import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
after(()=>server.close());
const {chestId,claimChest,normalizeOpenedChests}=await server.ssrLoadModule('/src/chests.ts');
const {worldMaps,eventAt,reachableMapCells,adaptLegacyMap}=await server.ssrLoadModule('/src/world/maps.ts');

test('opening a chest awards its contents once, including after saving and loading',()=>{
  const initial={gold:100,inventory:{herb:1,woodSword:1},openedChests:[],name:'旅人'};
  const id=chestId('armorShop',{x:2,y:2});
  const first=claimChest(initial,id);
  assert.equal(first.opened,true);
  assert.equal(first.save.gold,130);
  assert.equal(first.save.inventory.herb,3);
  assert.equal(first.save.inventory.woodSword,1);
  assert.equal(first.save.name,initial.name);
  assert.deepEqual(initial,{gold:100,inventory:{herb:1,woodSword:1},openedChests:[],name:'旅人'});
  const restored=JSON.parse(JSON.stringify(first.save));
  const repeated=claimChest(restored,id);
  assert.equal(repeated.opened,false);
  assert.equal(repeated.save,restored);
  assert.match(repeated.message,/空っぽ/);
  assert.match(first.message,/やくそう ×2.*30 G/);
});

test('chest IDs distinguish areas and positions and old save data gets an empty opened list',()=>{
  assert.deepEqual(normalizeOpenedChests(undefined),[]);
  assert.deepEqual(normalizeOpenedChests(null),[]);
  assert.deepEqual(normalizeOpenedChests('armorShop:2,2'),[]);
  assert.deepEqual(normalizeOpenedChests(['armorShop:2,2',null,'armorShop:2,2']),['armorShop:2,2']);
  const ids=['armorShop','home'].flatMap(area=>[{x:2,y:2},{x:3,y:2}].map(p=>chestId(area,p)));
  assert.equal(new Set(ids).size,4);
});

test('every placed chest has a reachable interaction, including legacy map chests',async()=>{
  const {maps:legacyMaps}=await server.ssrLoadModule('/src/content.ts');
  const legacy=adaptLegacyMap('home',legacyMaps.home);
  let count=0;
  for(const [area,map] of [...Object.entries(worldMaps),['home',legacy]]) {
    const reachable=reachableMapCells(map);
    for(const prop of map.props.filter(p=>p.chip==='chest')) {
      count++;
      assert.deepEqual(eventAt(map,prop,'interact')?.action,{kind:'chest',id:chestId(area,prop)});
      assert.ok([{x:prop.x-1,y:prop.y},{x:prop.x+1,y:prop.y},{x:prop.x,y:prop.y-1},{x:prop.x,y:prop.y+1}].some(p=>reachable.has(`${p.x},${p.y}`)));
    }
  }
  assert.ok(count>=2);
});


test('side-room chests have authored supplies and preserve both cave routes',()=>{
 const cases=[['dungeon:2,5',{potion:1},0],['dungeon:15,10',{ether:1},0],['dungeon:19,5',{},45]];
 for(const [id,inventory,gold] of cases){
  assert.ok(worldMaps.dungeon.props.some(p=>p.chip==='chest'&&chestId('dungeon',p)===id));
  const first=claimChest({gold:0,inventory:{},openedChests:[]},id);
  assert.deepEqual(first.save.inventory,inventory);assert.equal(first.save.gold,gold);
  assert.equal(claimChest(first.save,id).save,first.save);
 }
});
