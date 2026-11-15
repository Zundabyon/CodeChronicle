import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
let server,browser,url,ids;
const key='code-chronicle-save-v1';
const shots=process.env.BATTLE_SHOTS;
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
async function open(t,viewport,save){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.addInitScript(()=>{Math.random=()=>0;});await page.goto(url);
  if(!ids)ids=await page.evaluate(async()=>{const {questions}=await import('/src/content.ts');const len=q=>q.code?.length??0;
    return {choice:'r-b-1',code:questions.filter(q=>q.kind==='choice').sort((a,b)=>len(b)-len(a))[0].id,fill:questions.find(q=>q.kind==='fill-choice').id,cli:questions.find(q=>q.kind==='cli').id};});
  await page.evaluate(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key,save});await page.reload();
  const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();
  await page.getByRole('button',{name:/続きから/}).click();return page;
}
// Bottom of the answer controls (options, or the input row) relative to the viewport height.
const bottom=page=>page.evaluate(()=>{const el=document.querySelector('.question-card .options')??document.querySelector('.cli-form>div');return {bottom:Math.round(el.getBoundingClientRect().bottom),h:innerHeight};});
async function reviewBattle(t,viewport,id){
  const page=await open(t,viewport,{area:'town',pos:{x:13,y:16},story:'legacy',name:'確認',wrong:[id]});
  await page.getByRole('button',{name:/コマンド/}).click();await page.getByRole('button',{name:/きょうかい/}).click();await page.getByRole('button',{name:/復習の部屋へ入る/}).click();
  await page.getByRole('button',{name:/答えを見ずに再挑戦/}).click();await page.locator('.question-card h3').waitFor();return page;
}
async function rangerBattle(t,viewport){
  const page=await open(t,viewport,{version:3,name:'確認',story:'rescued',completed:true,bossDefeated:true,level:3,hp:30,mp:4,gold:100,area:'village',pos:{x:4,y:8},quests:{'village-ledger':{step:'battle-r'}},openedChests:['dungeon:19,5']});
  await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.locator('.dialogue-box').waitFor();
  for(let i=0;i<80&&await page.locator('.dialogue-box').count();i++)await page.locator('.dialogue-text > span').click();
  await page.locator('.question-card h3').waitFor();return page;
}
for(const [width,height] of [[1366,768],[1280,720],[1440,900]]){
  const viewport={width,height};
  for(const kind of ['choice','code','fill','cli'])test(`${kind} answers fit the first screen at ${width}x${height}`,{timeout:45000},async t=>{
    const page=await reviewBattle(t,viewport,ids?.[kind]??'r-b-1');
    if(!ids){await page.close();return;}
    const m=await bottom(page);console.log(`${width}x${height} ${kind} ${ids[kind]}`,m);assert.ok(m.bottom<=m.h,`${kind} answers end at ${m.bottom} of ${m.h}`);
    if(shots&&width===1366&&kind==='code')await page.screenshot({path:`${shots}/battle-after-1366.png`});
  });
  test(`ranger battle fits and its next button shows at ${width}x${height}`,{timeout:60000},async t=>{
    const page=await rangerBattle(t,viewport);const m=await bottom(page);console.log(`${width}x${height} ranger`,m);assert.ok(m.bottom<=m.h,`ranger options end at ${m.bottom} of ${m.h}`);
    const prompt=await page.locator('.question-card h3').innerText();
    const q=await page.evaluate(async prompt=>{const {rangerBattleQuestions}=await import('/src/rangerBattleQuestions.ts');return rangerBattleQuestions.find(q=>q.prompt===prompt);},prompt);
    await page.locator('.options button').nth(q.answer).click();const next=page.getByRole('button',{name:/次の問題へ/});await next.waitFor();
    const nb=await next.evaluate(el=>Math.round(el.getBoundingClientRect().bottom));console.log(`${width}x${height} next`,nb);assert.ok(nb<=height,`next button ends at ${nb} of ${height}`);
  });
}
test('a phone shows the prompt and option A as the battle opens',{timeout:45000},async t=>{
  const page=await reviewBattle(t,{width:390,height:844},'r-b-1');
  const r=await page.evaluate(()=>[document.querySelector('.question-card h3'),document.querySelector('.options button')].map(el=>{const b=el.getBoundingClientRect();return [Math.round(b.top),Math.round(b.bottom)];}));
  console.log('390x844',r);for(const [top,bot] of r)assert.ok(top>=0&&bot<=844,`${top}-${bot} is on screen`);
  if(shots)await page.screenshot({path:`${shots}/battle-after-390.png`});
});
