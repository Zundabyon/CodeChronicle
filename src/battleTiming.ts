// Shared presentation timings in milliseconds. Game results are committed immediately.
export const battleTiming = {
  hero: { duration: 1200, impact: 450 },
  enemy: { duration: 1200, impact: 800 },
  turn: 1300,
} as const;

export type BattleImpact = {
  enemyBefore: number;
  heroBefore: number;
  enemyDamage: number;
  heroDamage: number;
};
