import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {noteToMidi,parseNotes,formatNotes,normalizeSong,songEvents,eventsInWindow,playheadStep,toggleNote,loopSteps}=await server.ssrLoadModule('/src/audio/music.ts');
const {bgmBank,sceneBgm}=await server.ssrLoadModule('/src/audio/bgmBank.ts');
test('note names, MIDI numbers and rests parse and round-trip',()=>{
 assert.equal(noteToMidi('C4'),60);assert.equal(noteToMidi('F#3'),54);assert.equal(noteToMidi('Bb2'),46);assert.equal(noteToMidi(200),127);assert.equal(noteToMidi('H2'),null);
 const notes=parseNotes('C5/4 r/2 64/2@.5 x/1');
 assert.deepEqual(notes,[{pitch:72,len:4,vol:1},{pitch:null,len:2,vol:1},{pitch:64,len:2,vol:.5},{pitch:null,len:1,vol:1}]);
 assert.deepEqual(parseNotes(formatNotes(notes)),notes);
});
test('normalizeSong clamps settings and fills four channels',()=>{
 const s=normalizeSong({bpm:999,bars:0,loop:false,channels:[{wave:'kazoo',duty:2,notes:[{pitch:60,len:0}]}]});
 assert.equal(s.bpm,240);assert.equal(s.bars,1);assert.equal(s.loop,false);assert.equal(s.channels.length,4);
 assert.equal(s.channels[0].wave,'square');assert.equal(s.channels[0].duty,.95);assert.equal(s.channels[0].notes[0].len,1);
 assert.equal(s.channels[3].wave,'noise');assert.deepEqual(normalizeSong(null),normalizeSong({}));
});
test('every bank song fills each channel to exactly one loop',()=>{
 for(const [name,s] of Object.entries(bgmBank))for(const [i,c] of s.channels.entries()){
  const steps=c.notes.reduce((a,n)=>a+n.len,0);if(steps)assert.equal(steps,loopSteps(s),`${name} channel ${i}`);
 }
 assert.equal(bgmBank.victory.loop,false);
});
test('songEvents clips notes to the loop and eventsInWindow repeats loops',()=>{
 const s=normalizeSong({bpm:60,bars:1,channels:[{notes:'C4/4 r/4 D4/12'}]});// 16 steps of 0.25s
 assert.deepEqual(songEvents(s).map(e=>[e.step,e.len]),[[0,4],[8,8]]);
 const ev=songEvents(s),hits=eventsInWindow(s,ev,10,10,18);
 assert.deepEqual(hits.map(h=>h.time),[10,12,14,16]);
 assert.deepEqual(eventsInWindow(s,ev,10,12,12),[]);
 assert.deepEqual(eventsInWindow({...s,loop:false},ev,10,10,18).map(h=>h.time),[10,12]);
 assert.equal(playheadStep(s,10,9),-1);assert.equal(playheadStep(s,10,14.3),1);
 assert.equal(playheadStep({...s,loop:false},10,14.3),-1);
});
test('toggleNote places, replaces and removes notes on a monophonic channel',()=>{
 let n=toggleNote([],4,60,4,16);assert.deepEqual(n,[{pitch:null,len:4,vol:1},{pitch:60,len:4,vol:1}]);
 n=toggleNote(n,6,62,2,16);assert.deepEqual(n.map(x=>[x.pitch,x.len]),[[null,4],[60,2],[62,2]]);
 n=toggleNote(n,7,62,2,16);assert.deepEqual(n.map(x=>[x.pitch,x.len]),[[null,4],[60,2]]);
 assert.deepEqual(toggleNote([],15,60,4,16).at(-1),{pitch:60,len:1,vol:1});
});
test('scenes pick their music',()=>{
 assert.equal(sceneBgm({phase:'title',area:'home'}),'title');
 assert.equal(sceneBgm({phase:'world',area:'village',environment:'outdoor'}),'village');
 assert.equal(sceneBgm({phase:'world',area:'crudRead',environment:'dungeon'}),'memoryDungeon');
 assert.equal(sceneBgm({phase:'world',area:'dungeon',environment:'dungeon'}),'dungeon');
 assert.equal(sceneBgm({phase:'world',area:'home',environment:'interior'}),'town');
 assert.equal(sceneBgm({phase:'battle',area:'field',enemyId:'graphius',ranger:true}),'graphius');
 assert.equal(sceneBgm({phase:'encounter',area:'field',enemyId:'ranger-read',ranger:true}),'ranger');
 assert.equal(sceneBgm({phase:'battle',area:'dungeon',boss:true}),'boss');
 assert.equal(sceneBgm({phase:'battle',area:'field'}),'battle');
});
