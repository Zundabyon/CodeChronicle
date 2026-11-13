import {readFileSync} from 'node:fs';
import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {memoryDungeons}=await server.ssrLoadModule('/src/world/memoryDungeons.ts');
const {worldMaps,reachableMapCells,canWalkOnMap,eventAt}=await server.ssrLoadModule('/src/world/maps.ts');
const {mapRoute,mapLocation,worldPlaces}=await server.ssrLoadModule('/src/world/mapGuide.ts');
const {questDefinitions}=await server.ssrLoadModule('/src/quests/definitions.ts');
const {collectedMemories}=await server.ssrLoadModule('/src/quests/MemoryFragments.tsx');
const {enemyKinds}=await server.ssrLoadModule('/src/content.ts');
const chapter=questDefinitions.find(q=>q.id==='village-ledger');
test('all four separated dungeons have navigable entrances, returns and five reachable seals plus an altar',()=>{
  assert.equal(memoryDungeons.length,4);assert.equal(new Set(memoryDungeons.map(d=>d.area)).size,4);
  assert.equal(new Set(memoryDungeons.map(d=>d.region)).size,4);
  assert.equal(new Set(memoryDungeons.map(d=>JSON.stringify(worldMaps[d.area].terrain))).size,4);
  for(const d of memoryDungeons){
    const map=worldMaps[d.area],reachable=reachableMapCells(map);
    assert.equal(map.environment,'dungeon');assert.equal(eventAt(worldMaps.field,d.gate,'enter').action.to,d.area);
    assert.ok(worldPlaces.some(p=>p.id===d.area));
    const exit=map.events.find(e=>e.action.kind==='transition');
    assert.ok(reachable.has(exit.x+','+exit.y));assert.equal(exit.action.to,'field');
    const point=exit.action.position;
    assert.ok(canWalkOnMap(worldMaps.field,point));assert.equal(eventAt(worldMaps.field,point,'enter'),undefined);
    assert.ok(mapRoute(point,d.gate).length>1);assert.ok(mapRoute(worldMaps.field.entry,d.gate).length>1);
    assert.deepEqual(mapLocation(d.area,map.entry).world,d.gate);assert.ok(map.npcs.length>=9);assert.equal(map.enemies.length,12);assert.equal(map.events.filter(e=>e.action.kind==='spring').length,1);assert.equal(map.events.filter(e=>e.action.kind==='memory-door'&&e.trigger==='enter').length,5);
    for(const npc of map.npcs){
      assert.ok([{x:npc.x-1,y:npc.y},{x:npc.x+1,y:npc.y},{x:npc.x,y:npc.y-1},{x:npc.x,y:npc.y+1}].some(p=>reachable.has(p.x+','+p.y)),npc.id);
      if(/-trial-|:altar|-altar$/.test(npc.id))assert.ok(chapter.steps.some(step=>step.npcId===npc.id),npc.id);
    }
    const enemyCharacters=map.characters.filter(c=>c.role==='enemy');
    assert.equal(new Set(enemyCharacters.map(c=>c.chip)).size,3);
    for(const c of enemyCharacters)assert.equal(enemyKinds[c.id],c.chip);
    const steps=chapter.steps.filter(step=>map.npcs.some(n=>n.id===step.npcId));
    // ledger-delete-transfer left the chapter, so the Delete act teaches one lesson fewer.
    assert.equal(steps.filter(s=>s.trigger.type==='question-answered').length,d.key==='d'?10:11);
    assert.equal(steps.filter(s=>s.id==='collect-'+d.key).length,1);
    assert.ok(!collectedMemories({'village-ledger':{step:'collect-'+d.key}}).includes(d.key));
    const next=chapter.steps[chapter.steps.findIndex(s=>s.id==='collect-'+d.key)+1];
    assert.ok(collectedMemories({'village-ledger':{step:next.id}}).includes(d.key));
  }
});
test('fragment collection survives saved progress and old completed adventures',()=>{
  assert.deepEqual(collectedMemories({}),[]);
  assert.deepEqual(collectedMemories({'village-ledger':{step:'find-copy'}}),[]);
  assert.deepEqual(collectedMemories({'village-ledger':{step:'read-records'}}),[]);
  assert.deepEqual(collectedMemories({'village-ledger':{step:'create-family'}}),['r']);
  assert.deepEqual(collectedMemories({'village-ledger':{step:'update-address'}}),['c','r']);
  assert.deepEqual(collectedMemories({'village-ledger':{step:'battle-graphius'}}),['c','r','u','d']);
  assert.deepEqual(new Set(collectedMemories({'village-ledger':{step:'return-names'}})),new Set(['c','r','u','d']));
  assert.deepEqual(collectedMemories({'village-ledger':{step:'complete'}}),['c','r','u','d']);
});

test('forty-eight optional monsters share twelve species atlas frames on map and battle',async()=>{
 const {memoryEnemyAtlas,memoryEnemyFrames,memoryEnemyVisual}=await server.ssrLoadModule('/src/world/memoryEnemyArt.ts');
 const {memoryEnemyBaseId}=await server.ssrLoadModule('/src/world/memoryEnemyIdentity.ts');
 const enemies=memoryDungeons.flatMap(d=>worldMaps[d.area].enemies);
 assert.equal(enemies.length,48);assert.equal(Object.keys(memoryEnemyFrames).length,12);
 const png=readFileSync(new URL('../public/'+memoryEnemyAtlas.src,import.meta.url));
 assert.equal(png.readUInt32BE(16),memoryEnemyAtlas.width);assert.equal(png.readUInt32BE(20),memoryEnemyAtlas.height);
 assert.equal(png[25],6,'sprite atlas must retain RGBA transparency');
 assert.equal(new Set(enemies.map(e=>JSON.stringify(memoryEnemyVisual(e.id).frame))).size,12);
 for(const enemy of enemies){
   const visual=memoryEnemyVisual(enemy.id);assert.equal(visual.renderer,'atlas');
   assert.deepEqual(visual.frame,memoryEnemyVisual(memoryEnemyBaseId(enemy.id)).frame);
   assert.equal(enemyKinds[enemy.id],enemyKinds[memoryEnemyBaseId(enemy.id)]);
   const [x,y,w,h]=visual.frame;assert.ok(x>=0&&y>=0&&w>0&&h>0);
   assert.ok(x+w<=memoryEnemyAtlas.width&&y+h<=memoryEnemyAtlas.height);
 }
 assert.equal(memoryEnemyVisual('f1'),undefined);
});
