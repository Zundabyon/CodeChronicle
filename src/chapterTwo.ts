import { questions } from './content';
import type { StoryLine } from './story';
export const chapterTwoStages=['not-started','village','cave','restore','complete'] as const;
export type ChapterTwoStage=typeof chapterTwoStages[number];
export const chapterTwoChestId='dungeon:19,5';
const narrator=(text:string):StoryLine=>({speaker:'語り手',face:'📜',text});
export const chapterTwoOpening:StoryLine[]=[narrator('石灯の村から、一通の手紙が届いた。村人の名簿から名前が消え、旅人を家族と取り違える者まで出始めたという。'),{speaker:'女将ハンナ',face:'👩',text:'今度は、あんたが覚えたことを、誰かの暮らしに返しておいで。帰りを待っているよ。'},narrator('第二章「消えた名簿」。平原の北東、石灯の村の記録係オルを訪ねよう。')];
export const chapterTwoFound:StoryLine[]=[narrator('宝箱の底板に、古い名簿の控えが挟まっていた。すでに宝を持ち出した箱でも、この薄い紙片は見落とされていた。'),narrator('名前はまだ読める。しかし住所の誤り、未登録の家族、重複した行が入り混じっている。紙片を大切に包み、石灯の村へ戻ろう。')];
export const chapterTwoEnding:StoryLine[]=[{speaker:'記録係 オル',face:'👴',text:'読む、直す、作る、不要な重複を消す。一つずつ確かめれば、名簿を元に戻せるのじゃな。'},narrator('正しい名簿を囲み、村人たちが互いの名前を呼ぶ。消えた記憶のすべては戻らなくても、また知り合うための手がかりは残せる。'),{speaker:'見習い ユナ',face:'🧒',text:'知識って、問題を解くだけじゃないんだね。誰かが困っているときに、使えるんだ。'},narrator('第二章「消えた名簿」完了。オルから70Gとエーテル1個を受け取った。両親の行方を追う旅は、まだ続いていく。')];
export const chapterTwoTasks=[{id:'basics-crud-r',text:'まず控えの情報を読み、今の名簿と照らし合わせよう。'},{id:'basics-crud-u',text:'登録済みの村人の、間違った住所を直そう。'},{id:'basics-crud-c',text:'まだ名簿にいない家族の情報を新しく登録しよう。'},{id:'basics-crud-d',text:'正しい行を残し、不要な重複データだけを削除しよう。'}];
export const chapterTwoQuestion=(step:number)=>questions.find(q=>q.id===chapterTwoTasks[step]?.id);
export function chapterTwoObjective(stage:ChapterTwoStage,step=0){
  switch(stage){
    case 'village':return {title:'第二章：消えた名簿',text:'石灯の村で、記録係オルから名簿の異変について聞こう。'};
    case 'cave':return {title:'第二章：名簿の控えを探す',text:'忘却の遺跡の東の小部屋で宝箱を調べよう。開けたことがある箱も確かめよう。'};
    case 'restore':return {title:'第二章：村の名簿を直す',text:`石灯の村のオルへ戻ろう。名簿の修復 ${Math.min(4,step)}/4。`};
    case 'complete':return {title:'第二章：消えた名簿 完了',text:'村人の暮らしを支える記録を取り戻した。知識を携え、自由に探索を続けよう。'};
    default:return undefined;
  }
}
