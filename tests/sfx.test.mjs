import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {normalizeSfx,renderSfx,encodeWav}=await server.ssrLoadModule('/src/audio/sfx.ts');
const {sfxBank}=await server.ssrLoadModule('/src/audio/sfxBank.ts');
test('normalizeSfx fills defaults, clamps ranges and rejects bad waves',()=>{
 const p=normalizeSfx({wave:'kazoo',freq:99999,duty:-1,volume:'x'});
 assert.equal(p.wave,'square');assert.equal(p.freq,4000);assert.equal(p.duty,.05);assert.equal(p.volume,.5);
 assert.deepEqual(normalizeSfx(null),normalizeSfx({}));
});
test('renderSfx length follows the envelope and stays within [-1,1]',()=>{
 for(const p of Object.values(sfxBank)){
  const s=renderSfx(p,8000);assert.equal(s.length,Math.ceil((p.attack+p.sustain+p.decay)*8000));
  assert.ok(s.every(v=>v>=-1&&v<=1&&Number.isFinite(v)));assert.ok(s.some(v=>v!==0));
 }
 assert.equal(renderSfx({sustain:0,decay:0}).length,1);
});
test('encodeWav writes a 16-bit mono PCM header and clamps samples',()=>{
 const v=new DataView(encodeWav(new Float32Array([0,2,-2]),8000));
 const tag=o=>String.fromCharCode(...[0,1,2,3].map(i=>v.getUint8(o+i)));
 assert.equal(tag(0),'RIFF');assert.equal(tag(8),'WAVE');assert.equal(tag(36),'data');
 assert.equal(v.getUint32(24,true),8000);assert.equal(v.getUint16(34,true),16);assert.equal(v.getUint32(40,true),6);
 assert.equal(v.getInt16(46,true),32767);assert.equal(v.getInt16(48,true),-32767);
});
