import { maps as legacyMaps, houses, fieldTownGate, fieldRuinsGate, type Area, type MapData, type Point, type Npc, type Enemy } from '../content';
import { npcSprite, enemySprite } from '../PixelSprite';
import { terrainChips, propChips, buildingChips, characterChips, type TerrainId, type PropId, type BuildingId, type CharacterId, type ObjectDefinition } from './catalog';
import { libraryShelves, libraryFloors } from '../library';
import { nativeMaps } from './nativeMaps';
import { dungeonExit } from './caveLayout';
import { mountainVillageGate } from './mountainVillage';
import { mapDecorations } from './decorations';

type Placement<Id> = Point & {
  id: string; chip: Id; blocksMovement?: boolean; text?: string;
};
export type PropPlacement = Placement<PropId>;
export type BuildingPlacement = Placement<BuildingId>;
export type CharacterPlacement = Placement<CharacterId> & (
  | {role:'npc'; npc:Npc}
  | {role:'enemy'; enemy:Enemy}
);
export type MapAction = {kind:'bookshelf';shelf:string} | {kind:'dresser'} | {kind:'church'} | {kind:'transition';to:Area;position?:Point};
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
  const libraryFloor=libraryFloors.find(floor=>floor.area===area);
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
      if(!libraryFloor&&y===0&&x===2) addProp('toolRack',x,y);
      if(!libraryFloor&&y===0&&x===8) addProp('wallSword',x,y);
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
  if(libraryFloor) {
    for(const shelf of libraryShelves.filter(shelf=>shelf.wing===libraryFloor.wing&&shelf.floor===libraryFloor.floor)) {
      event(shelf.x,shelf.y,'interact',`${shelf.language}・${shelf.topic}の本棚を読む`,{kind:'bookshelf',shelf:shelf.id});
      props.push({id:`label-${shelf.id}`,chip:'sign',x:shelf.x,y:shelf.y-.7,text:shelf.topic});
    }
    const stairs=(x:number,label:string,to:Area,position:Point)=>{
      addProp('stairs',x,6,false);
      props.push({id:`stairs-label-${x}`,chip:'sign',x,y:5.4,text:label});
      event(x,6,'enter',label,{kind:'transition',to,position});
    };
    const above=libraryFloors.find(floor=>floor.wing===libraryFloor.wing&&floor.floor===libraryFloor.floor+1);
    const below=libraryFloors.find(floor=>floor.wing===libraryFloor.wing&&floor.floor===libraryFloor.floor-1);
    if(above) stairs(9,`${above.floor}階へ ▲`,above.area,{x:1,y:5});
    if(below) stairs(1,`${below.floor}階へ ▼`,below.area,{x:9,y:5});
    if(area==='scholarHouse'||area==='backendLibrary') {
      const west=area==='scholarHouse',x=west?10:0;
      const label=west?'東棟・バックエンドへ':'西棟・フロントエンドへ';
      event(x,4,'enter',label,{kind:'transition',to:west?'backendLibrary':'scholarHouse',position:{x:west?1:9,y:4}});
      props.push({id:'connecting-hall-label',chip:'sign',x:west?9:1,y:3.5,text:west?'東棟へ ▶':'◀ 西棟へ'});
    }
  }
  if(area==='town') {
    for(const [id,house] of Object.entries(houses)) {
      buildings.push({id:`house-${id}`,chip:'house',x:house.door.x-2,y:house.door.y-3});
      props.push({id:`wall-lantern-${id}`,chip:'wallLantern',x:house.door.x-.55,y:house.door.y-1.15});
      const text=id==='weaponShop'?'武器':id==='armorShop'?'防具':id==='itemShop'?'道具':id==='elderHouse'?'村長':id==='guestHouse'?'旅籠':id==='scholarHouse'?'西棟・フロントエンド':id==='backendLibrary'?'東棟・バックエンド':undefined;
      if(text) props.push({id:`sign-${id}`,chip:'sign',x:house.door.x,y:house.door.y-.63,text});
    }
    props.push({id:'library-connecting-hall',chip:'libraryHall',x:24.5,y:5.4});
    buildings.push({id:'church',chip:'church',x:11,y:12});
    props.push({id:'wall-lantern-church',chip:'wallLantern',x:12.45,y:13.85});
    event(14,31,'enter','平原へ出る',{kind:'transition',to:'field'});
  }
  if(area==='field') {
    buildings.push({id:'mountain-village-gate',chip:'villageGate',x:mountainVillageGate.x-1,y:mountainVillageGate.y-2});
    props.push({id:'mountain-village-sign',chip:'sign',x:mountainVillageGate.x,y:mountainVillageGate.y-.6,text:'石灯の村'});
    event(mountainVillageGate.x,mountainVillageGate.y,'enter','石灯の村へ',{kind:'transition',to:'village'});
    buildings.push({id:'ruins-gate',chip:'ruinsGate',x:fieldRuinsGate.x-1,y:fieldRuinsGate.y-1});
    event(fieldTownGate.x,fieldTownGate.y,'enter','町へ入る',{kind:'transition',to:'town'});
    event(fieldRuinsGate.x,fieldRuinsGate.y,'enter','遺跡への門',{kind:'transition',to:'dungeon'});
  }
  if(area==='dungeon') {
    event(dungeonExit.x,dungeonExit.y,'enter','平原へ出る',{kind:'transition',to:'field'});
    props.push({id:'dungeon-exit-sign',chip:'sign',x:dungeonExit.x,y:dungeonExit.y-.45,text:'出口 ▼'});
    props.push({id:'dungeon-entry-lantern',chip:'lantern',x:dungeonExit.x-1,y:dungeonExit.y-1});
  }
  const characters:CharacterPlacement[]=[
    ...legacy.npcs.map(npc=>({id:npc.id,chip:npcSprite(npc.id) as CharacterId,x:npc.x,y:npc.y,role:'npc' as const,npc})),
    ...legacy.enemies.map(enemy=>({id:enemy.id,chip:enemySprite(enemy.id) as CharacterId,x:enemy.x,y:enemy.y,role:'enemy' as const,enemy})),
  ];
  return createWorldMap({environment,terrain,props:[...props,...mapDecorations[area]??[]],buildings,characters,events,entry:legacy.entry,cellOverrides,
    backdrop:undefined});
}

