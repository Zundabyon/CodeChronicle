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
const key='code-chronicle-save-v1';
async function fixture(t,extra={}){
  const page=await browser.newPage({viewport:{width:1280,height:1000},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));t.after(async()=>{await page.close();assert.deepEqual(errors,[]);});
  await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//,route=>route.abort());
  await page.addInitScript(()=>{Math.random=()=>0;});await page.goto(url);
  await page.evaluate(({key,extra})=>localStorage.setItem(key,JSON.stringify({area:'home',pos:{x:5,y:7},story:'legacy',name:'確認',...extra})),{key,extra});
  await page.reload();await resume(page);return page;
}
async function resume(page){const notice=page.getByRole('button',{name:'確認しました'});if(await notice.count())await notice.click();await page.getByRole('button',{name:/続きから/}).click();}
async function saved(page){return page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);}
async function review(page){await page.getByRole('button',{name:/コマンド/}).click();await page.getByRole('button',{name:/きょうかい/}).click();await page.getByRole('button',{name:/復習の部屋へ入る/}).click();}

test('chest rewards are granted once and remain opened after reload',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'armorShop',pos:{x:2,y:3}});await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');
  await page.getByRole('status').filter({hasText:'空の宝箱を調べる'}).waitFor();const first=await saved(page);assert.ok(first.openedChests.includes('armorShop:2,2'));
  await page.reload();await resume(page);await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.getByText('✦ 宝箱は空っぽだ。',{exact:true}).waitFor();const second=await saved(page);assert.equal(second.gold,first.gold);assert.deepEqual(second.inventory,first.inventory);
});
test('reading marks and bookmarks survive reopening',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'scholarHouse',pos:{x:2,y:3}});await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:/01 名前のついた値/}).click();await page.getByRole('button',{name:'既読にする',exact:true}).click();
  assert.ok((await saved(page)).readBooks.includes('js-variables-01'));await page.reload();await resume(page);await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.getByRole('heading',{name:'01 名前のついた値',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:'既読を取り消す'}).getAttribute('aria-pressed'),'true');
});
test('ordinary battle grants its reward once after victory',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'field'});
  const setup=await page.evaluate(async()=>{const {spawnEnemies,enemyAt}=await import('/src/enemyMovement.ts');const {worldMaps,canWalkOnMap,eventAt}=await import('/src/world/maps.ts');const positions=spawnEnemies(),enemy=positions.f1;const pos=[{x:enemy.x+1,y:enemy.y},{x:enemy.x-1,y:enemy.y},{x:enemy.x,y:enemy.y+1},{x:enemy.x,y:enemy.y-1}].find(p=>canWalkOnMap(worldMaps.field,p)&&!enemyAt('field',p,positions,[])&&!eventAt(worldMaps.field,p,'enter'));return {pos,key:pos.x>enemy.x?'ArrowLeft':pos.x<enemy.x?'ArrowRight':pos.y>enemy.y?'ArrowUp':'ArrowDown'};});
  await page.evaluate(({key,pos})=>{const save=JSON.parse(localStorage.getItem(key));save.pos=pos;localStorage.setItem(key,JSON.stringify(save));},{key,pos:setup.pos});await page.reload();await resume(page);await page.locator('.world-viewport').focus();await page.keyboard.press(setup.key);
  for(let i=0;i<5;i++){
    await page.locator('.question-card h3').waitFor();const prompt=await page.locator('.question-card h3').innerText();
    const q=await page.evaluate(async prompt=>{const {questions}=await import('/src/content.ts');return questions.find(q=>q.prompt===prompt)},prompt);
    if(q.options)await page.locator('.options button').nth(q.answer).click();else{await page.locator('.cli-form input').fill(q.accepted[0]);await page.locator('.cli-form button').click();}
    const finish=page.getByRole('button',{name:/戦闘を終える/});if(await finish.count()){await finish.click();break;}await page.getByRole('button',{name:/次の問題へ/}).click();
  }
  await page.locator('.world-stage').waitFor();const result=await saved(page);assert.equal(result.gold,135);assert.equal(result.xp,4);assert.equal(result.defeated.filter(id=>id==='f1').length,1);
});
test('review keeps HP, retains mistakes and removes a corrected question',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'town',pos:{x:13,y:16},wrong:['r-b-1'],hp:7});await review(page);await page.getByRole('button',{name:/答えを見ずに再挑戦/}).click();await page.locator('.options button').nth(1).click();assert.equal((await saved(page)).hp,7);assert.deepEqual((await saved(page)).wrong,['r-b-1']);await page.getByRole('button',{name:/もう一度挑戦する/}).click();await page.locator('.options button').nth(0).click();await page.getByRole('button',{name:/戦闘を終える/}).click();await page.getByRole('heading',{name:'復習する問題はありません'}).waitFor();assert.deepEqual((await saved(page)).wrong,[]);assert.equal((await saved(page)).hp,7);
});
test('saved adventure resumes with possessions and position intact',{timeout:45000},async t=>{
  const page=await fixture(t,{gold:321,readBooks:['js-variables-01']});await page.locator('.world-viewport').focus();await page.keyboard.press('ArrowLeft');const first=await saved(page);await page.reload();await resume(page);const second=await saved(page);assert.deepEqual(second.pos,first.pos);assert.equal(second.gold,321);assert.deepEqual(second.readBooks,['js-variables-01']);
});

