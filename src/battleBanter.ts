import { enemyKinds, type Enemy } from './content';

type EnemyBanter = {
  intro: string;
  ready: string;
  attack: string;
  hurt: string;
  defeat: string;
  victory: string;
};

const lines: Record<string, EnemyBanter> = {
  slime: {
    intro: 'ぴちゃっ！ ぼくのバグ、見つけられる？',
    ready: 'まだまだ跳ねるぞ、ぴちゃっ！',
    attack: 'バグまみれになっちゃえ！',
    hurt: 'ぴちゃっ!? 正解は熱い！',
    defeat: 'ぼくのバグが……直っちゃう……。',
    victory: 'ぴちゃっ！ また解きにおいで！',
  },
  bat: {
    intro: 'ぱたぱたっ！ きみが動くと、ぼくも反応！',
    ready: '羽音の中でも考えられるかな？',
    attack: '耳を澄ませても、もう遅い！',
    hurt: 'その一撃、聞こえなかったことに……！',
    defeat: 'ぱた……そのイベント、受け取ったよ……。',
    victory: '迷いの音が、まだ残っているよ。',
  },
  ghost: {
    intro: 'ふわっ。ぼくを呼ぶコマンド、知ってる？',
    ready: '次の命令を、見せてみろ。',
    attack: '思考を停止させる。',
    hurt: 'その答え……実行できたのか。',
    defeat: '正しいコマンド……すーっと実行できたね……。',
    victory: 'もう一度、手順を確かめることだ。',
  },
  shadow: {
    intro: '呼んだ？ ……ぼく、中身ないけど。',
    ready: '隙を見せれば、そこを断つ。',
    attack: 'その迷い、切り離してやる！',
    hurt: '断片をつなぎ合わせた……だと？',
    defeat: '中身がないって……ちゃんと見抜いたね……。',
    victory: '知識の継ぎ目が、まだ甘い。',
  },
  memory: {
    intro: '前の答え、とってあるよ。まだ使えるかな？',
    ready: 'その記憶、いつまで保てる？',
    attack: 'その答えごと、奪おう。',
    hurt: '忘れずに、思い出したのか……。',
    defeat: '古いキャッシュは……入れ替えておくね……。',
    victory: '失った答えは、また拾い集めよ。',
  },
  crab: {
    intro: 'かちかちっ！ その値、どんな型？',
    ready: '次はどっちのはさみで挟もうかな。',
    attack: '泡に包まれてしまえ！',
    hurt: 'あいたっ！ 甲羅にも響く答えだ！',
    defeat: 'かち……型がぴったり合っちゃった……。',
    victory: 'また浜で待っているぞ、かちっ！',
  },
  wolf: {
    intro: 'くんくん……探してる値のにおいがする！',
    ready: '次の隙は見逃さない。',
    attack: '一気に飛びかかる！',
    hurt: 'くっ、動きを読まれたか。',
    defeat: 'あおーん……ぼくより先に、見つけたね……。',
    victory: '森で足跡をたどり直すことだ。',
  },
  treant: {
    intro: '枝の先まで、たどっておいで。葉っぱで待ってるよ。',
    ready: '枝葉の間で、答えを探せ。',
    attack: '根よ、その足を絡め取れ。',
    hurt: '長い時でも、知らぬ答えがあるとは。',
    defeat: '根から葉まで……ちゃんとたどれたね……。',
    victory: '急ぐな。根を張るように学ぶのだ。',
  },
  moth: {
    intro: 'ひらひらっ！ データが変わったら、描き直すよ！',
    ready: '鱗粉の向こうは見える？',
    attack: '風に紛れて舞いなさい！',
    hurt: '光が……答えを照らした！',
    defeat: 'ひらり……きみの答え、きれいに映ったね……。',
    victory: '落ち着いて、もう一度見てごらん。',
  },
  beetle: {
    intro: 'こつこつっ！ その入力、ルールに合ってる？',
    ready: '角を構えた。次は突き進むぞ。',
    attack: '鉄の角を受けてみろ！',
    hurt: '殻の継ぎ目を見抜いたか！',
    defeat: '検証おわり……きみの入力、合格だよ……。',
    victory: '考えを固めてから戻るんだな。',
  },
  scorpion: {
    intro: 'ちくっ！ エラーが出たら、どこを見る？',
    ready: '尾の針が、次を待っている。',
    attack: '砂針、走れ！',
    hurt: '針より鋭い答えだと!?',
    defeat: 'エラーの原因……見つかっちゃった……。',
    victory: '砂漠では、油断が命取りだ。',
  },
  cactus: {
    intro: 'ちくっ！ ブレークポイントで、ひと休みしよ？',
    ready: 'ちくりと試してやる。',
    attack: '千本針、飛んでいけ！',
    hurt: 'うわっ、ぼくの針より痛い！',
    defeat: '変数、確かめた？ ……じゃあ、続きをどうぞ……。',
    victory: '焦ると針が刺さるぞ。',
  },
  serpent: {
    intro: 'くるくるっ！ 条件が続く間、何度でも！',
    ready: '次はどの道を選ぶ？',
    attack: '流砂ごと呑み込む！',
    hurt: '正しい道筋を見つけたか。',
    defeat: '終了条件……見つけちゃったか……。',
    victory: '迷ったら道筋を確かめ直せ。',
  },
  golem: {
    intro: 'ごとごとっ。コードを組み上げて、道を開け！',
    ready: 'この拳を止められるか。',
    attack: '砕け、石の拳！',
    hurt: '岩に……ひびが入った！',
    defeat: 'ビルド成功……通っていいぞ……。',
    victory: '石は動かぬ。学び直して戻れ。',
  },
  wisp: {
    intro: 'ぽわっ。結果が届くまで、ちょっと待ってね。',
    ready: '光の揺らぎを見失わないで。',
    attack: '火花よ、閃いて！',
    hurt: 'まぶしい答えだね……！',
    defeat: 'お待たせ……結果、ちゃんと届いたよ……。',
    victory: 'また灯りを探しにおいで。',
  },
  skeleton: {
    intro: 'かたかたっ！ 最後に積んだ骨から、取り出して！',
    ready: '骨は折れても、剣は止まらぬ。',
    attack: 'この一太刀を受けよ！',
    hurt: '抜け落ちた記憶を、拾われたか。',
    defeat: '最後の骨も……ぽこんと取り出された……。',
    victory: '基礎から組み立て直すのだ。',
  },
  mimic: {
    intro: 'ぱかっ！ 本物そっくりの応答、返してあげる！',
    ready: '次の選択肢にも、罠があるかもね。',
    attack: 'がぶり！ 中身は牙でした！',
    hurt: '見破られた！ 蓋を閉じたい！',
    defeat: 'ぱたん……本番前の練習に、なったかな……。',
    victory: '見た目だけで決めちゃだめだよ。',
  },
  boss: {
    intro: 'コマンドを示せ。正しく実行できれば、この門は開く。',
    ready: '封印の前で、言葉を証明せよ。',
    attack: '半端な命令では封印は解けぬ！',
    hurt: 'その命令……石版に届いたか。',
    defeat: '実行成功。封印を解除する……よくぞ、ここまで学んだ。',
    victory: '学び直し、再び石版の前へ来い。',
  },
  review: {
    intro: '前に迷った問いだよ。もう一度、試してみよ？',
    ready: '前に見落としたものは何だ？',
    attack: '曖昧な記憶に、囚われよ。',
    hurt: '今度は、確かに覚えているな。',
    defeat: 'リトライ成功！ 今度は、自分の力で解けたね。',
    victory: '間違いから、また始めればいい。',
  },
  'after-gate': {
    intro: '見極めの魔法で、間違った選択肢を一つ見つけてみよ？',
    ready: '見極めた先に、答えがある。',
    attack: '迷いを、光で包もう。',
    hurt: '新しい力を、使いこなしたね。',
    defeat: 'その調子！ 間違いを絞って、答えにたどり着けたね。',
    victory: '力は、また試せば身につくよ。',
  },
};

