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
    intro: 'ぴちゃっ！ その知識、溶かしてやる！',
    ready: 'まだまだ跳ねるぞ、ぴちゃっ！',
    attack: 'バグまみれになっちゃえ！',
    hurt: 'ぴちゃっ!? 正解は熱い！',
    defeat: 'ぼくのバグが……直っちゃう……。',
    victory: 'ぴちゃっ！ また解きにおいで！',
  },
  bat: {
    intro: '静かな答えなんて、ノイズで消す！',
    ready: '羽音の中でも考えられるかな？',
    attack: '耳を澄ませても、もう遅い！',
    hurt: 'その一撃、聞こえなかったことに……！',
    defeat: 'くっ、答えがはっきり聞こえる……。',
    victory: '迷いの音が、まだ残っているよ。',
  },
  ghost: {
    intro: '入力を間違えれば、ここから出られない。',
    ready: '次の命令を、見せてみろ。',
    attack: '思考を停止させる。',
    hurt: 'その答え……実行できたのか。',
    defeat: '命令が……書き換わった……。',
    victory: 'もう一度、手順を確かめることだ。',
  },
  shadow: {
    intro: '欠けた記憶で、私の刃を見切れるか。',
    ready: '隙を見せれば、そこを断つ。',
    attack: 'その迷い、切り離してやる！',
    hurt: '断片をつなぎ合わせた……だと？',
    defeat: '答えが、ひとつの形になったか……。',
    victory: '知識の継ぎ目が、まだ甘い。',
  },
  memory: {
    intro: '覚えたことから、忘れていくがいい。',
    ready: 'その記憶、いつまで保てる？',
    attack: 'その答えごと、奪おう。',
    hurt: '忘れずに、思い出したのか……。',
    defeat: '記憶は……お前の中に残る……。',
    victory: '失った答えは、また拾い集めよ。',
  },
  crab: {
    intro: 'かち、かちっ。ここはぼくらの水辺だ！',
    ready: '次はどっちのはさみで挟もうかな。',
    attack: '泡に包まれてしまえ！',
    hurt: 'あいたっ！ 甲羅にも響く答えだ！',
    defeat: 'かち……潮の音が遠くなる……。',
    victory: 'また浜で待っているぞ、かちっ！',
  },
  wolf: {
    intro: '風より速く、その迷いを嗅ぎつけたぞ。',
    ready: '次の隙は見逃さない。',
    attack: '一気に飛びかかる！',
    hurt: 'くっ、動きを読まれたか。',
    defeat: 'この知恵には……追いつけないな。',
    victory: '森で足跡をたどり直すことだ。',
  },
  treant: {
    intro: '古い根の下には、忘れられた言葉が眠る。',
    ready: '枝葉の間で、答えを探せ。',
    attack: '根よ、その足を絡め取れ。',
    hurt: '長い時でも、知らぬ答えがあるとは。',
    defeat: '新しい芽が、知恵とともに伸びる……。',
    victory: '急ぐな。根を張るように学ぶのだ。',
  },
  moth: {
    intro: 'ひらひら……その集中、散らしてあげる。',
    ready: '鱗粉の向こうは見える？',
    attack: '風に紛れて舞いなさい！',
    hurt: '光が……答えを照らした！',
    defeat: 'ひらり……もう隠せないね。',
    victory: '落ち着いて、もう一度見てごらん。',
  },
  beetle: {
    intro: 'この殻を破るほどの答えを見せろ。',
    ready: '角を構えた。次は突き進むぞ。',
    attack: '鉄の角を受けてみろ！',
    hurt: '殻の継ぎ目を見抜いたか！',
    defeat: '硬さだけでは……守りきれぬ。',
    victory: '考えを固めてから戻るんだな。',
  },
  scorpion: {
    intro: '砂の下から、弱い答えを狙っていた。',
    ready: '尾の針が、次を待っている。',
    attack: '砂針、走れ！',
    hurt: '針より鋭い答えだと!?',
    defeat: '砂に……沈む……。',
    victory: '砂漠では、油断が命取りだ。',
  },
  cactus: {
    intro: '砂漠に立つ知恵、見せてもらおうか。',
    ready: 'ちくりと試してやる。',
    attack: '千本針、飛んでいけ！',
    hurt: 'うわっ、ぼくの針より痛い！',
    defeat: '水を……飲んで出直すよ。',
    victory: '焦ると針が刺さるぞ。',
  },
  serpent: {
    intro: '砂の道は、いつも真っすぐとは限らない。',
    ready: '次はどの道を選ぶ？',
    attack: '流砂ごと呑み込む！',
    hurt: '正しい道筋を見つけたか。',
    defeat: '足跡が……答えへ続いていた……。',
    victory: '迷ったら道筋を確かめ直せ。',
  },
  golem: {
    intro: '岩の門を越える知識を示せ。',
    ready: 'この拳を止められるか。',
    attack: '砕け、石の拳！',
    hurt: '岩に……ひびが入った！',
    defeat: '道を開く力、認めよう。',
    victory: '石は動かぬ。学び直して戻れ。',
  },
  wisp: {
    intro: '暗い道に、ひとつ問いを灯そう。',
    ready: '光の揺らぎを見失わないで。',
    attack: '火花よ、閃いて！',
    hurt: 'まぶしい答えだね……！',
    defeat: 'その光を、消さずに進んで。',
    victory: 'また灯りを探しにおいで。',
  },
  skeleton: {
    intro: '古い剣の型を、まだ覚えているか。',
    ready: '骨は折れても、剣は止まらぬ。',
    attack: 'この一太刀を受けよ！',
    hurt: '抜け落ちた記憶を、拾われたか。',
    defeat: '剣を置こう。先へ進め。',
    victory: '基礎から組み立て直すのだ。',
  },
  mimic: {
    intro: '宝箱だと思った？ ほら、こっちを見て！',
    ready: '次の選択肢にも、罠があるかもね。',
    attack: 'がぶり！ 中身は牙でした！',
    hurt: '見破られた！ 蓋を閉じたい！',
    defeat: '本物の宝は、覚えたことだよ。',
    victory: '見た目だけで決めちゃだめだよ。',
  },
  boss: {
    intro: '石版に刻むに足る知識を示せ。',
    ready: '封印の前で、言葉を証明せよ。',
    attack: '半端な命令では封印は解けぬ！',
    hurt: 'その命令……石版に届いたか。',
    defeat: '認めよう。石版は、お前に応える。',
    victory: '学び直し、再び石版の前へ来い。',
  },
  review: {
    intro: '忘れた問いを、もう一度映そう。',
    ready: '前に見落としたものは何だ？',
    attack: '曖昧な記憶に、囚われよ。',
    hurt: '今度は、確かに覚えているな。',
    defeat: 'その答えを、忘れないで。',
    victory: '間違いから、また始めればいい。',
  },
  'after-gate': {
    intro: '手にした魔法を、見せてごらん。',
    ready: '見極めた先に、答えがある。',
    attack: '迷いを、光で包もう。',
    hurt: '新しい力を、使いこなしたね。',
    defeat: 'さあ、その知識を次の旅へ。',
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
