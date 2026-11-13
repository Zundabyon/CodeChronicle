import type { Area, Point } from '../content';
import type { TerrainId, PropId } from './catalog';
import { memoryDungeonLayouts } from './memoryDungeonLayouts';
export type MemoryDungeon = {
  key:'c'|'r'|'u'|'d'; operation:string; area:Area; name:string; region:string;
  gate:Point; color:string; floor:TerrainId; theme:PropId; summary:string;
  path:number[][]; trials:number[][]; doors:number[][]; roomNames:string[];
};
type MemoryDungeonInfo = Omit<MemoryDungeon,'path'|'trials'|'doors'>;
const info:MemoryDungeonInfo[] = [
  {key:'c',operation:'Create',area:'crudCreate',name:'創生の工房',region:'深緑の森',gate:{x:32,y:55},color:'#eebd71',floor:'creationFloor',theme:'crate',
    summary:'新しい命を名簿へ。入力を確かめ、記録を保存する。',
    roomNames:['登録画面の間：create','入力と検証の間：store','保存結果の間：store','失敗と再入力の間','登録をつなぐ実践の間']},
  {key:'r',operation:'Read',area:'crudRead',name:'読解の書庫',region:'鏡の湖',gate:{x:49,y:20},color:'#93c9ff',floor:'readingFloor',theme:'shelf',
    summary:'眠る記録を読み解く。条件と取得結果を照合する。',
    roomNames:['一覧の間：index','一覧と条件の間：index','詳細の間：show','存在しない記録の間','読む流れの実践の間']},
  {key:'u',operation:'Update',area:'crudUpdate',name:'改変の回廊',region:'石鳴り山脈',gate:{x:90,y:30},color:'#95e3c7',floor:'updatingFloor',theme:'books',
    summary:'書き換えの術を学ぶ。対象を絞り、変化を確かめる。',
    roomNames:['編集画面の間：edit','変更を検証する間：update','対象を絞る間：update','保存結果を確かめる間','編集をつなぐ実践の間']},
  {key:'d',operation:'Delete',area:'crudDelete',name:'忘却の墓所',region:'陽炎の砂漠',gate:{x:100,y:66},color:'#c5a6ee',floor:'deletionFloor',theme:'lantern',
    summary:'残すべき記憶を守る。不要な行だけを見極めて消す。',
    roomNames:['削除対象を選ぶ間','削除リクエストの間：destroy','対象を絞る間：destroy','削除結果を確かめる間','残す記録を守る実践の間']},
];
// Route, seals and doors come from the v2 layout so every consumer shares one set of coordinates.
export const memoryDungeons:MemoryDungeon[] = info.map(d=>{
  const {path,trials,doors}=memoryDungeonLayouts[d.key];
  return {...d,path,trials,doors};
});
export const trialNpcId=(key:string,index:number)=>'memory-'+key+'-trial-'+index;
export const altarNpcId=(key:string)=>'memory-'+key+'-altar';
