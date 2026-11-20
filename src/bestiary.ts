import { areaLabel, enemyKinds, type Area } from './content';
import { enemyStats, type EnemyStats } from './enemyStats';
import { worldMaps } from './world/maps';
import { rangerBattles } from './quests/rangerBattles';

export type BestiaryEntry = { key: string; area: Area; areaName: string; name: string; spriteId: string; ids: string[]; stats: EnemyStats };

// One entry per monster name in each area; story foes (rangers, bosses) fight by question sets, not stats.
export const bestiary: BestiaryEntry[] = (() => {
  const entries = new Map<string, BestiaryEntry>();
  for (const [area, map] of Object.entries(worldMaps) as [Area, typeof worldMaps[Area]][]) {
    for (const enemy of map.enemies) {
      if (enemy.boss || rangerBattles[enemy.id] || enemy.id === 'after-gate' || !enemyKinds[enemy.id]) continue;
      const key = `${area}:${enemy.name}`;
      const entry = entries.get(key);
      if (entry) entry.ids.push(enemy.id);
      else entries.set(key, { key, area, areaName: areaLabel[area], name: enemy.name, spriteId: enemy.id, ids: [enemy.id], stats: enemyStats(enemy, area) });
    }
  }
  return [...entries.values()].sort((a, b) => a.stats.level - b.stats.level || a.area.localeCompare(b.area) || a.stats.hp - b.stats.hp);
})();
