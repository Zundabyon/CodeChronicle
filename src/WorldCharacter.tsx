import { MysteriousKnight } from './MysteriousKnight';
import './characterArt.css';

export type CharacterDirection = 'down'|'left'|'right'|'up';

export type CharacterName = 'hero'|'elder'|'scholar'|'child'|'priest'|'wanderer'|'father'|'mother'|'knight';

export function WorldCharacter({name,walking=false,direction,className=''}:{name:CharacterName;walking?:boolean;direction?:CharacterDirection;className?:string}) {
  const classes=`world-character character-art ${walking?'walking':''} ${className}`;
  if(name==='hero'&&direction)return <span className={`${classes} hero-directional`} data-direction={direction} aria-hidden="true">
    <span className="character-art-image hero-walk-frame" style={{backgroundImage:`url("${import.meta.env.BASE_URL}sprites/hero-walk.png")`}}/>
  </span>;
  if(name==='knight')return <MysteriousKnight className={classes} world/>;
  return <span className={classes} aria-hidden="true">
    <img className="character-art-image" src={`${import.meta.env.BASE_URL}sprites/${name}-64.png`} alt="" width={64} height={64} draggable={false}/>
  </span>;
}
