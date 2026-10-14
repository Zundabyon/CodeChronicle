import type { Point, Npc } from '../content';
import type { TerrainId } from './catalog';
import type { WorldMapInput, PropPlacement, CharacterPlacement } from './maps';

export const mountainVillageGate:Point={x:100,y:23};
export const mountainVillageReturn:Point={x:100,y:24};
const width=24,height=20;
const terrain:TerrainId[][]=Array.from({length:height},()=>Array<TerrainId>(width).fill('grass'));
for(let y=7;y<height;y++) terrain[y][11]='road';
for(let x=4;x<=18;x++) terrain[7][x]='road';
for(let y=11;y<=15;y++) for(let x=8;x<=14;x++) terrain[y][x]='road';
for(const x of [4,18]) terrain[6][x]='road';
terrain[6][11]='road';

const props:PropPlacement[]=[];
const prop=(id:string,chip:PropPlacement['chip'],x:number,y:number,text?:string)=>props.push({id,chip,x,y,text});
for(let x=0;x<width;x++) {
  prop(`north-tree-${x}`,'tree',x,0);
  if(x!==11) prop(`south-tree-${x}`,'tree',x,height-1);
}
for(let y=1;y<height-1;y++) {prop(`west-tree-${y}`,'tree',0,y);prop(`east-tree-${y}`,'tree',width-1,y);}
prop('village-name','sign',11,17.5,'石灯の村');
prop('ledger-label','sign',4,5.4,'村の記録所');
prop('rest-label','sign',11,5.4,'休憩所');
prop('lodge-label','sign',18,5.4,'旅人の宿');
prop('exit-label','sign',11,18.6,'平原へ ▼');
prop('square-well','well',16,14);
prop('west-bench','bench',8,12);
prop('east-bench','bench',14,12);
prop('rest-wall-light','wallLantern',10.45,4.85);
prop('west-wall-light','wallLantern',3.45,4.85);
prop('east-wall-light','wallLantern',17.45,4.85);
prop('west-plant','plant',8,6);
prop('east-plant','plant',14,6);
prop('rest-books','books',13,8);
for(const [i,[x,y]] of [[3,8],[4,8],[17,8],[18,8],[7,15],[15,15],[10,16],[12,16]].entries()) prop(`village-flowers-${i}`,'flowers',x,y);

const npcs:(Npc & {chip:CharacterPlacement['chip']})[]=[
  {id:'mountainGuide',chip:'elder',name:'記録係 オル',x:4,y:7,face:'👴',lines:[
    '石灯の村へようこそ。北東の忘却の遺跡へ向かう旅人が、この村で支度をしていく。',
    '名簿に新しい村人を書くのがCreate。名簿を読むのがRead。住所を直すのがUpdate。名簿から取り除くのがDeleteじゃ。',
    '四つまとめてCRUD。難しい術に見えても、毎日の暮らしでやっていることなんじゃよ。'
  ]},
  {id:'mountainHealer',chip:'priest',name:'灯守 リオ',x:11,y:7,face:'👩🏼',lines:[
    'ようこそ。遺跡へ向かう前に、ここでひと休みしませんか。村の灯りは、旅人のためにともしています。',
    '休憩は無料です。体力と魔力を整えてから、分かれ道のある遺跡へ向かってください。'
  ]},
  {id:'mountainKeeper',chip:'wanderer',name:'宿守 ダン',x:18,y:7,face:'🧑🏽',lines:[
    '遺跡は村を出て北東。石畳をたどれば、山の向こうに門が見える。',
    '中は一本道じゃない。入口から左右に道が分かれ、脇の小部屋にも通じている。出口は南、守護者は北だ。',
    '分からなくなったら、一度村まで戻って休め。あせって奥へ進む必要はない。'
  ]},
  {id:'mountainLearner',chip:'child',name:'見習い ユナ',x:12,y:14,face:'🧒',lines:[
    'ぼくもMVCを勉強してるよ。Modelは名簿のデータを扱う係、Viewはそれを見せる係。',
    'Controllerは「名簿を見たい！」というお願いを受けて、必要な係に仕事を頼むんだ。',
    '役割を一つずつ覚えたら、三つの係がどうつながるか考えてみよう！'
  ]},
];

export const mountainVillage:WorldMapInput={
  environment:'outdoor',terrain,entry:{x:11,y:18},props,
  buildings:[
    {id:'village-ledger-house',chip:'house',x:2,y:3},
    {id:'village-rest-house',chip:'church',x:9,y:3},
    {id:'village-traveler-house',chip:'house',x:16,y:3},
  ],
  characters:npcs.map(({chip,...npc})=>({id:npc.id,role:'npc',chip,x:npc.x,y:npc.y,npc})),
  events:[{id:'village-field-exit',x:11,y:19,trigger:'enter',label:'風渡りの平原へ',action:{kind:'transition',to:'field',position:mountainVillageReturn}}],
};
