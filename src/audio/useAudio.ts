import {useEffect,useState} from 'react';
import {loadAudioPreferences,saveAudioPreferences} from './audioPreferences';
import {pauseBgm,playBgm,playJingle,setAudioSettings,sfx,stopBgm,unlockAudio} from './audioEngine';

/** Appが使う音の窓口。消音・音量を保存し、最初のユーザー操作で解錠する。 */
export function useAudio(){
  const [preferences,setPreferences]=useState(loadAudioPreferences);
  useEffect(()=>{saveAudioPreferences(preferences);setAudioSettings(preferences.muted,preferences.volume);},[preferences]);
  useEffect(()=>{
    const unlock=()=>{unlockAudio();window.removeEventListener('pointerdown',unlock,true);window.removeEventListener('keydown',unlock,true);};
    window.addEventListener('pointerdown',unlock,true);window.addEventListener('keydown',unlock,true);
    return ()=>{window.removeEventListener('pointerdown',unlock,true);window.removeEventListener('keydown',unlock,true);};
  },[]);
  return {muted:preferences.muted,volume:preferences.volume,sfx,playBgm,stopBgm,pauseBgm,jingle:playJingle,
    setVolume:(volume:number)=>setPreferences(value=>({...value,volume})),
    toggleMute:()=>setPreferences(value=>({...value,muted:!value.muted}))};
}
