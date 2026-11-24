import type { Point } from '../content';
import type { CharacterId } from './catalog';
import type { WorldMapInput, PropPlacement, CharacterPlacement, MapEvent } from './maps';
import layout from '../../docs/production/chapter-three-undersea-layout.json';

// 第三章 序幕「海底の古道」。盤面・座標は docs/production/chapter-three-undersea-design.md の生成JSONが正本。
export const underseaVillageLanding:Point={x:3,y:7};
export const underseaBossNpcId='hedoro';
// The boss body fills the 1-cell neck; App blocks these cells until the boss falls.
export const underseaBossCells=layout.boss.footprint.map(([x,y])=>({x,y}));
export const underseaReturnLanding={x:layout.returns[1].approach[0],y:layout.returns[1].approach[1]};

// Washed-up chapter one/two foes; same sprites, renamed and tinted blue by CSS (.map-undersea / .battle-foe-undersea).
const kinds:[string,string,CharacterId][]=[
  ['漂着したスライム','塩水の粘液','slime'],['泥かぶりのミミック','泥の噛みつき','mimic'],['藻にからまる影','からまる役割','shadow'],
  ['漂着したコウモリ','泡の超音波','bat'],['泥かぶりのゴーレム','泥の一括更新','golem'],['藻にからまる骸骨','錆びた消去','skeleton'],
  ['漂着した幽霊','潮の呪い','ghost'],['泥かぶりの迷い火','濁った閃光','wisp'],['藻にからまる甲虫','貝殻の突進','beetle'],
  ['漂着したカニ','はさみの検証','crab'],
];
export const underseaEnemies=layout.enemies.map(({id,position:[x,y]},i)=>{
  const [name,attackName,chip]=kinds[i%kinds.length];
  return {id,name,attackName,chip,x,y};
});

const terrain=layout.terrain.map(row=>[...row].map(cell=>cell==='.'?'underseaFloor' as const:'underseaWall' as const));
const props:PropPlacement[]=[];
const events:MapEvent[]=[];
const characters:CharacterPlacement[]=[];
const [entryX,entryY]=layout.entry;
props.push({id:'undersea-stairs',chip:'stairs',x:entryX,y:entryY+1});
props.push({id:'undersea-stairs-label',chip:'sign',x:entryX,y:entryY+.4,text:'石灯の村へ ▼'});
events.push({id:'undersea-stairs-exit',x:entryX,y:entryY+1,trigger:'enter',label:'石灯の村へ戻る',action:{kind:'transition',to:'village',position:underseaVillageLanding}});
const deepWarp={x:entryX+1,y:entryY+1};
props.push({id:'undersea-deep-warp',chip:'lantern',...deepWarp,blocksMovement:true});
events.push({id:'undersea-deep-warp-interact',...deepWarp,trigger:'interact',label:'奥の帰還点へ飛ぶ',action:{kind:'memory-warp',dungeon:'undersea'}});
layout.returns.forEach(({id,position:[x,y]},room)=>{
  props.push({id,chip:'lantern',x,y,blocksMovement:true});
  props.push({id:id+'-label',chip:'sign',x,y:y-.65,text:'帰還点'});
  events.push({id:id+'-interact',x,y,trigger:'interact',label:'帰還点から村へ戻る',action:{kind:'memory-warp',dungeon:'undersea',room}});
});
for(const {id,position:[x,y]} of layout.reviews){
  props.push({id:'lesson-'+id,chip:'lessonTablet',x,y,blocksMovement:true});
  events.push({id:'lesson-'+id+'-interact',x,y,trigger:'interact',label:'ふり返りの石板を読む',action:{kind:'lesson',id,required:false}});
}
for(const {position:[x,y]} of layout.chests)props.push({id:`undersea-chest-${x}-${y}`,chip:'chest',x,y});
const [springX,springY]=layout.spring.position;
props.push({id:'undersea-spring',chip:'memorySpring',x:springX,y:springY});
props.push({id:'undersea-spring-label',chip:'sign',x:springX,y:springY-1.4,text:'回復泉 HP・MP / 無料'});
events.push({id:'undersea-spring-interact',x:springX,y:springY,trigger:'interact',label:'海底の泉で休む',action:{kind:'spring',name:'海底の泉'}});
const [signX,signY]=layout.sign.position;
props.push({id:'undersea-wip-sign',chip:'sign',x:signX,y:signY,text:'王都への街道 ▶（職人の町は制作中）',blocksMovement:true});
// Chapter four intro: the road east to the royal capital starts beside the sign (App gates it on the prologue).
const [roadX,roadY]=layout.sign.approach;
events.push({id:'undersea-royal-road',x:roadX,y:roadY,trigger:'enter',label:'王都への街道を進む',action:{kind:'transition',to:'royalGate'}});
export const underseaShoreLanding:Point={x:layout.exit[0],y:layout.exit[1]};
props.push({id:'undersea-exit-label',chip:'sign',x:layout.exit[0],y:layout.exit[1]-.6,text:'向こう岸の浜辺'});
for(const enemy of underseaEnemies)characters.push({id:enemy.id,role:'enemy',chip:enemy.chip,x:enemy.x,y:enemy.y,
  enemy:{id:enemy.id,name:enemy.name,attackName:enemy.attackName,x:enemy.x,y:enemy.y,icon:'🌊'}});
// Interaction needs the boss next to the forecourt, so the NPC stands on the south cell of its body.
const [bossX,bossY]=layout.boss.approach;
characters.push({id:underseaBossNpcId,role:'npc',chip:'hedoro',x:bossX,y:bossY-1,npc:{id:underseaBossNpcId,name:'ヘドロの主・スパゲッティ',x:bossX,y:bossY-1,face:'hedoro',
  lines:['ぐちゃぐちゃの泥とコードの塊が、道をふさいでいる。']}});
// Grim props along the passages (layout v2 `decor`): drips, bones, wreckage, rotten books, eyes in the dark, rusted chains.
const decorChips={drip:'underseaDrip',bones:'underseaBones',wreck:'underseaWreck',books:'underseaBooks',eyes:'underseaEyes',chains:'underseaChains'} as const;
layout.decor.forEach(({kind,position:[x,y]},i)=>props.push({id:`undersea-decor-${i}`,chip:decorChips[kind as keyof typeof decorChips],x,y,blocksMovement:false}));

export const underseaMap:WorldMapInput={environment:'dungeon',terrain,entry:{x:entryX,y:entryY},props,buildings:[],characters,events};
