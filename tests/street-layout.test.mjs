import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>server.close());
const {worldMaps,canWalkOnMap,eventAt,reachableMapCells,restoreMapPosition}=await server.ssrLoadModule('/src/world/maps.ts');
const {houses,fieldRuinsGate}=await server.ssrLoadModule('/src/content.ts');
const {mountainVillageGate}=await server.ssrLoadModule('/src/world/mountainVillage.ts');
const {mapDecorations}=await server.ssrLoadModule('/src/world/decorations.ts');
const key=({x,y})=>`${x},${y}`;

// Match player navigation: a transition cell cannot be crossed on the way
// to some other destination, even when geometric flood-fill calls it reachable.
function pavedRoute(map,start,goal) {
  const queue=[start],parents=new Map(),seen=new Set([key(start)]);
  for(let i=0;i<queue.length;i++) {
    const p=queue[i];
    if(key(p)===key(goal)) {
      const route=[p];let cell=key(p);
      while(cell!==key(start)) {const prev=parents.get(cell);route.unshift(prev);cell=key(prev);}
      return route;
    }
    for(const point of [{x:p.x+1,y:p.y},{x:p.x-1,y:p.y},{x:p.x,y:p.y+1},{x:p.x,y:p.y-1}]) {
      if(seen.has(key(point))||!canWalkOnMap(map,point)||map.terrain[point.y][point.x]!=='road')continue;
      if(map.npcs.some(npc=>key(npc)===key(point)))continue;
      if(key(point)!==key(goal)&&eventAt(map,point,'enter'))continue;
      seen.add(key(point));parents.set(key(point),p);queue.push(point);
    }
  }
  return [];
}

test('the ruins have a continuous paved approach that never enters the village',()=>{
  const map=worldMaps.field;
  const route=pavedRoute(map,map.entry,fieldRuinsGate);
  assert.ok(route.length>0,'the village must not be a required transition on the cave route');
  assert.ok(!route.some(point=>key(point)===key(mountainVillageGate)));
  assert.ok(pavedRoute(map,map.entry,mountainVillageGate).length>0,'the village remains accessible on its side road');
});

test('the mountain pass offers five clear lanes beside the village and up to the ruins',()=>{
  const map=worldMaps.field;
  for(let y=14;y<=30;y++) for(let x=106;x<=110;x++) {
    assert.equal(map.terrain[y][x],'road',`mountain pass ${x},${y}`);
    assert.ok(canWalkOnMap(map,{x,y}));
    assert.notEqual(eventAt(map,{x,y},'enter')?.action.to,'village');
  }
  for(let x=90;x<=108;x++) for(let y=28;y<=32;y++) {
    assert.equal(map.terrain[y][x],'road',`southern approach ${x},${y}`);
    assert.ok(canWalkOnMap(map,{x,y}));
  }
});

test('starting-town streets reach every porch without cutting through buildings or other doors',()=>{
  const map=worldMaps.town;
  for(const [area,house] of Object.entries(houses))
    assert.ok(pavedRoute(map,map.entry,house.outside).length>0,`${area}: a paved street reaches its front porch`);
  assert.ok(pavedRoute(map,map.entry,{x:13,y:16}).length>0,'church porch');
  for(let y=7;y<=29;y++) for(let x=16;x<=18;x++) {
    assert.equal(map.terrain[y][x],'road',`main avenue ${x},${y}`);
    assert.ok(canWalkOnMap(map,{x,y}));
  }
  for(const prop of mapDecorations.town) if(Number.isInteger(prop.x)&&Number.isInteger(prop.y))
    assert.notEqual(map.terrain[prop.y][prop.x],'road',`${prop.id}: furniture and planting stay off the streets`);
});

test('outdoor lanterns are wall-mounted above porches instead of standing on roads',()=>{
  const town=worldMaps.town,village=worldMaps.village;
  assert.equal(town.props.filter(prop=>prop.chip==='wallLantern').length,Object.keys(houses).length+1);
  assert.equal(village.props.filter(prop=>prop.chip==='wallLantern').length,3);
  for(const map of [town,village]) {
    assert.ok(!map.props.some(prop=>prop.chip==='lantern'));
    for(const lamp of map.props.filter(prop=>prop.chip==='wallLantern')) {
      const below={x:Math.floor(lamp.x+.5),y:Math.floor(lamp.y+1)};
      assert.notEqual(map.terrain[below.y][below.x],'road');
    }
  }
});


test('old mountain-road saves resume on nearby connected ground after the layout update',()=>{
  const map=worldMaps.field,reachable=reachableMapCells(map);
  for(const old of [{x:91,y:26},{x:97,y:25},{x:102,y:19}]) {
    const restored=restoreMapPosition(map,old);
    assert.ok(reachable.has(key(restored)));
    assert.ok(Math.abs(restored.x-old.x)+Math.abs(restored.y-old.y)<=4);
    assert.ok(!eventAt(map,restored,'enter'));
  }
  const valid={x:108,y:16};
  assert.deepEqual(restoreMapPosition(map,valid),valid);
});
