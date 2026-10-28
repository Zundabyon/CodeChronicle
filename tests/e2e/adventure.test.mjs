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
async function fixture(t,extra={}){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.addInitScript(()=>{Math.random=()=>0;});await page.goto(url);
  await page.evaluate(({key,extra})=>localStorage.setItem(key,JSON.stringify({area:'home',pos:{x:5,y:7},story:'legacy',name:'確認',...extra})),{key,extra});
  await page.reload();await resume(page);return page;
}
async function resume(page){const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();await page.getByRole('button',{name:/続きから/}).click();}
async function saved(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);}
async function review(page){await page.getByRole('button',{name:/コマンド/}).click();await page.getByRole('button',{name:/きょうかい/}).click();await page.getByRole('button',{name:/復習の部屋へ入る/}).click();}

test('chest rewards are granted once and remain opened after reload',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'armorShop',pos:{x:2,y:3}});await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');
  await page.getByRole('status').filter({hasText:'空の宝箱を調べる'}).waitFor();const first=await saved(page);assert.ok(first.openedChests.includes('armorShop:2,2'));
  await page.reload();await resume(page);await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.getByText('✦ 宝箱は空っぽだ。',{exact:true}).waitFor();const second=await saved(page);assert.equal(second.gold,first.gold);assert.deepEqual(second.inventory,first.inventory);
});
test('reading marks and bookmarks survive reopening',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'scholarHouse',pos:{x:2,y:3}});await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:/01 名前のついた値/}).click();await page.getByRole('button',{name:'既読にする',exact:true}).click();
  assert.ok((await saved(page)).readBooks.includes('js-variables-01'));await page.reload();await resume(page);await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'01 名前のついた値',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'既読を取り消す'}).getAttribute('aria-pressed'),'true');
});
test('ordinary battle grants its reward once after victory',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'field'});
  const setup=await page.evaluate(async()=>{const {spawnEnemies,enemyAt}=await import('/src/enemyMovement.ts');const {worldMaps,canWalkOnMap,eventAt}=await import('/src/world/maps.ts');const positions=spawnEnemies(),enemy=positions.f1;const pos=[{x:enemy.x+1,y:enemy.y},{x:enemy.x-1,y:enemy.y},{x:enemy.x,y:enemy.y+1},{x:enemy.x,y:enemy.y-1}].find(p=>canWalkOnMap(worldMaps.field,p)&&!enemyAt('field',p,positions,[])&&!eventAt(worldMaps.field,p,'enter'));return {pos,key:pos.x>enemy.x?'ArrowLeft':pos.x<enemy.x?'ArrowRight':pos.y>enemy.y?'ArrowUp':'ArrowDown'};});
  await page.evaluate(({key,pos})=>{const save=JSON.parse(localStorage.getItem(key));save.pos=pos;localStorage.setItem(key,JSON.stringify(save));},{key,pos:setup.pos});await page.reload();await resume(page);await page.locator('.world-viewport').focus();await page.keyboard.press(setup.key);
  for(let i=0;i<5;i++){
    await page.locator('.question-card h3').waitFor();const prompt=await page.locator('.question-card h3').innerText();
    const q=await page.evaluate(async prompt=>{const {questions}=await import('/src/content.ts');return questions.find(q=>q.prompt===prompt)},prompt);
    if(q.options)await page.locator('.options button').nth(q.answer).click();else{await page.locator('.cli-form input').fill(q.accepted[0]);await page.locator('.cli-form button').click();}
    const finish=page.getByRole('button',{name:/戦闘を終える/});if(await finish.count()){await finish.click();break;}await page.getByRole('button',{name:/次の問題へ/}).click();
  }
  await page.locator('.world-stage').waitFor();const result=await saved(page);assert.equal(result.gold,135);assert.equal(result.xp,4);assert.equal(result.defeated.filter(id=>id==='f1').length,1);
});
test('review keeps HP, retains mistakes and removes a corrected question',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'town',pos:{x:13,y:16},wrong:['r-b-1'],hp:7});await review(page);await page.getByRole('button',{name:/答えを見ずに再挑戦/}).click();await page.locator('.options button').nth(1).click();assert.equal((await saved(page)).hp,7);assert.deepEqual((await saved(page)).wrong,['r-b-1']);await page.getByRole('button',{name:/もう一度挑戦する/}).click();await page.locator('.options button').nth(0).click();await page.getByRole('button',{name:/戦闘を終える/}).click();await page.getByRole('heading',{name:'復習する問題はありません'}).waitFor();assert.deepEqual((await saved(page)).wrong,[]);assert.equal((await saved(page)).hp,7);
});
test('saved adventure resumes with possessions and position intact',{timeout:45000},async t=>{
  const page=await fixture(t,{gold:321,readBooks:['js-variables-01']});await page.locator('.world-viewport').focus();await page.keyboard.press('ArrowLeft');const first=await saved(page);await page.reload();await resume(page);const second=await saved(page);assert.deepEqual(second.pos,first.pos);assert.equal(second.gold,321);assert.deepEqual(second.readBooks,['js-variables-01']);
});

