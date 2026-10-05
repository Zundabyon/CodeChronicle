export type HeroTechnique = { name: string; motion: 0 | 1 | 2 };

// Motions correspond to the battle scene's slash, sweep, and thrust animations.
export const heroTechniques = [
  { name: '型刻みの一閃', motion: 0 },
  { name: '変数斬り', motion: 0 },
  { name: '関数の閃刃', motion: 0 },
  { name: '分岐の太刀', motion: 0 },
  { name: '配列断ち', motion: 0 },
  { name: '継承の剣閃', motion: 0 },
  { name: '論理の月影', motion: 0 },
  { name: '構文の居合', motion: 0 },

  { name: '再帰の旋風', motion: 1 },
  { name: '反復の風刃', motion: 1 },
  { name: '連結の大薙ぎ', motion: 1 },
  { name: '並列の乱舞', motion: 1 },
  { name: '循環の蒼嵐', motion: 1 },
  { name: '条件の風車', motion: 1 },
  { name: '集合の円舞', motion: 1 },
  { name: '演算の烈風', motion: 1 },

  { name: '参照の鋭槍', motion: 2 },
  { name: '返値の貫き', motion: 2 },
  { name: '型守りの刺突', motion: 2 },
  { name: '規則の星突き', motion: 2 },
  { name: '記憶の穿ち', motion: 2 },
  { name: '引数の流星', motion: 2 },
  { name: '写像の竜牙', motion: 2 },
  { name: '真偽の一突き', motion: 2 },
] as const satisfies readonly HeroTechnique[];

export function chooseHeroTechnique(previous?: HeroTechnique | null): HeroTechnique {
  const candidates = previous
    ? heroTechniques.filter(technique => technique.name !== previous.name)
    : heroTechniques;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
