import { chapterTwoOpening, chapterTwoFound, chapterTwoEnding } from './chapterScenes';
import type { QuestDefinition } from './types';
const guide=(text:string)=>({speaker:'記録係 オル',face:'👴',text});
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
    id:'village-ledger',category:'chapter',startLabel:'第二章「消えた名簿」を始める',title:'第二章：消えた名簿',description:'村と遺跡を巡り、CRUDの知識で名簿を取り戻す短い冒険。',npcId:'mountainGuide',npcLocation:'石灯の村の記録係オル',requiresFirstChapter:true,startAt:'town',opening:chapterTwoOpening,
    pauseResponse:'控えは預かっておく。続きは、また話しかけてくれ。',completionObjective:'村人の暮らしを支える記録を取り戻した。自由に探索を続けよう。',completedText:'名簿は元通りじゃ。名前を呼び合う声が戻った。ありがとう、忘れぬよう書き留めておくよ。',
    steps:[
      {id:'visit-village',title:'第二章：消えた名簿',description:'石灯の村で、記録係オルから名簿の異変について聞こう。',trigger:{type:'npc-talked',npcId:'mountainGuide'},lines:[guide('名簿の名前が消え、住所も書き換わってしまった。だが、遺跡へ納めた古い控えが残っているかもしれん。'),guide('忘却の遺跡の東の小部屋に宝箱がある。すでに宝を取った箱でも、底板まで調べてほしい。')]},
      {id:'find-copy',title:'第二章：名簿の控えを探す',description:'忘却の遺跡の東の小部屋で宝箱を調べよう。開けたことがある箱も確かめよう。',reminder:'遺跡の東の小部屋の宝箱じゃ。控えが見つかったら、ここへ戻っておいで。',trigger:{type:'chest-examined',chestId:'dungeon:19,5'},after:chapterTwoFound},
      ...[
        ['read-records','basics-crud-r','まず控えの情報を読み、今の名簿と照らし合わせよう。'],
        ['update-address','basics-crud-u','登録済みの村人の、間違った住所を直そう。'],
        ['create-family','basics-crud-c','まだ名簿にいない家族の情報を新しく登録しよう。'],
        ['delete-duplicate','basics-crud-d','正しい行を残し、不要な重複データだけを削除しよう。'],
      ].map(([id,questionId,questionIntro])=>({id,title:'第二章：村の名簿を直す',description:'石灯の村のオルと、名簿の修復を進めよう。',questionIntro,trigger:{type:'question-answered' as const,questionId,correct:true,source:'quest' as const}})),
      {id:'return-names',title:'第二章：名簿を取り戻した',description:'オルと修復した名簿を確かめよう。',trigger:{type:'npc-talked',npcId:'mountainGuide'},lines:chapterTwoEnding},
    ],reward:{gold:70,items:{ether:1}},
  },
];
export const questDefinition=(id:string)=>questDefinitions.find(def=>def.id===id);
