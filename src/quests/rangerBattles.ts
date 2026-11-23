import type { Enemy } from '../content';
import { rangerBattleSets } from '../rangerBattleQuestions';
import { hedoroBattleSet } from '../hedoroBattleQuestions';
import { clownBattleSet } from '../clownBattleQuestions';
import { questions } from '../content';

// Required story battles: each attempt draws `count` questions at random from the set; one correct answer is one point of damage.
// Enemy ids double as sprite names (public/sprites/<id>-right.png).
type RangerBattle = { enemy: Enemy; set: string[]; count: number; hint: string };
const foe = (id: string, name: string, attackName: string): Enemy => ({ id, name, attackName, x: 0, y: 0, icon: '✦' });
export const rangerBattles: Record<string, RangerBattle> = {
  'ranger-read': { enemy: foe('ranger-read', 'ノゾミ・ブルー', 'あっちの記録だよ♪'), set: rangerBattleSets.r, count: 5,
    hint: '読解の書庫の石板：番号なしの GET は一覧の index、番号付きの GET は1件の show。どちらも読むだけで記録は変わらない。' },
  'ranger-create': { enemy: foe('ranger-create', 'ツクネ・アンバー', 'お友達いっぱい'), set: rangerBattleSets.c, count: 5,
    hint: '創生の工房の石板：create はフォームを開くだけ。store は検証を通った入力だけを新しい1行として保存する。' },
  'ranger-update': { enemy: foe('ranger-update', 'ヌリエ・ジェイド', 'ぜんぶ塗りかえ'), set: rangerBattleSets.u, count: 5,
    hint: '改変の回廊の石板：edit で対象を確かめ、IDを指定した update でその行だけを書き換える。条件のない更新は全行に届く。' },
  'ranger-delete': { enemy: foe('ranger-delete', 'ケシ・パープル', 'しずかにする'), set: rangerBattleSets.d, count: 5,
    hint: '忘却の墓所の石板：控えと照合したIDだけを destroy で消す。消した行は戻らない。' },
  graphius: { enemy: foe('graphius', '記録卿グラフィウス', '羽ペンの裁定'), set: rangerBattleSets.graphius, count: 7,
    hint: '四つの記憶を思い出そう：一覧と詳細は読むだけ、フォームを開くだけでも変わらない。保存・更新・削除はどの行に届くかを確かめる。' },
  // Optional side boss: three hard Laravel questions; its bite takes almost half the hero's HP.
  'mimic-book': { enemy: foe('mimic-book', '人喰い図鑑ミミック', 'ページばさみ'), count: 3,
    set: questions.filter(q => q.difficulty === 'advanced' && q.topic === 'laravel' && q.options).map(q => q.id),
    hint: '図鑑の牙が食い込む……。落ち着いて、問いの条件を一つずつ確かめよう。' },
  clown: { enemy: foe('clown', '道化師エヌコイールイーチ', 'お一人様ずつご案内'), set: clownBattleSet, count: 7,
    hint: '学者の覚え書き：ループの中で毎回つながりを辿ると、件数ぶん問い合わせが増える。with でまとめて先に読み込めば2回で済む。' },
  hedoro: { enemy: foe('hedoro', 'ヘドロの主・スパゲッティ', 'ねばねばスパゲッティ'), set: hedoroBattleSet, count: 7,
    hint: 'ふり返りの石板：名前ではなく中身で役割を見る。取り出す番号・絞り込み・保存の有無を一つずつ確かめよう。' },
};
/** Questions for one attempt: a Fisher-Yates shuffle of the set, cut to the battle's count. */
export const drawSet = ({ set, count }: RangerBattle) => {
  const order = [...set];
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return order.slice(0, count);
};
