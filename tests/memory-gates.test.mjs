import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {worldMaps,canWalkOnMap}=await server.ssrLoadModule('/src/world/maps.ts');
const {memoryDungeons,trialNpcId,altarNpcId}=await server.ssrLoadModule('/src/world/memoryDungeons.ts');
const {spawnEnemies,moveEnemies}=await server.ssrLoadModule('/src/enemyMovement.ts');
const {questDefinition,applyQuestEvent}=await server.ssrLoadModule('/src/quests/engine.ts');
const memoryGates=await server.ssrLoadModule('/src/quests/memoryGates.ts');
const {isMemoryDoorOpen,restoreMemoryPosition}=memoryGates;
const {startQuestReview,applyQuestReviewAnswer,questReviewSteps}=await server.ssrLoadModule('/src/quests/review.ts');
const chapter=questDefinition('village-ledger');
const key=p=>`${p.x},${p.y}`;
const adjacent=p=>[{x:p.x-1,y:p.y},{x:p.x+1,y:p.y},{x:p.x,y:p.y-1},{x:p.x,y:p.y+1}];
const saveAt=step=>({quests:{[chapter.id]:{step}},completed:true,readBooks:[],gold:100,inventory:{herb:1}});
const roomSteps=npcId=>chapter.steps.filter(step=>step.npcId===npcId&&step.trigger.type==='question-answered');
const answer=(save,step,overrides={})=>applyQuestEvent(save,{...step.trigger,...overrides}).save;

function reachableWithProgress(map,quests){
  const npcCells=new Set(map.npcs.map(key));
  const closedDoors=new Set(map.events.filter(event=>event.action.kind==='memory-door'&&!isMemoryDoorOpen(quests,event.action.npcId)).map(key));
  const seen=new Set(),queue=[map.entry];
  for(let i=0;i<queue.length;i++){
    const p=queue[i],cell=key(p);
    if(seen.has(cell)||!canWalkOnMap(map,p)||npcCells.has(cell)||closedDoors.has(cell))continue;
    seen.add(cell);queue.push(...adjacent(p));
  }
  return seen;
}
const canInteract=(seen,p)=>adjacent(p).some(cell=>seen.has(key(cell)));

for(const dungeon of memoryDungeons){
  test(`${dungeon.name}: every multi-question seal holds its physical door until its final answer`,()=>{
    const map=worldMaps[dungeon.area],altar=map.npcs.find(npc=>npc.id===altarNpcId(dungeon.key));
    assert.ok(altar);
    for(let room=0;room<dungeon.trials.length;room++){
      const npcId=trialNpcId(dungeon.key,room),steps=roomSteps(npcId);
      assert.ok(steps.length>1,`${npcId} must teach more than one question`);
      const seal=map.npcs.find(npc=>npc.id===npcId);
      let save=saveAt(steps[0].id);
      for(let question=0;question<steps.length;question++){
        const step=steps[question];
        assert.equal(save.quests[chapter.id].step,step.id,'same-room lesson order must be contiguous');
        for(let door=0;door<dungeon.trials.length;door++){
          assert.equal(isMemoryDoorOpen(save.quests,trialNpcId(dungeon.key,door)),door<room,`${npcId}: door ${door} while answering question ${question}`);
        }
        const seen=reachableWithProgress(map,save.quests);
        assert.ok(canInteract(seen,seal),'current seal must be accessible');
        for(let later=room+1;later<dungeon.trials.length;later++){
          const nextSeal=map.npcs.find(npc=>npc.id===trialNpcId(dungeon.key,later));
          assert.equal(canInteract(seen,nextSeal),false,'closed door must prevent access to later rooms');
        }
        assert.equal(canInteract(seen,altar),false,'altar must remain inaccessible before the last door');
        for(const overrides of [{correct:false},{source:'battle'},{source:'book'}]){
          const unchanged=answer(save,step,overrides);
          assert.deepEqual(unchanged.quests,save.quests);
          assert.equal(isMemoryDoorOpen(unchanged.quests,npcId),false,'wrong answers and unrelated practice cannot open a door');
        }
        save=answer(save,step);
        assert.equal(isMemoryDoorOpen(save.quests,npcId),question===steps.length-1,'only the final answer opens this room');
      }
      const seen=reachableWithProgress(map,save.quests);
      const destination=room===dungeon.trials.length-1?altar:map.npcs.find(npc=>npc.id===trialNpcId(dungeon.key,room+1));
      assert.ok(canInteract(seen,destination),'opening a door must expose the next seal or altar');
      assert.equal(save.gold,100,'opening a door does not grant chapter completion rewards');
    }
  });

  test(`${dungeon.name}: completed saves can reach the spring, travelers, optional enemies and altar`,()=>{
    const map=worldMaps[dungeon.area];
    for(const step of ['complete','return-names']){
      const quests=saveAt(step).quests,seen=reachableWithProgress(map,quests);
      for(let i=0;i<dungeon.trials.length;i++)assert.equal(isMemoryDoorOpen(quests,trialNpcId(dungeon.key,i)),true);
      const spring=map.events.find(event=>event.action.kind==='spring');
      assert.ok(spring,'a free recovery spring must exist');
      assert.ok(canInteract(seen,spring),'spring must be accessible');
      const travelers=map.npcs.filter(npc=>!npc.id.includes('-trial-')&&npc.id!==altarNpcId(dungeon.key));
      assert.ok(travelers.length>0);
      assert.equal(map.enemies.length,12,'each dungeon has four individuals of three optional species');
      for(const target of [...map.npcs,...map.enemies])assert.ok(canInteract(seen,target),`${step}: ${target.id}`);
    }
    const noQuest=reachableWithProgress(map,{});
    for(let i=0;i<dungeon.trials.length;i++)assert.equal(isMemoryDoorOpen({},trialNpcId(dungeon.key,i)),false);
    assert.equal(canInteract(noQuest,map.npcs.find(npc=>npc.id===altarNpcId(dungeon.key))),false);
  });
}

