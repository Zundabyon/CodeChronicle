import type { Area } from '../content';
import type { TerrainId } from './catalog';
import type { WorldMapInput, CharacterPlacement, PropPlacement, MapEvent } from './maps';
import { memoryEnemyInstanceId } from './memoryEnemyIdentity';
import { memoryDungeons, trialNpcId, altarNpcId } from './memoryDungeons';
import { memoryDungeonLayouts } from './memoryDungeonLayouts';

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

// Board, seals, lessons, returns, spring, foes and travelers follow the v2 layout
// (docs/production/chapter-two-dungeons-v2-design.md). Interact events stop movement into
// their tile, so objects the route must pass (returns, spring, entrance warp) sit in the
// wall beside the v2 coordinate, which stays a walkable standing and landing tile.
export const memoryDungeonMaps:Partial<Record<Area,WorldMapInput>>=Object.fromEntries(memoryDungeons.map(dungeon=>{
  const layout=memoryDungeonLayouts[dungeon.key];
  const terrain:TerrainId[][]=layout.terrain.map(row=>[...row].map(cell=>cell==='.'?dungeon.floor:'stoneWall'));
  const [guideX,guideY]=layout.npcs.guide;
  // The v2 guide stands in a sealed pocket; open the cell toward the entrance corridor so it can be addressed.
  terrain[guideY][guideX+1]=dungeon.floor;
  const props:PropPlacement[]=[];
  const characters:CharacterPlacement[]=[];
  const events:MapEvent[]=[];
  layout.doors.forEach(([doorX,doorY],i)=>{
    const [x,y]=layout.trials[i],id=trialNpcId(dungeon.key,i);
    characters.push({id,role:'npc',chip:'wisp',x,y,npc:{id,name:dungeon.name+'・第'+(i+1)+'の封印',x,y,face:'📜',lines:[
      dungeon.roomNames[i]+'。この部屋の実習をすべて解くと、北の封印扉が開く。',
      '石灯の村のオルから第二章の依頼を受け、名簿の控えを見つけてから挑戦しよう。途中でも答えたところから再開できる。',
    ]}});
    const [entryX,entryY]=layout.roomEntries[i];
    props.push({id:'room-title-'+i,chip:'sign',x:entryX,y:entryY-1.6,text:(i+1)+'/5 '+dungeon.roomNames[i]});
    props.push({id:'trial-label-'+i,chip:'sign',x,y:y-1,text:'第'+(i+1)+'の封印'});
    props.push({id:'door-'+i,chip:'memoryDoor',x:doorX,y:doorY,blocksMovement:false});
    props.push({id:'door-label-'+i,chip:'sign',x:doorX,y:doorY-.65,text:'第'+(i+1)+'の封印扉'});
    const [returnX,returnY]=layout.returns[i],returnPoint={x:returnX+1,y:returnY};
    props.push({id:'return-point-'+i,chip:'lantern',...returnPoint,blocksMovement:true});
    props.push({id:'return-label-'+i,chip:'sign',x:returnPoint.x,y:returnPoint.y-.65,text:'帰還点'});
    events.push({id:'return-point-'+i+'-interact',...returnPoint,trigger:'interact',label:'帰還点から村へ戻る',action:{kind:'memory-warp',dungeon:dungeon.key,room:i}});
    for(const trigger of ['enter','interact'] as const)events.push({
      id:'door-'+i+'-'+trigger,x:doorX,y:doorY,trigger,label:'第'+(i+1)+'の封印扉',action:{kind:'memory-door',npcId:id},
    });
  });
  for(const {id,required,position:[x,y]} of layout.explanations){
    const label=required?'解説を読む':'解説の石板を読む';
    if(!required)props.push({id:'lesson-'+id,chip:'lessonTablet',x,y,blocksMovement:true});
    events.push({id:'lesson-'+id+'-'+(required?'enter':'interact'),x,y,trigger:required?'enter':'interact',label,action:{kind:'lesson',id,required}});
  }
  const npc=(id:string,chip:'wanderer'|'scholar',name:string,[x,y]:[number,number],lines:string[])=>
    characters.push({id,role:'npc',chip,x,y,npc:{id,name,x,y,face:'🧑',lines}});
  npc('memory-'+dungeon.key+'-guide','scholar','道案内の学者',layout.npcs.guide,[
    dungeon.name+'へようこそ。'+dungeon.summary,
    '北へ進み、五つの実習部屋で封印を解こう。それぞれの部屋の北の扉は、その部屋の問題をすべて解くと開く。最奥の祭壇で記憶の欠片を受け取れる。',
    '第3室の西の休憩所には無料の回復泉がある。脇道の魔物は任意の腕試し。戦わずに学習を進めてもよい。',
    'この旅は画面を持つ通常のRoute::resourceを学ぶ。C・R・U・Dの四つの操作を、Laravelでは七つのアクションに分けている。',
  ]);
  npc('memory-'+dungeon.key+'-adventurer','wanderer','名簿を学ぶ冒険者',layout.npcs.adventurer,[
    '泉で休みながら、操作前と操作後の名簿を想像しているんだ。',...advice[dungeon.key],
  ]);
  npc('memory-'+dungeon.key+'-api-traveler','scholar','APIを旅する学者',layout.npcs['api-traveler'],[
    'ここで学ぶのは、HTMLの画面を持つ通常のリソースコントローラだ。',
    'API用のapiResourceでは、フォーム画面を表示するcreateとeditを除いた五つになる。保存用のstoreとupdateは残る。',
    '七つの名前を暗記するだけでなく、画面を開く操作とデータを書き換える操作を区別しよう。',
  ]);
  // West wall one row south of the v2 spring tile, so the tablet north and the adventurer east of it stay reachable.
  const spring={x:layout.spring[0]-1,y:layout.spring[1]+1};
  props.push({id:'rest-spring',chip:'memorySpring',...spring});
  props.push({id:'rest-label',chip:'sign',x:spring.x,y:spring.y-1.4,text:'回復泉 HP・MP / 無料'});
  events.push({id:'rest-spring-interact',...spring,trigger:'interact',label:'記憶の回復泉で休む',action:{kind:'spring',name:'記憶の回復泉'}});
  // Four individuals per species keep the original IDs (copy 0) and add -copy-1..3; room 3 has none.
  for(const {species,copy,position:[x,y]} of layout.enemies){
    const [name,attackName,chip]=enemies[dungeon.key][species];
    const id=memoryEnemyInstanceId('memory-'+dungeon.key+'-enemy-'+species,copy);
    characters.push({id,role:'enemy',chip,x,y,enemy:{id,name,attackName,x,y,icon:species===0?'👾':'👻'}});
  }
  const id=altarNpcId(dungeon.key),[altarX,altarY]=layout.altar;
  characters.push({id,role:'npc',chip:'memory',x:altarX,y:altarY,npc:{id,name:dungeon.operation+'の記憶の祭壇',x:altarX,y:altarY,face:'📜',lines:[
    '五つの封印を越えた旅人よ。「'+dungeon.operation+'」の記憶を確かめよう。',
  ]}});
  props.push({id:'altar-title',chip:'sign',x:altarX,y:altarY-1.5,text:dungeon.key.toUpperCase()+'の記憶の欠片'});
  const [entryX,entryY]=layout.entry,deepWarp={x:entryX+1,y:entryY};
  props.push({id:'deep-warp',chip:'lantern',...deepWarp,blocksMovement:true});
  props.push({id:'deep-warp-label',chip:'sign',x:deepWarp.x,y:deepWarp.y-.65,text:'奥への帰還点'});
  events.push({id:'deep-warp-interact',...deepWarp,trigger:'interact',label:'到達した一番奥の部屋へ飛ぶ',action:{kind:'memory-warp',dungeon:dungeon.key}});
  const [exitX,exitY]=layout.exit;
  props.push({id:'entrance-name',chip:'sign',x:exitX,y:exitY-.4,text:dungeon.name+' / 出口 ▼'});
  const map:WorldMapInput={environment:'dungeon',terrain,entry:{x:entryX,y:entryY},props,buildings:[],characters,events:[...events,
    {id:'return-to-field',x:exitX,y:exitY,trigger:'enter',label:'風渡りの平原へ',
      action:{kind:'transition',to:'field',position:{x:dungeon.gate.x,y:dungeon.gate.y+1}}},
  ]};
  return [dungeon.area,map];
}));
