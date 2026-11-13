import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
let server,browser,url;
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
const key='code-chronicle-save-v1';
const chapterSave=step=>({version:3,name:'確認',story:'rescued',completed:true,bossDefeated:true,level:3,hp:30,mp:4,gold:100,area:'village',pos:{x:4,y:8},quests:{'village-ledger':{step}},openedChests:['dungeon:19,5']});
async function open(t,extra){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.addInitScript(()=>{Math.random=()=>0;});await page.goto(url);
  await page.evaluate(({key,extra})=>localStorage.setItem(key,JSON.stringify(extra)),{key,extra});
  await page.reload();
  const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();
  await page.getByRole('button',{name:/続きから/}).click();return page;
}
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
async function advance(page){for(let i=0;i<80&&await page.locator('.dialogue-box').count();i++)await page.locator('.dialogue-text > span').click();}
async function talkToOrl(page){await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.locator('.dialogue-box').waitFor();}
async function current(page){
  await page.locator('.question-card h3').waitFor();const prompt=await page.locator('.question-card h3').innerText();
  return page.evaluate(async prompt=>{const {rangerBattleQuestions}=await import('/src/rangerBattleQuestions.ts');return rangerBattleQuestions.find(q=>q.prompt===prompt);},prompt);
}
async function winBattle(page,count){
  for(let i=0;i<count;i++){
    const q=await current(page);await page.locator('.options button').nth(q.answer).click();
    if(i===count-1){await page.getByRole('button',{name:/戦闘を終える/}).click();break;}
    await page.getByRole('button',{name:/次の問題へ/}).click();
  }
}

test('the attack opens act one with the new faces, and the Read battle leads into act two',{timeout:60000},async t=>{
  const page=await open(t,chapterSave('visit-village'));await talkToOrl(page);
  await page.locator('.dialogue-text > span').click();
  assert.match(await page.locator('.dialogue-portrait .character-portrait').getAttribute('style'),/chapter-two-faces-v1\.png/,'Graphius uses the chapter two portrait atlas');
  await advance(page);assert.equal((await saved(page)).quests['village-ledger'].step,'find-copy');

  await page.evaluate(key=>{const s=JSON.parse(localStorage.getItem(key));s.quests['village-ledger']={step:'battle-r'};localStorage.setItem(key,JSON.stringify(s));},key);
  await page.reload();await page.getByRole('button',{name:/続きから/}).click();await talkToOrl(page);await advance(page);
  const first=await current(page);assert.equal(first.id,'ranger-r-1');
  await page.locator('.options button').nth((first.answer+1)%4).click();
  assert.ok((await saved(page)).hp<30,'a wrong answer costs HP');
  await page.getByRole('button',{name:/同じ問いに再挑戦/}).click();
  assert.equal((await current(page)).id,'ranger-r-1','the same question returns after a wrong answer');
  await page.locator('.options button').nth(first.answer).click();
  assert.deepEqual(Object.values((await saved(page)).learningRecords['ranger-r-1']).slice(0,5),[1,0,0,0,1],'only the first answer is recorded');
  await page.getByRole('button',{name:/次の問題へ/}).click();
  await winBattle(page,4);
  await page.locator('.dialogue-box').waitFor();await advance(page);
  const after=await saved(page);assert.equal(after.quests['village-ledger'].step,'create-family');
});

test('losing a ranger battle restarts it from the first question without a game over',{timeout:60000},async t=>{
  const page=await open(t,{...chapterSave('battle-c'),hp:1});await talkToOrl(page);await advance(page);
  const first=await current(page);await page.locator('.options button').nth((first.answer+1)%4).click();
  assert.equal((await saved(page)).hp,0);
  await page.getByRole('button',{name:/最初から挑み直す/}).click();
  assert.equal((await current(page)).id,'ranger-c-1');const s=await saved(page);assert.equal(s.hp,30);assert.equal(s.area,'village');
  await winBattle(page,5);await page.locator('.dialogue-box').waitFor();await advance(page);
  assert.equal((await saved(page)).quests['village-ledger'].step,'update-address');
});

test('the final battle against Graphius precedes restoring the ledger',{timeout:60000},async t=>{
  const page=await open(t,chapterSave('battle-graphius'));await talkToOrl(page);await advance(page);
  assert.equal((await current(page)).id,'graphius-1');
  await winBattle(page,7);await page.locator('.dialogue-box').waitFor();await advance(page);
  assert.equal((await saved(page)).quests['village-ledger'].step,'return-names');
  const gold=(await saved(page)).gold;
  await talkToOrl(page);await advance(page);
  const done=await saved(page);assert.equal(done.quests['village-ledger'].step,'complete');assert.equal(done.gold,gold+70);
});
