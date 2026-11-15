import {normalizeSong,type Song} from './music';
import {bgmBank,type BgmName} from './bgmBank';

// Songs tuned in the in-game designer; per-browser only, so a failure just falls back to the bank.
const KEY='code-chronicle-bgm-overrides';
const read=():Partial<Record<BgmName,Song>>=>{try{const v=JSON.parse(localStorage.getItem(KEY)??'{}');return v&&typeof v==='object'?v:{};}catch{return {};}};
export const bgmSong=(name:BgmName):Song=>{const o=read()[name];return o?normalizeSong(o):bgmBank[name];};
export const saveBgmOverride=(name:BgmName,song:Song)=>{try{localStorage.setItem(KEY,JSON.stringify({...read(),[name]:song}));}catch{/* storage unavailable */}};
export const clearBgmOverrides=()=>{try{localStorage.removeItem(KEY);}catch{/* storage unavailable */}};
