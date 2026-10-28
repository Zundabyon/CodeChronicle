export const AUDIO_PREFERENCES_KEY='code-chronicle-audio-v1';
export type AudioPreferences={muted:boolean;volume:number};
export const defaultAudioPreferences:AudioPreferences={muted:true,volume:.35};

export function loadAudioPreferences():AudioPreferences {
  try {
    const value:unknown=JSON.parse(localStorage.getItem(AUDIO_PREFERENCES_KEY)??'null');
    if(!value||typeof value!=='object')return {...defaultAudioPreferences};
    const {muted,volume}=value as Partial<AudioPreferences>;
    return {muted:typeof muted==='boolean'?muted:true,
      volume:typeof volume==='number'&&Number.isFinite(volume)&&volume>=0&&volume<=1?volume:.35};
  } catch {return {...defaultAudioPreferences};}
}
export function saveAudioPreferences(value:AudioPreferences):void {
  try {localStorage.setItem(AUDIO_PREFERENCES_KEY,JSON.stringify(value));} catch {/* Audio preferences must not interrupt the adventure. */}
}
