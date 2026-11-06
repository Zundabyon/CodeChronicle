import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
let server,browser,url;
const key='code-chronicle-save-v1',backupKey='code-chronicle-save-backup-v1';
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
async function fixture(t){
  const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,r=>r.abort());await page.goto(url);return page;
}
async function seed(page,hasSave=true,hasBackup=false){
  await page.evaluate(({key,backupKey,hasSave,hasBackup})=>{
    localStorage.removeItem(key);localStorage.removeItem(backupKey);
    const data={version:2,name:'旅人',story:'legacy',area:'home',pos:{x:5,y:7},level:3,gold:321};
    if(hasSave)localStorage.setItem(key,JSON.stringify(data));
    if(hasBackup)localStorage.setItem(backupKey,JSON.stringify({...data,name:'前の旅人',gold:456}));
  },{key,backupKey,hasSave,hasBackup});await page.reload();
  const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();
  await page.evaluate(()=>document.fonts.ready);
}
test('desktop title keeps the main action above the fold for new, saved and backed-up adventures',{timeout:60000},async t=>{
  const page=await fixture(t);
  for(const viewport of [{width:1280,height:800},{width:1366,height:768},{width:1024,height:600}]){
    await page.setViewportSize(viewport);
    for(const state of ['new','saved','backup']){
      await seed(page,state!=='new',state==='backup');
      await page.locator('.title-background').evaluate(im=>im.decode());
      assert.ok(await page.evaluate(()=>document.fonts.check('800 24px "Chronicle Mincho"','コードクロニクル')));
      const metrics=await page.evaluate(()=>({height:innerHeight,scroll:document.documentElement.scrollHeight,width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
      assert.ok(metrics.scroll<=metrics.height+2,`${viewport.width} ${state}: ${metrics.scroll}>${metrics.height}`);
      assert.ok(metrics.scrollWidth<=metrics.width);
      const primary=page.locator('.title-menu .primary');
      assert.equal((await primary.innerText()).replace('▶','').trim(),state==='new'?'新しい冒険を始める':'続きから始める');
      const bounds=await primary.boundingBox();assert.ok(bounds.y>=0&&bounds.y+bounds.height<=viewport.height);
    }
  }
  await page.setViewportSize({width:1280,height:800});await seed(page,true,true);
  await page.screenshot({path:'/private/tmp/cc-title-refined-desktop.png'});
  await page.getByRole('button',{name:'続きから始める',exact:true}).click();await page.locator('.world-stage').waitFor();
});
test('adventure management preserves import confirmation, backup restore, Escape focus and mobile usability',{timeout:60000},async t=>{
  const page=await fixture(t);await page.setViewportSize({width:1280,height:800});await seed(page,true,true);
  const before=await page.evaluate(key=>localStorage.getItem(key),key);
  const opener=page.getByRole('button',{name:/冒険の管理/});await opener.click();
  const dialog=page.getByRole('dialog',{name:'冒険の管理'});await dialog.waitFor();
  await page.keyboard.press('Escape');assert.equal(await dialog.isVisible(),false);assert.equal(await opener.evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),before);
  await opener.click();await dialog.locator('.save-transfer summary').click();
  const incoming={version:2,name:'持ち運びの旅人',story:'legacy',area:'home',pos:{x:5,y:7},gold:789};
  await dialog.locator('input[type=file]').setInputFiles({name:'save.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(incoming))});
  await dialog.getByRole('button',{name:'このセーブを読み込む',exact:true}).waitFor();
  assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),before,'file selection must not replace the current adventure');
  await dialog.getByRole('button',{name:'取り消す',exact:true}).click();
  await dialog.locator('.backup-summary summary').click();
  await dialog.getByRole('button',{name:'この冒険を復元する',exact:true}).click();
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).name,key),'前の旅人');
  await dialog.getByRole('button',{name:'冒険の管理を閉じる'}).click();
  assert.ok((await page.locator('.title-adventure').innerText()).includes('前の旅人'));
  await page.setViewportSize({width:390,height:844});
  await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'/private/tmp/cc-title-refined-mobile.png',fullPage:true});
  await opener.click();assert.equal(await dialog.isVisible(),true);await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'新しい冒険を始める',exact:true}).click();await page.locator('.prologue-screen').waitFor();
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).name,backupKey),'前の旅人');
});
