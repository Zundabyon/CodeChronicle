import type { StoryLine } from '../story';
import type { QuestStates } from './types';

// おまけ「裏会議」: 章クリアで解放される制作の円卓会議の楽屋話。
const say=(speaker:string,face:string)=>(text:string):StoryLine=>({speaker,face,text});
// 円卓の面々: face 'bs-<id>'、立ち絵 'bs-<id>-<pose>'（public/portraits/backstage/）。
type Pose='normal'|'propose'|'down'|'surprised';
const bs=(speaker:string,id:string)=>(text:string,pose:Pose='normal'):StoryLine=>({speaker,face:`bs-${id}`,standing:`bs-${id}-${pose}`,text});
const narrator=say('語り手','📜'),pro=bs('肯定派','positive'),mid=bs('中立派','neutral'),con=bs('否定派','negative'),user=bs('ユーザー代弁者','user');
// 本編の面々: 立ち絵 'cast-<id>-<pose>'（public/portraits/cast/）。
const cast=(speaker:string,face:string,id:string)=>(text:string,pose:Pose='normal'):StoryLine=>({speaker,face,standing:`cast-${id}-${pose}`,text});
const hero=cast('{name}','🗡️','hero'),fumi=say('フミ','fumi'),ol=cast('記録係 オル','👴','ol'),hanna=cast('女将ハンナ','👩','hanna'),mayor=cast('村長エルド','👴','mayor');
const metappi=bs('めたっぴ','metappi'),ai=bs('AIの代弁者','ai');
const graphius=say('記録卿グラフィウス','graphius'),demon=bs('魔王','maou');
const nozomi=say('ノゾミ・ブルー','nozomi'),tsukune=say('ツクネ・アンバー','tsukune'),nurie=say('ヌリエ・ジェイド','nurie'),keshi=say('ケシ・パープル','keshi');

export type BackstageMeeting={id:string;title:string;theme:string;unlocked:(save:{completed?:boolean;quests?:QuestStates})=>boolean;lines:StoryLine[]};

