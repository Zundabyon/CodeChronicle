import { maps as legacyMaps, houses, fieldTownGate, fieldRuinsGate, type Area, type MapData, type Point, type Npc, type Enemy } from '../content';
import { npcSprite, enemySprite } from '../PixelSprite';
import { terrainChips, propChips, buildingChips, characterChips, type TerrainId, type PropId, type BuildingId, type CharacterId, type ObjectDefinition } from './catalog';
import { nativeMaps } from './nativeMaps';

type Placement<Id> = Point & {
  id: string; chip: Id; blocksMovement?: boolean; text?: string;
};
export type PropPlacement = Placement<PropId>;
export type BuildingPlacement = Placement<BuildingId>;
export type CharacterPlacement = Placement<CharacterId> & (
  | {role:'npc'; npc:Npc}
  | {role:'enemy'; enemy:Enemy}
);
export type MapAction = {kind:'dresser'} | {kind:'church'} | {kind:'transition';to:Area;position?:Point};
export type MapEvent = Point & {id:string; trigger:'enter'|'interact'; label:string; action:MapAction};
export type WorldMapInput = {
  environment:'outdoor'|'interior'|'dungeon';
  terrain: TerrainId[][]; entry: Point;
  props: PropPlacement[]; buildings: BuildingPlacement[]; characters: CharacterPlacement[];
  events: MapEvent[];
  // Compatibility exceptions are kept in the adapter, never in the renderer.
  cellOverrides?: Record<string,{enemyAllowed?:boolean}>;
  backdrop?: string;
};
export type WorldMap = WorldMapInput & {
  width:number; height:number; npcs:Npc[]; enemies:Enemy[];
  blocked: ReadonlySet<string>; eventIndex:ReadonlyMap<string,MapEvent[]>;
  minimapOverrides:ReadonlyMap<string,string>;
};
const key = ({x,y}:Point) => `${x},${y}`;

export function createWorldMap(input:WorldMapInput):WorldMap {
  const height=input.terrain.length,width=input.terrain[0]?.length??0;
  if (!width||input.terrain.some(row=>row.length!==width)) throw new Error('地形マップは空でない長方形にしてください');
  for (const row of input.terrain) for (const chip of row) {
    if (!terrainChips[chip]) throw new Error(`未登録の地形チップ: ${chip}`);
  }
  const blocked=new Set<string>(),minimapOverrides=new Map<string,string>();
  const register=(placement:PropPlacement|BuildingPlacement,definition:ObjectDefinition)=>{
    if (!definition) throw new Error(`未登録の配置チップ: ${placement.chip}`);
    if (placement.blocksMovement!==false) {
      for (const offset of definition.blockedCells) blocked.add(key({x:placement.x+offset.x,y:placement.y+offset.y}));
      if (placement.blocksMovement===true&&!definition.blockedCells.length) blocked.add(key(placement));
    }
    if (definition.minimap) minimapOverrides.set(key(placement),definition.minimap);
  };
  const ids=new Set<string>();
  for (const placement of [...input.props,...input.buildings,...input.characters,...input.events]) {
    if(ids.has(placement.id)) throw new Error(`配置IDが重複しています: ${placement.id}`);
    ids.add(placement.id);
  }
  input.props.forEach(placement=>register(placement,propChips[placement.chip]));
  input.buildings.forEach(placement=>register(placement,buildingChips[placement.chip]));
  input.characters.forEach(placement=>{
    if(!characterChips[placement.chip]) throw new Error(`未登録のキャラチップ: ${placement.chip}`);
  });
  const characters:CharacterPlacement[]=input.characters.map(character=>character.role==='npc'?
    {...character,npc:{...character.npc,id:character.id,x:character.x,y:character.y}}:
    {...character,enemy:{...character.enemy,id:character.id,x:character.x,y:character.y}});
  const eventIndex=new Map<string,MapEvent[]>();
  for(const event of input.events) eventIndex.set(key(event),[...eventIndex.get(key(event))??[],event]);
  return {...input,characters,width,height,blocked,eventIndex,minimapOverrides,
    npcs:characters.flatMap(character=>character.role==='npc'?[character.npc]:[]),
    enemies:characters.flatMap(character=>character.role==='enemy'?[character.enemy]:[])};
}

