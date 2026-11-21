import { enemyKinds, type Area, type Enemy, type EnemyKind } from './content';

export type EnemyStats = { level: number; hp: number; attack: number; defense: number; xp: number; gold: number };

// How deep the area sits in the journey; enemies grow stronger with it.
const areaTier: Partial<Record<Area, number>> = {
  town: 1, field: 1, dungeon: 2,
  librarySecondFloor: 2, libraryThirdFloor: 3, libraryFourthFloor: 3, backendSecondFloor: 3,
  crudRead: 3, crudCreate: 4, crudUpdate: 4, crudDelete: 5, village: 4, undersea: 6,
};

// [hp, attack, defense] adjustments that give each kind its own feel.
const kindTraits: Record<EnemyKind, [number, number, number]> = {
  slime: [-1, -1, 0], bat: [-2, 0, 0], moth: [-2, 0, 0], wisp: [-1, 1, 0], ghost: [0, 1, 0],
  shadow: [1, 1, 0], memory: [1, 0, 1], crab: [0, 0, 2], beetle: [1, 0, 2], wolf: [0, 2, 0],
  scorpion: [0, 2, 0], serpent: [1, 1, 1], cactus: [2, 0, 1], treant: [3, 0, 1], skeleton: [1, 1, 1],
  mimic: [2, 2, 0], golem: [4, 0, 2], guardian: [4, 2, 2],
  imp: [0, 3, 0], jelly: [2, -1, 1], raven: [-1, 2, 1],
};

export function enemyStats(enemy: Enemy, area: Area | string): EnemyStats {
  const tier = areaTier[area as Area] ?? 1;
  const [hp, attack, defense] = kindTraits[enemyKinds[enemy.id] ?? 'shadow'];
  return {
    level: tier * 2 - 1,
    hp: Math.max(3, 3 + tier * 2 + hp),
    attack: Math.max(1, 1 + tier * 2 + attack),
    defense: Math.max(0, Math.floor(tier / 2) + defense - 1),
    xp: 2 + tier * 2 + Math.max(0, hp + attack + defense),
    gold: 20 + tier * 15,
  };
}

// Hero strength grows with level, so leveling up shortens fights and softens hits.
export const heroAttack = (level: number, weaponPower: number) => 2 + Math.floor(level / 2) + weaponPower;
export const heroDefense = (level: number, armorPower: number) => Math.floor(level / 2) + armorPower;

// Fighting far below your level gives less experience, so grinding easy foes stays slow.
export const scaledXp = (xp: number, heroLevel: number, enemyLevel: number) =>
  heroLevel > enemyLevel + 2 ? Math.max(1, Math.floor(xp / (heroLevel - enemyLevel - 1))) : xp;
