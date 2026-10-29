import { useId, useState, type CSSProperties } from 'react';
import { heroAttackArt } from './heroAttackArt';
import './heroBattleSprite.css';

/** Load all three moves during the encounter, before the first answer. */
export function HeroBattleSprite({motion=0,attacking=false,attackId=0}:{motion?:0|1|2;attacking?:boolean;attackId?:number}) {
  const id=useId().replace(/:/g,''),[loaded,setLoaded]=useState([false,false,false]);
  const active=attacking&&loaded[motion];
  return <span className="pixel-sprite hero-battle-art" data-ready={loaded[0]} data-attacking={active} data-motion={heroAttackArt[motion].name} aria-hidden="true">
    <img className="hero-battle-idle" src={`${import.meta.env.BASE_URL}sprites/hero-battle-left.png`} alt="" draggable={false}/>
    {heroAttackArt.map((art,move)=>art.frames.map((frame,pose)=>{
      const [x,y,width,height]=frame.box,clip=`hero-clip-${id}-${move}-${pose}`;
      return <svg key={`${move}-${pose}-${attackId}`} className={`hero-attack-pose hero-atlas-${art.name} pose-${pose} ${move===motion?'is-current':''}`} data-pose={pose} viewBox={`${frame.anchor[0]-358.4} ${frame.anchor[1]-537.6} 640 640`} style={{'--pose-scale':art.scale} as CSSProperties}>
        <defs><clipPath id={clip} clipPathUnits="userSpaceOnUse">{(frame.clips??[frame.box]).map((rect,i)=><rect key={i} x={rect[0]} y={rect[1]} width={rect[2]} height={rect[3]}/>)}</clipPath></defs>
        <svg x={x} y={y} width={width} height={height} viewBox={`${x} ${y} ${width} ${height}`} overflow="hidden">
          <image href={`${import.meta.env.BASE_URL}${art.src}`} width={art.width} height={art.height} clipPath={`url(#${clip})`} imageRendering="pixelated" onLoad={pose===0?()=>setLoaded(value=>value[move]?value:value.map((ready,index)=>index===move||ready)):undefined}/>
        </svg>
      </svg>;
    }))}
  </span>;
}
