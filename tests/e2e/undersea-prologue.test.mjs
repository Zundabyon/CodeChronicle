import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
// Options are shuffled on screen, so find the correct answer by its text (offset picks a wrong one).
async function answerAt(page,selector,q,offset=0){await page.locator(selector).first().waitFor();const texts=await page.locator(selector).allInnerTexts();const i=texts.findIndex(t=>t.replace(/^[A-H]\s*/,'').replace(/\s*▶$/,'').trim()===q.options[q.answer]);if(i<0)throw new Error(`answer not shown: ${q.options[q.answer]}`);return (i+offset)%texts.length;}
let server,browser,url;
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
const key='code-chronicle-save-v1';
const shots=process.env.UNDERSEA_SHOTS;
const base={version:3,name:'確認',story:'rescued',completed:true,bossDefeated:true,level:3,hp:30,mp:4,gold:100,openedChests:['dungeon:19,5']};
const prologueSave=(step,area,pos)=>({...base,area,pos,quests:{'village-ledger':{step:'complete'},'undersea-prologue':{step}}});
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
  return page.evaluate(async ({prompt,options})=>{const {hedoroBattleQuestions}=await import('/src/hedoroBattleQuestions.ts');
    return hedoroBattleQuestions.find(q=>q.prompt===prompt&&options.some(text=>text.includes(q.options[0])));},{prompt,options});
}

test('the old road stays closed before chapter two is complete',{timeout:60000},async t=>{
  const page=await open(t,{...base,area:'village',pos:{x:1,y:7},quests:{'village-ledger':{step:'battle-r'}}});
  await press(page,'ArrowUp');await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.dialogue-box').innerText(),/まだ用はない/);
  assert.equal((await saved(page)).area,'village');
});

test('restoring the ledger starts the prologue and the cellar leads to the old road',{timeout:90000},async t=>{
  const page=await open(t,{...base,area:'village',pos:{x:4,y:8},quests:{'village-ledger':{step:'return-names'}}});
  await page.keyboard.press('Enter');await page.locator('.dialogue-box').waitFor();
  let text='';for(let i=0;i<80&&await page.locator('.dialogue-box').count();i++){text+=await page.locator('.dialogue-box').innerText();await page.locator('.dialogue-text > span').click();}
  assert.match(text,/海の向こうの大陸で漉かれた紙じゃ/,'the departure scene follows the chapter two ending');
  assert.equal((await saved(page)).quests['undersea-prologue'].step,'enter-undersea');
  assert.match(await page.locator('.world-objective').innerText(),/記録所の地下へ/);
  await press(page,'ArrowLeft',3);await press(page,'ArrowUp',2);
  await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.story-art').getAttribute('style'),/undersea-entrance/);
  await advance(page);
  const s=await saved(page);assert.equal(s.area,'undersea');assert.deepEqual(s.pos,{x:8,y:104});assert.equal(s.quests['undersea-prologue'].step,'cross-tunnel');
  assert.equal(await page.locator('.top-location').innerText(),'海底の古道');
  if(shots)await page.screenshot({path:`${shots}/undersea-entrance.png`});
});

test('the sea window scene marks the tunnel crossed',{timeout:60000},async t=>{
  const page=await open(t,prologueSave('cross-tunnel','undersea',{x:18,y:53}));
  await press(page,'ArrowUp');await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.dialogue-box').innerText(),/窓/,'the sea window scene plays (without the reserved underwater-city art)');
  await advance(page);assert.equal((await saved(page)).quests['undersea-prologue'].step,'defeat-hedoro');
});

test('beating the sludge boss opens the neck and reaching the far shore clears the prologue',{timeout:120000},async t=>{
  const page=await open(t,prologueSave('defeat-hedoro','undersea',{x:40,y:15}));
  await press(page,'ArrowUp');
  if(shots)await page.screenshot({path:`${shots}/undersea-boss.png`});
  await page.keyboard.press('Enter');await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.dialogue-box').innerText(),/縄張り|ヘドロ|泥/);
  await advance(page);
  assert.ok(await current(page),'the boss draws from the hedoro set');
  for(let i=0;i<7;i++){
    const q=await current(page);await page.locator('.options button').nth(await answerAt(page,'.options button',q)).click();
    if(i===6){await page.getByRole('button',{name:/戦闘を終える/}).click();break;}
    await page.getByRole('button',{name:/次の問題へ/}).click();
  }
  await page.locator('.dialogue-box').waitFor();await advance(page);
  let s=await saved(page);assert.equal(s.quests['undersea-prologue'].step,'reach-shore');
  assert.ok(Object.keys(s.learningRecords).every(id=>id.startsWith('hedoro-')));
  await press(page,'ArrowUp',10);await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.dialogue-box').innerText(),/浜辺/);
  await advance(page);
  s=await saved(page);assert.equal(s.quests['undersea-prologue'].step,'complete');assert.deepEqual(s.pos,{x:40,y:4});
  assert.match(await page.locator('.world-objective').innerText(),/王都/,'the chapter four intro follows the prologue');
});
