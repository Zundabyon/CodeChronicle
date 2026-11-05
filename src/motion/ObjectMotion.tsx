import {useEffect,useState,type CSSProperties,type ReactNode} from 'react';
import './objectMotion.css';

export type ObjectMotionSpec={preset:'glow'|'sway';duration:number;delay?:number;strength?:number};
type MotionStyle=CSSProperties&Record<`--object-motion-${string}`,string|number>;
const preferenceKey='code-chronicle-object-motion';
function savedPreference(){try{return localStorage.getItem(preferenceKey)!=='off';}catch{return true;}}

// Shared playback policy, independent from adventure saves and game timing.
export function useObjectMotionPlayback(){
  const [enabled,setPreference]=useState(savedPreference);
  const [reduced,setReduced]=useState(()=>typeof matchMedia==='undefined'||matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible,setVisible]=useState(()=>typeof document!=='undefined'&&!document.hidden);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const updateReduced=()=>setReduced(media.matches),updateVisible=()=>setVisible(!document.hidden);
    updateReduced();updateVisible();
    media.addEventListener('change',updateReduced);document.addEventListener('visibilitychange',updateVisible);
    return ()=>{media.removeEventListener('change',updateReduced);document.removeEventListener('visibilitychange',updateVisible);};
  },[]);
  useEffect(()=>{
    const localChange=(event:Event)=>{const value=(event as CustomEvent<unknown>).detail;if(typeof value==='boolean')setPreference(value);};
    const storageChange=(event:StorageEvent)=>{if(event.key===preferenceKey||event.key===null)setPreference(savedPreference());};
    window.addEventListener('object-motion-preference',localChange);window.addEventListener('storage',storageChange);
    return ()=>{window.removeEventListener('object-motion-preference',localChange);window.removeEventListener('storage',storageChange);};
  },[]);
  const setEnabled=(value:boolean)=>{
    setPreference(value);try{localStorage.setItem(preferenceKey,value?'on':'off');}catch{/* Decoration never blocks the game. */}
    window.dispatchEvent(new CustomEvent('object-motion-preference',{detail:value}));
  };
  return {enabled,setEnabled,reduced,visible,active:enabled&&!reduced&&visible};
}

export function ObjectMotionScene({active,children,className=''}:{active:boolean;children:ReactNode;className?:string}){
  return <div className={`object-motion-scene ${className}`} data-motion-active={active}>{children}</div>;
}

// HTML props and SVG artwork share the same presets; position belongs to the caller.
export function ObjectMotion({motion,children,as='span',className=''}:{motion:ObjectMotionSpec;children:ReactNode;as?:'span'|'g';className?:string}){
  const Element=as;
  const strength=Math.max(0,Math.min(1,motion.strength??1));
  const style:MotionStyle={
    '--object-motion-duration':`${Math.max(1,motion.duration)}s`,
    '--object-motion-delay':`${motion.delay??0}s`,
    '--object-motion-opacity-low':strength*.16,
    '--object-motion-opacity-high':strength*.48,
    '--object-motion-angle':`${strength*2}deg`,
  };
  return <Element className={`object-motion ${className}`} data-motion-preset={motion.preset} style={style} aria-hidden="true">{children}</Element>;
}
