import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';

const source=readFileSync(new URL('../worker/index.ts',import.meta.url),'utf8');
const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(outputText).toString('base64'));

function fixture(t) {
  const db=new DatabaseSync(':memory:');t.after(()=>db.close());
  db.exec('PRAGMA foreign_keys=ON');
  db.exec(readFileSync(new URL('../migrations/0001_init_catalog.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../seed.lab.sql',import.meta.url),'utf8'));
  let queries=0,assetRequests=0;
  const env={
    DB:{prepare(sql){
      queries++;const statement=db.prepare(sql);
      return {bind(...values){return {
        first:async()=>statement.get(...values)??null,
        all:async()=>({results:statement.all(...values)}),
      };}};
    }},
    ASSETS:{async fetch(request){assetRequests++;return new Response('asset:'+new URL(request.url).pathname);}},
  };
  const request=(path='/api/catalog',method='GET')=>worker.fetch(new Request('https://game.test'+path,{method}),env);
  return {db,env,request,queries:()=>queries,assetRequests:()=>assetRequests};
}

test('catalog returns seeded content and only selects published versions without writing data',async t=>{
  const f=fixture(t);
  f.db.exec("UPDATE catalog_releases SET published_at='2000-01-01T00:00:00Z'");
  f.db.exec("INSERT INTO catalog_releases VALUES ('draft-v3','draft','2002-01-01T00:00:00Z'),('lab-v2','published','2001-01-01T00:00:00Z')");
  f.db.exec("INSERT INTO catalog_entries VALUES ('lab-v2','cc-lab-1',1)");
  const before=f.db.prepare('SELECT total_changes() n').get().n;
  const response=await f.request();assert.equal(response.status,200);
  assert.match(response.headers.get('Content-Type'),/^application\/json/);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  const data=await response.json();assert.equal(data.catalogVersion,'lab-v2');assert.equal(data.questions.length,1);
  assert.equal(data.questions[0].id,'cc-lab-1');assert.equal(data.questions[0].options[data.questions[0].answer],data.questions[0].reveal);
  assert.equal((await(await f.request('/api/catalog?version=lab-v1')).json()).catalogVersion,'lab-v1');
  assert.equal((await f.request('/api/catalog?version=draft-v3')).status,404);
  assert.equal(f.db.prepare('SELECT total_changes() n').get().n,before);
  assert.equal(f.assetRequests(),0);
});

test('invalid versions and writes are rejected before accessing D1, and unknown APIs stay JSON',async t=>{
  const f=fixture(t);
  for(const v of ['',"' OR 1=1 --",'a'.repeat(65),'../lab-v1']){
    const r=await f.request('/api/catalog?version='+encodeURIComponent(v));assert.equal(r.status,400);
    assert.deepEqual(await r.json(),{error:'invalid_version'});
  }
  for(const method of ['POST','PUT','DELETE','HEAD']){
    const r=await f.request('/api/catalog',method);assert.equal(r.status,405);assert.equal(r.headers.get('Allow'),'GET');
  }
  for(const path of ['/api','/api/missing','/api/catalog/']){
    const r=await f.request(path);assert.equal(r.status,404);assert.deepEqual(await r.json(),{error:'not_found'});
  }
  assert.equal(f.queries(),0);assert.equal(f.assetRequests(),0);
});

test('unpublished, nonexistent and empty catalogs never return a successful empty result',async t=>{
  const f=fixture(t);t.mock.method(console,'error',()=>{});
  assert.equal((await f.request('/api/catalog?version=missing')).status,404);
  f.db.exec("UPDATE catalog_releases SET status='draft'");
  assert.equal((await f.request()).status,404);
  f.db.exec("INSERT INTO catalog_releases VALUES ('empty-v1','published','2000-01-01T00:00:00Z')");
  const r=await f.request();assert.equal(r.status,503);assert.deepEqual(await r.json(),{error:'catalog_unavailable'});
});

test('broken payloads and mismatched question identity fail the whole response',async t=>{
  const f=fixture(t);t.mock.method(console,'error',()=>{});
  for(const payload of ['null','[]','42','{}','{"id":"other-question"}']){
    f.db.prepare('UPDATE question_revisions SET payload_json=?').run(payload);
    const r=await f.request();assert.equal(r.status,503);assert.deepEqual(await r.json(),{error:'catalog_unavailable'});
  }
});

test('database errors return a retryable JSON error without exposing exception details',async t=>{
  const f=fixture(t);const log=t.mock.method(console,'error',()=>{});
  f.env.DB.prepare=()=>{throw new Error('private database diagnostic');};
  const r=await f.request();assert.equal(r.status,503);assert.equal(r.headers.get('Cache-Control'),'no-store');
  assert.deepEqual(await r.json(),{error:'catalog_unavailable'});
  assert.deepEqual(log.mock.calls[0].arguments,['catalog_load_failed']);
});

test('non-API requests delegate to static assets without querying D1',async t=>{
  const f=fixture(t);
  for(const path of ['/','/assets/game.js'])assert.equal(await(await f.request(path)).text(),'asset:'+path);
  assert.equal(f.assetRequests(),2);assert.equal(f.queries(),0);
});