// The old letter grids remain source data during migration. Only this function
// interprets them; gameplay and rendering consume the four-category map.
export function adaptLegacyMap(area:Area,legacy:MapData):WorldMap {
  const environment=area==='town'||area==='field'?'outdoor':area==='dungeon'?'dungeon':'interior';
  const props:PropPlacement[]=[],buildings:BuildingPlacement[]=[],events:MapEvent[]=[];
  const cellOverrides:NonNullable<WorldMapInput['cellOverrides']>={};
  const addProp=(chip:PropId,x:number,y:number,blocksMovement?:boolean)=>props.push({id:`prop-${x}-${y}-${chip}`,chip,x,y,blocksMovement});
  const event=(x:number,y:number,trigger:MapEvent['trigger'],label:string,action:MapAction)=>events.push({id:`event-${x}-${y}`,x,y,trigger,label,action});
  const terrain=legacy.tiles.map((row,y)=>[...row].map((tile,x):TerrainId=>{
    cellOverrides[`${x},${y}`]={enemyAllowed:(area==='field'?['.','s','v','g']:['.']).includes(tile)};
    if(environment==='interior') {
      if(tile==='#') buildings.push({id:`wall-${x}-${y}`,chip:'plasterWall',x,y});
      const furniture:Partial<Record<string,PropId>>={T:'dresser',b:'bed',s:'shelf',c:'chest'};
      if(furniture[tile]) addProp(furniture[tile]!,x,y);
      if(y===0&&x===2) addProp('toolRack',x,y);
      if(y===0&&x===8) addProp('wallSword',x,y);
      if(tile==='T') event(x,y,'interact','タンスを調べる',{kind:'dresser'});
      if(tile==='e') event(x,y,'enter','町へ出る',{kind:'transition',to:'town'});
      return 'woodFloor';
    }
    if(environment==='dungeon') return tile==='#'?'stoneWall':'stoneFloor';
    if(tile==='#'&&area==='town') {addProp('tree',x,y);return 'grass';}
    if(tile==='#') return 'fieldBoundary';
    if(tile==='m') return 'mountain';
    if(tile==='t') {addProp('tree',x,y,false);return 'grass';}
    if(tile==='k') {addProp('cactus',x,y);return 'sand';}
    if(tile==='s') return 'sand';
    if(tile==='r') return x<10+Math.sin(y/7)*3||(x<51&&y<8+Math.sin(x/5)*2)?'sea':'river';
    if(tile==='v') return 'meadow';
    if(tile==='f') event(x,y,'enter','教会',{kind:'church'});
    if(tile==='D') {
      const house=(Object.entries(houses) as [Area,(typeof houses)[keyof typeof houses]][]).find(([,value])=>value.door.x===x&&value.door.y===y);
      if(house) event(x,y,'enter',house[1].name,{kind:'transition',to:house[0]});
    }
    return 'gdDf'.includes(tile)?'road':'grass';
  }));
  if(area==='town') {
    for(const [id,house] of Object.entries(houses)) {
      buildings.push({id:`house-${id}`,chip:'house',x:house.door.x-2,y:house.door.y-3});
      const text=id==='weaponShop'?'武器':id==='armorShop'?'防具':id==='itemShop'?'道具':undefined;
      if(text) props.push({id:`sign-${id}`,chip:'sign',x:house.door.x,y:house.door.y-.63,text});
    }
    buildings.push({id:'church',chip:'church',x:11,y:12});
    event(14,31,'enter','平原へ出る',{kind:'transition',to:'field'});
  }
  if(area==='field') {
    buildings.push({id:'ruins-gate',chip:'ruinsGate',x:fieldRuinsGate.x-1,y:fieldRuinsGate.y-1});
    event(fieldTownGate.x,fieldTownGate.y,'enter','町へ入る',{kind:'transition',to:'town'});
    event(fieldRuinsGate.x,fieldRuinsGate.y,'enter','遺跡への門',{kind:'transition',to:'dungeon'});
  }
  if(area==='dungeon') event(10,11,'enter','平原へ出る',{kind:'transition',to:'field'});
  const characters:CharacterPlacement[]=[
    ...legacy.npcs.map(npc=>({id:npc.id,chip:npcSprite(npc.id) as CharacterId,x:npc.x,y:npc.y,role:'npc' as const,npc})),
    ...legacy.enemies.map(enemy=>({id:enemy.id,chip:enemySprite(enemy.id) as CharacterId,x:enemy.x,y:enemy.y,role:'enemy' as const,enemy})),
  ];
  return createWorldMap({environment,terrain,props,buildings,characters,events,entry:legacy.entry,cellOverrides,
    backdrop:area==='dungeon'?'maps/dungeon-ground.png':undefined});
}

const areaIds=[...new Set([...Object.keys(legacyMaps),...Object.keys(nativeMaps)])] as Area[];
export const worldMaps=Object.fromEntries(areaIds.map(area=>{
  const native=nativeMaps[area],legacy=legacyMaps[area];
  if(native) return [area,createWorldMap(native)];
  if(legacy) return [area,adaptLegacyMap(area,legacy)];
  throw new Error(`マップが未定義です: ${area}`);
})) as Record<Area,WorldMap>;

export const insideMap=(map:WorldMap,point:Point)=>Number.isInteger(point.x)&&Number.isInteger(point.y)&&
  point.x>=0&&point.x<map.width&&point.y>=0&&point.y<map.height;
export const canWalkOnMap=(map:WorldMap,point:Point)=>insideMap(map,point)&&
  terrainChips[map.terrain[point.y][point.x]].walkable&&!map.blocked.has(key(point));
export const canEnemyOccupyMap=(map:WorldMap,point:Point)=>canWalkOnMap(map,point)&&
  (map.cellOverrides?.[key(point)]?.enemyAllowed??terrainChips[map.terrain[point.y][point.x]].enemyAllowed)&&
  !map.eventIndex.has(key(point))&&!map.npcs.some(npc=>npc.x===point.x&&npc.y===point.y);
export const eventAt=(map:WorldMap,point:Point,trigger:MapEvent['trigger'])=>
  map.eventIndex.get(key(point))?.find(event=>event.trigger===trigger);
export const minimapColorAt=(map:WorldMap,point:Point)=>map.minimapOverrides.get(key(point))??
  terrainChips[map.terrain[point.y][point.x]].minimap;