test('second chapter visits four dungeons, resumes seals and completes seven board actions',{timeout:240000},async t=>{
  const page=await fixture(t,{completed:true,story:'rescued',bossDefeated:true,gold:321,openedChests:['dungeon:19,5']});
  async function advance(){for(let i=0;i<40&&await page.locator('.dialogue-box').count()&&!await page.locator('.dialogue-choices button').count();i++)await page.locator('.dialogue-text > p').first().click();}
  async function relocate(area,pos){
    await page.evaluate(({key,area,pos})=>{const s=JSON.parse(localStorage.getItem(key));s.area=area;s.pos=pos;localStorage.setItem(key,JSON.stringify(s));},{key,area,pos});
    await page.reload();await resume(page);
  }
  async function interact(){await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');}
  const course=await page.evaluate(async()=>{
    const {questDefinitions}=await import('/src/quests/definitions.ts');
    const {questions}=await import('/src/content.ts');
    const {memoryDungeons}=await import('/src/world/memoryDungeons.ts');
    const {worldMaps}=await import('/src/world/maps.ts');
    return {dungeons:memoryDungeons,steps:questDefinitions.find(d=>d.id==='village-ledger').steps.slice(2,-1).map(step=>{
      const area=Object.keys(worldMaps).find(area=>worldMaps[area].npcs.some(n=>n.id===step.npcId));
      const npc=worldMaps[area].npcs.find(n=>n.id===step.npcId);
      return {step,area,npc,q:questions.find(q=>q.id===step.trigger.questionId)};
    })};
  });
  await page.getByRole('button',{name:'第二章「消えた名簿」を始める',exact:true}).click();await advance();
  await relocate('village',{x:4,y:8});await interact();await advance();
  assert.equal((await saved(page)).quests['village-ledger'].step,'find-copy');
  await relocate('dungeon',{x:20,y:5});await interact();await advance();
  assert.equal((await saved(page)).quests['village-ledger'].step,'read-records');
  for(const dungeon of course.dungeons){
    await relocate('field',{x:dungeon.gate.x,y:dungeon.gate.y+1});
    await page.keyboard.press('ArrowUp');assert.equal((await saved(page)).area,dungeon.area);
    await page.keyboard.press('ArrowDown');await page.keyboard.press('ArrowDown');
    const returned=await saved(page);assert.equal(returned.area,'field');assert.deepEqual(returned.pos,{x:dungeon.gate.x,y:dungeon.gate.y+1});
  }
  const firstAltar=course.steps.find(s=>s.step.id==='collect-r');
  await relocate(firstAltar.area,{x:firstAltar.npc.x,y:firstAltar.npc.y+1});
  await interact();await advance();assert.equal((await saved(page)).quests['village-ledger'].step,'read-records');
  assert.equal(await page.locator('.memory-fragments [data-collected=true]').count(),0);
  let fragments=0;
  for(const [index,{step,area,npc,q}] of course.steps.entries()){
    await relocate(area,{x:npc.x,y:npc.y+1});await interact();await advance();
    if(q){
      if(step.id==='ledger-read-filter'){
        await page.getByRole('button',{name:/あとで続ける/}).click();await advance();
        assert.equal((await saved(page)).quests['village-ledger'].step,step.id);
        await page.reload();await resume(page);await interact();await advance();
        await page.setViewportSize({width:390,height:844});
        assert.equal((await page.locator('.quest-question-code').innerText()).trimEnd(),q.code.trimEnd());
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        const firstAnswer=page.getByRole('group',{name:'会話の選択肢'}).getByRole('button').first();
        await firstAnswer.scrollIntoViewIfNeeded();
        assert.ok(await firstAnswer.evaluate(button=>{
          const r=button.getBoundingClientRect(),top=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
          return top===button||button.contains(top);
        }));
        await page.screenshot({path:'/private/tmp/codechronicle-crud-mobile.png'});
        await page.setViewportSize({width:1280,height:1000});
      }
      if(q.code){
        assert.equal((await page.locator('.quest-question-code').innerText()).trimEnd(),q.code.trimEnd());
        await page.locator('.quest-question-code').click();assert.equal((await saved(page)).quests['village-ledger'].step,step.id);
      }
      if(index===0||step.id==='ledger-read-filter'){
        await page.getByRole('group',{name:'会話の選択肢'}).getByRole('button',{name:q.options[(q.answer+1)%4],exact:false}).click();
        assert.equal(await page.locator('.quest-question-code').count(),0);assert.equal(await page.locator('.quest-study-result').count(),0);
        await advance();assert.equal((await saved(page)).quests['village-ledger'].step,step.id);
      }
      await page.getByRole('group',{name:'会話の選択肢'}).getByRole('button',{name:q.options[q.answer],exact:false}).click();await advance();
      assert.equal((await saved(page)).gold,step.id==='resource-checkpoint-destroy'?391:321);
    }else{
      fragments++;assert.equal(await page.locator('.memory-fragments [data-collected=true]').count(),fragments);
      const progress=(await saved(page)).quests['village-ledger'].step;
      await interact();await advance();assert.equal((await saved(page)).quests['village-ledger'].step,progress);
    }
  }
  assert.equal(fragments,4);assert.equal((await saved(page)).quests['village-ledger'].step,'complete');
  await relocate('village',{x:4,y:8});await interact();await advance();
  const result=await saved(page);
  assert.equal(result.quests['village-ledger'].step,'complete');assert.equal(result.gold,391);assert.equal(result.inventory.ether,1);
  assert.equal(result.story,'rescued');assert.equal(result.completed,true);
  await page.reload();await resume(page);await interact();await advance();assert.equal((await saved(page)).gold,391);
});

test('a completed adventure can resume resource review without losing fragments or receiving rewards',{timeout:60000},async t=>{
  const page=await fixture(t,{area:'town',pos:{x:13,y:16},completed:true,story:'rescued',bossDefeated:true,gold:321,inventory:{ether:1},quests:{'village-ledger':{step:'complete'}}});
  async function advance(){for(let i=0;i<12&&await page.locator('.dialogue-box').count()&&!await page.locator('.dialogue-choices button').count();i++)await page.locator('.dialogue-text > p').first().click();}
  async function review(){
    await page.getByRole('button',{name:/コマンド/}).click();
    await page.getByRole('region',{name:'コマンドメニュー'}).getByRole('button',{name:/学習設定/}).click();
    await page.locator('summary').filter({hasText:/^第二章：消えた名簿$/}).click();
    await page.getByRole('button',{name:/7つの役割.*復習/}).click();await advance();
  }
  const steps=await page.evaluate(async()=>{const {questReviewSteps}=await import('/src/quests/review.ts');const {questions}=await import('/src/content.ts');return questReviewSteps('village-ledger').slice(0,2).map(s=>({id:s.id,q:questions.find(q=>q.id===s.trigger.questionId)}));});
  await review();
  await page.getByRole('group',{name:'会話の選択肢'}).getByRole('button',{name:steps[0].q.options[steps[0].q.answer],exact:false}).click();await advance();
  await page.getByRole('button',{name:/あとで続ける/}).click();await advance();
  let progress=await saved(page);assert.equal(progress.quests['village-ledger'].reviewStep,steps[1].id);
  await page.reload();await resume(page);await review();
  assert.ok((await page.locator('.dialogue-text > p').first().innerText()).includes(steps[1].q.prompt));
  progress=await saved(page);assert.equal(progress.quests['village-ledger'].step,'complete');assert.equal(progress.gold,321);assert.equal(progress.inventory.ether,1);
  assert.equal(await page.locator('.memory-fragments [data-collected=true]').count(),4);
});

test('side quest keeps progress through reading, practice, reporting and reload',{timeout:45000},async t=>{
async function reposition(pos){await page.evaluate(pos=>{const key='code-chronicle-save-v1',s=JSON.parse(localStorage.getItem(key));s.area='scholarHouse';s.pos=pos;localStorage.setItem(key,JSON.stringify(s));},pos);await page.reload();await page.getByRole('button',{name:/続きから/}).click();}
async function talkUntil(label){await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');for(let i=0;i<10&&!await page.getByRole('button',{name:label}).count();i++)await page.locator('.dialogue-box').click();await page.getByRole('button',{name:label}).click();await page.locator('.dialogue-box').click();}
const page=await fixture(t);const npc=await page.evaluate(async()=>{const {worldMaps}=await import('/src/world/maps.ts');return worldMaps.scholarHouse.npcs.find(n=>n.id==='assistant')});await reposition({x:npc.x,y:npc.y+1});await talkUntil(/案内板の修理を手伝う/);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('code-chronicle-save-v1')).quests['library-signboard'].step),'read-route');await reposition({x:2,y:3});await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');await page.getByRole('button',{name:'全館の蔵書を探す'}).click();await page.getByLabel('言語',{exact:true}).selectOption('Laravel');await page.getByLabel('本を検索',{exact:true}).fill('URLに応答する');await page.locator('.library-search li button').click();await page.getByRole('button',{name:'既読にする',exact:true}).click();await page.getByRole('button',{name:'この本の確認問題を解く'}).click();await page.getByRole('region',{name:'本の確認問題'}).getByRole('button',{name:'ルート',exact:true}).click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('code-chronicle-save-v1')).quests['library-signboard'].step),'report');await reposition({x:npc.x,y:npc.y+1});await talkUntil(/案内板の修理を報告する/);const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('code-chronicle-save-v1')));assert.equal(s.quests['library-signboard'].step,'complete');assert.equal(s.gold,140);await reposition({x:npc.x,y:npc.y+1});await page.locator('.world-viewport').focus();await page.keyboard.press('Enter');assert.equal(await page.getByRole('button',{name:/案内板の修理を報告する/}).count(),0);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('code-chronicle-save-v1')).gold),140);
});

