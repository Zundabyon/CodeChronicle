import { enemyKinds, type Question } from './content';
import { shuffleChoices, withDecoys } from './questionSelection';

// Enemy special abilities (docs/production/roundtable-logs/2026-11-22-enemy-abilities.md).
// Rules from the roundtable: one ability per enemy, never timed, announced in words, and a correct answer always eases it.
// Bosses use the same four mechanics as named special moves (必殺技) at LV1–3; a higher level makes the effect stronger.
export type AbilityId = 'page-scramble' | 'cache-afterimage' | 'memory-leak' | 'deadlock';
export type AbilityLevel = 1 | 2 | 3;
/** Per-battle state, never saved. `pending`: twist the next question; `shown`: the current question was twisted. */
export type AbilityState = { pending: boolean; shown: boolean; leak: number; lock: number };
type Ability = { id: AbilityId; level: AbilityLevel; name: string; boss: boolean; summary: string; onMiss: (s: AbilityState) => string };

export const MAX_LEAK = 3;
/** Strength per level: decoy choices added, extra decoys on a repeated question, attack boost per leak, questions sealed. */
const power = {
  decoys: { 1: 2, 2: 3, 3: 4 },
  repeatDecoys: { 1: 0, 2: 1, 3: 2 },
  leakBoost: { 1: .15, 2: .25, 3: .4 },
  sealed: { 1: 1, 2: 2, 3: 3 },
} as const;

const describe = (id: AbilityId, level: AbilityLevel) => ({
  'page-scramble': `間違えると、次の問題の選択肢が${power.decoys[level]}つ増えて混ざる`,
  'cache-afterimage': `間違えた問題を、並びを変えてもう一度出してくる${power.repeatDecoys[level] ? `（選択肢も${power.repeatDecoys[level]}つ増える）` : ''}`,
  'memory-leak': `間違えるたびに攻撃力が${Math.round(power.leakBoost[level] * 100)}%ずつ上がる（最大${MAX_LEAK}段）。正解すると1段戻る`,
  deadlock: `間違えると、まほうとアイテムを${power.sealed[level]}問のあいだ封じる。正解で解除`,
})[id];
const missLine = (id: AbilityId, level: AbilityLevel, s: AbilityState) => ({
  'page-scramble': `選択肢が${power.decoys[level]}つ増えて混ざった！`,
  'cache-afterimage': `同じ問題がもう一度来る！${power.repeatDecoys[level] ? `しかも選択肢が${power.repeatDecoys[level]}つ増えている！` : ''}`,
  'memory-leak': `攻撃力が上がった！（${s.leak}/${MAX_LEAK}段、+${Math.round(power.leakBoost[level] * 100 * s.leak)}%）正解すると1段戻る。`,
  deadlock: `次の${power.sealed[level]}問、まほうとアイテムが使えない。正解すれば解ける。`,
})[id];

// [mechanic, level, name, intro line on a miss]. Ordinary monsters by kind, bosses by id.
type Move = [AbilityId, AbilityLevel, string, string];
const byKind: Partial<Record<string, Move>> = {
  raven: ['cache-afterimage', 1, 'キャッシュの残像', '古い答えが残っている……'],
  jelly: ['memory-leak', 2, 'メモリリーク', 'リークが溜まった！'],
  imp: ['deadlock', 2, 'デッドロック封印', '鎖が絡みついた！'],
};
const bossMoves: Record<string, Move> = {
  boss: ['memory-leak', 1, '暴走する門番の怒り', '守護者の拳に、怒りがこもっていく！'],
  'ranger-read': ['page-scramble', 1, 'すりかえ栞', 'はい、それ別の人の記録でしたー！'],
  'ranger-create': ['memory-leak', 1, 'お友達いっぱい', '空っぽの住人が、どんどん増えていく！'],
  'ranger-update': ['cache-afterimage', 2, 'ぜんぶ塗りかえ', '答えごと、ぜんぶ同じ色に塗りかえられた！'],
  'ranger-delete': ['deadlock', 2, 'しずかにする', '……しずかにして。手の中の道具が、消えたように動かない！'],
  hedoro: ['page-scramble', 2, 'からみつく麺', 'ぐちゃぐちゃの麺が、選択肢にからみついた！'],
  clown: ['cache-afterimage', 3, 'お一人様ずつ、ご案内', '次の方〜！ ……と思ったら、さっきのキミだ！'],
  graphius: ['memory-leak', 3, '改竄の羽ペン', '誤りが帳簿に記された！ 罪が重なるほど、羽ペンは鋭くなる！'],
  'mimic-book': ['page-scramble', 3, 'ページばさみ', '図鑑のページがばらばらに舞った！'],
};

export const abilityOf = (enemyId: string): Ability | undefined => {
  const boss = bossMoves[enemyId], move = boss ?? byKind[enemyKinds[enemyId] ?? ''];
  if (!move) return undefined;
  const [id, level, name, cry] = move;
  return { id, level, name, boss: !!boss, summary: describe(id, level), onMiss: s => `${name}！ ${cry} ${missLine(id, level, s)}` };
};
export const initialAbilityState = (): AbilityState => ({ pending: false, shown: false, leak: 0, lock: 0 });

export function afterAnswer(ability: Ability, s: AbilityState, correct: boolean): AbilityState {
  const twists = ability.id === 'page-scramble' || ability.id === 'cache-afterimage';
  return {
    ...s,
    pending: twists && !correct,
    leak: ability.id !== 'memory-leak' ? s.leak : correct ? Math.max(0, s.leak - 1) : Math.min(MAX_LEAK, s.leak + 1),
    // lock counts questions still to come plus this one; battleNext ticks it down.
    lock: ability.id !== 'deadlock' ? s.lock : correct ? 0 : power.sealed[ability.level] + 1,
  };
}

/** Moves to the next question: applies a pending twist and ticks the deadlock down. */
export function nextQuestion(ability: Ability | undefined, s: AbilityState, current: Question, fresh: Question, pool: Question[]): [Question, AbilityState] {
  const next = { ...s, pending: false, shown: !!ability && s.pending, lock: Math.max(0, s.lock - 1) };
  if (!ability || !s.pending) return [fresh, next];
  if (ability.id === 'page-scramble') return [withDecoys(fresh, pool, power.decoys[ability.level]), next];
  // Repeat from the catalog copy so decoys never pile up across repeated misses.
  const original = pool.find(o => o.id === current.id) ?? current, extra = power.repeatDecoys[ability.level];
  return [extra ? withDecoys(original, pool, extra) : shuffleChoices(original), next];
}

/** Damage the hero takes on a miss; `base` is the usual stat-based damage. */
export function abilityDamage(ability: Ability | undefined, s: AbilityState, base: number, heroMaxHp: number): number {
  if (ability?.id === 'page-scramble' && ability.boss && ability.level === 3) return Math.ceil(heroMaxHp * .45); // the mimic book: two misses survivable, the third is not
  if (ability?.id === 'memory-leak') return Math.round(base * (1 + power.leakBoost[ability.level] * s.leak));
  return base;
}

export const sealed = (s: AbilityState | undefined) => !!s && s.lock > 0;
