import { enemyKinds, type Question } from './content';
import { shuffleChoices, withDecoys } from './questionSelection';

// Enemy special abilities (docs/production/roundtable-logs/2026-11-22-enemy-abilities.md).
// Rules from the roundtable: one ability per enemy, never timed, announced in words, and a correct answer always eases it.
export type AbilityId = 'page-scramble' | 'cache-afterimage' | 'memory-leak' | 'deadlock';
/** Per-battle state, never saved. `pending`: twist the next question; `shown`: the current question was twisted. */
export type AbilityState = { pending: boolean; shown: boolean; leak: number; lock: number };
type Ability = { id: AbilityId; name: string; tier: 1 | 2 | 3 | 4; summary: string; onMiss: (s: AbilityState) => string };

export const MAX_LEAK = 3;
const abilities: Record<AbilityId, Ability> = {
  'cache-afterimage': { id: 'cache-afterimage', name: 'キャッシュの残像', tier: 1, summary: '間違えた問題を、並びを変えてもう一度出してくる',
    onMiss: () => '古い答えが残っている……同じ問題がもう一度来る！' },
  'memory-leak': { id: 'memory-leak', name: 'メモリリーク', tier: 2, summary: '間違えるたびに攻撃力が上がる。正解すると少し戻る',
    onMiss: s => `リークが溜まった！ 敵の攻撃力が上がる（リーク ${s.leak}/${MAX_LEAK}）。正解すると1つ解放できる。` },
  deadlock: { id: 'deadlock', name: 'デッドロック封印', tier: 2, summary: '間違えると、まほうとアイテムを2問のあいだ封じる。正解で解除',
    onMiss: () => '鎖が絡みついた！ 次の2問、まほうとアイテムが使えない。正解すれば解ける。' },
  'page-scramble': { id: 'page-scramble', name: 'ページばさみ', tier: 4, summary: '間違えると、次の問題の選択肢が4つ増えて混ざる',
    onMiss: () => '図鑑のページがばらばらに舞い、選択肢が4つ増えて混ざった！' },
};
const byKind: Partial<Record<string, AbilityId>> = { raven: 'cache-afterimage', jelly: 'memory-leak', imp: 'deadlock' };

export const abilityOf = (enemyId: string): Ability | undefined => {
  const id = enemyId === 'mimic-book' ? 'page-scramble' : byKind[enemyKinds[enemyId] ?? ''];
  return id && abilities[id];
};
export const initialAbilityState = (): AbilityState => ({ pending: false, shown: false, leak: 0, lock: 0 });

export function afterAnswer(ability: Ability, s: AbilityState, correct: boolean): AbilityState {
  const twists = ability.id === 'page-scramble' || ability.id === 'cache-afterimage';
  return {
    ...s,
    pending: twists && !correct,
    leak: ability.id !== 'memory-leak' ? s.leak : correct ? Math.max(0, s.leak - 1) : Math.min(MAX_LEAK, s.leak + 1),
    // lock counts questions still to come plus this one; battleNext ticks it down.
    lock: ability.id !== 'deadlock' ? s.lock : correct ? 0 : 3,
  };
}

/** Moves to the next question: applies a pending twist and ticks the deadlock down. */
export function nextQuestion(ability: Ability | undefined, s: AbilityState, current: Question, fresh: Question, pool: Question[]): [Question, AbilityState] {
  const next = { ...s, pending: false, shown: !!ability && s.pending, lock: Math.max(0, s.lock - 1) };
  if (!ability || !s.pending) return [fresh, next];
  return [ability.id === 'page-scramble' ? withDecoys(fresh, pool) : shuffleChoices(current), next];
}

/** Damage the hero takes on a miss; `base` is the usual stat-based damage. */
export function abilityDamage(ability: Ability | undefined, s: AbilityState, base: number, heroMaxHp: number): number {
  if (ability?.id === 'page-scramble') return Math.ceil(heroMaxHp * .45); // two misses survivable, the third is not
  if (ability?.id === 'memory-leak') return Math.round(base * (1 + .25 * s.leak));
  return base;
}

export const sealed = (s: AbilityState | undefined) => !!s && s.lock > 0;
