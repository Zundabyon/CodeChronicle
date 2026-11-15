import {normalizeSfx,type SfxParams} from './sfx';
import {sfxBank,type SfxName} from './sfxBank';

// Sounds tuned in the in-game designer; per-browser only, so a failure just falls back to the bank.
const KEY='code-chronicle-sfx-overrides';
const read=():Partial<Record<SfxName,SfxParams>>=>{try{const v=JSON.parse(localStorage.getItem(KEY)??'{}');return v&&typeof v==='object'?v:{};}catch{return {};}};
export const sfxParams=(name:SfxName):SfxParams=>{const o=read()[name];return o?normalizeSfx(o):sfxBank[name];};
export const saveSfxOverride=(name:SfxName,params:SfxParams)=>{try{localStorage.setItem(KEY,JSON.stringify({...read(),[name]:params}));}catch{/* storage unavailable */}};
export const clearSfxOverrides=()=>{try{localStorage.removeItem(KEY);}catch{/* storage unavailable */}};
