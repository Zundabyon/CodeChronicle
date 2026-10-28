import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const originalStorage=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
after(()=>{if(originalStorage===undefined)delete globalThis.localStorage;else Object.defineProperty(globalThis,'localStorage',originalStorage);return server.close();});
const {loadAudioPreferences,saveAudioPreferences,AUDIO_PREFERENCES_KEY}=await server.ssrLoadModule('/src/audioPreferences.ts');
test('audio preferences survive storage without touching the adventure save',()=>{
 const stored=new Map([['code-chronicle-save-v1','adventure']]);
 globalThis.localStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};
 saveAudioPreferences({muted:false,volume:.65});assert.deepEqual(loadAudioPreferences(),{muted:false,volume:.65});
 assert.equal(stored.get('code-chronicle-save-v1'),'adventure');assert.ok(stored.has(AUDIO_PREFERENCES_KEY));
});
test('missing, malformed and out-of-range audio settings fall back safely',()=>{
 for(const raw of [null,'{','[]','null','{"muted":"no","volume":2}']){
  globalThis.localStorage={getItem:()=>raw};assert.deepEqual(loadAudioPreferences(),{muted:true,volume:.35});
 }
 globalThis.localStorage={getItem:()=>'{"muted":false,"volume":0}'};assert.deepEqual(loadAudioPreferences(),{muted:false,volume:0});
});
test('unavailable preference storage never interrupts the game',()=>{
 globalThis.localStorage={getItem:()=>{throw new Error('blocked');},setItem:()=>{throw new Error('full');}};
 assert.deepEqual(loadAudioPreferences(),{muted:true,volume:.35});assert.doesNotThrow(()=>saveAudioPreferences({muted:true,volume:.5}));
});
