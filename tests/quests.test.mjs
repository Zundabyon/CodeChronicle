import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});after(()=>server.close());
const {applyQuestEvent,hasStartedChapter}=await server.ssrLoadModule('/src/quests/engine.ts');
const {restoreQuestStates}=await server.ssrLoadModule('/src/quests/persistence.ts');
const {questDefinitions}=await server.ssrLoadModule('/src/quests/definitions.ts');
const {questions}=await server.ssrLoadModule('/src/content.ts');
const {rangerBattles}=await server.ssrLoadModule('/src/quests/rangerBattles.ts');
const {fumiLine}=await server.ssrLoadModule('/src/quests/definitions.ts');
const {libraryShelves}=await server.ssrLoadModule('/src/library.ts');
const {worldMaps}=await server.ssrLoadModule('/src/world/maps.ts');
const {items}=await server.ssrLoadModule('/src/items.ts');
const fresh=()=>({quests:{},completed:false,readBooks:[],gold:100,inventory:{herb:1}});
const send=(save,event)=>applyQuestEvent(save,event).save;

test('quest definitions reference real NPCs, books, questions, chests and rewards',()=>{
  const npcs=new Set(Object.values(worldMaps).flatMap(map=>map.npcs.map(n=>n.id)));
  const books=new Set(libraryShelves.flatMap(s=>s.books.map(b=>b.id)));
  assert.equal(new Set(questDefinitions.map(q=>q.id)).size,questDefinitions.length);
  for(const def of questDefinitions){
    assert.ok(npcs.has(def.npcId));assert.equal(new Set(def.steps.map(s=>s.id)).size,def.steps.length);
    for(const step of def.steps){const t=step.trigger;
      if(t.type==='book-read')assert.ok(books.has(t.bookId));
      if(t.type==='question-answered')assert.ok(questions.some(q=>q.id===t.questionId));
      if(t.type==='npc-talked'||t.type==='reported')assert.ok(npcs.has(t.npcId));
      if(t.type==='battle-won'){const b=rangerBattles[t.enemyId];assert.ok(b);for(const id of b.set)assert.ok(questions.some(q=>q.id===id),id);}
      if(t.type==='chest-examined')assert.ok(Object.values(worldMaps).some(m=>m.events.some(e=>e.action.kind==='chest'&&e.action.id===t.chestId)));
      if(step.requiresReadBook)assert.ok(books.has(step.requiresReadBook));
      if(step.npcId)assert.ok(npcs.has(step.npcId));
    }
    for(const [id,count] of Object.entries(def.reward.items)){assert.ok(items[id]);assert.ok(count>0);}
  }
});
test('unaccepted, unrelated and out-of-order events cannot advance a quest',()=>{
  const initial=fresh();assert.strictEqual(send(initial,{type:'reported',npcId:'assistant',questId:'library-signboard'}),initial);
  assert.strictEqual(send(initial,{type:'accepted',questId:'village-ledger'}),initial);
  let save=send(initial,{type:'accepted',questId:'library-signboard'});
  assert.strictEqual(send(save,{type:'question-answered',questionId:'l-b-1',correct:true,source:'book'}),save);
  const accepted=save;save=send({...save,readBooks:['laravel-routes-01']},{type:'book-read',bookId:'laravel-routes-01'});
  assert.strictEqual(send(save,{type:'question-answered',questionId:'l-b-1',correct:true,source:'battle'}),save);
  assert.strictEqual(send(save,{type:'question-answered',questionId:'l-b-1',correct:false,source:'book'}),save);
  assert.deepEqual(initial,fresh());assert.equal(accepted.quests['library-signboard'].step,'read-route');
});
test('book practice followed by reporting grants rewards exactly once',()=>{
  let save=send({...fresh(),readBooks:['laravel-routes-01']},{type:'accepted',questId:'library-signboard'});
  save=send(save,{type:'question-answered',questionId:'l-b-1',correct:true,source:'book'});
  assert.equal(save.gold,100);assert.strictEqual(send(save,{type:'reported',npcId:'assistant',questId:'village-ledger'}),save);const report={type:'reported',npcId:'assistant',questId:'library-signboard'};save=send(save,report);
  assert.equal(save.gold,140);assert.equal(save.inventory.herb,2);assert.equal(save.quests['library-signboard'].step,'complete');
  assert.strictEqual(send(save,report),save);assert.strictEqual(send(save,{type:'accepted',questId:'library-signboard'}),save);
});
test('chapter progress and rewards are independent from side quests',()=>{
  let save=send({...fresh(),completed:true},{type:'accepted',questId:'village-ledger'});
  save=send(save,{type:'accepted',questId:'library-signboard'});
  save=send(save,{type:'npc-talked',npcId:'mountainGuide',questId:'village-ledger'});
  save=send(save,{type:'chest-examined',chestId:'dungeon:19,5'});
  for(const step of questDefinitions.find(q=>q.id==='village-ledger').steps.slice(2,-1))save=send(save,{...step.trigger,...(step.trigger.type==='npc-talked'?{questId:'village-ledger'}:{})});
  assert.equal(save.gold,100);save=send(save,{type:'npc-talked',npcId:'mountainGuide',questId:'village-ledger'});
  assert.equal(save.gold,170);assert.equal(save.inventory.ether,1);assert.equal(save.quests['library-signboard'].step,'read-route');assert.equal(save.completed,true);assert.equal(hasStartedChapter(save.quests),true);
  assert.strictEqual(send(save,{type:'npc-talked',npcId:'mountainGuide',questId:'village-ledger'}),save);
});
test('legacy progress migrates without replaying rewards, including completed and paused quests',()=>{
  assert.deepEqual(restoreQuestStates({scholarQuestCompleted:true},false,[]),{'library-signboard':{step:'complete'}});
  assert.equal(restoreQuestStates({scholarQuestReady:true},false,[])['library-signboard'].step,'report');
  assert.equal(restoreQuestStates({scholarQuestAccepted:true},false,['laravel-routes-01'])['library-signboard'].step,'practice-route');
  const old={chapterTwo:'restore',chapterTwoStep:4};assert.equal(restoreQuestStates(old,true,[])['village-ledger'].step,'return-names');// saveValidation restarts such old chapter-two progressassert.deepEqual(restoreQuestStates(old,false,[]),{});
  const quests=restoreQuestStates({chapterTwo:'complete'},true,[]),save={...fresh(),completed:true,quests};assert.strictEqual(send(save,{type:'npc-talked',npcId:'mountainGuide',questId:'village-ledger'}),save);
  assert.deepEqual(restoreQuestStates({quests:{unknown:{step:'complete'},'village-ledger':{step:'bad'}}},true,[]),{});
  assert.deepEqual(restoreQuestStates({quests:{'library-signboard':{step:'complete'}},scholarQuestAccepted:true},false,[]),{'library-signboard':{step:'complete'}});
});

