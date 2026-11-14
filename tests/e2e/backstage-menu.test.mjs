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

test('裏会議は章クリアで解放され、未解放はロックされる',async t=>{
  const page=await open(t,{...base,completed:true,bossDefeated:true});
  await page.getByRole('button',{name:/冒険の管理/}).click();await page.getByText('おまけ：裏会議').click();
  assert.equal(await page.getByRole('button',{name:/第二回（未解放）/}).isDisabled(),true);
  const before=JSON.stringify(await saved(page));
  await page.getByRole('button',{name:/第一回「/}).click();
  await page.locator('.dialogue-box').waitFor();
  assert.match(await page.locator('.dialogue-text strong').innerText(),/語り手/);
  await page.keyboard.press('Enter');
  assert.match(await page.locator('.dialogue-text strong').innerText(),/めたっぴ/);
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
