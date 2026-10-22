import {test,after} from 'node:test';import assert from 'node:assert/strict';import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});after(()=>server.close());
const {validateSave}=await server.ssrLoadModule('/src/saveValidation.ts');
const defaults={version:1,name:'旅人',level:1,track:'react',difficulty:'beginner',inertia:true,area:'home',pos:{x:5,y:7},hp:20,mp:3,xp:0,gold:100,inventory:{woodSword:1,travelerClothes:1,herb:1},equipment:{weapon:'woodSword',armor:'travelerClothes'},openedChests:[],readBooks:[],bookmarks:{},wrong:[],answered:[],defeated:[],seen:[],correct:0,total:0,steps:0,story:'breakfast',completed:false};
test('legacy saves migrate with valid possessions and learning progress intact',()=>{
 const value={...defaults,version:undefined,name:'勇者',gold:321,readBooks:['js-variables-01'],bookmarks:{'js-variables':'js-variables-02'}};const result=validateSave(value,defaults);assert.equal(result.save.version,1);assert.equal(result.save.gold,321);assert.deepEqual(result.save.readBooks,value.readBooks);assert.match(result.notice,/移行/);assert.equal(value.version,undefined);
});
test('corrupt numbers, arrays, items and equipment recover to safe values',()=>{
 const {save,notice}=validateSave({...defaults,gold:-10,level:0,hp:999,total:0,correct:5,wrong:'bad',answered:[null,'unknown'],defeated:{},inventory:{herb:-2,unknown:1},equipment:{weapon:'unknown',armor:'ironSword'},area:'missing',pos:null},defaults);
 assert.equal(save.gold,0);assert.equal(save.level,1);assert.equal(save.hp,20);assert.equal(save.total,5);assert.deepEqual(save.wrong,[]);assert.deepEqual(save.answered,[]);assert.deepEqual(save.equipment,defaults.equipment);assert.equal(save.area,'town');assert.match(notice,/補正/);assert.equal(save.inventory.unknown,undefined);
});
test('unsupported versions and non-save objects are rejected without mutation',()=>{
 for(const value of [null,[],{},42,{...defaults,version:99}])assert.equal(validateSave(value,defaults).save,null);
});