export const backstageMeetings:BackstageMeeting[]=[
  {id:'first',title:'第一回',theme:'そもそもどんなアプリ作る？',unlocked:save=>!!save.completed,lines:[
    narrator('実は裏で、こんな会議をしていました。まだ世界が何もなかった頃。円卓には制作の四人と、AIの代弁者。そして作者めたっぴ。'),
    metappi('はい！ SFCのRPGでプログラミングが学べたら最高じゃない！？','propose'),
    ai('確認させてください。SFC風というのは、見た目ですか、操作感ですか、それとも容量の制約まで含みますか。'),
    metappi('ぜんぶ！ あと全部AIに作らせたい！ レトロで、細かくて、可愛いドット絵で！','propose'),
    ai('……はい。はい。「細かく」と「レトロ」は、ときどき喧嘩しますが、はい。','down'),
    con('無茶振りの三段重ねだな。'),
    pro('でも夢があります！ 勉強が冒険になるんですよ！','propose'),
    user('問題を解くと敵に勝てるなら、ぼく、毎晩やります。'),
    mid('では最初の場面を決めましょう。主人公の朝からです。','propose'),
    metappi('朝ごはん中に、女将さんが主人公の名前を忘れて魔物になりかける！','propose'),
    hanna('ちょいと待ちな！ 「スープが冷めるよ」って台詞で始まる悲劇があるかい！ 女将の沽券に関わるよ！','surprised'),
    ai('台詞案、温かいスープ版と冷めたスープ版を三十通り用意しました。','propose'),
    hanna('……一番あったかいのにしておくれ。'),
    metappi('村長の杖は光らせて！ かっこいいから！','propose'),
    mayor('光らせるなら、毎朝磨いておかねばならんのう。三十分ほど。','propose'),
    con('その手入れ事情、本編に一行も出てこないぞ。'),
    metappi('ボスは、忘却の遺跡の暴走した守護者で！','propose'),
    say('遺跡の守護者','📜')('異議あり！ 暴走していたのは魔王のせいです！ 本当の私は、本の返却期限に厳しいだけの真面目な司書なんです！ 延滞は困ります！'),
    metappi('魔法も欲しい！ 四択の誤答を一つ消す「見極め」！ MP1で！','propose'),
    con('強すぎないか。四択が実質三択だぞ。'),
    pro('いいんです！ 「これは違う」と見抜く力こそ学びです！'),
    ai('MP1で確定でよろしいですか。後から2にすると、遊んだ人に怒られます。'),
    metappi('1！ あと謎の騎士が「お前の両親は生きている」とだけ言って去る！','propose'),
    hero('ちょっと待って、それどういう意味！？ あなたは誰なの！？','surprised'),
    say('謎の騎士','knight')('……通りすがりの鎧好きだ。今日は兜の調子が悪くてな、何も聞こえない。……では！'),
    ai('作者さん、騎士の正体の仕様は。'),
    metappi('ひみつ！'),
    ai('……仕様書に「ひみつ」と書きました。','down'),
    demon('おい。余は。封印されて千年、出番がないのだが。'),
    metappi('魔王さんはプロローグで名前だけ！'),
    demon('名前だけ！？ ……いいもん。余、魔王だし。一人で寂しくないし。','down'),
    hero('燃える故郷から始まって、ハンナさんを助けるところまで。……ぼくの冒険、なんだか騒がしく生まれたんだね。'),
    hanna('いいじゃないか。賑やかなのは、生きてる証拠さ。'),
    narrator('こうして第一章が生まれた。AIの代弁者の仕様書には、今も「ひみつ」の三文字が残っている。'),
  ]},
  {id:'second',title:'第二回',theme:'第二章の整合性レビュー',unlocked:save=>save.quests?.['village-ledger']?.step==='complete',lines:[
    narrator('実は裏で、こんな会議をしていました。まずは前回の続き。第三章で認証・認可を扱う案は「初心者に難しすぎる」と見送り、第二章を「読む・増やす・直す・消す」の四幕に分けた。セーブ移行は不要、即決。'),
    metappi('あと四天王は一人！ 部下はCRUD戦隊・悪レンジャー！ 可愛げのある残虐系で！','propose'),
    tsukune('呼ばれて増えて登場〜！ ツクネたち、かわいいでしょ？'),
    demon('四天王を一人しか出さないとは何事だ！ 余、名前を四つ、寝ないで考えてきたのだが！？','surprised'),
    narrator('そして本題。「第二章、ちゃんと筋が通ってる？」。全員が別々にレビューして持ち寄った。'),
    con('では私から。四幕のうち三幕で、敵の技で学ぶ「誤り」と、村の困りごとで学ぶ「操作」が別の話になっていた。'),
    nurie('え〜、どっちも楽しかったのに！'),
    con('楽しいかどうかではない。一本の話に束ねろ、と言っている。……で、直した。'),
    pro('そこは褒めさせてください。敵の技が「初心者がやりがちな誤り」になっている。物語と学習が同じ方向を向いています！'),
    mid('私からは一点。名簿のデータと、人の記憶の関係が未定義でした。'),
    mid('そこで決めました。名簿は記憶の手がかり。行を消しても人は消えない。間をつなぐのは「名の糸」です。','propose'),
    ol('名簿の扱いなら、わしは目をつぶってもできる。……じゃが、孫のどこを見ればよいかは、分からんのじゃ。','down'),
    fumi('おじいちゃん……それ、会議で言うこと？'),
    user('ぼくからは三つ。まず、Readで村が回復すると「読んだら直った」と誤解します。'),
    user('二つ目。必須の戦闘で負けると、学び直す道がない。三つ目。フミの動機が途中で薄れる。'),
    fumi('……薄れてないもん。ちょっと、台詞が少なかっただけだもん。'),
    keshi('……消したら、静かになる。でも、あの子のは……消したら、泣く。'),
    narrator('円卓が一瞬、しんとした。'),
    graphius('ふん。記録とは所有する者のものだ。裂いたところで価値は減らん。'),
    con('待て。記録を大事にする人間が、自分の帳簿を裂く理由がない。'),
    graphius('ち、違うのだ……！ あれは、その、手が滑って……いや、演出上の都合で……うっ……。'),
    graphius('私だって帳簿は大好きなのだ！ 毎晩、背表紙を撫でてから寝ているのだ！ ……議事録から今の発言を消せ。'),
    hanna('忘れられる側も、忘れる側も、どっちも苦しいもんさ。だから筋は通しておやり。','propose'),
    narrator('続いて楽屋話。実装中のドタバタも報告された。'),
    nozomi('まず、画像を四枚まとめて一枚にしたら、作者に「まとめたことねえわ」って怒られたんだって〜♪'),
    con('一キャラ一ポーズ一枚。基本だ。'),
    user('それから、燃えている村なのに炎の上を歩けました。「倫理的におかしい」と言われました。'),
    mayor('村人が騒ぎのあと、けろっとしておったのもいかんかった。「気持ち悪い」と言われてのう。','down'),
    hanna('あれだけのことがあったんだ。ちゃんと、しんみりもさせておくれ。','down'),
    demon('余の出番は。'),
    mid('次回以降に検討します。'),
    demon('前回もそう言った！ 余、ずっと円卓の端で座ってるだけではないか！ お茶菓子も余の分だけ無かった！','down'),
    hanna('はいはい、魔王さんの分、取っておいたよ。'),
    demon('……うむ。苦しゅうない。'),
    narrator('こうして第二章は、少しずつ筋が通っていった。裏会議は、まだまだ続く……かもしれない。'),
  ]},
];
