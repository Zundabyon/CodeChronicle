import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
let server,browser,url;
const key='code-chronicle-save-v1',shots=process.env.BATTLE_SHOTS;
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
// Starts today's five from the header, then answers the same review question wrong five times.
async function playFive(page){
  await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.learning-session summary').click();await page.getByRole('button',{name:'新しく5問の目標を始める'}).click();
  await page.locator('.learning-session summary').click();
  await page.getByRole('button',{name:/コマンド/}).click();await page.getByRole('button',{name:/きょうかい/}).click();await page.getByRole('button',{name:/復習の部屋へ入る/}).click();
  await page.getByRole('button',{name:/答えを見ずに再挑戦/}).click();
  const wrong=await page.evaluate(async()=>{const {questions}=await import('/src/content.ts');return (questions.find(q=>q.id==='r-b-1').answer+1)%4;});
  for(let i=0;i<5;i++){
    assert.match(await page.locator('.learning-session summary').innerText(),new RegExp(`今日の5問 ${i}/5`));
    await page.locator('.options button').nth(wrong).click();
    if(i<4)await page.getByRole('button',{name:/もう一度挑戦する/}).click();
  }
}
test('five answers pay XP once a day and again the next day',{timeout:90000},async t=>{
  const page=await browser.newPage({viewport:{width:1470,height:800},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.clock.setFixedTime(new Date('2026-11-15T10:00:00'));
  await page.goto(url);
  await page.evaluate(key=>localStorage.setItem(key,JSON.stringify({area:'town',pos:{x:13,y:16},story:'legacy',name:'確認',wrong:['r-b-1']})),key);await page.reload();
  const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();
  await playFive(page);
  await page.locator('.learning-session-panel p[role=status]', {hasText:'経験値 +8'}).waitFor({state:'attached'});
  assert.match(await page.locator('.learning-session summary').innerText(),/報酬受取済み✓/);
  let s=await saved(page);assert.equal(s.xp,8);assert.equal(s.dailyRewardDate,'2026-11-15');
  if(shots){await page.locator('.learning-session summary').click();await page.screenshot({path:`${shots}/header-daily.png`});await page.locator('.learning-session summary').click();}
  await page.reload();await playFive(page);await page.locator('.next-turn').waitFor();
  await page.locator('.learning-session summary').click();await page.getByText('本日の報酬は受け取り済み。また明日').waitFor();
  s=await saved(page);assert.equal(s.xp,8);
  await page.clock.setFixedTime(new Date('2026-11-16T09:00:00'));await page.reload();await playFive(page);
  await page.locator('.learning-session-panel p[role=status]', {hasText:'経験値 +8'}).waitFor({state:'attached'});
  s=await saved(page);assert.equal(s.xp,16);assert.equal(s.dailyRewardDate,'2026-11-16');assert.equal(s.level,2);
});
