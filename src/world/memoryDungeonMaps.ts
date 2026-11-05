import type { Area } from '../content';
import type { TerrainId } from './catalog';
import type { WorldMapInput, CharacterPlacement, PropPlacement, MapEvent } from './maps';
import { memoryEnemyInstanceId } from './memoryEnemyIdentity';
import { memoryDungeons, trialNpcId, altarNpcId } from './memoryDungeons';

const advice = {
  c: ['createは登録フォームを表示するだけ。POSTを受けるstoreが入力を検証し、新しい記録を保存する。', '保存に失敗したら、入力エラーを直してもう一度。フォームを開いた回数だけ記録が増えることはない。'],
  r: ['indexは一覧、showは特定の1件。画面が似ていても、受け取る対象と渡すデータの形が違う。', '見つからないIDを指定されたとき、findOrFailは404にする。別の村人の記録を代わりに見せないことが大切だ。'],
  u: ['editは現在の値が入った編集画面を表示する。PATCHやPUTを受けるupdateで、検証した変更を保存する。', '住所を直す前に、誰の住所かIDで確かめよう。条件のない一括更新は、村じゅうの住所を書き換えてしまう。'],
  d: ['destroyは対象を特定して削除する処理。確認画面を表示しただけでは、名簿を消さない。', '同姓同名でも別の村人かもしれない。消すべき重複行のIDを確かめ、残す記録が残ったかも確認しよう。'],
};
const enemies = {
  c: [['未検証のミミック','入力すり抜け','mimic'],['二重登録の影','重複の刻印','shadow'],['未保存のスライム','保存忘れの粘液','slime']],
  r: [['一覧まぎれの幽霊','単数複数の霧','ghost'],['見失いの迷い火','見つからぬID','wisp'],['条件違いのコウモリ','絞り込みの迷霧','bat']],
  u: [['一括更新のゴーレム','全件書き換え','golem'],['古い住所の影','更新忘れ','shadow'],['追記まぎれのミミック','追記のすり替え','mimic']],
  d: [['全件削除の骸骨','条件なき消去','skeleton'],['取り違えの幽霊','別人の記憶','ghost'],['削除忘れのゴーレム','見せかけの消去','golem']],
} as const;