test('command menu opens labelled world and town maps without moving the player',{timeout:45000},async t=>{
  const page=await fixture(t,{area:'town',pos:{x:13,y:16}});
  await page.getByRole('button',{name:/コマンド/}).click();
  await page.getByRole('region',{name:'コマンドメニュー'}).getByRole('button',{name:/地図/}).click();
  const dialog=page.getByRole('dialog',{name:'旅の地図'});await dialog.waitFor();
  assert.equal(await dialog.locator('.travel-map-pin').count(),7);
  for(const name of ['創生の工房','読解の書庫','改変の回廊','忘却の墓所']){
    await dialog.locator('.travel-map-place-list').getByRole('button',{name:new RegExp(name)}).click();
    await dialog.getByRole('status').filter({hasText:name+'への案内'}).waitFor();
    assert.ok((await dialog.locator('polyline').first().getAttribute('points')).split(' ').length>1);
  }
  await page.screenshot({path:'/private/tmp/codechronicle-crud-world-map.png'});
  await dialog.locator('.travel-map-place-list').getByRole('button',{name:/石灯の村/}).click();
  await dialog.getByRole('status').filter({hasText:'石灯の村への案内'}).waitFor();
  assert.ok((await dialog.locator('polyline').first().getAttribute('points')).split(' ').length>1);
  await page.keyboard.press('ArrowRight');assert.deepEqual((await saved(page)).pos,{x:13,y:16});
  await dialog.getByRole('tab',{name:'町の施設',exact:true}).click();assert.equal(await dialog.locator('.town-map-pin').count(),10);
  await dialog.locator('.travel-map-place-list').getByRole('button',{name:/教会/}).click();await dialog.getByRole('status').filter({hasText:'教会'}).waitFor();
  await page.keyboard.press('Escape');assert.equal(await dialog.count(),0);
  await page.keyboard.press('m');await dialog.waitFor();await page.keyboard.press('m');assert.equal(await dialog.count(),0);
});
