import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
let server,browser,url;
const key='code-chronicle-save-v1';
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
async function open(t,save){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,r=>r.abort());await page.goto(url);
  await page.evaluate(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key,save});await page.reload();
  const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();
  return page;
}
const base={version:3,name:'確認',story:'legacy',level:3,hp:30,mp:4,gold:100,area:'town',pos:{x:5,y:7}};
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);

test('メニューの「ゲームを終わる」は確認後に保存してタイトルへ戻る',async t=>{
  const page=await open(t,base);
  await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.world-viewport').focus();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'▶ ゲームを終わる'}).click();
  await page.getByText('冒険を保存してタイトルへ戻りますか？').waitFor();
  await page.getByRole('button',{name:/いいえ/}).click();await page.locator('.dialogue-text > span').click();
  assert.equal(await page.locator('.world-viewport').count(),1);
  const before=(await saved(page)).lastSavedAt;
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'▶ ゲームを終わる'}).click();
  await page.getByRole('button',{name:/はい/}).click();await page.locator('.dialogue-text > span').click();
  await page.getByRole('button',{name:/続きから/}).waitFor();
  assert.ok((await saved(page)).lastSavedAt>=before);
});

test('裏会議は今はすべて読める（確認用）',async t=>{
  const page=await open(t,{...base,completed:true,bossDefeated:true});
  await page.getByRole('button',{name:/冒険の管理/}).click();await page.getByText('おまけ：裏会議').click();
  // BACKSTAGE_ALL_OPEN: every meeting is readable while the author reviews them.
  assert.equal(await page.getByRole('button',{name:/第九回「/}).isEnabled(),true);
  const before=JSON.stringify(await saved(page));
  await page.getByRole('button',{name:/第一回「/}).click();
  await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.dialogue-text strong').innerText(),/語り手/);
  await page.keyboard.press('Enter');
  assert.match(await page.locator('.dialogue-text strong').innerText(),/めたっぴ/);
  assert.match(await page.locator('.story-standing.is-active').getAttribute('style'),/backstage\/standing-metappi-propose\.png/);
  assert.match(await page.locator('.dialogue-box .character-portrait').getAttribute('style'),/backstage\/face-metappi\.png/);
  assert.match(await page.locator('.story-standing.is-active').getAttribute('class'),/is-left/,'the first speaker stands on the left');
  if(process.env.BACKSTAGE_SHOT)await page.screenshot({path:process.env.BACKSTAGE_SHOT});
  await page.keyboard.press('Enter');
  assert.match(await page.locator('.story-standing.is-active.is-right').getAttribute('style'),/standing-ai-normal\.png/,'the reply comes from the right');
  assert.match(await page.locator('.story-standing.is-left:not(.is-active)').getAttribute('style'),/standing-metappi-propose\.png/,'the previous speaker stays, dimmed, on the left');
  if(process.env.BACKSTAGE_SHOT2)await page.screenshot({path:process.env.BACKSTAGE_SHOT2});
  for(let i=0;i<60&&await page.locator('.dialogue-box').count();i++)await page.locator('.dialogue-text > span').click();
  await page.getByRole('button',{name:/続きから/}).waitFor();
  assert.equal(JSON.stringify(await saved(page)),before);
  await page.getByRole('button',{name:/冒険の管理/}).click();await page.getByText('おまけ：裏会議').click();
  assert.equal(await page.getByRole('button',{name:/第一回「/}).isEnabled(),true);
});

test('第二章クリアで第二回も読める',async t=>{
  const page=await open(t,{...base,completed:true,quests:{'village-ledger':{step:'complete'}}});
  await page.getByRole('button',{name:/冒険の管理/}).click();await page.getByText('おまけ：裏会議').click();
  await page.getByRole('button',{name:/第二回「/}).click();await page.locator('.dialogue-box').waitFor();
});

test('第二章クリアで第三回が解放され、最後まで読める',async t=>{
  const locked=await open(t,{...base,completed:true});
  await locked.getByRole('button',{name:/冒険の管理/}).click();await locked.getByText('おまけ：裏会議').click();
  assert.equal(await locked.getByRole('button',{name:/第三回「/}).isEnabled(),true,'all meetings are open for review');
  const page=await open(t,{...base,completed:true,quests:{'village-ledger':{step:'complete'}}});
  await page.getByRole('button',{name:/冒険の管理/}).click();await page.getByText('おまけ：裏会議').click();
  await page.getByRole('button',{name:/第三回「第二章、作ってみたら事件だらけ」/}).click();await page.locator('.dialogue-box').waitFor();
  let last='';
  for(let i=0;i<80&&await page.locator('.dialogue-box').count();i++){last=await page.locator('.dialogue-text').innerText().catch(()=>last);await page.locator('.dialogue-text > span').click();}
  assert.match(last,/魔王の曲は、まだ無い/);
  await page.getByRole('button',{name:/続きから/}).waitFor();
});

test('メニューの「デバッグ：ワープ」で任意の場所へ一瞬で移動できる',async t=>{
  const page=await open(t,base);
  await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.world-viewport').focus();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'▶ デバッグ：ワープ'}).click();
  await page.getByRole('button',{name:'▶ 読解の書庫'}).click();
  await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).area==='crudRead',key);
  assert.equal((await saved(page)).area,'crudRead');
});

