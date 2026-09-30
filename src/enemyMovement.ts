import { maps, type Area, type Enemy, type Point } from './content';

export type EnemyPositions = Record<string, Point>;

const distance = (a: Point, b: Point) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export const positionOf = (enemy: Enemy, positions: EnemyPositions): Point => positions[enemy.id] ?? enemy;

export function enemyAt(area: Area, point: Point, positions: EnemyPositions, defeated: string[]): Enemy | undefined {
  return maps[area].enemies.find(enemy => !defeated.includes(enemy.id) && same(positionOf(enemy, positions), point));
}

const canOccupy = (area: Area, point: Point) =>
  maps[area].tiles[point.y]?.[point.x] === '.' &&
  !maps[area].npcs.some(npc => same(npc, point));

const withinTerritory = (enemy: Enemy, point: Point) =>
  !enemy.boss || (point.y <= 3 && point.x >= 8 && point.x <= 15);

export function spawnEnemies(defeated: string[] = []): EnemyPositions {
  const positions: EnemyPositions = {};
  for (const area of ['field', 'dungeon'] as const) {
    const occupied: Point[] = [];
    const tiles = maps[area].tiles;
    const candidates = tiles.flatMap((row, y) => [...row].map((_, x) => ({ x, y })))
      .filter(point => canOccupy(area, point) && distance(point, maps[area].entry) > 2);
    for (const enemy of maps[area].enemies) {
      if (defeated.includes(enemy.id)) continue;
      const choices = candidates.filter(point =>
        withinTerritory(enemy, point) && occupied.every(other => distance(point, other) > 1));
      const point = choices[Math.floor(Math.random() * choices.length)] ?? { x: enemy.x, y: enemy.y };
      positions[enemy.id] = point;
      occupied.push(point);
    }
  }
  return positions;
}

export function moveEnemies(area: Area, current: EnemyPositions, defeated: string[], player: Point): EnemyPositions {
  const next = { ...current };
  let changed = false;
  for (const enemy of maps[area].enemies) {
    if (defeated.includes(enemy.id) || Math.random() < 0.25) continue;
    const from = positionOf(enemy, next);
    const neighbors = [
      { x: from.x, y: from.y - 1 }, { x: from.x + 1, y: from.y },
      { x: from.x, y: from.y + 1 }, { x: from.x - 1, y: from.y },
    ];
    const choices = neighbors.filter(point =>
      canOccupy(area, point) && withinTerritory(enemy, point) && !same(point, player) &&
      !maps[area].enemies.some(other => other.id !== enemy.id && !defeated.includes(other.id) && same(positionOf(other, next), point)));
    if (!choices.length) continue;
    next[enemy.id] = choices[Math.floor(Math.random() * choices.length)];
    changed = true;
  }
  return changed ? next : current;
}
