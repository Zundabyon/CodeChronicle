// Compare paused/playing decoration in the real title. Measurements, not CI thresholds.
import {createServer} from 'vite';
import {chromium} from 'playwright-core';
import {existsSync} from 'node:fs';
const server=await createServer({server:{host:'127.0.0.1',port:0,hmr:false,ws:false}});
let browser;
try{
  await server.listen();
  const executablePath=process.env.CHROME_PATH??['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/usr/bin/chromium','/usr/bin/google-chrome'].find(existsSync);
  browser=await chromium.launch({headless:true,...(executablePath?{executablePath}:{})});
  const page=await browser.newPage({viewport:{width:1280,height:800},reducedMotion:'no-preference'});
  await page.addInitScript(()=>localStorage.setItem('code-chronicle-object-motion','off'));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}`);
  await page.locator('.title-background').evaluate(image=>image.decode());
  await page.waitForFunction(()=>document.querySelector('.artwork-motion-layer')?.hasAttribute('viewBox'));
  const session=await page.context().newCDPSession(page);await session.send('Performance.enable');
  const metrics=async()=>Object.fromEntries((await session.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));
  const results=[];
  for(const cpuRate of [1,4]){
    await session.send('Emulation.setCPUThrottlingRate',{rate:cpuRate});
    for(const playing of [false,true]){
      const toggle=page.locator('.title-motion-toggle');
      if((await toggle.getAttribute('aria-pressed')==='true')!==playing)await toggle.click();
      await page.waitForTimeout(400);
      const before=await metrics();
      const frames=await page.evaluate(()=>new Promise(resolve=>{
        const times=[];let start,last;
        function tick(now){if(start===undefined)start=now;if(last!==undefined)times.push(now-last);last=now;if(now-start<3000)requestAnimationFrame(tick);else resolve(times);}
        requestAnimationFrame(tick);
      }));
      const after=await metrics(),sorted=[...frames].sort((a,b)=>a-b);
      results.push({cpuRate,playing,frames:frames.length,frameP95Ms:Number(sorted[Math.floor(sorted.length*.95)].toFixed(2)),framesOver34ms:frames.filter(ms=>ms>34).length,taskMs:Number(((after.TaskDuration-before.TaskDuration)*1000).toFixed(2)),layoutMs:Number(((after.LayoutDuration-before.LayoutDuration)*1000).toFixed(2)),styleMs:Number(((after.RecalcStyleDuration-before.RecalcStyleDuration)*1000).toFixed(2))});
    }
  }
  const media=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.(png|webp|gif|mp4|webm)(?:$|\?)/.test(r.name)&&/\/(title|motion)\//.test(new URL(r.name).pathname)).map(r=>({path:new URL(r.name).pathname,transferBytes:r.transferSize})));
  console.log(JSON.stringify({environment:'local headless Chromium, 1280x800; 4x is simulated CPU throttling, not a physical phone; 3 seconds per sample; dev build',results,media},null,2));
}finally{await browser?.close();await server.close();}
