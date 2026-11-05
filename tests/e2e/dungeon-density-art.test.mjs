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
async function resume(page){const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();await page.getByRole('button',{name:/続きから/}).click();}
async function fixture(t){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'}),errors=[];
  page.setDefaultTimeout(10000);page.on('pageerror',error=>errors.push(error.message));
  t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.addInitScript(()=>{Math.random=()=>0;});await page.goto(url);
  return page;
}
async function relocate(page,extra){
  await page.evaluate(({key,extra})=>localStorage.setItem(key,JSON.stringify({name:'密度確認',story:'rescued',completed:true,bossDefeated:true,area:'crudRead',pos:{x:15,y:60},gold:321,quests:{'village-ledger':{step:'complete'}},...extra})),{key,extra});
  await page.reload();await resume(page);
}

test('additional monsters retain their design through encounter and combat in all four dungeons',{timeout:90000},async t=>{
  const page=await fixture(t);
  const setups=await page.evaluate(async()=>{
    const {spawnEnemies,enemyAt}=await import('/src/enemyMovement.ts');
    const {worldMaps,canWalkOnMap,eventAt}=await import('/src/world/maps.ts');
    const {memoryDungeons}=await import('/src/world/memoryDungeons.ts');
    const {memoryEnemyVisual}=await import('/src/world/memoryEnemyArt.ts');
    const positions=spawnEnemies();
    return memoryDungeons.map(d=>{
      const map=worldMaps[d.area],enemy=map.enemies.find(e=>e.id.includes('-copy-')),target=positions[enemy.id];
      const pos=[{x:target.x+1,y:target.y},{x:target.x-1,y:target.y},{x:target.x,y:target.y+1},{x:target.x,y:target.y-1}].find(p=>canWalkOnMap(map,p)&&!enemyAt(d.area,p,positions,[])&&!map.npcs.some(n=>n.x===p.x&&n.y===p.y)&&!eventAt(map,p,'enter'));
      return {area:d.area,id:enemy.id,pos,count:map.enemies.length,visual:memoryEnemyVisual(enemy.id),baseVisual:memoryEnemyVisual(enemy.id.split('-copy-')[0]),key:pos.x>target.x?'ArrowLeft':pos.x<target.x?'ArrowRight':pos.y>target.y?'ArrowUp':'ArrowDown'};
    });
  });
  assert.equal(setups.reduce((total,s)=>total+s.count,0),48);
  for(const setup of setups){
    assert.equal(setup.count,12);assert.deepEqual(setup.visual,setup.baseVisual);
    await relocate(page,{area:setup.area,pos:setup.pos,defeated:[]});
    assert.ok(await page.locator('.world-enemy image[href$="memory-dungeon-enemies-v1.png"]').count());
    await page.locator('.world-viewport').focus();await page.keyboard.press(setup.key);
    await page.locator('.encounter-foe-sprite [data-memory-enemy-art="'+setup.id+'"]').waitFor();
    const sprite=page.locator('.battle-foe [data-memory-enemy-art="'+setup.id+'"]');await sprite.waitFor();
    assert.equal(await sprite.getAttribute('viewBox'),'0 0 '+setup.visual.frame[2]+' '+setup.visual.frame[3]);
    assert.ok((await sprite.locator('image').getAttribute('href')).endsWith(setup.visual.src));
  }
  await page.screenshot({path:'/private/tmp/cc-density-copy-battle.png'});
  const setup=setups[0];await relocate(page,{area:setup.area,pos:setup.pos,defeated:[]});
  const visibleBefore=await page.locator('.world-enemy').count();
  await relocate(page,{area:setup.area,pos:setup.pos,defeated:[setup.id]});
  assert.equal(await page.locator('.world-enemy').count(),visibleBefore-1,'one defeated individual does not remove its siblings');
});

test('detailed spring and both door states render from transparent high resolution artwork on desktop and mobile',{timeout:60000},async t=>{
  const page=await fixture(t);
  const data=await page.evaluate(async()=>{
    const {propChips}=await import('/src/world/catalog.ts');
    const {questDefinitions}=await import('/src/quests/definitions.ts');
    const {memoryDungeons}=await import('/src/world/memoryDungeons.ts');
    const door=memoryDungeons.find(d=>d.key==='r').doors[0];
    const steps=questDefinitions.find(d=>d.id==='village-ledger').steps;
    return {door,spring:propChips.memorySpring.visual,closed:propChips.memoryDoor.visual,open:propChips.memoryDoorOpen.visual,restStep:steps.find(s=>s.npcId==='memory-r-trial-2').id};
  });
  for(const visual of [data.spring,data.closed,data.open]){
    assert.equal(visual.renderer,'atlas');assert.ok(visual.src.endsWith('.png'));
    assert.ok(visual.frame[2]>=200&&visual.frame[3]>=200,'original art must retain fine source detail');
  }
  await relocate(page,{pos:{x:4,y:34},quests:{'village-ledger':{step:data.restStep}}});
  const assertArt=async visual=>{
    const loaded=await page.evaluate(async src=>{const image=new Image();image.src='/'+src;await image.decode();return {width:image.naturalWidth,height:image.naturalHeight};},visual.src);
    assert.equal(loaded.width,visual.sourceWidth);assert.equal(loaded.height,visual.sourceHeight);
  };
  await assertArt(data.spring);await assertArt(data.closed);await assertArt(data.open);
  assert.ok(await page.locator('.world-chip image').evaluateAll((nodes,src)=>nodes.some(n=>n.getAttribute('href')?.endsWith(src)),data.spring.src));
  await page.screenshot({path:'/private/tmp/cc-detailed-spring-desktop.png'});
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.screenshot({path:'/private/tmp/cc-detailed-spring-mobile.png'});
  await page.setViewportSize({width:1280,height:1000});
  await relocate(page,{pos:{x:data.door[0],y:data.door[1]+1},quests:{'village-ledger':{step:'read-records'}}});
  assert.ok(await page.locator('.memory-door-closed image').count());
  await page.screenshot({path:'/private/tmp/cc-detailed-door-closed.png'});
  await relocate(page,{pos:{x:data.door[0],y:data.door[1]+1},quests:{'village-ledger':{step:'complete'}}});
  assert.ok(await page.locator('.memory-door-open image').count());
  await page.screenshot({path:'/private/tmp/cc-detailed-door-open.png'});
});
