import type { QuestStates } from './types';
import { chapterTwoPhase } from './definitions';

// The hero answers back after ordinary talks instead of standing silent.
// Village folk answer by chapter-two phase (aligned with villagerTalk / fumiTalk); everyone else rotates by talk count.
const byPhase:Record<string,string[]>={
  mountainGuide:[
    '俺の名前は思い出せなくてもいい。名簿は、必ず取り戻す。',
    '見分ける方法は必ずある。控えと照らし合わせよう、オルさん。',
    '直したい一行だけを直せばいい。全部を塗り直す必要はないんだ。',
    '止める。消したものが戻らないなら、なおさらだ。',
    'あの羽ペンの男……グラフィウスから、オルさんの大事なものを取り返してくる。',
    'すぐ行く。光が消えないうちに、名簿を一枚に戻そう。',
    '恩なんていいよ。フミの名前を呼ぶオルさんの声が聞けたら、それで十分だ。',
  ],
  mountainHealer:[
    '名前は、きっと戻る。それまで灯りを守っていてくれ、リオ。',
    '名前を呼べなくても、そばにいるだけで救われる人はいるよ。',
    '家の場所を塗り替えたやつがいるんだな。……一軒ずつ、元に戻してくる。',
    '消される前に止める。リオは、ここで灯りを頼む。',
    'あと少しだ。名前を呼び合える夜を、取り戻してくる。',
    '分かった、すぐにオルさんのところへ行く！',
    'ありがとう、リオ。この灯りを見ると、帰ってきたって気がするよ。',
  ],
  mountainKeeper:[
    '無理に思い出さなくていい、ダン。宿のことは、俺がなんとかする。',
    '名前のない予約は受けなくていい。ちゃんと確かめてから一行ずつ書けばいいんだ。',
    '道は思い出せなくても、家はなくなってない。住所を元に戻してくる。',
    '貸し出し記録まで……。すぐ止めに行く。',
    '常連さんの名前、もうすぐ喉から出てくるさ。もう少しだけ待っててくれ。',
    '霧が晴れてきたなら、もう大丈夫だ。行ってくる！',
    '道案内、助かるよ。今度は俺が、宿の常連になりに来る。',
  ],
  mountainLearner:[
    'ユナがフミを覚えていてくれて、よかった。フミのそばにいてやってくれ。',
    'ありがとう、ユナ。二つある行のうち、本物はひとつだけだ。必ず見分ける。',
    'そのとおりだ、ユナ。直すのは、条件で選んだ一行だけでいい。',
    '分かってる。消える前に、俺が止める。',
    'ああ。フミのおじいちゃんの記憶、必ず返してもらってくる。',
    'みんなの声が聞こえる……！ 急ごう！',
    'Modelはデータの係、か。ユナ、ちゃんと覚えてるじゃないか。',
  ],
};
const fumiReplies=[
  'フミ、か。いい名前だな。名簿の名前、ひとつも失わせないよ。',
  'オルさんは、きっとまたフミの名前を呼ぶ。約束する。',
  '本物のフミはひとりだけだ。必ず見分けて、一行に戻すよ。',
  '帰る家は、ちゃんとある。元の住所に戻してくるから。',
  'フミの行は、消させない。絶対に。',
  'ケシにも、何か思うところがあるのかもしれないな……。あとひとりだ、待っててくれ。',
  'ああ、すぐに行く。フミも一緒に、おじいちゃんのところへ行こう。',
  'よかったな、フミ。……毎朝呼んでもらえる名前があるって、いいな。',
];
const byCount:Record<string,string[]>={
  scholar:['型は、値の約束……。書き留めておくよ、ミラ。','部品を組み合わせて画面を作る、か。少しずつ覚えていく。'],
  child:['大丈夫。ちゃんと帰ってくるよ。そのときは、覚えたことを教えてくれ。','一つずつでいいんだ。俺も、そうやって覚えてる。'],
  priest:['間違いは足跡、か。……少し気が楽になったよ、セラさん。','ありがとう。また振り返りに来るよ。'],
  elderKin:['ありがとう、リン。村長さんには、いつも助けられてばかりだ。','東の門だな。気をつけて行ってくるよ。'],
  childMother:['もちろん。帰ったら、真っ先に声をかけるよ。','あの子の前では、かっこいい冒険の話をしないとな。'],
  innkeeper:['ああ、ちゃんと支度してから出るよ。ハンナさんに怒られたくないしな。','行ってきます。……帰ったら、またスープを頼むよ。'],
  wanderer:['問いを読んで、選択肢を比べる。急がずに、だな。ありがとう、ロイ。','ロイも、旅の途中で困ったら声をかけてくれ。'],
  assistant:['小さな本に一つずつ、か。順番に読んでいくよ、ノア。','また分からなくなったら、ここへ戻ってくる。'],
  backendLibrarian:['ありがとう、イオ。ルートとコントローラ、覚えたら報告に来るよ。','奥の本も、少しずつ読んでいく。'],
  royalTeahouse:['ありがとう、ミーナ。泉の水、ありがたくいただくよ。','あの人たちを、必ず正気に戻してくる。'],
};
export function heroReply(npcId:string,quests:QuestStates,count:number):string|undefined{
  const step=quests['village-ledger']?.step;
  if(npcId==='fumi')return fumiReplies[chapterTwoPhase(quests)];
  const phased=byPhase[npcId];
  if(phased&&step)return phased[Math.min(phased.length-1,step==='complete'?phased.length-1:Math.max(0,chapterTwoPhase(quests)-1))];
  if(npcId.startsWith('royal-queue-'))return ['……もう少しの辛抱だ。行列は、俺が動かしてみせる。','しっかりしてくれ。あんたの名前は、ちゃんとあるはずだ。'][count%2];
  const rotating=byCount[npcId];
  return rotating?.[count%rotating.length];
}