test('review completion never opens doors ahead of the main adventure cursor',()=>{
  const firstQuestion=chapter.steps.find(step=>step.trigger.type==='question-answered');
  let save=startQuestReview(saveAt(firstQuestion.id),chapter.id);
  const initialDoors=memoryDungeons.flatMap(d=>d.trials.map((_,i)=>trialNpcId(d.key,i))).map(npcId=>({npcId,open:isMemoryDoorOpen(save.quests,npcId)}));
  assert.ok(initialDoors.every(door=>!door.open));
  for(const step of questReviewSteps(chapter.id)){
    save=applyQuestReviewAnswer(save,chapter.id,step.id,step.trigger.questionId,true);
    assert.equal(save.quests[chapter.id].step,firstQuestion.id);
    for(const door of initialDoors)assert.equal(isMemoryDoorOpen(save.quests,door.npcId),door.open);
  }
  assert.equal(save.quests[chapter.id].reviewStep,'complete');
  assert.equal(save.gold,100);
});


test('legacy positions beyond closed doors resume on the accessible side while completed saves retain position',()=>{
  for(const dungeon of memoryDungeons){
    const map=worldMaps[dungeon.area];
    const altarApproach={x:15,y:5};
    assert.ok(canWalkOnMap(map,altarApproach));
    const first=roomSteps(trialNpcId(dungeon.key,0))[0];
    const middle=roomSteps(trialNpcId(dungeon.key,2))[0];
    for(const quests of [{},saveAt(first.id).quests,saveAt(middle.id).quests]){
      const seen=reachableWithProgress(map,quests);
      assert.equal(seen.has(key(altarApproach)),false);
      const restored=restoreMemoryPosition(map,altarApproach,quests);
      assert.ok(seen.has(key(restored)),`${dungeon.key}: stranded save must resume before its closed gate`);
      assert.notDeepEqual(restored,altarApproach);
      assert.deepEqual(restoreMemoryPosition(map,restored,quests),restored,'restoration must be stable');
    }
    for(const step of ['complete','return-names']){
      assert.deepEqual(restoreMemoryPosition(map,altarApproach,saveAt(step).quests),altarApproach);
    }
  }
});


