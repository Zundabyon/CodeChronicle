import type { CSSProperties } from 'react';
import { PixelSprite, faceSprite } from './PixelSprite';

const locations: Record<string, [number, number]> = {
  hero: [0, 0], elder: [1, 0], scholar: [2, 0], child: [3, 0],
  priest: [0, 1], wanderer: [1, 1], father: [2, 1], mother: [3, 1],
};

export function CharacterPortrait({face,standing=false}:{face:string;standing?:boolean}) {
  const name=faceSprite(face);
  const location=locations[name];
  if (!location) return <PixelSprite name={name}/>;
  const [column,row]=location;
  const style={
    backgroundImage:`url(${import.meta.env.BASE_URL}portraits/${standing?'standing':'faces'}.png)`,
    backgroundPosition:`${column*100/3}% ${row*100}%`,
  } as CSSProperties;
  return <span className={`character-portrait ${standing?'standing':''}`} style={style} role="img" aria-label={`${name}の肖像`}/>;
}
