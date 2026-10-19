import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>server.close());
const {worldMaps,reachableMapCells,eventAt,canEnemyOccupyMap,canWalkOnMap}=await server.ssrLoadModule('/src/world/maps.ts');
const {mountainVillageGate,mountainVillageReturn}=await server.ssrLoadModule('/src/world/mountainVillage.ts');
const {dungeonEntry,dungeonExit}=await server.ssrLoadModule('/src/world/caveLayout.ts');
const {questions}=await server.ssrLoadModule('/src/content.ts');
const {beginnerQuestions}=await server.ssrLoadModule('/src/beginnerQuestions.ts');
const key=({x,y})=>`${x},${y}`;

test('nearby village joins the existing cave road with a safe return and rest stop',()=>{
  const reachable=reachableMapCells(worldMaps.field);
  assert.ok(reachable.has(key(mountainVillageGate)));
  assert.ok(reachable.has(key(mountainVillageReturn)));
  assert.deepEqual(eventAt(worldMaps.field,mountainVillageGate,'enter').action,{kind:'transition',to:'village'});
  assert.equal(eventAt(worldMaps.field,mountainVillageReturn,'enter'),undefined);
  assert.equal(canEnemyOccupyMap(worldMaps.field,mountainVillageGate),false);
  const exit=worldMaps.village.events.find(event=>event.action.kind==='transition'&&event.action.to==='field');
  assert.ok(exit);
  assert.deepEqual(exit.action.position,mountainVillageReturn);
  assert.ok(reachableMapCells(worldMaps.village).has(key(exit)));
  assert.ok(worldMaps.village.npcs.some(npc=>npc.id==='mountainHealer'));
  assert.equal(worldMaps.village.enemies.length,0);
});

test('expanded cave keeps entry, exit and guardian accessible and its familiar enemy identities',()=>{
  const map=worldMaps.dungeon,reachable=reachableMapCells(map);
  assert.deepEqual(map.entry,dungeonEntry);
  const floorCells=map.terrain.flatMap((row,y)=>row.map((_,x)=>({x,y}))).filter(point=>map.terrain[point.y][point.x]==='stoneFloor'&&canWalkOnMap(map,point));
  assert.equal(reachable.size,floorCells.length,'every chamber and dead end is reachable');
  const edges=floorCells.reduce((sum,{x,y})=>sum+[{x:x+1,y},{x,y:y+1}].filter(point=>reachable.has(key(point))).length,0);
  assert.ok(edges>=floorCells.length,'the cave has a loop and more than one route');
  assert.ok(map.width>20&&map.height>12);
  assert.ok(reachable.has(key(dungeonExit)));
  assert.deepEqual(eventAt(map,dungeonExit,'enter').action,{kind:'transition',to:'field'});
  assert.deepEqual(map.enemies.map(enemy=>enemy.id).sort(),['d1','d2','d3','d4','d5','d6','d7','boss'].sort());
  assert.ok(map.enemies.every(enemy=>reachable.has(key(enemy))));
});

test('new MVC and CRUD fundamentals enter every beginner learning route without duplicate ids',()=>{
  assert.equal(beginnerQuestions.length,36);
  for(const q of beginnerQuestions) {
    assert.equal(q.kind,'choice');assert.equal(q.difficulty,'beginner');
    assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);
    assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4);
    assert.equal(q.reveal,q.options[q.answer]);assert.ok(q.explanation.length>0);
  }
  const ids=questions.map(question=>question.id);
  assert.equal(new Set(ids).size,ids.length);
  for(const track of ['react','vue']) for(const inertia of [true,false]) {
    const pool=questions.filter(question=>question.difficulty==='beginner'&&(!question.track||question.track===track)&&(question.inertia===undefined||question.inertia===inertia));
    for(const question of beginnerQuestions) assert.ok(pool.some(candidate=>candidate.id===question.id));
  }
});
