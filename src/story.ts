import type { Npc } from './content';

export const storyStages=['breakfast','mayor','ruins','knight','knowledge','homecoming','rescued','legacy'] as const;
export type StoryStage=typeof storyStages[number];
export type StoryLine={speaker:string;face:string;text:string;action?:'knight-leaves'};
const line=(speaker:string,face:string,text:string):StoryLine=>({speaker,face,text});
const hero=(text:string)=>line('{name}','🗡️',text);
const hanna=(text:string)=>line('女将ハンナ','👩',text);
const mayor=(text:string)=>line('村長エルド','👴',text);
const narrator=(text:string)=>line('語り手','📜',text);

export function migrateStoryStage(value:unknown):StoryStage {
  return storyStages.includes(value as StoryStage)?value as StoryStage:'legacy';
}
export const canLeaveTown=(stage:StoryStage)=>stage!=='breakfast'&&stage!=='mayor';
export const storyNpcs=(npcs:Npc[],stage:StoryStage)=>npcs.filter(npc=>npc.id!=='innkeeper'||['breakfast','rescued','legacy'].includes(stage));
export function storyObjective(stage:StoryStage,bossDefeated=false) {
  switch(stage) {
    case 'breakfast':return {title:'いつもの朝食',text:'街の東にある旅籠へ。育ての親、女将ハンナに会おう。'};
    case 'mayor':return {title:'今度は、まだ間に合う',text:'街の北中央にある村長の家へ。女将を救う方法を聞こう。'};
    case 'ruins':return {title:'女将を救う知識',text:'東の忘却の遺跡で知識と「見極め」を取り戻す。守護者に挑むにはLV 2が必要。'};
    case 'knight':return {title:'遺跡に現れた騎士',text:'謎の騎士の言葉を聞こう。'};
    case 'knowledge':return {title:'取り戻した力',text:'魔法「見極め」の使い方を確かめよう。'};
    case 'homecoming':return {title:'今度こそ、助ける',text:'街の教会で休むハンナのもとへ。両親のことを確かめる前に、今救える人を救おう。'};
    case 'rescued':return {title:'知識を取り戻す旅へ',text:'魔王による知識の喪失を食い止める。そして、騎士の証言を手がかりに、両親の行方を確かめる。'};
    default:return {title:'失われた知識の扉',text:bossDefeated?'知識と「見極め」を取り戻した。世界に残る知識を探そう。':'東の忘却の遺跡へ。守護者に挑むにはLV 2が必要。'};
  }
}

