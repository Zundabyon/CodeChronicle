import {test,after} from 'node:test';import assert from 'node:assert/strict';import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});after(()=>server.close());
const {nearbyInteraction}=await server.ssrLoadModule('/src/world/interactions.ts');
const npc={id:'neighbor',name:'隣人',x:2,y:1};const chest={id:'box',x:1,y:0,label:'宝箱を開ける',trigger:'interact',action:{kind:'chest',id:'test'}};
const map={npcs:[npc],eventIndex:new Map([['1,0',[chest]]])};
test('the facing interaction is chosen before another adjacent target',()=>{assert.equal(nearbyInteraction(map,{x:1,y:1},{x:0,y:-1},'legacy').kind,'event');assert.equal(nearbyInteraction(map,{x:1,y:1},{x:1,y:0},'legacy').kind,'npc');});
test('fallbacks remain adjacent and hidden story NPCs do not appear',()=>{assert.equal(nearbyInteraction(map,{x:1,y:1},{x:0,y:1},'legacy').kind,'event');assert.equal(nearbyInteraction(map,{x:8,y:8},{x:0,y:-1},'legacy'),null);assert.equal(nearbyInteraction({npcs:[{...npc,id:'innkeeper'}],eventIndex:new Map()},{x:1,y:1},{x:1,y:0},'mayor'),null);});
