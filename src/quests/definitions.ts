import { chapterTwoLessons } from './chapterTwoLessons';
import { chapterTwoOpening, chapterTwoAttack, chapterTwoFound, chapterTwoEnding, fumiTalk, villagerTalk } from './chapterScenes';
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
    id:'village-ledger',category:'chapter',startLabel:'第二章「消えた名簿」を始める',title:'第二章：消えた名簿',description:'記録卿グラフィウスに裂かれた名簿を、四つの幕で取り戻す。読む→作る→直す→消すの順にダンジョンの封印を解き、村を荒らす悪レンジャーとの戦いで学んだ操作を試す。最後はグラフィウスとの決戦。',npcId:'mountainGuide',npcLocation:'石灯の村の記録係オル',requiresFirstChapter:true,startAt:'town',opening:chapterTwoOpening,
    pauseResponse:'ここまでの記憶は残っている。同じ封印に触れれば、続きから挑める。',completionObjective:'村人の暮らしを支える記録を取り戻した。自由に探索を続けよう。',completedText:'名簿は元通りじゃ。名前を呼び合う声が戻った。ありがとう、忘れぬよう書き留めておくよ。',
    steps:[
      {id:'visit-village',title:'第二章：消えた名簿',description:'平原の北東、石灯の村へ向かおう。',trigger:{type:'npc-talked',npcId:'mountainGuide'},lines:chapterTwoAttack},
      {id:'find-copy',title:'第二章：名簿の控えを探す',description:'忘却の遺跡の東の小部屋で宝箱を調べよう。開けたことがある箱も確かめよう。',reminder:'遺跡の東の小部屋の宝箱じゃ。控えが見つかったら、ここへ戻っておいで。',trigger:{type:'chest-examined',chestId:'dungeon:19,5'},after:chapterTwoFound},
      ...chapterTwoLessons,
      {id:'return-names',title:'第二章：名簿を取り戻した',description:'四つの欠片と控えを持って石灯の村のオルに話しかけ、名簿を復元しよう。',trigger:{type:'npc-talked',npcId:'mountainGuide'},lines:chapterTwoEnding},
    ],reward:{gold:70,items:{ether:1}},
  },
];
export const questDefinition=(id:string)=>questDefinitions.find(def=>def.id===id);
const actMarks=['visit-village','battle-r','battle-c','battle-u','battle-d','battle-graphius'];
/** Chapter phase: 0 before the attack, then one per act boundary passed, fumiTalk.length-1 once complete. */
function chapterTwoPhase(quests:QuestStates):number {
  const def=questDefinition('village-ledger')!,step=quests[def.id]?.step;
  if(step==='complete')return fumiTalk.length-1;
  const index=def.steps.findIndex(s=>s.id===step);
  return index<0?0:actMarks.filter(id=>def.steps.findIndex(s=>s.id===id)<index).length;
}
/** Fumi's line follows how many act boundaries the chapter has passed. */
export const fumiLine=(quests:QuestStates)=>fumiTalk[chapterTwoPhase(quests)];
/** Village folk's lines for the current chapter phase, or undefined for their peacetime lines. */
export const villagerLines=(npcId:string,quests:QuestStates):string[]|undefined=>villagerTalk[npcId]?.[chapterTwoPhase(quests)-1];
/** Act count passed in the village-ledger chapter, or -1 when it is not running. */
export function chapterTwoAct(quests:QuestStates):number {
  const def=questDefinition('village-ledger')!,step=quests[def.id]?.step;
  if(!step||step==='complete')return -1;
  const index=def.steps.findIndex(s=>s.id===step);
  return actMarks.filter(id=>def.steps.findIndex(s=>s.id===id)<index).length;
}
const foeOrder=['ranger-read','ranger-create','ranger-update','ranger-delete','graphius'];
/** Village foes: `foe-<id>` stands in the square during its battle step, `taunt-<id>` on the outskirts earlier in its act. */
export function villageFoeVisible(npcId:string,quests:QuestStates):boolean {
  const match=/^(foe|taunt)-(.+)$/.exec(npcId);if(!match)return true;
  if(foeOrder[chapterTwoAct(quests)-1]!==match[2])return false;
  return (match[1]==='foe')===!!quests['village-ledger']?.step.startsWith('battle-');
}
