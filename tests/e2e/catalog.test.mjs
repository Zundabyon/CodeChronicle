import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

let server, browser, url, questions, catalogVersion;
const key = 'code-chronicle-save-v1';
before(async () => {
  server = await createServer({ mode: 'staging', server: { host: '127.0.0.1', port: 0, hmr: false, ws: false } });
  await server.listen();
  url = `http://127.0.0.1:${server.httpServer.address().port}`;
  ({ questions } = await server.ssrLoadModule('/src/content.ts'));
  ({ catalogVersion } = await server.ssrLoadModule('/src/catalogRelease.ts'));
  const executablePath = process.env.CHROME_PATH ?? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'].find(existsSync);
  browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
});
after(async () => { await browser?.close(); await server?.close(); });
async function pageFor(t, save) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  t.after(async () => { await page.close(); assert.deepEqual(errors, []); });
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
  await page.addInitScript(({ key, save }) => {
    Math.random = () => 0;
    if (!localStorage.getItem('catalog-test-initialized')) {
      localStorage.setItem(key, JSON.stringify(save));
      localStorage.setItem('catalog-test-initialized', 'yes');
    }
  }, { key, save });
  return page;
}
async function resume(page) {
  const notice = page.getByRole('button', { name: '確認しました' });
  if (await notice.count()) await notice.click();
  await page.getByRole('button', { name: /続きから/ }).click();
}
test('API failure and incomplete catalog leave raw saves untouched; retry uses fetched questions and records survive reload', { timeout: 60000 }, async t => {
  const save = { area: 'town', pos: { x: 13, y: 16 }, story: 'legacy', name: '確認', wrong: ['r-b-1'], gold: 321, hp: 7 };
  const page = await pageFor(t, save);
  let response = 'unavailable', requests = 0;
  const bank = structuredClone(questions);
  bank.find(q => q.id === 'r-b-1').prompt = 'APIから届いた確認問題';
  await page.route('**/api/catalog?*', route => {
    assert.equal(new URL(route.request().url()).searchParams.get('version'), catalogVersion);
    requests++;
    if (response === 'unavailable') return route.fulfill({ status: 503, contentType: 'application/json', body: '{}' });
    return route.fulfill({ json: { catalogVersion, questions: response === 'incomplete' ? bank.slice(0, 1) : bank } });
  });
  await page.goto(url);
  await page.getByRole('heading', { name: '記憶の書が届きませんでした' }).waitFor();
  assert.equal(await page.evaluate(key => localStorage.getItem(key), key), JSON.stringify(save));
  assert.equal(await page.getByRole('button', { name: /新しい冒険/ }).count(), 0);
  response = 'incomplete'; await page.getByRole('button', { name: 'もう一度読み込む' }).click();
  await page.getByRole('heading', { name: '記憶の書が届きませんでした' }).waitFor();
  assert.equal(await page.evaluate(key => localStorage.getItem(key), key), JSON.stringify(save));
  response = 'complete'; await page.getByRole('button', { name: 'もう一度読み込む' }).click();
  await page.getByRole('button', { name: /続きから/ }).waitFor(); await resume(page);
  await page.getByRole('button', { name: /コマンド/ }).click();
  await page.getByRole('button', { name: /きょうかい/ }).click();
  await page.getByRole('button', { name: /復習の部屋へ入る/ }).click();
  await page.getByRole('heading', { name: 'APIから届いた確認問題', exact: true }).waitFor();
  await page.getByRole('button', { name: /答えを見ずに再挑戦/ }).click();
  await page.locator('.question-card h3').filter({ hasText: 'APIから届いた確認問題' }).waitFor();
  await page.locator('.options button').nth(0).click();
  await page.getByRole('button', { name: /戦闘を終える/ }).click();
  await page.getByRole('heading', { name: '復習する問題はありません' }).waitFor();
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  assert.deepEqual(saved.wrong, []); assert.equal(saved.gold, 321); assert.equal(saved.hp, 7);
  assert.ok(saved.learningRecords['r-b-1']);
  await page.getByRole('button', { name: '教会の本堂へ戻る', exact: true }).click();
  await page.getByRole('button', { name: /町へ戻る/ }).click();
  await page.getByRole('button', { name: /コマンド/ }).click();
  await page.getByRole('region', { name: 'コマンドメニュー' }).getByRole('button', { name: /学習設定/ }).click();
  await page.locator('summary').filter({ hasText: /^問題ごとの学習記録$/ }).click();
  await page.locator('.learning-record-list h4').filter({ hasText: 'APIから届いた確認問題' }).waitFor();
  await page.reload(); await resume(page);
  const reloaded = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  assert.deepEqual(reloaded.learningRecords, saved.learningRecords);
  assert.ok(requests >= 4);
});

