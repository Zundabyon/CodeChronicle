import type { Enemy } from './content';

type EnemyBanter = {
  intro: string;
  ready: string;
  attack: string;
  hurt: string;
  defeat: string;
  victory: string;
};

const lines: Record<string, EnemyBanter> = {
  f1: {
    intro: 'ぴちゃっ！ その知識、溶かしてやる！',
    ready: 'まだまだ跳ねるぞ、ぴちゃっ！',
    attack: 'バグまみれになっちゃえ！',
    hurt: 'ぴちゃっ!? 正解は熱い！',
    defeat: 'ぼくのバグが……直っちゃう……。',
    victory: 'ぴちゃっ！ また解きにおいで！',
  },
  f2: {
    intro: '静かな答えなんて、ノイズで消す！',
    ready: '羽音の中でも考えられるかな？',
    attack: '耳を澄ませても、もう遅い！',
    hurt: 'その一撃、聞こえなかったことに……！',
    defeat: 'くっ、答えがはっきり聞こえる……。',
    victory: '迷いの音が、まだ残っているよ。',
  },
  f3: {
    intro: '入力を間違えれば、ここから出られない。',
    ready: '次の命令を、見せてみろ。',
    attack: '思考を停止させる。',
    hurt: 'その答え……実行できたのか。',
    defeat: '命令が……書き換わった……。',
    victory: 'もう一度、手順を確かめることだ。',
  },
  d1: {
    intro: '欠けた記憶で、私の刃を見切れるか。',
    ready: '隙を見せれば、そこを断つ。',
    attack: 'その迷い、切り離してやる！',
    hurt: '断片をつなぎ合わせた……だと？',
    defeat: '答えが、ひとつの形になったか……。',
    victory: '知識の継ぎ目が、まだ甘い。',
  },
  d3: {
    intro: '覚えたことから、忘れていくがいい。',
    ready: 'その記憶、いつまで保てる？',
    attack: 'その答えごと、奪おう。',
    hurt: '忘れずに、思い出したのか……。',
    defeat: '記憶は……お前の中に残る……。',
    victory: '失った答えは、また拾い集めよ。',
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
  const foe = enemy.id === 'd2' ? lines.f3 : lines[enemy.id] ?? lines.d1;
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
