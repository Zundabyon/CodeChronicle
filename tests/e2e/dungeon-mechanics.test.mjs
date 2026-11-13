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
async function fixture(t,extra={}){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'}),errors=[];
  page.setDefaultTimeout(10000);
  page.on('pageerror',error=>errors.push(error.message));t.after(async()=>{if(errors.length){await page.screenshot({path:'/private/tmp/cc-resource-failure-'+t.name.split(' ')[0]+'.png'});console.log('Failed page:',(await page.locator('body').innerText()).slice(-2000));}await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.addInitScript(()=>{Math.random=()=>0;});await page.goto(url);
  await page.evaluate(({key,extra})=>localStorage.setItem(key,JSON.stringify({name:'実習確認',story:'rescued',completed:true,bossDefeated:true,area:'crudRead',pos:{x:23,y:110},gold:321,quests:{'village-ledger':{step:'read-records'}},...extra})),{key,extra});
  await page.reload();await resume(page);return page;
}
async function saved(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);}
async function interact(page){await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.locator('.dialogue-box').waitFor();}
async function advance(page){for(let i=0;i<30&&await page.locator('.dialogue-box').count()&&!await page.locator('.dialogue-choices button').count();i++)await page.locator('.dialogue-text > span').click();}
async function course(page){return page.evaluate(async()=>{
  const {questDefinitions}=await import('/src/quests/definitions.ts');const {questions}=await import('/src/content.ts');const {memoryDungeons}=await import('/src/world/memoryDungeons.ts');
  const dungeon=memoryDungeons.find(d=>d.key==='r'),npcId='memory-r-trial-0';
  const steps=questDefinitions.find(d=>d.id==='village-ledger').steps.filter(s=>s.npcId===npcId&&s.trigger.type==='question-answered');
  return {dungeon,npcId,allSteps:questDefinitions.find(d=>d.id==='village-ledger').steps,steps:steps.map(step=>({...step,q:questions.find(q=>q.id===step.trigger.questionId)}))};
});}
async function relocate(page,extra){await page.evaluate(({key,extra})=>{const save=JSON.parse(localStorage.getItem(key));Object.assign(save,extra);localStorage.setItem(key,JSON.stringify(save));},{key,extra});await page.reload();await resume(page);}

test('a room door stays closed through mistakes and partial progress, then opens and persists',{timeout:90000},async t=>{
  const page=await fixture(t),{dungeon,npcId,steps}=await course(page);assert.ok(steps.length>1,'a seal contains multiple lessons');
  const [x,y]=dungeon.doors[0];await relocate(page,{pos:{x,y:y+1},quests:{'village-ledger':{step:steps[0].id}}});
  await page.locator('.world-viewport').focus();await page.keyboard.press('ArrowUp');await advance(page);
  assert.deepEqual((await saved(page)).pos,{x,y:y+1});
  const q=steps[0].q;await page.locator('.dialogue-choices button').nth((q.answer+1)%4).click();
  assert.equal(await page.locator('.quest-study-result').count(),0);assert.equal((await saved(page)).quests['village-ledger'].step,steps[0].id);
  await advance(page);
  for(const [index,step] of steps.entries()){
    assert.equal((await saved(page)).quests['village-ledger'].step,step.id);
    await page.locator('.dialogue-choices button').nth(step.q.answer).click();
    if(step.study){await page.locator('.quest-study-result').waitFor();assert.ok((await page.locator('.quest-study-result').innerText()).includes(step.study.result));}
    const open=await page.evaluate(async({npcId,key})=>{const {isMemoryDoorOpen}=await import('/src/quests/memoryGates.ts');return isMemoryDoorOpen(JSON.parse(localStorage.getItem(key)).quests,npcId);},{npcId,key});
    assert.equal(open,index===steps.length-1);
    if(index===0){await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/private/tmp/cc-resource-mobile-result.png'});}
    await advance(page);
  }
  await page.setViewportSize({width:1280,height:1000});await page.locator('.memory-door-open').first().waitFor();
  await page.locator('.world-viewport').focus();await page.keyboard.press('ArrowUp');assert.deepEqual((await saved(page)).pos,{x,y});
  await page.reload();await resume(page);await page.locator('.memory-door-open').first().waitFor();assert.deepEqual((await saved(page)).pos,{x,y});
  await page.screenshot({path:'/private/tmp/cc-resource-open-door.png'});
});

test('free springs restore HP and MP repeatedly without advancing quests or spending gold',{timeout:45000},async t=>{
  const page=await fixture(t,{pos:{x:2,y:55},hp:2,mp:0,quests:{'village-ledger':{step:'read-records'}}});
  const data=await course(page);await relocate(page,{pos:{x:2,y:55},quests:{'village-ledger':{step:data.allSteps.find(s=>s.npcId==='memory-r-trial-2').id}}});
  const before=await saved(page);await interact(page);assert.equal((await saved(page)).hp,2);assert.ok((await page.locator('.dialogue-text').innerText()).includes('澄んだ水面'));await advance(page);await page.waitForFunction(key=>JSON.parse(localStorage.getItem(key)).hp>2,key);
  const healed=await saved(page);assert.equal(healed.hp,20+(healed.level-1)*5);assert.equal(healed.mp,3+Math.floor((healed.level-1)/2));assert.equal(healed.gold,before.gold);assert.deepEqual(healed.quests,before.quests);
  await interact(page);await advance(page);const again=await saved(page);assert.equal(again.hp,healed.hp);assert.equal(again.gold,before.gold);assert.deepEqual(again.quests,before.quests);
});

test('fellow adventurers explain the operation taught in their dungeon',{timeout:45000},async t=>{
  const page=await fixture(t);const data=await course(page);await relocate(page,{pos:{x:2,y:54},quests:{'village-ledger':{step:data.allSteps.find(s=>s.npcId==='memory-r-trial-2').id}}});
  // The adventurer stands east of the v2 spring tile; a lesson tablet is north of it, so face east.
  await page.locator('.world-viewport').focus();await page.keyboard.press('ArrowRight');await page.locator('.dialogue-box').waitFor();
  let text='';for(let i=0;i<10&&await page.locator('.dialogue-box').count();i++){text+=await page.locator('.dialogue-text').innerText();await page.locator('.dialogue-text > span').click();}
  assert.ok(text.includes('index'));assert.ok(text.includes('show'));assert.ok(text.includes('一覧'));
});

test('dungeon guardians ask operation-specific questions and use the dungeon battle scene',{timeout:60000},async t=>{
  const page=await fixture(t,{difficulty:'advanced'});
  const setup=await page.evaluate(async()=>{
    const {spawnEnemies,enemyAt}=await import('/src/enemyMovement.ts');const {worldMaps,canWalkOnMap,eventAt}=await import('/src/world/maps.ts');const positions=spawnEnemies(),enemy=positions['memory-r-enemy-0'];
    const pos=[{x:enemy.x+1,y:enemy.y},{x:enemy.x-1,y:enemy.y},{x:enemy.x,y:enemy.y+1},{x:enemy.x,y:enemy.y-1}].find(p=>canWalkOnMap(worldMaps.crudRead,p)&&!enemyAt('crudRead',p,positions,[])&&!eventAt(worldMaps.crudRead,p,'enter'));
    return {pos,key:pos.x>enemy.x?'ArrowLeft':pos.x<enemy.x?'ArrowRight':pos.y>enemy.y?'ArrowUp':'ArrowDown'};
  });const data=await course(page);await relocate(page,{pos:setup.pos,quests:{'village-ledger':{step:data.allSteps.find(s=>s.npcId==='memory-r-trial-1').id}}});await page.locator('.world-viewport').focus();await page.keyboard.press(setup.key);
  await page.locator('.battlefield-dungeon').waitFor();assert.equal(await page.locator('.battlefield-location').innerText(),'読解の書庫');
  assert.equal(await page.locator('.battle-foe [data-memory-enemy-art]').getAttribute('data-memory-enemy-art'),'memory-r-enemy-0');
  assert.ok((await page.locator('.battle-foe image').getAttribute('href')).endsWith('sprites/memory-dungeon-enemies-v1.png'));
  const prompt=await page.locator('.question-card h3').innerText();const q=await page.evaluate(async prompt=>{const {questions}=await import('/src/content.ts');return questions.find(q=>q.prompt===prompt);},prompt);
  assert.ok(q.id==='basics-crud-r'||q.id.startsWith('ledger-read-')||q.id.startsWith('resource-read-'));assert.notEqual(q.kind,'cli');
  const levels={beginner:'初級',intermediate:'中級',advanced:'上級'};assert.ok((await page.locator('.question-kicker').innerText()).includes(levels[q.difficulty]));
  await page.screenshot({path:'/private/tmp/cc-resource-guardian.png'});
});

test('all twelve new monster designs appear consistently on the map, encounter and battlefield',{timeout:120000},async t=>{
  const page=await fixture(t,{quests:{'village-ledger':{step:'complete'}}});
  const setups=await page.evaluate(async()=>{
    const {spawnEnemies,enemyAt}=await import('/src/enemyMovement.ts');
    const {worldMaps,canWalkOnMap,eventAt}=await import('/src/world/maps.ts');
    const {memoryDungeons}=await import('/src/world/memoryDungeons.ts');
    const positions=spawnEnemies();
    return memoryDungeons.flatMap(d=>worldMaps[d.area].enemies.filter(enemy=>!enemy.id.includes('-copy-')).map(enemy=>{
      const target=positions[enemy.id],map=worldMaps[d.area];
      const pos=[{x:target.x+1,y:target.y},{x:target.x-1,y:target.y},{x:target.x,y:target.y+1},{x:target.x,y:target.y-1}].find(p=>
        canWalkOnMap(map,p)&&!enemyAt(d.area,p,positions,[])&&!map.npcs.some(n=>n.x===p.x&&n.y===p.y)&&!eventAt(map,p,'enter'));
      return {area:d.area,id:enemy.id,pos,key:pos.x>target.x?'ArrowLeft':pos.x<target.x?'ArrowRight':pos.y>target.y?'ArrowUp':'ArrowDown'};
    }));
  });
  assert.equal(setups.length,12);
  for(const setup of setups){
    await relocate(page,{area:setup.area,pos:setup.pos,defeated:[],quests:{'village-ledger':{step:'complete'}}});
    assert.ok(await page.locator('.world-enemy image[href$="memory-dungeon-enemies-v1.png"]').count());
    await page.locator('.world-viewport').focus();await page.keyboard.press(setup.key);
    await page.locator('.encounter-foe-sprite [data-memory-enemy-art="'+setup.id+'"]').waitFor();
    await page.locator('.battle-foe [data-memory-enemy-art="'+setup.id+'"]').waitFor();
    if(setup.id.endsWith('-2'))await page.screenshot({path:'/private/tmp/cc-new-'+setup.id+'-battle.png'});
  }
});
