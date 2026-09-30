import type { CSSProperties } from 'react';

export type CharacterName = 'hero'|'elder'|'scholar'|'child'|'priest'|'wanderer'|'father'|'mother';

const colors: Record<CharacterName,{hair:string;light:string;coat:string;shade:string;trim:string;skin:string;legs:string}> = {
  hero:{hair:'#172b75',light:'#4273db',coat:'#2457a4',shade:'#15326b',trim:'#f5c35d',skin:'#f5bd8d',legs:'#71462e'},
  elder:{hair:'#c6cad1',light:'#f0f0df',coat:'#7b5238',shade:'#493327',trim:'#d5aa6c',skin:'#deb18c',legs:'#553b2d'},
  scholar:{hair:'#67412e',light:'#a27044',coat:'#247c7c',shade:'#194b59',trim:'#e1bb6e',skin:'#efbd91',legs:'#5b3c31'},
  child:{hair:'#9a5128',light:'#dd8540',coat:'#df652b',shade:'#a53827',trim:'#ffd35c',skin:'#f7c291',legs:'#5b9942'},
  priest:{hair:'#e4ae4e',light:'#ffe082',coat:'#f3e7c9',shade:'#c8b48c',trim:'#ce4b3f',skin:'#f6c49d',legs:'#916a45'},
  wanderer:{hair:'#55412d',light:'#7a633a',coat:'#4d6942',shade:'#304934',trim:'#ad8d59',skin:'#ddb184',legs:'#4c402e'},
  father:{hair:'#463022',light:'#6e4b35',coat:'#85583a',shade:'#513728',trim:'#d9b67b',skin:'#dca87e',legs:'#59402f'},
  mother:{hair:'#75452e',light:'#b77948',coat:'#5b9b4b',shade:'#36633d',trim:'#eee0a4',skin:'#eab88f',legs:'#66513a'},
};

export function WorldCharacter({name,walking=false,className=''}:{name:CharacterName;walking?:boolean;className?:string}) {
  const c=colors[name];
  const hood=name==='wanderer';
  const robe=name==='priest'||name==='elder'||name==='mother';
  const beard=name==='elder'||name==='father';
  const style={'--coat':c.coat,'--shade':c.shade,'--skin':c.skin,'--legs':c.legs} as CSSProperties;
  return <svg className={`world-character ${walking?'walking':''} ${className}`} style={style} viewBox="0 0 32 40" shapeRendering="crispEdges" aria-hidden="true">
    <path fill="#171823" d="M9 2h14v2h4v4h2v12h-3v3h-3v2h3v11h-3v2h-6v-2h-2v2H9v-2H6V25h3v-2H6v-3H3V9h3V5h3z"/>
    <path fill={hood?c.shade:c.hair} d="M9 3h14v2h3v4h2v10h-4V9H8v10H4V9h3V5h2z"/>
    <path fill={c.light} d="M9 4h7v2H8v5H6V8h3zM18 4h4v2h3v3h-3V7h-4z"/>
    <path fill={c.skin} d="M8 10h16v10h-3v3H11v-3H8zM5 14h3v5H5zM24 14h3v5h-3z"/>
    <path fill="#e89569" d="M9 18h2v3h2v2h-2v-2H9zM21 18h2v3h-2z"/>
    <path fill={c.hair} d={hood?'M7 9h4v4H8v7H6V11h1zM21 9h4v12h-2v-8h-2z':'M7 8h7v3H9v4H6v-5h1zM18 8h7v3h2v5h-3v-5h-6z'}/>
    <path fill="#182032" d="M10 14h3v3h-3zM19 14h3v3h-3z"/>
    <path fill="#fff4df" d="M10 14h1v1h-1zM19 14h1v1h-1z"/>
    {beard&&<path fill={name==='elder'?'#e5e3da':'#5d3929'} d="M11 19h10v4h-2v3h-6v-3h-2z"/>}
    <path fill={c.shade} d="M11 23h10v3h4v9H7v-9h4z"/>
    <path fill={c.coat} d="M12 24h8v2h4v8H8v-8h4z"/>
    <path fill={c.trim} d="M15 25h2v10h-2zM9 31h3v2H9zM20 31h3v2h-3z"/>
    {robe&&<path fill={c.coat} d="M9 32h14v4H7v-2h2z"/>}
    <g className="character-arm-left"><path fill="#171823" d="M6 25h4v9H5v-3H4v-4h2z"/><path fill={c.coat} d="M6 26h3v5H5v-4h1z"/><path fill={c.skin} d="M5 31h4v3H5z"/></g>
    <g className="character-arm-right"><path fill="#171823" d="M22 25h4v2h2v7h-6z"/><path fill={c.coat} d="M23 26h3v5h-3z"/><path fill={c.skin} d="M23 31h4v3h-4z"/></g>
    <g className="character-leg-left"><path fill="#171823" d="M9 35h6v4H7v-2h2z"/><path fill={c.legs} d="M9 35h5v3H8v-1h1z"/></g>
    <g className="character-leg-right"><path fill="#171823" d="M17 35h6v2h2v2h-8z"/><path fill={c.legs} d="M18 35h5v2h1v1h-6z"/></g>
  </svg>;
}
