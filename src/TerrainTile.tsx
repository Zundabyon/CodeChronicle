import { terrainChips, type TerrainId } from './world/catalog';

type Props = {
  tiles: TerrainId[][];
  x: number;
  y: number;
  textureId: string;
};

const connection = (tile: string | undefined) => tile ? terrainChips[tile as TerrainId]?.connection : undefined;
const isRoad = (tile: string | undefined) => connection(tile) === 'road';
const isSand = (tile: string | undefined) => connection(tile) === 'sand';

// Each quarter uses its two adjacent cells and diagonal. Coordinates stay on a
// 16px grid so both outside corners and inside corners retain stepped pixels.
export function terrainContour(
  tiles: readonly (readonly string[])[], x: number, y: number,
  matches: (tile: string | undefined) => boolean, inset: number,
) {
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy]) => {
    // Continue at the map edge rather than drawing a false shoreline there.
    const neighbor = (offsetX: number, offsetY: number) =>
      matches(tiles[y + offsetY]?.[x + offsetX] ?? tiles[y][x]);
    const horizontal = neighbor(dx, 0), vertical = neighbor(0, dy);
    const left = horizontal ? 0 : inset, top = vertical ? 0 : inset;
    let points: number[][];
    if (horizontal && vertical && !neighbor(dx, dy)) {
      points = [[inset, 0], [8, 0], [8, 8], [0, 8], [0, inset], [inset, inset]];
    } else if (!horizontal && !vertical) {
      points = [[left + 2, top], [8, top], [8, 8], [left, 8], [left, top + 2], [left + 1, top + 2], [left + 1, top + 1], [left + 2, top + 1]];
    } else {
      points = [[left, top], [8, top], [8, 8], [left, 8]];
    }
    return points.map(([px, py], index) =>
      `${index ? 'L' : 'M'}${dx < 0 ? px : 16 - px},${dy < 0 ? py : 16 - py}`,
    ).join(' ') + 'Z';
  }).join(' ');
}

export function TerrainTextures({ id }: { id: string }) {
  return <svg className="terrain-definitions" aria-hidden="true" width="0" height="0">
    <defs>
      {Object.entries(terrainChips).filter(([,chip])=>chip.image).map(([texture,chip]) =>
        <pattern key={texture} id={`${id}-${texture}`} patternUnits="userSpaceOnUse" width="16" height="16">
          {chip.connection === 'water' ? <g className="terrain-water-motion">
            {[-16, 0, 16].map(offset => <image key={offset} x={offset} href={`${import.meta.env.BASE_URL}${chip.image}`} width="16" height="16" preserveAspectRatio="none" />)}
          </g> : <image href={`${import.meta.env.BASE_URL}${chip.image}`} width="16" height="16" preserveAspectRatio="none" />}
        </pattern>,
      )}
    </defs>
  </svg>;
}

export function TerrainTile({ tiles, x, y, textureId }: Props) {
  const tile = tiles[y][x];
  const road = isRoad(tile), sand = isSand(tile), water = connection(tile) === 'water';
  if (!road && !sand && !water) return null;
  const nearbySand = [-1, 0, 1].flatMap(dy => [-1, 0, 1].map(dx => tiles[y + dy]?.[x + dx]))
    .filter(isSand).length;
  const texture = (name: string) => `url(#${textureId}-${name})`;
  const matches = water ? (value: string | undefined) => connection(value) === 'water' : road ? isRoad :
    (value: string | undefined) => isSand(value) || isRoad(value);
  return <svg className="terrain-tile" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
    <path d="M0,0H16V16H0Z" fill={texture(!sand && nearbySand > 0 ? 'sand' : 'grass')} />
    {water && <path d={terrainContour(tiles, x, y, matches, 1)} fill="#a58b55" />}
    <path d={terrainContour(tiles, x, y, matches, water ? 2 : road ? 3 : 1)} fill={texture(tile)} />
  </svg>;
}
