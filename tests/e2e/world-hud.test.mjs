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
async function open(t,viewport,area='field'){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());await page.goto(url);
  await page.evaluate(area=>localStorage.setItem('code-chronicle-save-v1',JSON.stringify({area,pos:area==='town'?{x:13,y:16}:{x:30,y:30},story:'rescued',bossDefeated:true,name:'確認'})),area);
  await page.reload();const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();await page.getByRole('button',{name:/続きから/}).click();
  await page.locator('.world-viewport').waitFor();return page;
}
const hud='.world-place,.world-objective,.world-notices,.field-minimap,.town-map,.world-map-button,.world-guide,.world-command,.world-hint';
for(const viewport of [{width:1366,height:768},{width:1920,height:1080},{width:390,height:844}])for(const area of ['field','town'])
test(`HUD stays off the map at ${viewport.width}x${viewport.height} (${area})`,{timeout:30000},async t=>{
  const page=await open(t,viewport,area);
  const overlaps=await page.evaluate(hud=>{const v=document.querySelector('.world-viewport').getBoundingClientRect();
    return [...document.querySelectorAll(hud)].map(e=>[e.className,e.getBoundingClientRect()]).filter(([,r])=>r.width&&r.left<v.right&&r.right>v.left&&r.top<v.bottom&&r.bottom>v.top).map(([c])=>c);},hud);
  assert.deepEqual(overlaps,[]);
  assert.ok(await page.locator('.world-objective').count()&&await page.locator(area==='town'?'.town-map':'.field-minimap').count());
});
test('HUD panels open and close and remember it',{timeout:30000},async t=>{
  const page=await open(t,{width:1366,height:768});
  const toggle=page.locator('.world-objective .world-panel-toggle');
  assert.equal(await toggle.getAttribute('aria-expanded'),'true');await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'),'false');assert.equal(await page.locator('.world-objective .world-panel-body').count(),0);
  await page.reload();await page.getByRole('button',{name:/続きから/}).click();
  assert.equal(await page.locator('.world-objective .world-panel-toggle').getAttribute('aria-expanded'),'false');
  assert.equal(await page.locator('.field-minimap .world-panel-toggle').getAttribute('aria-expanded'),'true');
});