test('all 48 individuals spawn without collisions, keep their territory and respect individual defeats across random seeds',()=>{
  const enemies=memoryDungeons.flatMap(dungeon=>worldMaps[dungeon.area].enemies);
  assert.equal(enemies.length,48);assert.equal(new Set(enemies.map(e=>e.id)).size,48);
  const originalRandom=Math.random;
  try {
    for(let seed=1;seed<=12;seed++){
      let state=seed;
      Math.random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
      let positions=spawnEnemies();
      for(const dungeon of memoryDungeons){
        const map=worldMaps[dungeon.area];
        for(let tick=0;tick<25;tick++){
          const cells=new Set();
          for(const enemy of map.enemies){
            const position=positions[enemy.id];
            assert.ok(position,`${enemy.id} must spawn`);
            assert.ok(canWalkOnMap(map,position));
            assert.ok(Math.abs(position.x-enemy.x)+Math.abs(position.y-enemy.y)<=2,`${enemy.id} must stay in its optional alcove`);
            assert.ok(position.y<29||position.y>37,'the third room must remain free of enemies');
            assert.ok(!map.npcs.some(npc=>key(npc)===key(position)),'enemies cannot occupy NPC cells');
            assert.ok(!cells.has(key(position)),'enemies cannot overlap');cells.add(key(position));
          }
          positions=moveEnemies(dungeon.area,positions,[],map.entry);
        }
      }
      const defeated=['memory-c-enemy-0','memory-r-enemy-1-copy-2'];
      positions=spawnEnemies(defeated);
      for(const enemy of enemies)assert.equal(Boolean(positions[enemy.id]),!defeated.includes(enemy.id),'only defeated individuals disappear');
    }
  } finally {Math.random=originalRandom;}
});

test('enemy territories leave a permanent walkable route to every seal, spring, traveler and altar',()=>{
  for(const dungeon of memoryDungeons){
    const map=worldMaps[dungeon.area];
    const npcCells=new Set(map.npcs.map(key)),seen=new Set(),queue=[map.entry];
    for(let i=0;i<queue.length;i++){
      const point=queue[i],cell=key(point);
      if(seen.has(cell)||!canWalkOnMap(map,point)||npcCells.has(cell)||map.enemies.some(enemy=>Math.abs(point.x-enemy.x)+Math.abs(point.y-enemy.y)<=2))continue;
      seen.add(cell);queue.push(...adjacent(point));
    }
    for(const target of [...map.npcs,...map.events.filter(e=>e.action.kind==='spring')])assert.ok(canInteract(seen,target),`${target.id} must remain accessible without battles`);
    for(const door of map.events.filter(e=>e.action.kind==='memory-door'))assert.ok(seen.has(key(door)),'enemies cannot block sealed doors');
  }
});

test('return points open only after their room seal, and the entrance warp lands past the deepest open door',()=>{
  const {memoryWarpTarget}=memoryGates;
  for(const dungeon of memoryDungeons){
    const map=worldMaps[dungeon.area],warps=map.events.filter(e=>e.action.kind==='memory-warp');
    assert.equal(warps.length,dungeon.doors.length+1);
    const fresh={[chapter.id]:{step:roomSteps(trialNpcId(dungeon.key,0))[0].id}};
    assert.equal(memoryWarpTarget(fresh,dungeon.key),null,'no warp before the first seal');
    for(let room=0;room<dungeon.doors.length;room++){
      assert.equal(memoryWarpTarget(fresh,dungeon.key,room),null);
      const after=roomSteps(trialNpcId(dungeon.key,room+1));
      const quests={[chapter.id]:{step:after.length?after[0].id:'complete'}};
      assert.deepEqual(memoryWarpTarget(quests,dungeon.key,room),{area:'village'});
      const deep=memoryWarpTarget(quests,dungeon.key),seen=reachableWithProgress(map,quests);
      assert.equal(deep.area,dungeon.area);
      assert.ok(seen.has(key(deep.position)),`deep warp after room ${room} must land on reachable floor`);
      const returnPoint=warps.find(e=>e.action.room===room);
      assert.ok(canInteract(seen,returnPoint),`return point ${room} must be usable once its seal opens`);
    }
  }
});
