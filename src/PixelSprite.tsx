type SpriteName = 'hero'|'elder'|'scholar'|'child'|'priest'|'wanderer'|'slime'|'bat'|'ghost'|'shadow'|'guardian'|'memory'|'father'|'mother'|'scroll';
type SpriteData = { rows: string[]; colors: Record<string,string> };
const sprites: Partial<Record<SpriteName,SpriteData>> = {
  hero: { rows:[
    '....hhhh....','...hhhhhh...','...hffffh...','...fefef....','...ffffff...','....ffff....','...cccccc...','..cccccccc..','..ccaccaac..','...cccccc...','...dd..dd...','..ddd..ddd..',
  ],colors:{h:'#453344',f:'#eac49b',e:'#27283d',c:'#345c78',a:'#e1c17d',d:'#382f43'} },
  elder: { rows:[
    '....hhhh....','...hhhhhh...','...hffffh...','...fefef....','...ffffff...','...wwwwww...','..wwwwwwww..','..ccwwwwcc..','..cccccccc..','...cccccc...','...dd..dd...','..ddd..ddd..',
  ],colors:{h:'#d8d3c5',f:'#d8ad89',e:'#31303b',w:'#e5e1d3',c:'#695d83',d:'#42364c'} },
  scholar: { rows:[
    '...hhhhhh...','..hhhhhhhh..','..hhffffhh..','..hfefefhh..','..hffffffh..','...hffffh...','..cccccccc..','..caccacc..','..cccccccc..','...cccccc...','...dd..dd...','..ddd..ddd..',
  ],colors:{h:'#2c3042',f:'#e0ae8e',e:'#312a35',c:'#8b5a69',a:'#e0c07b',d:'#34314a'} },
  child: { rows:[
    '............','...hhhhhh...','..hhhhhhhh..','...hffffh...','...fefef....','...ffffff...','....ffff....','..cccccccc..','..cccccccc..','...cccccc...','...dd..dd...','..ddd..ddd..',
  ],colors:{h:'#b37b50',f:'#f1c79a',e:'#342e3b',c:'#829a62',d:'#55434e'} },
  priest: { rows:[
    '....yyyy....','...ywwwwy...','..ywwwwwwy..','...wffffw...','...fefef....','...ffffff...','....ffff....','..wwwwwwww..','..wwywwyww..','..wwwwwwww..','...ww..ww...','..www..www..',
  ],colors:{y:'#d7b775',w:'#f1eadb',f:'#e3b291',e:'#3c3240'} },
  slime: { rows:[
    '............','.....pp.....','....pppp....','...pppppp...','..pppppppp..','.pppppppppp.','.ppweppwepp.','.pppppppppp.','..pppppppp..','...pppppp...','....dddd....','............',
  ],colors:{p:'#d58ca3',w:'#fff0e6',e:'#473447',d:'#8f5d77'} },
  bat: { rows:[
    '............','pp........pp','ppp......ppp','pppp.pp.pppp','.pppppppppp.','..pppppppp..','...pweewp...','....pppp....','...pp..pp...','..pp....pp..','............','............',
  ],colors:{p:'#77618b',w:'#eee2d5',e:'#d8a26f'} },
  ghost: { rows:[
    '....bbbb....','...bbbbbb...','..bbbbbbbb..','..bbbbbbbb..','..bbweewbb..','..bbbbbbbb..','..bbbbbbbb..','...bbbbbb...','...bbbbbb...','..bb.bb.bb..','..b...b..b..','............',
  ],colors:{b:'#a7d3cf',w:'#f4f6e8',e:'#284657'} },
  shadow: { rows:[
    '....pppp....','...pppppp...','..pppppppp..','..pppppppp..','..ppreerpp..','..pppppppp..','...pppppp...','..pppppppp..','..pppppppp..','...pppppp...','....p..p....','............',
  ],colors:{p:'#6b557e',r:'#da7995',e:'#f7bd84'} },
  guardian: { rows:[
    '..yyy..yyy..','..yyyyyyyy..','...yppppy...','..pppppppp..','..ppweewpp..','..pppppppp..','...yppppy...','..yyyyyyyy..','.yyypyyypyy.','..yy.yyyy...','..dd.dd.dd..','.ddd.dd.ddd.',
  ],colors:{y:'#d9b870',p:'#5d425f',w:'#fff0d2',e:'#e78d77',d:'#332e4b'} },
  memory: { rows:[
    '............','.....yy.....','....yyyy....','...yyyyyy...','..yyywwyyy..','..yyweewyy..','..yyywwyyy..','...yyyyyy...','....yyyy....','.....yy.....','............','............',
  ],colors:{y:'#e8c886',w:'#f8ecce',e:'#a17d91'} },
  father: { rows:[
    '...hhhhhh...','..hhhhhhhh..','..hhffffhh..','...fefef....','...ffffff...','....hhhh....','..cccccccc..','..ccaccacc..','..cccccccc..','...cccccc...','...dd..dd...','..ddd..ddd..',
  ],colors:{h:'#503849',f:'#d2a17f',e:'#2d2a3a',c:'#6b536c',a:'#dab780',d:'#3b3044'} },
  mother: { rows:[
    '...hhhhhh...','..hhhhhhhh..','..hhffffhh..','..hfefefhh..','..hffffffh..','...hffffh...','..cccccccc..','..ccaccaac..','..cccccccc..','...cccccc...','...dd..dd...','..ddd..ddd..',
  ],colors:{h:'#5b3b45',f:'#edbd96',e:'#38303d',c:'#75848b',a:'#cfb37f',d:'#443346'} },
  scroll: { rows:[
    '..yyyyyyyy..','.ywwwwwwwwy.','.ywwwwwwwwy.','.ywwddddwwy.','.ywwwwwwwwy.','.ywwddddwwy.','.ywwwwwwwwy.','.ywwddddwwy.','.ywwwwwwwwy.','..yyyyyyyy..','............','............',
  ],colors:{y:'#b8945e',w:'#e8d8ad',d:'#866d59'} },
};

