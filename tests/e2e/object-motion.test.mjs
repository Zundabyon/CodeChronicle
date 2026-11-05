import {test,before,after} from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {chromium} from 'playwright-core';
import {createServer} from 'vite';
let server,browser,url;
before(async()=>{
  server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});await server.listen();
  url=`http://127.0.0.1:${server.httpServer.address().port}`;
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
});
after(async()=>{await browser?.close();await server?.close();});
async function fixture(t,path='/'){
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'no-preference'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.goto(url+path);return page;
}
async function ready(page){await page.locator('.title-background').evaluate(image=>image.decode());await page.locator('.title-artwork [data-motion-active=true]').waitFor();}
const playback=page=>page.locator('.title-artwork .object-motion-scene').getAttribute('data-motion-active');

test('artwork coordinates remain attached to the cover image across desktop, mobile and breakpoint changes',{timeout:45000},async t=>{
  const page=await fixture(t);await ready(page);
  for(const viewport of [{width:1920,height:960},{width:1280,height:800},{width:1024,height:600},{width:390,height:844},{width:844,height:390},{width:901,height:800},{width:900,height:800}]){
    await page.setViewportSize(viewport);
    await page.waitForFunction(()=>{
      const image=document.querySelector('.title-background'),svg=document.querySelector('.artwork-motion-layer'),r=image.getBoundingClientRect(),view=svg.viewBox.baseVal;
      const scale=Math.max(r.width/image.naturalWidth,r.height/image.naturalHeight);
      return Math.abs(view.width-r.width/scale)<1&&Math.abs(view.height-r.height/scale)<1;
    });
    const error=await page.evaluate(()=>{
      const image=document.querySelector('.title-background'),svg=document.querySelector('.artwork-motion-layer'),r=image.getBoundingClientRect();
      const [x,y]=getComputedStyle(image).objectPosition.split(' ').map(value=>parseFloat(value)/100);
      const scale=Math.max(r.width/image.naturalWidth,r.height/image.naturalHeight),source={x:1323,y:151};
      const expected={x:r.left+(r.width-image.naturalWidth*scale)*x+source.x*scale,y:r.top+(r.height-image.naturalHeight*scale)*y+source.y*scale};
      const actual=new DOMPoint(source.x,source.y).matrixTransform(svg.getScreenCTM());
      return Math.hypot(actual.x-expected.x,actual.y-expected.y);
    });
    assert.ok(error<1,`${viewport.width}x${viewport.height}: ${error}px drift`);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
});
test('motion preference persists independently, adds no media requests and never blocks starting the adventure',{timeout:45000},async t=>{
  const page=await fixture(t);await ready(page);
  await page.evaluate(()=>localStorage.setItem('unrelated-setting','keep'));
  const before=await page.evaluate(()=>localStorage.getItem('code-chronicle-save-v1'));
  await page.getByRole('button',{name:'背景の動き：入',exact:true}).click();
  assert.equal(await playback(page),'false');
  assert.ok(await page.locator('.title-light').evaluateAll(elements=>elements.every(element=>getComputedStyle(element).animationName==='none'&&getComputedStyle(element).opacity==='0')));
  await page.reload();await page.getByRole('button',{name:'背景の動き：切',exact:true}).waitFor();
  assert.equal(await playback(page),'false');
  assert.equal(await page.evaluate(()=>localStorage.getItem('code-chronicle-save-v1')),before);
  assert.equal(await page.evaluate(()=>localStorage.getItem('unrelated-setting')),'keep');
  assert.equal(await page.locator('video,canvas').count(),0);
  const artwork=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.(png|webp|gif|mp4|webm)(?:$|\?)/.test(r.name)&&/\/(title|motion)\//.test(new URL(r.name).pathname)).map(r=>new URL(r.name).pathname));
  assert.deepEqual(artwork,['/title/knowledge-journey-v1.png']);
  await page.getByRole('button',{name:'背景の動き：切',exact:true}).click();await ready(page);
  await page.getByRole('button',{name:'新しい冒険を始める',exact:true}).click();await page.locator('.prologue-screen').waitFor();
  assert.equal(await page.locator('.title-artwork').count(),0);
});
test('live reduced-motion and visibility changes stop playback and image failure stays static',{timeout:45000},async t=>{
  const page=await fixture(t);await ready(page);
  await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'背景の動き：端末設定で停止'}).waitFor();
  assert.equal(await playback(page),'false');assert.equal(await page.getByRole('button',{name:'背景の動き：端末設定で停止'}).isDisabled(),true);
  await page.emulateMedia({reducedMotion:'no-preference'});await ready(page);
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
  await page.waitForFunction(()=>document.querySelector('.title-artwork .object-motion-scene').dataset.motionActive==='false');
  await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await ready(page);
  await page.route('**/title/knowledge-journey-v1.png',route=>route.abort());await page.reload();
  await page.getByRole('button',{name:'新しい冒険を始める',exact:true}).waitFor();assert.equal(await playback(page),'false');
  await page.getByRole('button',{name:'新しい冒険を始める',exact:true}).click();await page.locator('.prologue-screen').waitFor();
});
test('development harness reuses glow and sway and shares playback preference with the title',{timeout:45000},async t=>{
  const page=await fixture(t,'/scripts/object-motion-harness.html');
  await page.getByRole('heading',{name:'Object motion / 確認用'}).waitFor();
  assert.equal(await page.locator('[data-motion-preset=glow]').count(),2);assert.equal(await page.locator('[data-motion-preset=sway]').count(),1);
  await page.getByRole('button',{name:'動きを止める',exact:true}).click();
  assert.equal(await page.locator('.motion-harness-samples').getAttribute('data-motion-active'),'false');
  await page.getByRole('button',{name:'タイトルを確認',exact:true}).click();await page.getByRole('button',{name:'背景の動き：切',exact:true}).waitFor();
  await page.getByRole('button',{name:'背景の動き：切',exact:true}).click();await ready(page);
  await page.getByRole('button',{name:'部品を確認',exact:true}).click();await page.getByRole('status').filter({hasText:'再生中'}).waitFor();
  assert.equal(await page.locator('.motion-harness-samples').getAttribute('data-motion-active'),'true');
});