test('chapter two runs its acts R→C→U→D, each followed by a required village battle, then the final battle',()=>{
  const def=questDefinitions.find(q=>q.id==='village-ledger');
  const lessons=def.steps.filter(s=>s.trigger.type==='question-answered');
  assert.equal(lessons.length,43);
  assert.deepEqual(lessons.filter(s=>['read-records','update-address','create-family','delete-duplicate'].includes(s.id)).map(s=>s.id),['read-records','create-family','update-address','delete-duplicate']);
  for(const key of ['r','u','c'])assert.equal(lessons.filter(s=>s.npcId?.startsWith('memory-'+key+'-trial-')).length,11);
  assert.equal(lessons.filter(s=>s.npcId?.startsWith('memory-d-trial-')).length,10);
  assert.ok(!def.steps.some(s=>s.id==='ledger-delete-transfer'),'authorization transfer left chapter two');
  assert.ok(questions.some(q=>q.id==='ledger-delete-transfer'),'its question stays in the catalog');
  assert.ok(!lessons.some(s=>s.npcId==='mountainGuide'),'the board capstone became the final battle');
  const order=['collect-r','battle-r','collect-c','battle-c','collect-u','battle-u','collect-d','battle-d','battle-graphius','return-names'];
  assert.deepEqual(def.steps.filter(s=>order.includes(s.id)).map(s=>s.id),order);
  assert.deepEqual(def.steps.filter(s=>s.trigger.type==='battle-won').map(s=>[s.trigger.enemyId,rangerBattles[s.trigger.enemyId].set.length]),[['ranger-read',5],['ranger-create',5],['ranger-update',5],['ranger-delete',5],['graphius',7]]);
  let save=send({...fresh(),completed:true},{type:'accepted',questId:def.id});
  assert.equal(fumiLine(save.quests),fumiLine({}));
  save=send(save,{type:'npc-talked',npcId:def.npcId,questId:def.id});
  save=send(save,{type:'chest-examined',chestId:'dungeon:19,5'});
  const answers=new Set(),fumi=new Set([fumiLine(save.quests)]);
  for(const step of def.steps.slice(2,-1)){
    assert.equal(save.quests[def.id].step,step.id);
    if(step.trigger.type==='question-answered'){
      const q=questions.find(q=>q.id===step.trigger.questionId);
      assert.equal(q.kind,'choice');assert.equal(new Set(q.options).size,4);assert.equal(q.reveal,q.options[q.answer]);
      assert.ok(step.study.objective);assert.ok(step.study.before);assert.ok(step.study.after);answers.add(q.answer);
      assert.strictEqual(send(save,{...step.trigger,correct:false}),save);
      assert.strictEqual(send(save,{...step.trigger,source:'battle'}),save);
      assert.strictEqual(send(save,{type:'npc-talked',npcId:def.npcId,questId:def.id}),save);
      save=send(save,{...step.trigger});
    }else if(step.trigger.type==='battle-won'){
      assert.ok(step.lines.length&&step.after.length);
      assert.strictEqual(send(save,{type:'npc-talked',npcId:def.npcId,questId:def.id}),save,'talking alone cannot skip a battle');
      assert.strictEqual(send(save,{type:'battle-won',enemyId:'not-'+step.trigger.enemyId}),save);
      const result=applyQuestEvent(save,step.trigger);assert.deepEqual(result.scenes,step.after);save=result.save;
      fumi.add(fumiLine(save.quests));
    }else{
      assert.ok(step.id.startsWith('collect-'));
      assert.strictEqual(send(save,{type:'question-answered',questionId:lessons[0].trigger.questionId,correct:true,source:'quest'}),save);
      save=send(save,{...step.trigger,questId:def.id});
    }
    assert.deepEqual(restoreQuestStates(JSON.parse(JSON.stringify(save)),true,[]),save.quests);
    assert.equal(save.gold,100);
  }
  assert.equal(answers.size,4);assert.equal(save.quests[def.id].step,'return-names');
  assert.equal(fumi.size,6,'Fumi speaks differently in every act');
  save=send(save,{type:'npc-talked',npcId:def.npcId,questId:def.id});
  assert.equal(save.quests[def.id].step,'complete');assert.equal(save.gold,170);
  assert.ok(!fumi.has(fumiLine(save.quests)));
});