const areaIds=[...new Set([...Object.keys(legacyMaps),...Object.keys(nativeMaps)])] as Area[];
export const worldMaps=Object.fromEntries(areaIds.map(area=>{
  const native=nativeMaps[area],legacy=legacyMaps[area];
  if(native) return [area,createWorldMap({...native,props:[...native.props,...mapDecorations[area]??[]]})];
  if(legacy) return [area,adaptLegacyMap(area,legacy)];
  throw new Error(`マップが未定義です: ${area}`);
})) as Record<Area,WorldMap>;

export const insideMap=(map:WorldMap,point:Point)=>Number.isInteger(point.x)&&Number.isInteger(point.y)&&
  point.x>=0&&point.x<map.width&&point.y>=0&&point.y<map.height;
export const canWalkOnMap=(map:WorldMap,point:Point)=>insideMap(map,point)&&
  terrainChips[map.terrain[point.y][point.x]].walkable&&!map.blocked.has(key(point));
export const dungeonFieldReturn:Point={x:fieldRuinsGate.x-1,y:fieldRuinsGate.y+1};

export function reachableMapCells(map:WorldMap):ReadonlySet<string> {
  const seen=new Set<string>(),queue:Point[]=[];
  const npcCells=new Set(map.npcs.map(key));
  const visit=(point:Point)=>{
    const cell=key(point);
    if(!seen.has(cell)&&canWalkOnMap(map,point)&&!npcCells.has(cell)) {
      seen.add(cell); queue.push(point);
    }
  };
  visit(map.entry);
  for(let head=0;head<queue.length;head++) {
    const {x,y}=queue[head];
    visit({x:x+1,y}); visit({x:x-1,y}); visit({x,y:y+1}); visit({x,y:y-1});
  }
  return seen;
}
// Road updates can leave an old save on isolated grass, even when that tile is walkable.
export function restoreMapPosition(map:WorldMap,point:Point):Point {
  const reachable=reachableMapCells(map);
  if(reachable.has(key(point))) return point;
  if(!insideMap(map,point)) return map.entry;
  let nearest=map.entry,distance=Infinity;
  for(const cell of reachable) {
    const [x,y]=cell.split(',').map(Number),candidate={x,y};
    if(map.eventIndex.get(cell)?.some(event=>event.trigger==='enter')) continue;
    const nextDistance=Math.abs(x-point.x)+Math.abs(y-point.y);
    if(nextDistance<distance) {nearest=candidate;distance=nextDistance;}
  }
  return nearest;
}
export const canEnemyOccupyMap=(map:WorldMap,point:Point)=>canWalkOnMap(map,point)&&
  (map.cellOverrides?.[key(point)]?.enemyAllowed??terrainChips[map.terrain[point.y][point.x]].enemyAllowed)&&
  !map.eventIndex.has(key(point))&&!map.npcs.some(npc=>npc.x===point.x&&npc.y===point.y);
export const eventAt=(map:WorldMap,point:Point,trigger:MapEvent['trigger'])=>
  map.eventIndex.get(key(point))?.find(event=>event.trigger===trigger);
export const minimapColorAt=(map:WorldMap,point:Point)=>map.minimapOverrides.get(key(point))??
  terrainChips[map.terrain[point.y][point.x]].minimap;
