import type { CSSProperties } from 'react';
import { PixelSprite, faceSprite } from './PixelSprite';
import { MysteriousKnight } from './MysteriousKnight';
import { WorldCharacter, type CharacterName } from './WorldCharacter';

const locations: Record<string, [number, number]> = {
  hero: [0, 0], elder: [1, 0], scholar: [2, 0], child: [3, 0],
  priest: [0, 1], wanderer: [1, 1], father: [2, 1], mother: [3, 1],
};

// One image per chapter two character: public/portraits/chapter-two/face-<name>.png
const chapterTwoFaces=new Set(['graphius','nozomi','tsukune','nurie','keshi','keshi-hesitant','fumi','fumi-tears']);

export function CharacterPortrait({face,standing=false}:{face:string;standing?:boolean}) {
  if(face==='knight')return <MysteriousKnight className="knight-portrait"/>;
  if(face==='corrupted-hanna')return <span className="corrupted-portrait"><CharacterPortrait face="👩"/></span>;
  if(face.startsWith('bs-'))return <span className="character-portrait single-image" style={{backgroundImage:`url(${import.meta.env.BASE_URL}portraits/backstage/face-${face.slice(3)}.png)`}} role="img" aria-label={`${face}の肖像`}/>;
  if(chapterTwoFaces.has(face))return <span className="character-portrait single-image" style={{backgroundImage:`url(${import.meta.env.BASE_URL}portraits/chapter-two/face-${face}.png)`}} role="img" aria-label={`${face}の肖像`}/>;
  const name=faceSprite(face);
  const location=locations[name];
  if (!location) return <span className="narrator-portrait"><PixelSprite name={name}/></span>;
  if (standing) return <WorldCharacter name={name as CharacterName} className="standing-character"/>;
  const [column,row]=location;
  const style={
    backgroundImage:`url(${import.meta.env.BASE_URL}portraits/faces.png)`,
    backgroundPosition:`${column*100/3}% ${row*100}%`,
  } as CSSProperties;
  return <span className="character-portrait" style={style} role="img" aria-label={`${name}の肖像`}/>;
}

// One image per pose: public/portraits/chapter-two/standing-<name>.png
const chapterTwoStanding:Record<string,string>={graphius:'graphius',nozomi:'nozomi',tsukune:'tsukune',nurie:'nurie',keshi:'keshi',fumi:'fumi','fumi-tears':'fumi','graphius-battle':'graphius-battle','keshi-hesitant':'keshi-hesitant'};
export function standingUrl(name:string):string|undefined {
  // 裏会議 'bs-<id>[-<pose>]' -> backstage/、本編の面々 'cast-<id>-<pose>' -> cast/standing-<id>-<pose>.png
  const set=/^(bs|cast)-([a-z]+)(?:-(normal|propose|down|surprised))?$/.exec(name);
  if(set)return `${import.meta.env.BASE_URL}portraits/${set[1]==='bs'?'backstage':'cast'}/standing-${set[2]}-${set[3]??'normal'}.png`;
  const file=chapterTwoStanding[name];
  return file&&`${import.meta.env.BASE_URL}portraits/chapter-two/standing-${file}.png`;
}
// Never mirror: some silhouettes carry text.
export function StandingArt({name,side='right',active=true}:{name:string;side?:'left'|'right';active?:boolean}) {
  const url=standingUrl(name);
  if(!url)return null;
  // Lettered silhouettes (作者・まおう) must never be mirrored.
  const noFlip=/^bs-(metappi|maou)/.test(name);
  return <span className={`story-standing is-${side}${active?' is-active':''}${noFlip?' no-flip':''}`} role="img" aria-label={`${name}の立ち絵`} style={{backgroundImage:`url(${url})`}}/>;
}