test('second chapter survives pauses, opened chests and completion without altering chapter one',{timeout:45000},async t=>{
const storage='code-chronicle-save-v1';
async function data(){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),storage);}
async function advance(){for(let i=0;i<40&&await page.locator('.dialogue-box').count()&&!await page.locator('.dialogue-choices button').count();i++)await page.locator('.dialogue-box').click();}
async function relocate(area,pos){await page.evaluate(({key,area,pos})=>{const s=JSON.parse(localStorage.getItem(key));s.area=area;s.pos=pos;localStorage.setItem(key,JSON.stringify(s));},{key:storage,area,pos});await page.reload();const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();await page.getByRole('button',{name:/続きから/}).click();}
async function interact(){await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');}
const page=await fixture(t,{completed:true,story:'rescued',bossDefeated:true,gold:321,openedChests:['dungeon:19,5']});await page.getByRole('button',{name:'第二章「消えた名簿」を始める',exact:true}).click();await advance();assert.equal((await data()).chapterTwo,'village');await relocate('village',{x:4,y:8});await interact();await advance();assert.equal((await data()).chapterTwo,'cave');await relocate('dungeon',{x:20,y:5});await interact();await advance();assert.equal((await data()).chapterTwo,'restore');assert.equal((await data()).gold,321);await relocate('village',{x:4,y:8});await interact();await advance();
const qs=await page.evaluate(async()=>{const {chapterTwoTasks}=await import('/src/chapterTwo.ts');const {questions}=await import('/src/content.ts');return chapterTwoTasks.map(task=>questions.find(q=>q.id===task.id));});
await page.getByRole('group',{name:'会話の選択肢'}).getByRole('button',{name:qs[0].options[(qs[0].answer+1)%4],exact:false}).click();await advance();assert.equal((await data()).chapterTwoStep,0);
await page.getByRole('group',{name:'会話の選択肢'}).getByRole('button',{name:qs[0].options[qs[0].answer],exact:false}).click();await advance();await page.getByRole('button',{name:/あとで続ける/}).click();await advance();assert.equal((await data()).chapterTwoStep,1);await relocate('village',{x:4,y:8});await interact();await advance();
for(const q of qs.slice(1)){await page.getByRole('group',{name:'会話の選択肢'}).getByRole('button',{name:q.options[q.answer],exact:false}).click();await advance();}
const result=await data();assert.equal(result.chapterTwo,'complete');assert.equal(result.chapterTwoStep,4);assert.equal(result.gold,391);assert.equal(result.inventory.ether,1);assert.equal(result.story,'rescued');assert.equal(result.completed,true);await relocate('village',{x:4,y:8});assert.ok(await page.locator('.world-stage').count());await interact();await advance();assert.equal((await data()).gold,391);
});
