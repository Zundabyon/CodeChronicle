import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
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


test('added furniture stays clear of doors, residents and existing buildings',async()=>{
  const {mapDecorations}=await server.ssrLoadModule('/src/world/decorations.ts');
  const {propChips,buildingChips}=await server.ssrLoadModule('/src/world/catalog.ts');
  for(const [area,decorations] of Object.entries(mapDecorations)) {
    const map=worldMaps[area],occupied=new Set();
    for(const placement of map.buildings) for(const offset of buildingChips[placement.chip].blockedCells)
      occupied.add(key({x:placement.x+offset.x,y:placement.y+offset.y}));
    for(const placement of map.props.filter(p=>!p.id.startsWith('decor-'))) for(const offset of propChips[placement.chip].blockedCells)
      occupied.add(key({x:placement.x+offset.x,y:placement.y+offset.y}));
    for(const placement of decorations) for(const offset of propChips[placement.chip].blockedCells) {
      const point={x:placement.x+offset.x,y:placement.y+offset.y},cell=key(point);
      assert.ok(point.x>0&&point.x<map.width-1&&point.y>0&&point.y<map.height-1,`${area}: bounds ${placement.id}`);
      assert.ok(!occupied.has(cell),`${area}: overlapping object ${placement.id}`);
      assert.ok(!map.npcs.some(npc=>key(npc)===cell),`${area}: resident ${placement.id}`);
      assert.ok(!map.events.some(event=>event.trigger==='enter'&&key(event)===cell),`${area}: entrance ${placement.id}`);
      occupied.add(cell);
      assert.equal(canWalkOnMap(map,point),false,`${area}: solid furniture ${placement.id}`);
    }
    for(const placement of decorations.filter(p=>['rug','flowers'].includes(p.chip)))
      assert.ok(canWalkOnMap(map,placement),`${area}: walkable decoration ${placement.id}`);
  }
});

test('both library wings connect every floor with safe arrival cells',async()=>{
  const {libraryShelves,libraryFloors}=await server.ssrLoadModule('/src/library.ts');
  const referencedShelves=new Set();
  for(const floor of libraryFloors) {
    const map=worldMaps[floor.area];
    const shelves=map.events.filter(event=>event.action.kind==='bookshelf');
    assert.equal(shelves.length,3);
    for(const event of shelves) {
      const shelf=libraryShelves.find(shelf=>shelf.id===event.action.shelf);
      assert.equal(shelf.floor,floor.floor);
      assert.equal(shelf.wing,floor.wing);
      assert.equal(shelf.language,floor.language);
      assert.equal(shelf.books.length,3);
      assert.ok(!referencedShelves.has(shelf.id));
      referencedShelves.add(shelf.id);
    }
    for(const [point,target] of [
      [{x:9,y:6},libraryFloors.find(other=>other.wing===floor.wing&&other.floor===floor.floor+1)],
      [{x:1,y:6},libraryFloors.find(other=>other.wing===floor.wing&&other.floor===floor.floor-1)]
    ]) {
      if(!target) continue;
      const action=eventAt(map,point,'enter').action;
      assert.equal(action.to,target.area);
      assert.ok(playerCells(worldMaps[target.area]).has(key(action.position)));
      assert.equal(eventAt(worldMaps[target.area],action.position,'enter'),undefined);
    }
  }
  assert.equal(referencedShelves.size,libraryShelves.length);
  assert.equal(libraryShelves.reduce((count,shelf)=>count+shelf.books.length,0),54);
});

test('west frontend and east backend wings adjoin and have a two-way ground-floor corridor',()=>{
  const west=houses.scholarHouse,east=houses.backendLibrary;
  assert.equal(east.door.x-west.door.x,5,'the two five-cell buildings share an edge');
  assert.equal(east.door.y,west.door.y);
  for(const [area,point,to] of [
    ['scholarHouse',{x:10,y:4},'backendLibrary'],
    ['backendLibrary',{x:0,y:4},'scholarHouse']
  ]) {
    const map=worldMaps[area],action=eventAt(map,point,'enter').action;
    assert.ok(playerCells(map).has(key(point)));
    assert.equal(action.to,to);
    assert.ok(playerCells(worldMaps[to]).has(key(action.position)));
    assert.equal(eventAt(worldMaps[to],action.position,'enter'),undefined);
  }
});