const rasterSprites: Partial<Record<SpriteName,string>> = {
  hero:'/sprites/hero-64.png',
  elder:'/sprites/elder-64.png',
  scholar:'/sprites/scholar-64.png',
  child:'/sprites/child-64.png',
  priest:'/sprites/priest-64.png',
  wanderer:'/sprites/wanderer-64.png',
  slime:'/sprites/slime-64.png',
  bat:'/sprites/bat-64.png',
  ghost:'/sprites/ghost-64.png',
  shadow:'/sprites/shadow-64.png',
  guardian:'/sprites/guardian-64.png',
  memory:'/sprites/ghost-64.png',
  father:'/sprites/father-64.png',
  mother:'/sprites/mother-64.png',
};

export function PixelSprite({name,className=''}:{name:SpriteName;className?:string}) {
  const raster=rasterSprites[name];
  if(raster) return <img className={`pixel-sprite ${className}`} src={`${import.meta.env.BASE_URL}${raster.slice(1)}`} alt="" aria-hidden="true" draggable={false}/>;
  const sprite=sprites[name]!;
  return <svg className={`pixel-sprite ${className}`} viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    {sprite.rows.flatMap((row,y)=>[...row].map((pixel,x)=>pixel==='.'?null:<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={sprite.colors[pixel]??'#fff'}/>))}
  </svg>;
}

export function npcSprite(id:string):SpriteName { return id==='elder'?'elder':id==='scholar'||id==='assistant'?'scholar':id==='child'||id==='elderKin'?'child':id==='wanderer'?'wanderer':id==='childMother'||id==='innkeeper'?'mother':'priest'; }
export function enemySprite(id:string):SpriteName { return id==='boss'?'guardian':id==='after-gate'?'memory':id==='review'?'shadow':id==='f1'?'slime':id==='f2'?'bat':id==='f3'||id==='d2'?'ghost':'shadow'; }
export function faceSprite(face:string):SpriteName { return face==='🗡️'?'hero':face==='👴'?'elder':face==='👩🏻‍🎓'?'scholar':face==='🧒'?'child':face==='👩🏼'?'priest':face==='🧑🏽'?'wanderer':face==='🧔'?'father':face==='👩'?'mother':'scroll'; }
