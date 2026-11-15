// ゲームの音の出口を1か所にまとめる。AudioContextはユーザー操作で解錠してから作り、消音・タブ非表示の間は suspend する。
// 再生に失敗してもゲームは続ける。
import {playSfx} from './sfx';
import {sfxParams} from './sfxOverrides';
import type {SfxName} from './sfxBank';
import {MusicPlayer} from './music';
import {bgmSong} from './bgmOverrides';
import type {BgmName} from './bgmBank';

const SFX_LEVEL=0.5, MUSIC_LEVEL=0.3; // BGMは効果音より控えめ
let ctx:AudioContext|null=null, master:GainNode|null=null, sfxBus:GainNode|null=null, player:MusicPlayer|null=null;
let unlocked=false, muted=true, volume=0.35;
let wanted:BgmName|null=null, playing:BgmName|null=null, paused=false, jingle=false;

function ensure():AudioContext|null {
  if(!unlocked)return null;
  if(!ctx){
    try {
      ctx=new AudioContext();master=ctx.createGain();master.connect(ctx.destination);
      sfxBus=ctx.createGain();sfxBus.gain.value=SFX_LEVEL;sfxBus.connect(master);
      const musicBus=ctx.createGain();musicBus.gain.value=MUSIC_LEVEL;musicBus.connect(master);
      player=new MusicPlayer(ctx,musicBus);
      document.addEventListener('visibilitychange',applyState);
    } catch {ctx=null;return null;}
  }
  applyState();return ctx;
}
function applyState(){
  if(!ctx||!master)return;
  master.gain.value=volume;
  const run=!muted&&!document.hidden;
  if(run&&ctx.state==='suspended')void ctx.resume().catch(()=>{});
  else if(!run&&ctx.state==='running')void ctx.suspend().catch(()=>{});
}
function refreshMusic(){
  if(!ensure()||!player||jingle)return;
  const target=paused?null:wanted;
  if(target===playing)return;
  playing=target;
  try {if(target)player.play(bgmSong(target));else player.stop();} catch {playing=null;}
}

export function unlockAudio(){unlocked=true;refreshMusic();}
export function setAudioSettings(nextMuted:boolean,nextVolume:number){muted=nextMuted;volume=nextVolume;applyState();refreshMusic();}
export function sfx(name:SfxName){
  if(muted)return;const c=ensure();if(!c||!sfxBus)return;
  try {playSfx(c,sfxParams(name),1,sfxBus);} catch {/* audio is optional */}
}
/** 場面の曲（ループ）。同じ曲なら何もしない。 */
export function playBgm(name:BgmName){wanted=name;refreshMusic();}
export function stopBgm(){wanted=null;refreshMusic();}
/** 作成ツールを開いている間などに一時停止する。再開時は反映済みの曲を読み直す。 */
export function pauseBgm(value:boolean){paused=value;refreshMusic();}
/** ループなしの曲を1回鳴らし、終わったら場面の曲へ戻る。 */
export function playJingle(name:BgmName){
  if(muted||paused||!ensure()||!player)return;
  jingle=true;playing=null;
  try {player.play(bgmSong(name),{fade:0.05,onEnd:()=>{jingle=false;refreshMusic();}});} catch {jingle=false;refreshMusic();}
}
