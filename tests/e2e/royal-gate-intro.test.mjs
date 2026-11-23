import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
// Options are shuffled on screen, so find the correct answer by its text (offset picks a wrong one).
async function answerAt(page,selector,q,offset=0){await page.locator(selector).first().waitFor();const texts=await page.locator(selector).allInnerTexts();const i=texts.findIndex(t=>t.replace(/^[A-D]\s*/,'').replace(/\s*▶$/,'').trim()===q.options[q.answer]);if(i<0)throw new Error(`answer not shown: ${q.options[q.answer]}`);return (i+offset)%4;}
let server,browser,url;
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
const key='code-chronicle-save-v1';
const shots=process.env.ROYAL_SHOTS;
const base={version:3,name:'確認',story:'rescued',completed:true,bossDefeated:true,level:3,hp:30,mp:4,gold:100,openedChests:['dungeon:19,5']};
const introSave=(step,area,pos)=>({...base,area,pos,quests:{'village-ledger':{step:'complete'},'undersea-prologue':{step:'complete'},...(step?{'royal-gate-intro':{step}}:{})}});
async function open(t,save){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.addInitScript(()=>{Math.random=()=>0;});await page.goto(url);
  await page.evaluate(({key,save})=>localStorage.setItem(key,JSON.stringify(save)),{key,save});
  await page.reload();
  const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();
  await page.getByRole('button',{name:/続きから/}).click();await page.locator('.world-viewport').focus();return page;
}
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
async function advance(page){for(let i=0;i<80&&await page.locator('.dialogue-box').count();i++)await page.locator('.dialogue-text > span').click();}
async function press(page,keyName,times=1){for(let i=0;i<times;i++)await page.keyboard.press(keyName);}
async function current(page){
  await page.locator('.question-card h3').waitFor();
  const prompt=await page.locator('.question-card h3').innerText(),options=await page.locator('.options button').allInnerTexts();
  return page.evaluate(async ({prompt,options})=>{const {clownBattleQuestions}=await import('/src/clownBattleQuestions.ts');
    return clownBattleQuestions.find(q=>q.prompt===prompt&&options.some(text=>text.includes(q.options[0])));},{prompt,options});
}


test('the road east from the far shore leads into the royal gate town and its arrival scene',{timeout:90000},async t=>{
  const page=await open(t,introSave(undefined,'undersea',{x:42,y:4}));
  await press(page,'ArrowRight');
  let sawArt=false;
  for(let i=0;i<80;i++){
    await page.waitForTimeout(100);if(!await page.locator('.dialogue-box').count())continue;
    const art=page.locator('.story-art');if(await art.count()&&/gate-queue/.test(await art.getAttribute('style')??''))sawArt=true;
    if(sawArt&&shots&&i<40)await page.screenshot({path:`${shots}/royal-arrival.png`});
    await page.locator('.dialogue-text > span').click();
  }
  assert.ok(sawArt,'the arrival scene shows the gate queue art');
  const s=await saved(page);assert.equal(s.area,'royalGate');assert.equal(s.quests['royal-gate-intro'].step,'meet-haven');
  assert.equal(await page.locator('.top-location').innerText(),'王都の関所街');
  if(shots)await page.screenshot({path:`${shots}/royal-arrival.png`});
});

test('beating the clown clears the gate and the intro',{timeout:120000},async t=>{
  const page=await open(t,introSave('defeat-clown','royalGate',{x:30,y:11}));
  await press(page,'ArrowUp');
  await page.keyboard.press('Enter');await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.dialogue-box').innerText(),/列|道化|順番/);
  await advance(page);
  for(let i=0;i<7;i++){
    const q=await current(page);assert.ok(q,'the clown draws from the clown set');
    await page.locator('.options button').nth(await answerAt(page,'.options button',q)).click();
    if(i===6){await page.getByRole('button',{name:/戦闘を終える/}).click();break;}
    await page.getByRole('button',{name:/次の問題へ/}).click();
  }
  await page.locator('.dialogue-box').waitFor();await advance(page);
  const s=await saved(page);assert.equal(s.quests['royal-gate-intro'].step,'complete');
  await press(page,'ArrowUp',2);
  assert.equal((await saved(page)).pos.y,8,'the gate cells open once the clown is gone');
});
