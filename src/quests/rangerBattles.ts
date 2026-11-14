import type { Enemy } from '../content';
import { rangerBattleSets } from '../rangerBattleQuestions';

// Required story battles: the set is asked in order, one correct answer is one point of damage.
// Enemy ids double as sprite names (public/sprites/<id>-right.png).
type RangerBattle = { enemy: Enemy; set: string[]; hint: string };
const foe = (id: string, name: string, attackName: string): Enemy => ({ id, name, attackName, x: 0, y: 0, icon: '✦' });
export const rangerBattles: Record<string, RangerBattle> = {
  'ranger-read': { enemy: foe('ranger-read', 'ノゾミ・ブルー', 'あっちの記録だよ♪'), set: rangerBattleSets.r,
    hint: '読解の書庫の石板：番号なしの GET は一覧の index、番号付きの GET は1件の show。どちらも読むだけで記録は変わらない。' },
  'ranger-create': { enemy: foe('ranger-create', 'ツクネ・アンバー', 'お友達いっぱい'), set: rangerBattleSets.c,
    hint: '創生の工房の石板：create はフォームを開くだけ。store は検証を通った入力だけを新しい1行として保存する。' },
  'ranger-update': { enemy: foe('ranger-update', 'ヌリエ・ジェイド', 'ぜんぶ塗りかえ'), set: rangerBattleSets.u,
    hint: '改変の回廊の石板：edit で対象を確かめ、IDを指定した update でその行だけを書き換える。条件のない更新は全行に届く。' },
  'ranger-delete': { enemy: foe('ranger-delete', 'ケシ・パープル', 'しずかにする'), set: rangerBattleSets.d,
    hint: '忘却の墓所の石板：控えと照合したIDだけを destroy で消す。消した行は戻らない。' },
  graphius: { enemy: foe('graphius', '記録卿グラフィウス', '羽ペンの裁定'), set: rangerBattleSets.graphius,
    hint: '四つの記憶を思い出そう：一覧と詳細は読むだけ、フォームを開くだけでも変わらない。保存・更新・削除はどの行に届くかを確かめる。' },
};
/** Retry order: a Fisher-Yates shuffle of the set (the first attempt keeps the defined order). */
export const shuffledSet = (set: string[]) => {
  const order = [...set];
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return order;
};
