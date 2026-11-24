import { chapterTwoLessons } from './chapterTwoLessons';
import { chapterTwoOpening, chapterTwoAttack, chapterTwoFound, chapterTwoEnding, chapterThreeDeparture, hedoroBeforeBattle, hedoroDefeated, royalGateHaven, clownBeforeBattle, clownDefeated, fumiTalk, villagerTalk } from './chapterScenes';
import type { QuestDefinition, QuestStates } from './types';
export const questDefinitions:QuestDefinition[]=[
  {
    id:'library-signboard',category:'side',title:'住民の依頼：図書館の案内板',
    description:'案内板の修理を手伝い、URLと処理の行き先をつなぐしくみを学ぼう。',npcId:'assistant',npcLocation:'図書館 西棟1階の司書見習い',
    offer:'図書館の案内板で、URLと処理の行き先が混ざってしまったの。学びながら修理を手伝ってくれない？',acceptLabel:'案内板の修理を手伝う',
    acceptResponse:'ありがとう！ 東棟2階「ルート」の「01 URLに応答する」を読んで既読にして、確認問題に正解してほしいの。URLと処理の対応が分かったら、ここへ報告してね。',
    reportLabel:'案内板の修理を報告する',reportResponse:'そう、URLと処理をつなぐのはルート！ 案内板の行き先を直せたわ。ありがとう。お礼に40Gとやくそうを受け取って。',completedText:'案内板は今日も元気よ。手伝ってくれてありがとう。',
    steps:[
      {id:'read-route',title:'ルートの本を読む',description:'東棟2階「ルート」の「01 URLに応答する」を読んで既読にする。',trigger:{type:'book-read',bookId:'laravel-routes-01'}},
      {id:'practice-route',title:'本の確認問題を解く',description:'その本の確認問題に正解する。',requiresReadBook:'laravel-routes-01',trigger:{type:'question-answered',questionId:'l-b-1',correct:true,source:'book'}},
      {id:'report',title:'成果を報告する',description:'西棟1階の司書見習いへ報告する。',trigger:{type:'reported',npcId:'assistant'}},
    ],reward:{gold:40,items:{herb:1}},
  },
  {
    id:'cursed-book',category:'side',title:'旅人の依頼：嫌な予感のする本',
    description:'平原の東の草むらに落ちている「妙な本」を確かめよう。開くかどうかは、自分で決めること。',npcId:'wanderer',npcLocation:'風渡りの平原の旅人ロイ',requiresFirstChapter:true,
    offer:'なあ、東の草むらに妙な本が落ちてるんだ。魔物の名前と強さがびっしり書いてある……らしい。拾おうとしたら、表紙が「ぎょろり」とこっちを見た気がしてな。腕に自信があるなら、確かめてきてくれないか？',
    acceptLabel:'本を確かめに行く',acceptResponse:'助かる。場所は俺のいるところから北東、草の濃いあたりだ。……嫌な予感がしたら、無理に開くなよ。',
    reportLabel:'本のことを報告する',reportResponse:'なんだって、本そのものがミミックだったのか！ しかも倒したら、中身はちゃんとした魔物の図鑑……。持っていけよ。お前が持つのが一番だ。',
    completedText:'あの図鑑、まだ噛みついてこないか？ ……そうか、ならいい。',
    steps:[
      {id:'defeat-mimic',title:'嫌な予感のする本を確かめる',description:'旅人ロイの北東、草むらに落ちている本を調べる。',npcId:'mimic-book',trigger:{type:'battle-won',enemyId:'mimic-book'},
        lines:[{speaker:'語り手',face:'📜',text:'草むらに、分厚い本が落ちている。革の表紙が、かすかに脈打っている……。',shake:true},{speaker:'語り手',face:'📜',text:'何やら嫌な予感がする……。'}],
        after:[{speaker:'語り手',face:'📜',text:'本は牙をおさめ、ぱたりと閉じた。表紙に金の文字が浮かぶ。「モンスター図鑑」。'},{speaker:'語り手',face:'📜',text:'旅人ロイに報告しよう。'}]},
      {id:'report',title:'旅人ロイに報告する',description:'平原の旅人ロイに、本の正体を伝える。',trigger:{type:'reported',npcId:'wanderer'}},
    ],reward:{gold:120,items:{}},
  },
  {
    id:'village-ledger',category:'chapter',startLabel:'第二章「消えた名簿」を始める',title:'第二章：消えた名簿',description:'記録卿グラフィウスに裂かれた名簿を、四つの幕で取り戻す。読む→作る→直す→消すの順にダンジョンの封印を解き、村を荒らす悪レンジャーとの戦いで学んだ操作を試す。最後はグラフィウスとの決戦。',npcId:'mountainGuide',npcLocation:'石灯の村の記録係オル',requiresFirstChapter:true,startAt:'town',opening:chapterTwoOpening,
    pauseResponse:'ここまでの記憶は残っている。同じ封印に触れれば、続きから挑める。',completionObjective:'村人の暮らしを支える記録を取り戻した。自由に探索を続けよう。',completedText:'名簿は元通りじゃ。名前を呼び合う声が戻った。ありがとう、忘れぬよう書き留めておくよ。',
    steps:[
      {id:'visit-village',title:'第二章：消えた名簿',description:'平原の北東、石灯の村へ向かおう。',trigger:{type:'npc-talked',npcId:'mountainGuide'},lines:chapterTwoAttack},
      {id:'find-copy',title:'第二章：名簿の控えを探す',description:'忘却の遺跡の東の小部屋で宝箱を調べよう。開けたことがある箱も確かめよう。',reminder:'遺跡の東の小部屋の宝箱じゃ。控えが見つかったら、ここへ戻っておいで。',trigger:{type:'chest-examined',chestId:'dungeon:19,5'},after:chapterTwoFound},
      ...chapterTwoLessons,
      {id:'return-names',title:'第二章：名簿を取り戻した',description:'四つの欠片と控えを持って石灯の村のオルに話しかけ、名簿を復元しよう。',trigger:{type:'npc-talked',npcId:'mountainGuide'},lines:chapterTwoEnding},
    ],reward:{gold:70,items:{ether:1}},
  },
  {
    // Starts by itself when chapter two completes (engine: requiresQuest). Older finished saves get Ol's offer.
    id:'undersea-prologue',category:'chapter',startLabel:'第三章 序幕「海底の古道」を始める',title:'第三章 序幕：海底の古道',description:'父の古い依頼書の宛先を確かめるため、記録所の地下から海の下を抜ける古い地下道を通り、海の向こうの大陸へ渡る。',
    npcId:'mountainGuide',npcLocation:'石灯の村の記録係オル',requiresFirstChapter:true,requiresQuest:'village-ledger',opening:chapterThreeDeparture,
    offer:'そなたに見てほしいものがある。名簿の奥から古い紙が出てきたのじゃ。見てくれんか。',acceptLabel:'古い紙を見る',acceptResponse:'これは……依頼書じゃな。',
    completionObjective:'海の向こうの大陸に着いた。この先の職人の町は制作中です。',completedText:'向こう岸に着いたか。父上の依頼の宛先、きっと見つかる。',
    steps:[
      {id:'enter-undersea',title:'第三章 序幕：記録所の地下へ',description:'石灯の村の記録所（西の建物）の脇にある地下への階段から、海底の古道へ降りよう。',trigger:{type:'place-reached',placeId:'undersea-entrance'}},
      {id:'cross-tunnel',title:'第三章 序幕：海底の古道を進む',description:'海の下の長い地下道を北へ進もう。脇の小部屋には、これまでの学びをふり返る石板がある。',trigger:{type:'place-reached',placeId:'undersea-tunnel'}},
      {id:'defeat-hedoro',title:'第三章 序幕：ヘドロの主を倒す',description:'道をふさぐ「ヘドロの主・スパゲッティ」に話しかけ、ぐちゃぐちゃの処理を読み解こう。',npcId:'hedoro',trigger:{type:'battle-won',enemyId:'hedoro'},lines:hedoroBeforeBattle,after:hedoroDefeated},
      {id:'reach-shore',title:'第三章 序幕：向こう岸へ',description:'ひらけた道を北へ抜け、海の向こうの大陸の浜辺へ出よう。',trigger:{type:'place-reached',placeId:'undersea-shore'}},
    ],reward:{gold:50,items:{potion:1}},
  },
  {
    id:'royal-gate-intro',category:'chapter',title:'第四章 導入：王都の関所街',description:'浜辺から街道を東へ。寂れた商業王国の王都で、道化師エヌコイールイーチが関所の行列を止めている。疲れ切った住人を正気に戻し、道化師に挑もう。',
    npcId:'royalTeahouse',npcLocation:'王都の関所街の隠れ茶屋',requiresFirstChapter:true,requiresQuest:'undersea-prologue',
    opening:[{speaker:'語り手',face:'📜',text:'浜辺の古い立て看板のそばから、潮風に削られた街道が東へ延びている。遠くに、高い城壁の影が見えた。'},{speaker:'語り手',face:'📜',text:'第四章 導入「王都の関所街」。看板を調べてから、街道を東へ進もう。'}],
    completionObjective:'関所の行列がはけた。この先の王城は制作中です。',completedText:'行列がはけて、街に少しだけ声が戻ったよ。ありがとうね。',
    steps:[
      {id:'reach-gate',title:'第四章 導入：王都へ',description:'浜辺の看板のそばから街道を東へ進み、王都の関所街に入ろう。',trigger:{type:'place-reached',placeId:'royal-gate-arrival'}},
      {id:'meet-haven',title:'第四章 導入：隠れ茶屋で話を聞く',description:'入口の北、路地の奥にある隠れ茶屋の女主人ミーナに話しかけよう。泉で休むこともできる。',npcId:'royalTeahouse',trigger:{type:'npc-talked',npcId:'royalTeahouse'},lines:royalGateHaven},
      {id:'defeat-clown',title:'第四章 導入：道化師に挑む',description:'待たされて疲れ切った住人たちを正気に戻しながら北の城門へ。道化師エヌコイールイーチに話しかけよう。',npcId:'clown',trigger:{type:'battle-won',enemyId:'clown'},lines:clownBeforeBattle,after:clownDefeated},
    ],reward:{gold:120,items:{ether:1}},
  },
];
export const questDefinition=(id:string)=>questDefinitions.find(def=>def.id===id);
const actMarks=['visit-village','battle-r','battle-c','battle-u','battle-d','battle-graphius'];
/** How many `marks` (step ids) a quest has moved past: -1 before it starts, marks.length once complete. Shared by every chapter. */
export function questPhase(quests:QuestStates,questId:string,marks:readonly string[]):number {
  const def=questDefinition(questId)!,step=quests[questId]?.step;
  if(!step)return -1;
  if(step==='complete')return marks.length;
  const index=def.steps.findIndex(s=>s.id===step);
  return marks.filter(id=>def.steps.findIndex(s=>s.id===id)<index).length;
}
/** Chapter phase: 0 before the attack, then one per act boundary passed, fumiTalk.length-1 once complete. */
function chapterTwoPhase(quests:QuestStates):number {
  return quests['village-ledger']?.step==='complete'?fumiTalk.length-1:Math.max(0,questPhase(quests,'village-ledger',actMarks));
}
/** Fumi's line follows how many act boundaries the chapter has passed. */
export const fumiLine=(quests:QuestStates)=>fumiTalk[chapterTwoPhase(quests)];
/** Village folk's lines for the current chapter phase, or undefined for their peacetime lines. */
export const villagerLines=(npcId:string,quests:QuestStates):string[]|undefined=>villagerTalk[npcId]?.[chapterTwoPhase(quests)-1];
/** Act count passed in the village-ledger chapter, or -1 when it is not running. */
export function chapterTwoAct(quests:QuestStates):number {
  return quests['village-ledger']?.step==='complete'?-1:questPhase(quests,'village-ledger',actMarks);
}
const foeOrder=['ranger-read','ranger-create','ranger-update','ranger-delete','graphius'];
/** Village foes: `foe-<id>` stands in the square during its battle step, `taunt-<id>` on the outskirts earlier in its act. */
export function villageFoeVisible(npcId:string,quests:QuestStates):boolean {
  if(npcId==='mimic-book')return quests['cursed-book']?.step==='defeat-mimic';
  if(npcId==='clown')return quests['royal-gate-intro']?.step!=='complete';
  if(npcId==='hedoro')return !['reach-shore','complete'].includes(quests['undersea-prologue']?.step??'');
  const match=/^(foe|taunt)-(.+)$/.exec(npcId);if(!match)return true;
  if(foeOrder[chapterTwoAct(quests)-1]!==match[2])return false;
  return (match[1]==='foe')===!!quests['village-ledger']?.step.startsWith('battle-');
}