test('メニューから効果音さくせいを開き、ゲームに反映できる',async t=>{
  const page=await open(t,base);
  await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.world-viewport').focus();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'▶ デバッグ：効果音さくせい'}).click();
  await page.getByRole('dialog',{name:'効果音さくせい'}).waitFor();
  await page.getByRole('combobox').first().selectOption('correct');
  await page.getByRole('button',{name:'ゲームに反映'}).click();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('code-chronicle-sfx-overrides')??'{}'));
  assert.ok(saved.correct,'the tuned correct sound is stored for the game');
  await page.getByRole('button',{name:'✕ とじる'}).click();
  assert.equal(await page.getByRole('dialog',{name:'効果音さくせい'}).count(),0);
});

test('メニューからBGMさくせいを開き、音符を置いてゲームに反映できる',async t=>{
  const page=await open(t,base);
  await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.world-viewport').focus();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'▶ デバッグ：BGMさくせい'}).click();
  const dialog=page.getByRole('dialog',{name:'BGMさくせい'});await dialog.waitFor();
  await dialog.getByRole('combobox').first().selectOption('battle');
  const before=await dialog.getByLabel('bgmBank.ts に貼るコード').inputValue();
  await dialog.locator('[data-pitch="62"]').click({position:{x:3,y:5}});
  assert.notEqual(await dialog.getByLabel('bgmBank.ts に貼るコード').inputValue(),before,'clicking the roll edits the song');
  const pos=(await saved(page)).pos;await page.locator('body').press('ArrowUp');
  assert.deepEqual((await saved(page)).pos,pos,'game keys stay stopped while the designer is open');
  await dialog.getByRole('button',{name:'ゲームに反映'}).click();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('code-chronicle-bgm-overrides')??'{}'));
  assert.equal(stored.battle?.bpm,152,'the edited battle song is stored for the game');
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog',{name:'BGMさくせい'}).count(),0);
});

test('メニューの進行スイッチで第二章を「グラフィウス戦の前」にすると村の広場にグラフィウスが立つ',async t=>{
  const page=await open(t,{...base,story:'rescued',completed:true,bossDefeated:true,area:'village',pos:{x:11,y:17},quests:{'village-ledger':{step:'battle-c'}},openedChests:['dungeon:19,5'],defeated:['boss','slime-1']});
  await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.world-viewport').focus();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'▶ デバッグ：進行スイッチ'}).click();
  const dialog=page.getByRole('dialog',{name:'進行スイッチ'});await dialog.getByText('セーブデータが書き換わります').waitFor();
  assert.equal(await dialog.getByRole('radio',{name:/第二幕 ツクネ戦の前/}).getAttribute('aria-checked'),'true','the current step is marked');
  await dialog.getByRole('radio',{name:/グラフィウス戦の前/}).click();
  assert.equal((await saved(page)).quests['village-ledger'].step,'battle-graphius');
  await page.getByText('第二章を『グラフィウス戦の前』にしました').waitFor();
  await dialog.getByRole('button',{name:/倒した敵をすべて復活/}).click();
  assert.deepEqual((await saved(page)).defeated,['boss']);
  await dialog.getByLabel('レベル').selectOption('10');
  const s=await saved(page);assert.equal(s.level,10);assert.equal(s.hp,65);
  if(process.env.FLAG_SHOT)await page.screenshot({path:process.env.FLAG_SHOT});
  let asked=0;page.once('dialog',d=>{asked++;d.accept();});
  await dialog.getByRole('radio',{name:/第一幕 ダンジョン中/}).click();
  assert.equal(asked,1,'going back asks once');assert.equal((await saved(page)).quests['village-ledger'].step,'read-records');
  await dialog.getByRole('radio',{name:/グラフィウス戦の前/}).click();
  await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog',{name:'進行スイッチ'}).count(),0);
  assert.equal(await page.locator('.world-viewport img[src*="sprites/graphius-64.png"]').count(),1,'Graphius stands in the village square');
  assert.equal(await page.locator('.world-viewport img[src*="sprites/ranger-create-64.png"]').count(),0,'the act-two ranger is gone');
});

test('進行スイッチで後の章を選ぶと前の章がすべてクリア済みになり、全部クリアでサブクエと石板もそろう',async t=>{
  const page=await open(t,{...base,story:'breakfast',area:'town',pos:{x:13,y:16},quests:{}});
  await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.world-viewport').focus();await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'▶ デバッグ：進行スイッチ'}).click();
  const dialog=page.getByRole('dialog',{name:'進行スイッチ'});await dialog.getByText('セーブデータが書き換わります').waitFor();
  await dialog.getByRole('radio',{name:/道化師戦の前/}).click();
  let s=await saved(page);
  assert.equal(s.story,'rescued');assert.equal(s.completed,true);
  assert.equal(s.quests['village-ledger'].step,'complete');assert.equal(s.quests['undersea-prologue'].step,'complete');
  assert.equal(s.quests['royal-gate-intro'].step,'defeat-clown');
  page.once('dialog',d=>d.accept());
  await dialog.getByRole('button',{name:/これまでを全部クリア済みに/}).click();
  await page.getByText('これまでの内容をすべてクリア済みにしました').waitFor();
  s=await saved(page);
  assert.equal(s.quests['royal-gate-intro'].step,'complete');assert.equal(s.quests['cursed-book'].step,'complete');
  assert.ok(s.readBooks.includes('lesson:undersea-review-read'));assert.ok(s.level>=10);
});
