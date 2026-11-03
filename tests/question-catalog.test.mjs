import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { createServer } from 'vite';
import { catalogArtifacts } from '../scripts/export-question-catalog.mjs';

let server, questions, parseQuestionCatalog, compatibleCatalog, fetchQuestionCatalog;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] } });
  ({ questions } = await server.ssrLoadModule('/src/content.ts'));
  ({ parseQuestionCatalog, compatibleCatalog, fetchQuestionCatalog } = await server.ssrLoadModule('/src/questionCatalog.ts'));
});
after(async () => { await server?.close(); });
const catalog = () => ({ catalogVersion: 'test-v1', questions: structuredClone(questions) });

test('all authored formats retain their grading fields through the catalog boundary', () => {
  const value = catalog();
  assert.deepEqual(compatibleCatalog(value, 'test-v1', questions).questions, questions);
  assert.deepEqual(new Set(value.questions.map(q => q.kind)), new Set(['choice', 'cli', 'fill-choice', 'fill-input']));
});
test('malformed grading fields, duplicate IDs and incomplete game catalogs are rejected', () => {
  for (const mutate of [
    v => v.questions.push(v.questions[0]),
    v => v.questions[0].answer = 4,
    v => v.questions[0].options = ['a'],
    v => v.questions.find(q => q.kind === 'cli').accepted = [],
    v => v.questions.find(q => q.kind === 'fill-input').code = 'missing blank',
    v => v.questions.find(q => q.kind === 'fill-input').code = 'const x = ①;',
    v => v.questions.find(q => q.kind === 'fill-choice').code = 'const x = 【①;',
    v => v.questions[0].track = 'other',
  ]) { const value = catalog(); mutate(value); assert.throws(() => parseQuestionCatalog(value)); }
  for (const mutate of [
    v => v.questions.pop(),
    v => v.catalogVersion = 'lab-v1',
    v => v.questions[0].id = 'replacement-id',
    v => v.questions[0].kind = 'fill-choice',
    v => v.questions[0].difficulty = 'advanced',
  ]) { const value = catalog(); mutate(value); assert.throws(() => compatibleCatalog(value, 'test-v1', questions)); }
});
test('fetch rejects unavailable/malformed catalogs and times out instead of hanging', async t => {
  const controller = new AbortController();
  let requested;
  t.mock.method(globalThis, 'fetch', async (url, options) => { requested = { url, options }; return Response.json(catalog()); });
  assert.equal((await fetchQuestionCatalog('test-v1', questions, controller.signal)).questions.length, questions.length);
  assert.equal(requested.url, '/api/catalog?version=test-v1');
  assert.equal(requested.options.cache, 'no-store');
  t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));
  await assert.rejects(fetchQuestionCatalog('test-v1', questions, controller.signal));
  t.mock.method(globalThis, 'fetch', async () => Response.json({ catalogVersion: 'lab-v1', questions: [] }));
  await assert.rejects(fetchQuestionCatalog('test-v1', questions, controller.signal));
  t.mock.method(globalThis, 'fetch', (_, { signal }) => new Promise((resolve, reject) => {
    if (signal.aborted) reject(new Error('aborted'));
    else signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true });
  }));
  await assert.rejects(fetchQuestionCatalog('test-v1', questions, controller.signal, 10));
  controller.abort();
  await assert.rejects(fetchQuestionCatalog('test-v1', questions, controller.signal));
});
test('generated SQL is reproducible, repeatable and preserves old releases when a question changes', () => {
  const first = catalogArtifacts(questions);
  assert.equal(catalogArtifacts([...questions].reverse()).sql, first.sql);
  assert.equal(readFileSync('seed.game.sql', 'utf8'), first.sql);
  assert.match(readFileSync('src/catalogRelease.ts', 'utf8'), new RegExp(first.version));
  const db = new DatabaseSync(':memory:');
  try {
    db.exec('PRAGMA foreign_keys = ON');
    db.exec(readFileSync('migrations/0001_init_catalog.sql', 'utf8'));
    db.exec(first.sql);
    const stamp = db.prepare('SELECT published_at FROM catalog_releases WHERE version = ?').get(first.version).published_at;
    db.exec(first.sql);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM question_revisions').get().n, questions.length);
    assert.equal(db.prepare('SELECT published_at FROM catalog_releases WHERE version = ?').get(first.version).published_at, stamp);
    const changed = structuredClone(questions); changed[0].prompt += " '改訂'";
    const next = catalogArtifacts(changed); assert.notEqual(next.version, first.version);
    db.exec(next.sql);
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM question_revisions').get().n, questions.length + 1);
    for (const version of [first.version, next.version]) assert.equal(db.prepare('SELECT COUNT(*) AS n FROM catalog_entries WHERE catalog_version = ?').get(version).n, questions.length);
    const payload = db.prepare('SELECT payload_json FROM catalog_entries e JOIN question_revisions q ON q.question_id=e.question_id AND q.revision=e.question_revision WHERE e.catalog_version=? AND e.question_id=?');
    assert.equal(JSON.parse(payload.get(first.version, questions[0].id).payload_json).prompt, questions[0].prompt);
    assert.equal(JSON.parse(payload.get(next.version, questions[0].id).payload_json).prompt, changed[0].prompt);
  } finally { db.close(); }
});