export type BattleMoment = 'intro' | 'ready' | 'heroAttack' | 'enemyAttack' | 'reviewMiss' | 'victory' | 'defeat';

export function battleBanter(enemy: Enemy, moment: BattleMoment, round: number): { enemy: string; hero: string } {
  const foe = lines[enemy.id] ?? lines[enemyKinds[enemy.id] ?? 'shadow'];
  const heroStrike = ['答えは見えた。行くぞ！', 'この一歩で、道を開く！', '迷いを断つ。そこだ！'];
  const heroHurt = ['くっ……でも、まだ考えられる。', '痛いな。でも次は見抜く。', '間違いから、次の答えを探す。'];
  switch (moment) {
    case 'intro': return { enemy: foe.intro, hero: enemy.boss ? '石版の言葉を、必ず読み解く。' : enemy.id === 'review' ? '今度は、自分の言葉で答える。' : '問いを解けば、道は開く。' };
    case 'ready': return { enemy: foe.ready, hero: '次の問いも、一つずつ解こう。' };
    case 'heroAttack': return { enemy: foe.hurt, hero: heroStrike[(round - 1) % heroStrike.length] };
    case 'enemyAttack': return { enemy: foe.attack, hero: heroHurt[(round - 1) % heroHurt.length] };
    case 'reviewMiss': return { enemy: foe.ready, hero: 'まだ曖昧だ。解説を読んで、もう一度。' };
    case 'victory': return { enemy: foe.defeat, hero: enemy.boss ? '石版の封印が……解ける！' : enemy.id === 'review' ? '思い出せた。この答えを持っていこう。' : 'よし、学んだことが力になった。' };
    case 'defeat': return { enemy: foe.victory, hero: 'ここで終わらない。学び直して戻る。' };
  }
}
