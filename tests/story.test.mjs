import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
after(()=>server.close());
const {migrateStoryStage,canLeaveTown,storyNpcs,storyObjective}=await server.ssrLoadModule('/src/story.ts');
const {worldMaps,canWalkOnMap,reachableMapCells}=await server.ssrLoadModule('/src/world/maps.ts');

test('older saves remain free to travel instead of restarting the introduction',()=>{
  for(const value of [undefined,null,'unknown',{},5]) {
    assert.equal(migrateStoryStage(value),'legacy');
    assert.equal(canLeaveTown(migrateStoryStage(value)),true);
  }
  for(const stage of ['breakfast','mayor','ruins','knight','knowledge','homecoming','rescued'])assert.equal(migrateStoryStage(stage),stage);
});
test('new-game departure waits for the incident and completed mayor conversation',()=>{
  assert.equal(canLeaveTown('breakfast'),false);assert.equal(canLeaveTown('mayor'),false);
  for(const stage of ['ruins','knight','knowledge','homecoming','rescued'])assert.equal(canLeaveTown(stage),true);
  assert.match(storyObjective('breakfast').text,/旅籠/);
  assert.match(storyObjective('mayor').text,/村長の家/);
  assert.match(storyObjective('homecoming').text,/教会/);
});
test('the mayor is reachable at home and Hanna is absent from the inn while recovering',()=>{
  assert.equal(worldMaps.town.npcs.some(n=>n.id==='elder'),false);
  const mayor=worldMaps.elderHouse.npcs.find(n=>n.id==='elder');assert.ok(mayor);
  const cells=reachableMapCells(worldMaps.elderHouse);
  assert.ok([{x:mayor.x+1,y:mayor.y},{x:mayor.x-1,y:mayor.y},{x:mayor.x,y:mayor.y+1},{x:mayor.x,y:mayor.y-1}].some(p=>cells.has(`${p.x},${p.y}`)));
  const npcs=worldMaps.guestHouse.npcs;
  for(const stage of ['mayor','ruins','knight','knowledge','homecoming'])assert.equal(storyNpcs(npcs,stage).some(n=>n.id==='innkeeper'),false);
  for(const stage of ['breakfast','rescued','legacy'])assert.equal(storyNpcs(npcs,stage).some(n=>n.id==='innkeeper'),true);
  assert.equal(canWalkOnMap(worldMaps.town,{x:13,y:16}),true);
});
