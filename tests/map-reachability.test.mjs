import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
after(()=>server.close());
const {worldMaps,createWorldMap,canWalkOnMap,canEnemyOccupyMap,eventAt,reachableMapCells,dungeonFieldReturn}=await server.ssrLoadModule('/src/world/maps.ts');
const {houses}=await server.ssrLoadModule('/src/content.ts');
const {spawnEnemies,moveEnemies}=await server.ssrLoadModule('/src/enemyMovement.ts');
const key=point=>`${point.x},${point.y}`;
const neighbors=({x,y})=>[{x:x+1,y},{x:x-1,y},{x,y:y+1},{x,y:y-1}];

// Independent traversal checks the player can actually approach every spawn.
function playerCells(map) {
  const queue=[map.entry],seen=new Set([key(map.entry)]);
  for(let head=0;head<queue.length;head++) for(const point of neighbors(queue[head])) {
    if(!seen.has(key(point))&&canWalkOnMap(map,point)&&!map.npcs.some(npc=>key(npc)===key(point))) {
      seen.add(key(point)); queue.push(point);
    }
  }
  return seen;
}

test('dungeon return lands on a reachable road without entering the gate again',()=>{
  const map=worldMaps.field;
  assert.ok(canWalkOnMap(map,dungeonFieldReturn));
  assert.ok(playerCells(map).has(key(dungeonFieldReturn)));
  assert.equal(eventAt(map,dungeonFieldReturn,'enter'),undefined);
  assert.equal(map.terrain[dungeonFieldReturn.y][dungeonFieldReturn.x],'road');
});

test('all house doors, interior exits, and interactable events are accessible',()=>{
  const townCells=playerCells(worldMaps.town);
  for(const [area,house] of Object.entries(houses)) {
    assert.ok(townCells.has(key(house.door)),`${area}: entrance`);
    assert.ok(townCells.has(key(house.outside)),`${area}: return`);
    assert.equal(eventAt(worldMaps.town,house.outside,'enter'),undefined);
    assert.ok(playerCells(worldMaps[area]).has('5,8'),`${area}: exit`);
  }
  for(const [area,map] of Object.entries(worldMaps)) {
    const cells=playerCells(map);
    for(const event of map.events) assert.ok(event.trigger==='enter'
      ? cells.has(key(event)) : neighbors(event).some(point=>cells.has(key(point))),`${area}: ${event.id}`);
    for(const npc of map.npcs) assert.ok(neighbors(npc).some(point=>cells.has(key(point))),`${area}: ${npc.id}`);
  }
});

test('reachability excludes land separated by walls, props, or an NPC',()=>{
  const input={environment:'outdoor',entry:{x:0,y:0},terrain:[['grass','grass','grass']],
    props:[],buildings:[],characters:[],events:[]};
  for(const barrier of [
    {terrain:[['grass','mountain','grass']]},
    {props:[{id:'tree',chip:'tree',x:1,y:0}]},
    {characters:[{id:'npc',chip:'scholar',x:1,y:0,role:'npc',npc:{id:'npc',name:'学者',x:1,y:0,face:'',lines:[]}}]},
  ]) assert.deepEqual([...reachableMapCells(createWorldMap({...input,...barrier}))],['0,0']);
});

test('seeded spawns and movement never strand an enemy on isolated land',()=>{
  const reachable=Object.fromEntries(['field','dungeon'].map(area=>[area,playerCells(worldMaps[area])]));
  const originalRandom=Math.random; let seed=123456789;
  Math.random=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
  try {
    for(let run=0;run<100;run++) {
      const defeated=run%2?['f1','d1','boss']:[];
      let positions=spawnEnemies(defeated);
      for(let tick=0;tick<=30;tick++) for(const area of ['field','dungeon']) {
        const map=worldMaps[area];
        if(tick>0) positions=moveEnemies(area,positions,defeated,map.entry);
        const occupied=new Set();
        for(const enemy of map.enemies) {
          if(defeated.includes(enemy.id)) {assert.equal(positions[enemy.id],undefined);continue;}
          const point=positions[enemy.id],cell=key(point);
          assert.ok(canEnemyOccupyMap(map,point),`${enemy.id}: blocked cell ${cell}`);
          assert.ok(reachable[area].has(cell),`${enemy.id}: isolated cell ${cell}`);
          assert.ok(!occupied.has(cell),`${enemy.id}: overlaps another enemy`);
          assert.notEqual(cell,key(map.entry));
          occupied.add(cell);
          if(area==='field') assert.ok(Math.abs(point.x-enemy.x)+Math.abs(point.y-enemy.y)<=7);
          if(enemy.boss) assert.ok(point.y<=3&&point.x>=8&&point.x<=15);
        }
      }
    }
  } finally {Math.random=originalRandom;}
});
