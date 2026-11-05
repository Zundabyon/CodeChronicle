import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {setTimeout} from 'node:timers/promises';

const origin='https://codechronicle-staging.metappi-dev.workers.dev';
const localHtml=readFileSync(new URL('../dist/index.html',import.meta.url),'utf8');
const assets=[...localHtml.matchAll(/(?:src|href)="(\/assets\/[^" ]+\.(?:js|css))"/g)].map(match=>match[1]);
assert.ok(assets.length>=2,'Build staging before verifying deployment');
const release=readFileSync(new URL('../src/catalogRelease.ts',import.meta.url),'utf8').match(/catalogVersion = "([^"]+)"/)?.[1];
assert.ok(release,'Missing generated catalog version');
const expectedIds=[...readFileSync(new URL('../seed.game.sql',import.meta.url),'utf8').matchAll(/INSERT INTO question_revisions .*? SELECT '([^']+)'/g)].map(match=>match[1]);
assert.ok(expectedIds.length>0,'Missing generated catalog questions');

for(let attempt=1;attempt<=10;attempt++){
  try{
    const response=await fetch(`${origin}/?deployment-check=${Date.now()}`,{signal:AbortSignal.timeout(15000),cache:'no-store'});
    assert.equal(response.status,200);
    const html=await response.text();
    for(const asset of assets){
      assert.ok(html.includes(asset),`Deployed HTML does not reference ${asset}`);
      const served=await fetch(new URL(asset,origin),{signal:AbortSignal.timeout(15000)});
      assert.equal(served.status,200,`Missing asset: ${asset}`);
      assert.equal(await served.text(),readFileSync(new URL(`../dist${asset}`,import.meta.url),'utf8'),`Asset differs: ${asset}`);
    }
    const catalogResponse=await fetch(`${origin}/api/catalog?version=${encodeURIComponent(release)}`,{signal:AbortSignal.timeout(15000)});
    assert.equal(catalogResponse.status,200);
    const catalog=await catalogResponse.json();
    assert.equal(catalog.catalogVersion,release);
    assert.deepEqual(catalog.questions.map(question=>question.id).sort(),expectedIds.sort());
    console.log(`Verified published JS/CSS and ${catalog.questions.length} questions (${release}): ${origin}`);
    break;
  }catch(error){
    if(attempt===10)throw error;
    console.log(`Deployment check ${attempt}/10 not ready: ${error.message}`);
    await setTimeout(3000);
  }
}