export const wakingScene:StoryLine[]=[
  hero('……あれから、十年か。また、あの日の夢を見た。'),
  hero('父さんと母さんは、あの夜から帰ってこなかった。二人は亡くなったんだと、自分に言い聞かせてきた。'),
  hero('逃げ延びた俺を育ててくれたのが、旅籠のハンナさんだ。独り立ちしても、朝飯ぐらい食べに来いって言うんだよな。'),
  hero('十年たっても、覚えたことを書き留める癖は抜けない。父さんと母さんに教わったことまで、なくしたくない。'),
  hero('今日も旅籠へ行こう。出かける前に、気になるならタンスの手紙を読んでいこう。'),
];
export const breakfastScene:StoryLine[]=[
  hanna('おはよう。ほら、そこに座りな。あんたの好きなスープ、冷めちまうよ。'),
  hero('また二人分も？ もう一人で暮らせるって、何度も言ってるだろ。'),
  hanna('一人で暮らせたって、腹は減るだろ。……あんた、昔はこの椅子にも足が届かなかったのにねえ。'),
  narrator('女将は笑いながら、いつもの器を並べた。その手が、不意に止まる。'),
  hanna('……あれ。あんたの名前、なんだったかね。昨日も、呼んだはずなのに。'),
  hero('ハンナさん？ ……{name}だよ。どうしたんだ。'),
  line('女将ハンナ','corrupted-hanna','違う。知らない。……お前が、私から奪ったんだろう。名前も、思い出も、全部！'),
  narrator('女将の影が歪む。指先が黒い爪へ変わり、見慣れた顔に、憎しみの色が浮かんだ。'),
  hero('やめてくれ！ 俺だよ。十年前、あんたが助けてくれた……！'),
  mayor('下がれ、{name}！ まだ、言葉が残っている。――思い出せ。この町で、お前が守ってきたものを！'),
  narrator('村長の杖から光が広がる。女将は膝をつき、黒い爪がゆっくりと元に戻った。'),
  hanna('……スープが、冷め……。'),
  mayor('セラ、教会へ運んでくれ。今の術は変化を抑えただけだ。わしの家で話そう、{name}。まだ、助ける道はある。'),
  hero('十年前は、逃げることしかできなかった。……今度は、まだ間に合うんだな？'),
];
export const mayorScene:StoryLine[]=[
  mayor('来たか。ハンナは教会で眠っている。だが、あの憎しみは消えておらん。'),
  hero('どうして、あの人が俺を襲うんだ。昨日まで、いつもどおりだったのに。'),
  mayor('魔王が再び、世界から知識を奪い始めた。術の使い方も、大切な人と過ごした記憶も……。'),
  mayor('そして、失われた心の隙へ悪意を吹き込む。覚えのない恨みが自分の感情のようになり、やがて人を魔物へ変えてしまうのだ。'),
  hero('「お前が奪った」って言ったのも……魔王が、そう思わせたのか。'),
  mayor('そうだ。ハンナが自分で選んだ憎しみではない。知識を取り戻し、植え付けられた感情を見破れれば、救えるかもしれん。'),
  hero('どこにある。その知識は。'),
  mayor('東の忘却の遺跡だ。古い守護者が、知識の扉を守っている。だが、今はそいつも魔王の影響で暴走しておる。'),
  mayor('知識を一つずつ思い出し、守護者を正気に戻すのだ。扉の先にある「見極め」なら、魔王に植え付けられた偽りを見破れる。'),
  hero('父さんと母さんには、もう会えないと思って生きてきた。でも、ハンナさんまで失いたくない。今度は、助けに戻ってくる。'),
  mayor('危険な旅になるぞ。魔王の力は、忘れた知識だけでなく、お前の恐れや怒りにもつけ込む。'),
  hero('それでも、行く。あの人が俺を覚えていられなくなっても、俺が覚えている。'),
  mayor('……わかった。平原で経験を積み、LV 2になったら遺跡の守護者へ向かえ。教会で傷を癒し、店で支度を整えてから出るのだ。'),
];
export const knightScene:StoryLine[]=[
  narrator('知識の扉が開き、暴走していた守護者の目から赤い光が消えた。背後で、鎧の触れ合う音がする。'),
  line('謎の騎士','knight','……最初の扉を開いたか。'),
  hero('誰だ！ ここで何をしている？'),
  line('謎の騎士','knight','お前の両親は生きている。'),
  hero('……何を言っている。俺は、二人ともあの夜に死んだと思っていた。'),
  line('謎の騎士','knight','知識を取り戻していけば、いずれ会えるだろう。'),
  hero('どこにいるんだ！？ 知っているなら教えてくれ！'),
  line('謎の騎士','knight','お前のその眼で、真実を直視せよ。'),
  {...narrator('騎士は踵を返した。呼び止める声は遺跡に響き、鎧の音だけが闇の奥へ消えていく。'),action:'knight-leaves'},
  hero('待て！ なぜ生きていると言えるんだ！ ……証拠も聞けていない。まだ、信じられない。'),
  hero('二人が本当に生きているのか、確かめたい。でも、今はハンナさんだ。扉の先の知識を持って帰る。今度こそ、助けるために。'),
];
export const rescueScene:StoryLine[]=[
  line('司祭セラ','👩🏼','お帰りなさい。ハンナさんは、まだ浅い眠りの中です。あの方の手を、握ってあげてください。'),
  narrator('握り返す力は弱い。女将の影に、遺跡で見たものと同じ黒い揺らぎがまとわりついている。'),
  hanna('……お前が、全部……奪った……。'),
  hero('違う。それは、あんたの言葉じゃない。――見極め。'),
  narrator('黒い揺らぎの向こうに、幾重にも重ねられた偽りが見える。主人公は、女将と学んだ言葉を一つずつ呼び戻した。'),
  hero('スープの火加減も、手紙の読み方も。全部、あんたが教えてくれた。俺からは、何も奪っていない。'),
  narrator('影に亀裂が走る。女将の指が動き、主人公の手を、確かに握り返した。'),
  hanna('……{name}？ おかえり。ちゃんと、帰ってきたんだね。'),
  hero('ああ。……今度は、助けられた。'),
  line('司祭セラ','👩🏼','変化は止まりました。あなたのことも思い出しています。でも、失われた知識がすべて戻ったわけではありません。'),
  hanna('スープの作り方まで、あやふやでねえ。……また、教えてくれるかい？'),
  hero('何度でも。一緒に、覚え直そう。'),
  narrator('同じことが、世界のどこかで今も起きている。取り戻せるものがある。今日、確かに一人を救えた。'),
  hero('魔王を止める。これ以上、誰かを失わせない。それから……父さんと母さんが本当に生きているのか、俺の目で確かめる。'),
];
