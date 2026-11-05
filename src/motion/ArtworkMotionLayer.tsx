import {useEffect,useState,type ReactNode,type RefObject} from 'react';
import {artworkViewport,type ArtworkSize} from './artworkViewport';

export function ArtworkMotionLayer({frame,source,children}:{frame:RefObject<HTMLDivElement|null>;source:ArtworkSize;children:ReactNode}){
  const [viewBox,setViewBox]=useState<string>();
  useEffect(()=>{
    const element=frame.current;if(!element)return;
    const update=()=>{
      const style=getComputedStyle(element);
      const readPosition=(property:string)=>{const value=parseFloat(style.getPropertyValue(property));return Number.isFinite(value)?value/100:.5;};
      const position={x:readPosition('--art-position-x'),y:readPosition('--art-position-y')};
      const view=artworkViewport(source,{width:element.clientWidth,height:element.clientHeight},position);
      setViewBox(view?`${view.x} ${view.y} ${view.width} ${view.height}`:undefined);
    };
    const observer=new ResizeObserver(update);observer.observe(element);
    // Breakpoint position may change even if the frame's measured size stays equal.
    window.addEventListener('resize',update);update();
    return ()=>{observer.disconnect();window.removeEventListener('resize',update);};
  },[frame,source]);
  return <svg className="artwork-motion-layer" viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',overflow:'hidden',visibility:viewBox?'visible':'hidden'}}>{children}</svg>;
}
