import type { Point } from '../content';
import type { CharacterId } from './catalog';
import type { WorldMapInput, PropPlacement, CharacterPlacement, MapEvent, BuildingPlacement } from './maps';
import layout from '../../docs/production/chapter-four-gate-layout.json';
import { royalQueueLines } from '../quests/chapterScenes';
import { underseaShoreLanding } from './undersea';

// 第四章 導入「王都の関所街」。盤面・座標は docs/production/chapter-four-gate-design.md の生成JSONが正本。
export const royalGateBossNpcId='clown';
export const royalGateBossCells=layout.boss.footprint.map(([x,y])=>({x,y}));
export const royalGateEntry:Point={x:layout.entry[0],y:layout.entry[1]};
const [forecourtX1,forecourtY1,forecourtX2,forecourtY2]=layout.boss.forecourt;
export const inRoyalForecourt=(p:Point)=>p.x>=forecourtX1&&p.x<=forecourtX2&&p.y>=forecourtY1&&p.y<=forecourtY2;

// Weary townsfolk, not monsters: existing townsfolk art, greyed by CSS (.battle-foe-weary / map class).
const folk:[string,string,CharacterId][]=[
  ['待ちくたびれた商人','うつろな呼び止め','father'],['名を忘れた売り子','とぎれた名乗り','mother'],
  ['行列にはぐれた子','まだかなの袖引き','child'],['うなだれた旅人','重たい足取り','wanderer'],
  ['手配書におびえる学者','あやふやな言い訳','scholar'],['祈りを忘れた修道女','ぼんやりの祈り','priest'],
];
export const royalGateFolk=layout.enemies.map(({id,position:[x,y]},i)=>{
  const [name,attackName,chip]=folk[i%folk.length];
  return {id,name,attackName,chip,x,y};
});

const terrain=layout.terrain.map(row=>[...row].map(cell=>cell==='.'?'cityCobble' as const:'cityWall' as const));
const props:PropPlacement[]=[];
const events:MapEvent[]=[];
const characters:CharacterPlacement[]=[];
const buildings:BuildingPlacement[]=layout.houses.map(({id,position:[x,y]})=>({id,chip:'house',x,y}));
const [backX,backY]=layout.back.position;
props.push({id:'royal-back-stairs',chip:'stairs',x:backX,y:backY});
props.push({id:'royal-back-label',chip:'sign',x:backX,y:backY-.6,text:'海底の古道へ ▼'});
events.push({id:'royal-back-exit',x:backX,y:backY,trigger:'enter',label:'海底の古道へ戻る',action:{kind:'transition',to:'undersea',position:underseaShoreLanding}});
for(const {id,position:[x,y]} of layout.boards){
  props.push({id,chip:'signboardNotice',x,y});
  events.push({id:id+'-interact',x,y,trigger:'interact',label:'張り紙を読む',action:{kind:'lesson',id:'sign-royal-wanted',required:false}});
}
for(const {id,position:[x,y]} of layout.reviews){
  props.push({id:'lesson-'+id,chip:'lessonTablet',x,y,blocksMovement:true});
  events.push({id:'lesson-'+id+'-interact',x,y,trigger:'interact',label:'学者の覚え書きを読む',action:{kind:'lesson',id,required:false}});
}
const [springX,springY]=layout.haven.spring.position;
props.push({id:'royal-spring',chip:'memorySpring',x:springX,y:springY});
props.push({id:'royal-spring-label',chip:'sign',x:springX,y:springY-1.4,text:'隠れ茶屋の泉 HP・MP / 無料'});
events.push({id:'royal-spring-interact',x:springX,y:springY,trigger:'interact',label:'隠れ茶屋の泉で休む',action:{kind:'spring',name:'隠れ茶屋の泉'}});
const [hostX,hostY]=layout.haven.havenNpc.position;
characters.push({id:'royalTeahouse',role:'npc',chip:'mother',x:hostX,y:hostY,npc:{id:'royalTeahouse',name:'隠れ茶屋の女主人 ミーナ',x:hostX,y:hostY,face:'👩',
  lines:['泉の水、もう一杯どうだい。……表へ出るなら、道化と目を合わせるんじゃないよ。','行列の連中は悪くないんだ。待たされすぎて、くたびれちまっただけさ。正気に戻してやっておくれ。']}});
layout.queue.forEach(({id,position:[x,y]},i)=>characters.push({id,role:'npc',chip:(['father','mother','wanderer','child'] as const)[i%4],x,y,
  npc:{id,name:'行列の人',x,y,face:'🧑',lines:[royalQueueLines[i%royalQueueLines.length]]}}));
for(const enemy of royalGateFolk)characters.push({id:enemy.id,role:'enemy',chip:enemy.chip,x:enemy.x,y:enemy.y,
  enemy:{id:enemy.id,name:enemy.name,attackName:enemy.attackName,x:enemy.x,y:enemy.y,icon:'🧍'}});
// The clown stands on the middle of the gate-blocking cells, talked to from the forecourt.
const [bossX,bossY]=layout.boss.approach;
characters.push({id:royalGateBossNpcId,role:'npc',chip:'clown',x:bossX,y:bossY-1,npc:{id:royalGateBossNpcId,name:'道化師エヌコイールイーチ',x:bossX,y:bossY-1,face:'clown',
  lines:['お一人様ずつ、ご案内〜！ 順番は守ってね！']}});
const [signX,signY]=layout.sign.position;
props.push({id:'royal-castle-sign',chip:'signboard',x:signX,y:signY});
events.push({id:'royal-castle-sign-interact',x:signX,y:signY,trigger:'interact',label:'立て看板を読む',action:{kind:'lesson',id:'sign-royal-castle',required:false}});

export const royalGateMap:WorldMapInput={environment:'dungeon',terrain,entry:royalGateEntry,props,buildings,characters,events};