test('books and dungeon seals use the fetched bank with unchanged progression', { timeout: 60000 }, async t => {
  const { questDefinitions } = await server.ssrLoadModule('/src/quests/definitions.ts');
  const { worldMaps } = await server.ssrLoadModule('/src/world/maps.ts');
  const def = questDefinitions.find(d => d.id === 'village-ledger');
  const step = def.steps.find(s => s.trigger.type === 'question-answered' && s.trigger.source === 'quest');
  const area = Object.keys(worldMaps).find(area => worldMaps[area].npcs.some(n => n.id === step.npcId));
  const npc = worldMaps[area].npcs.find(n => n.id === step.npcId);
  const bank = structuredClone(questions);
  bank.find(q => q.id === step.trigger.questionId).prompt = 'APIから届いた封印の問い';
  bank.find(q => q.id === 'l-b-1').prompt = 'APIから届いた本の問い';
  const page = await pageFor(t, { area, pos: { x: npc.x, y: npc.y + 1 }, story: 'rescued', completed: true, bossDefeated: true, quests: { 'village-ledger': { step: step.id } } });
  await page.route('**/api/catalog?*', route => route.fulfill({ json: { catalogVersion, questions: bank } }));
  await page.goto(url); await page.getByRole('button', { name: /続きから/ }).waitFor(); await resume(page);
  await page.locator('.world-viewport').focus(); await page.keyboard.press('Enter');
  for (let i = 0; i < 12 && !await page.locator('.dialogue-choices button').count(); i++) await page.locator('.dialogue-text > p').first().click();
  assert.match(await page.locator('.dialogue-text > p').first().innerText(), /APIから届いた封印の問い/);
  const q = bank.find(q => q.id === step.trigger.questionId);
  await page.getByRole('group', { name: '会話の選択肢' }).getByRole('button', { name: q.options[q.answer], exact: false }).click();
  assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).quests['village-ledger'].step, key), def.steps[def.steps.indexOf(step) + 1].id);
  const bookPage = await pageFor(t, { area: 'scholarHouse', pos: { x: 2, y: 3 }, story: 'legacy', name: '確認' });
  await bookPage.route('**/api/catalog?*', route => route.fulfill({ json: { catalogVersion, questions: bank } }));
  await bookPage.goto(url); await bookPage.getByRole('button', { name: /続きから/ }).waitFor(); await resume(bookPage);
  await bookPage.locator('.world-viewport').focus(); await bookPage.keyboard.press('Enter');
  await bookPage.getByRole('button', { name: '全館の蔵書を探す' }).click();
  await bookPage.getByLabel('言語', { exact: true }).selectOption('Laravel');
  await bookPage.getByLabel('本を検索', { exact: true }).fill('URLに応答する');
  await bookPage.locator('.library-search li button').click();
  await bookPage.getByRole('button', { name: 'この本の確認問題を解く' }).click();
  await bookPage.getByRole('region', { name: '本の確認問題' }).getByText('APIから届いた本の問い', { exact: true }).waitFor();
});
