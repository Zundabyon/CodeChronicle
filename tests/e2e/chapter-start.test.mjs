import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';

let server,browser,url;
const storage='code-chronicle-save-v1',backupStorage='code-chronicle-save-backup-v1';
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});
  await server.listen();url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
async function pageFor(t){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'});
  page.setDefaultTimeout(10000);
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.goto(url);return page;
}
async function dismissNotice(page){const button=page.getByRole('button',{name:'確認しました'});if(await button.count())await button.click();}
async function advance(page){
  for(let i=0;i<30&&await page.locator('.dialogue-box').count();i++)await page.locator('.dialogue-text > span').click();
}
async function readSave(page,key=storage){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);}

for(const step of ['return-names','complete'])test(`chapter two restarts from its opening instead of inheriting ${step}`,{timeout:45000},async t=>{
  const page=await pageFor(t);
  const old={version:2,name:'前の冒険',story:'rescued',completed:true,bossDefeated:true,area:'town',pos:{x:14,y:30},gold:777,track:'vue',difficulty:'intermediate',inertia:false,quests:{'village-ledger':{step}},openedChests:['dungeon:19,5']};
  await page.evaluate(({storage,old})=>localStorage.setItem(storage,JSON.stringify(old)),{storage,old});
  await page.reload();await dismissNotice(page);
  await page.getByRole('button',{name:/冒険の管理/}).click();
  await page.locator('.chapter-start summary').click();
  await page.getByRole('button',{name:/第二章から始める/}).click();
  assert.equal((await readSave(page)).gold,777,'setup must not overwrite the original save');
  // An unfinished version-2 chapter two restarts on load (acts were reordered); a finished one is kept.
  const kept=step==='complete'?step:'visit-village';
  assert.equal((await readSave(page,backupStorage)).quests['village-ledger'].step,kept);
  await page.getByLabel('主人公の名前').fill('章の検証');
  await page.getByRole('button',{name:'第二章を始める',exact:false}).click();
  await page.locator('.dialogue-box').waitFor();await advance(page);
  let save=await readSave(page);
  assert.equal(save.quests['village-ledger'].step,'visit-village');
  assert.equal(save.story,'rescued');assert.equal(save.completed,true);assert.equal(save.level,3);
  assert.equal(save.bossDefeated,true);assert.deepEqual(save.defeated,['boss']);
  assert.equal(save.hp,30);assert.equal(save.mp,4);assert.equal(save.gold,250);
  assert.equal(save.track,'vue');assert.equal(save.difficulty,'intermediate');assert.equal(save.inertia,false);
  assert.deepEqual(save.openedChests,[]);assert.deepEqual(save.answered,[]);
  assert.deepEqual(save.learningRecords,{});
  // Walk up to Orl using the actual map's resident coordinates, then speak in the UI.
  await page.evaluate(async storage=>{
    const {worldMaps}=await import('/src/world/maps.ts');
    const npc=worldMaps.village.npcs.find(npc=>npc.id==='mountainGuide');
    const save=JSON.parse(localStorage.getItem(storage));
    save.area='village';save.pos={x:npc.x,y:npc.y+1};
    localStorage.setItem(storage,JSON.stringify(save));
  },storage);
  await page.reload();await page.getByRole('button',{name:/続きから始める/}).click();
  await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');
  await page.locator('.dialogue-box').waitFor();await advance(page);
  save=await readSave(page);
  assert.equal(save.quests['village-ledger'].step,'find-copy','Orl must send the player to the chest, not end the chapter');
  assert.equal(save.gold,250,'no chapter completion reward is given');
  await page.reload();await page.getByRole('button',{name:/冒険の管理/}).click();await page.locator('.backup-summary summary').click();
  await page.getByRole('button',{name:'この冒険を復元する'}).click();
  save=await readSave(page);assert.equal(save.gold,777);assert.equal(save.quests['village-ledger'].step,kept);
});

test('chapter one starts at home while normal new games retain the prologue',{timeout:45000},async t=>{
  const page=await pageFor(t);
  await page.getByRole('button',{name:/新しい冒険を始める/}).click();
  await page.locator('.prologue-screen').waitFor();
  await page.reload();await page.setViewportSize({width:390,height:844});
  await page.getByRole('button',{name:/冒険の管理/}).click();
  await page.locator('.chapter-start summary').click();
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'/private/tmp/cc-chapter-start-mobile.png',fullPage:true});
  await page.getByRole('button',{name:/第一章から始める/}).click();
  await page.getByLabel('主人公の名前').fill('最初の朝');
  await page.getByRole('button',{name:'第一章を始める',exact:false}).click();
  await page.locator('.dialogue-box').waitFor();await advance(page);
  const save=await readSave(page);
  assert.equal(save.area,'home');assert.equal(save.story,'breakfast');assert.equal(save.completed,false);
  assert.equal(save.bossDefeated,false);assert.equal(save.level,1);assert.equal(save.gold,100);
  assert.deepEqual(save.quests,{});
});
