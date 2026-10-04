import type { CSSProperties } from 'react';
import { WorldCharacter } from '../WorldCharacter';
import { PixelSprite } from '../PixelSprite';
import type { Visual, ObjectDefinition } from './catalog';
import type { Point } from '../content';

type Props = {
  definition:Pick<ObjectDefinition,'visual'|'layer'|'label'> & {category:ObjectDefinition['category']|'terrain'}; point:Point; walking?:boolean; text?:string;
  label?:string; onClick?:()=>void; className?:string;
};

function ChipVisual({visual,walking,text}:{visual:Visual;walking:boolean;text?:string}) {
  if(visual.renderer==='person') return <WorldCharacter name={visual.name} walking={walking}/>;
  if(visual.renderer==='sprite') return <PixelSprite name={visual.name}/>;
  if(visual.renderer==='text') return <span className="world-chip-sign">{text??visual.text}</span>;
  return <img src={`${import.meta.env.BASE_URL}${visual.src}`} alt="" draggable={false}/>;
}

export function WorldChip({definition,point,walking=false,text,label,onClick,className=''}:Props) {
  const {visual}=definition;
  const foot=point.y+visual.anchor.y+visual.height*(1-visual.anchor.y);
  const layer=definition.layer==='ground'?0:definition.layer==='overhead'?100000:Math.round(foot*100)+10;
  const style={
    left:`calc(${point.x+visual.anchor.x-visual.width*visual.anchor.x} * var(--tile-size))`,
    top:`calc(${point.y+visual.anchor.y-visual.height*visual.anchor.y} * var(--tile-size))`,
    width:`calc(${visual.width} * var(--tile-size))`,height:`calc(${visual.height} * var(--tile-size))`,
    zIndex:layer,
  } as CSSProperties;
  const classes=`world-chip chip-category-${definition.category} ${className}`;
  const content=<ChipVisual visual={visual} walking={walking} text={text}/>;
  return onClick?<button className={classes} style={style} onClick={onClick} aria-label={label??definition.label}>{content}</button>:
    <div className={classes} style={style} aria-hidden="true">{content}</div>;
}
