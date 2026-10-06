import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
after(()=>server.close());
const {worldMaps,createWorldMap,canWalkOnMap,canEnemyOccupyMap,eventAt}=await server.ssrLoadModule('/src/world/maps.ts');
const {maps:legacyMaps,houses,fieldTownGate,fieldRuinsGate}=await server.ssrLoadModule('/src/content.ts');
const {chipCatalog,terrainSets}=await server.ssrLoadModule('/src/world/catalog.ts');
const {moveEnemies,spawnEnemies}=await server.ssrLoadModule('/src/enemyMovement.ts');

test('all existing cells retain player passability, including doors and furniture',()=>{
  for(const [area,legacy] of Object.entries(legacyMaps)) {
    const blocked=['#','r','o','m','k','l','A','R','Z','W','w','U','V','b','c','T',...(area==='field'?[]:['s'])];
    legacy.tiles.forEach((row,y)=>[...row].forEach((tile,x)=>{
      assert.equal(canWalkOnMap(worldMaps[area],{x,y}),!blocked.includes(tile),`${area} ${x},${y} (${tile})`);
    }));
    assert.equal(canWalkOnMap(worldMaps[area],{x:-1,y:0}),false);
    assert.equal(canWalkOnMap(worldMaps[area],{x:0,y:worldMaps[area].height}),false);
    assert.equal(canWalkOnMap(worldMaps[area],{x:.5,y:1}),false);
    assert.deepEqual(worldMaps[area].npcs,legacy.npcs);
    assert.deepEqual(worldMaps[area].enemies,legacy.enemies);
  }
});

test('house, church, field, ruins and dresser actions survive migration',()=>{
  for(const [area,house] of Object.entries(houses)) {
    assert.deepEqual(eventAt(worldMaps.town,house.door,'enter').action,{kind:'transition',to:area});
    assert.deepEqual(eventAt(worldMaps[area],{x:5,y:8},'enter').action,{kind:'transition',to:'town'});
  }
  assert.equal(eventAt(worldMaps.home,{x:3,y:5},'interact').action.kind,'dresser');
  assert.equal(eventAt(worldMaps.town,{x:13,y:15},'enter').action.kind,'church');
  assert.deepEqual(eventAt(worldMaps.field,fieldTownGate,'enter').action,{kind:'transition',to:'town'});
  assert.deepEqual(eventAt(worldMaps.field,fieldRuinsGate,'enter').action,{kind:'transition',to:'dungeon'});
  assert.deepEqual(eventAt(worldMaps.town,{x:14,y:31},'enter').action,{kind:'transition',to:'field'});
  assert.deepEqual(eventAt(worldMaps.dungeon,{x:10,y:11},'enter').action,{kind:'transition',to:'field'});
});

const example=()=>({environment:'outdoor',entry:{x:0,y:0},terrain:Array.from({length:6},()=>Array(7).fill('grass')),
  props:[],buildings:[],characters:[],events:[]});

test('native placement uses definitions for collision and supports multiple props on one cell',()=>{
  const input=example();
  input.props=[{id:'tree',chip:'tree',x:1,y:1},{id:'sign',chip:'sign',x:1,y:1,text:'森'},
    {id:'decoration',chip:'tree',x:2,y:1,blocksMovement:false}];
  input.buildings=[{id:'house',chip:'house',x:1,y:2}];
  const map=createWorldMap(input);
  assert.equal(canWalkOnMap(map,{x:1,y:1}),false);
  assert.equal(canWalkOnMap(map,{x:2,y:1}),true);
  assert.equal(canWalkOnMap(map,{x:1,y:2}),false);
  assert.equal(canWalkOnMap(map,{x:5,y:5}),false);
  assert.equal(canWalkOnMap(map,{x:3,y:5}),true,'house doorway stays open');
  assert.equal(map.terrain[1][1],'grass','props do not replace terrain');
});

test('native character placement is authoritative for game identity and position',()=>{
  const input=example();
  input.characters=[{id:'new-npc',chip:'scholar',x:2,y:3,role:'npc',npc:{id:'old',x:0,y:0,name:'学者',face:'',lines:['こんにちは']}}];
  const map=createWorldMap(input);
  assert.equal(map.npcs[0].id,'new-npc');
  assert.equal(map.npcs[0].x,2);
  assert.equal(map.npcs[0].y,3);
  assert.equal(map.characters[0].npc,map.npcs[0]);
  assert.equal(canEnemyOccupyMap(map,{x:2,y:3}),false);
});

test('invalid terrain, unknown chips and duplicate placement IDs fail clearly',()=>{
  assert.throws(()=>createWorldMap({...example(),terrain:[]}),/長方形/);
  assert.throws(()=>createWorldMap({...example(),terrain:[['grass'],['grass','grass']]}),/長方形/);
  assert.throws(()=>createWorldMap({...example(),terrain:[['unknown']]}),/未登録/);
  assert.throws(()=>createWorldMap({...example(),props:[{id:'a',chip:'unknown',x:0,y:0}]}),/未登録/);
  assert.throws(()=>createWorldMap({...example(),props:[{id:'a',chip:'tree',x:0,y:0},{id:'a',chip:'sign',x:1,y:0}]}),/重複/);
});

test('enemy spawning and movement respect migrated terrain, props and NPCs',()=>{
  const defeated=['f1','d1'];
  let positions=spawnEnemies(defeated);
  assert.equal(positions.f1,undefined);
  assert.equal(positions.d1,undefined);
  for(let tick=0;tick<30;tick++) {
    for(const area of ['field','dungeon']) {
      positions=moveEnemies(area,positions,defeated,worldMaps[area].entry);
      for(const enemy of worldMaps[area].enemies.filter(enemy=>!defeated.includes(enemy.id))) {
        const point=positions[enemy.id];
        assert.equal(canEnemyOccupyMap(worldMaps[area],point),true,enemy.id);
        const distance=Math.abs(point.x-enemy.x)+Math.abs(point.y-enemy.y);
        if(area==='field') assert.ok(distance<=7,enemy.id);
      }
    }
  }
});

test('registered image assets exist and terrain themes can be extended independently',async()=>{
  for(const collection of Object.values(chipCatalog)) for(const chip of Object.values(collection)) {
    const paths=[chip.image,chip.visual?.renderer==='image'?chip.visual.src:undefined,chip.overlay?.src].filter(Boolean);
    for(const path of paths) await access(new URL(`../public/${path}`,import.meta.url));
  }
  for(const set of ['snow','space','hell','underworld','otherworld','cave','abyss']) assert.ok(terrainSets[set]);
});