// Each horizontal wall is solid except for one gated cell. Side alcoves never
// connect across room boundaries, so every seal must open its own physical door.
export const memoryDungeonMaps:Partial<Record<Area,WorldMapInput>>=Object.fromEntries(memoryDungeons.map(dungeon=>{
  const width=31,height=63;
  const terrain:TerrainId[][]=Array.from({length:height},()=>Array<TerrainId>(width).fill('stoneWall'));
  const room=(left:number,top:number,right:number,bottom:number)=>{
    for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++)terrain[y][x]=dungeon.floor;
  };
  room(11,58,19,61);room(13,62,17,62);room(11,1,19,7);
  const props:PropPlacement[]=[];
  const characters:CharacterPlacement[]=[];
  const events:MapEvent[]=[];
  dungeon.doors.forEach(([doorX,doorY],i)=>{
    room(5,doorY+1,25,doorY+9);
    room(2,doorY+3,4,doorY+6);room(26,doorY+3,28,doorY+6);
    terrain[doorY][doorX]=dungeon.floor;
    const [x,y]=dungeon.trials[i],id=trialNpcId(dungeon.key,i);
    characters.push({id,role:'npc',chip:'wisp',x,y,npc:{id,name:dungeon.name+'・第'+(i+1)+'の封印',x,y,face:'📜',lines:[
      dungeon.roomNames[i]+'。この部屋の実習をすべて解くと、北の封印扉が開く。',
      '石灯の村のオルから第二章の依頼を受け、名簿の控えを見つけてから挑戦しよう。途中でも答えたところから再開できる。',
    ]}});
    props.push({id:'room-title-'+i,chip:'sign',x:15,y:doorY+1.6,text:(i+1)+'/5 '+dungeon.roomNames[i]});
    props.push({id:'trial-label-'+i,chip:'sign',x,y:y-1,text:'第'+(i+1)+'の封印'});
    props.push({id:'trial-decor-'+i,chip:dungeon.theme,x:23,y:doorY+7});
    props.push({id:'door-'+i,chip:'memoryDoor',x:doorX,y:doorY,blocksMovement:false});
    props.push({id:'door-label-'+i,chip:'sign',x:doorX,y:doorY-.65,text:'第'+(i+1)+'の封印扉'});
    props.push({id:'room-lamp-'+i,chip:'lantern',x:6,y:doorY+2});
    for(const trigger of ['enter','interact'] as const)events.push({
      id:'door-'+i+'-'+trigger,x:doorX,y:doorY,trigger,label:'第'+(i+1)+'の封印扉',action:{kind:'memory-door',npcId:id},
    });
  });
  const npc=(id:string,chip:'wanderer'|'scholar',name:string,x:number,y:number,lines:string[])=>
    characters.push({id,role:'npc',chip,x,y,npc:{id,name,x,y,face:'🧑',lines}});
  npc('memory-'+dungeon.key+'-guide','scholar','道案内の学者',12,59,[
    dungeon.name+'へようこそ。'+dungeon.summary,
    '北へ進み、五つの実習部屋で封印を解こう。それぞれの部屋の北の扉は、その部屋の問題をすべて解くと開く。最奥の祭壇で記憶の欠片を受け取れる。',
    '第3室の西の休憩所には無料の回復泉がある。脇部屋の魔物は任意の腕試し。戦わずに学習を進めてもよい。',
    'この旅は画面を持つ通常のRoute::resourceを学ぶ。C・R・U・Dの四つの操作を、Laravelでは七つのアクションに分けている。',
  ]);
  npc('memory-'+dungeon.key+'-adventurer','wanderer','名簿を学ぶ冒険者',27,34,[
    '泉で休みながら、操作前と操作後の名簿を想像しているんだ。',...advice[dungeon.key],
  ]);
  npc('memory-'+dungeon.key+'-api-traveler','scholar','APIを旅する学者',3,14,[
    'ここで学ぶのは、HTMLの画面を持つ通常のリソースコントローラだ。',
    'API用のapiResourceでは、フォーム画面を表示するcreateとeditを除いた五つになる。保存用のstoreとupdateは残る。',
    '七つの名前を暗記するだけでなく、画面を開く操作とデータを書き換える操作を区別しよう。',
  ]);
  props.push({id:'rest-spring',chip:'memorySpring',x:3,y:34});
  props.push({id:'rest-label',chip:'sign',x:3,y:32.6,text:'回復泉 HP・MP / 無料'});
  events.push({id:'rest-spring-interact',x:3,y:34,trigger:'interact',label:'記憶の回復泉で休む',action:{kind:'spring',name:'記憶の回復泉'}});
  // Four individuals per species; the original three IDs and origins remain stable.
  // Rooms 1, 2, 4 and 5 each contain three optional foes. Room 3 is a safe rest stop.
  // The two-cell territory stays away from the central route and all sealed doors.
  const enemyOrigins = [
    [[3,44],[3,54],[3,24],[3,12]],
    [[27,24],[27,54],[27,44],[25,12]],
    [[27,14],[5,52],[5,42],[25,22]],
  ];
  enemies[dungeon.key].forEach(([name,attackName,chip],species)=>{
    enemyOrigins[species].forEach(([x,y],copy)=>{
      const id=memoryEnemyInstanceId('memory-'+dungeon.key+'-enemy-'+species,copy);
      characters.push({id,role:'enemy',chip,x,y,enemy:{id,name,attackName,x,y,icon:species===0?'👾':'👻'}});
    });
  });
  const id=altarNpcId(dungeon.key);
  characters.push({id,role:'npc',chip:'memory',x:15,y:3,npc:{id,name:dungeon.operation+'の記憶の祭壇',x:15,y:3,face:'📜',lines:[
    '五つの封印を越えた旅人よ。「'+dungeon.operation+'」の記憶を確かめよう。',
  ]}});
  props.push({id:'altar-title',chip:'sign',x:15,y:1.5,text:dungeon.key.toUpperCase()+'の記憶の欠片'});
  props.push({id:'entrance-name',chip:'sign',x:15,y:60.6,text:dungeon.name+' / 出口 ▼'});
  const map:WorldMapInput={environment:'dungeon',terrain,entry:{x:15,y:60},props,buildings:[],characters,events:[...events,
    {id:'return-to-field',x:15,y:62,trigger:'enter',label:'風渡りの平原へ',
      action:{kind:'transition',to:'field',position:{x:dungeon.gate.x,y:dungeon.gate.y+1}}},
  ]};
  return [dungeon.area,map];
}));
