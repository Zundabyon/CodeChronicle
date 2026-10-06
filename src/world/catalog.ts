import type { CharacterName } from '../WorldCharacter';
import type { SpriteName } from '../PixelSprite';
import type { Point } from '../content';

export const terrainSets = {
  grassland: '草原', river: '川・湖', sea: '海', cave: '洞窟', mountain: '山',
  desert: '砂漠', snow: '雪', abyss: '奈落', space: '宇宙', otherworld: '別世界',
  hell: '地獄', underworld: '冥界', ruins: '遺跡', interior: '室内',
} as const;
export type TerrainSet = keyof typeof terrainSets;

// Sizes and anchors are measured in map cells, independently of image pixels.
export type Visual = {
  width: number; height: number; anchor: Point;
} & (
  | { renderer: 'image'; src: string }
  | { renderer: 'person'; name: CharacterName }
  | { renderer: 'sprite'; name: SpriteName }
  | { renderer: 'text'; text: string }
);
export type TerrainDefinition = {
  category: 'terrain'; label: string; set: TerrainSet;
  color: string; image?: string; minimap: string;
  walkable: boolean; enemyAllowed: boolean;
  connection?: 'road' | 'sand' | 'water'; overlay?: Visual; transparentOnBackdrop?:boolean;
};
export type ObjectDefinition = {
  category: 'prop' | 'building' | 'character'; label: string; visual: Visual;
  blockedCells: Point[]; layer: 'ground' | 'depth' | 'overhead';
  minimap?: string;
};
const image = (src: string, width = 1, height = 1, anchor: Point = {x: .5, y: 1}): Visual =>
  ({renderer: 'image', src: `maps/${src}`, width, height, anchor});
const terrain = (label: string, set: TerrainSet, color: string, minimap: string,
  options: Partial<Omit<TerrainDefinition, 'category' | 'label' | 'set' | 'color' | 'minimap'>> = {},
): TerrainDefinition => ({category: 'terrain', label, set, color, minimap, walkable: true, enemyAllowed: true, ...options});
const prop = (label: string, visual: Visual, blocks = true, layer: ObjectDefinition['layer'] = 'depth', minimap?: string): ObjectDefinition =>
  ({category: 'prop', label, visual, blockedCells: blocks ? [{x:0,y:0}] : [], layer, minimap});

export const terrainChips = {
  grass: terrain('草地', 'grassland', '#459149', '#79a65a', {image:'maps/grass-64.png'}),
  meadow: terrain('花の草地', 'grassland', '#86a84b', '#a2b767', {image:'maps/grass-64.png'}),
  road: terrain('土の道', 'grassland', '#b78a50', '#c8ad83', {image:'maps/path-64.png',connection:'road'}),
  sand: terrain('砂地', 'desert', '#d8b26c', '#dab56d', {image:'maps/desert-sand-64.png',connection:'sand'}),
  river: terrain('川・湖の水面', 'river', '#1262b4', '#347cb5', {image:'maps/water-64.png',connection:'water',walkable:false,enemyAllowed:false}),
  sea: terrain('海の水面', 'sea', '#1262b4', '#347cb5', {image:'maps/water-64.png',connection:'water',walkable:false,enemyAllowed:false}),
  mountain: terrain('山地', 'mountain', '#606968', '#777985', {walkable:false,enemyAllowed:false,overlay:image('mountain-64.png',1.1,1.1)}),
  fieldBoundary: terrain('世界の外縁', 'mountain', '#365453', '#223849', {walkable:false,enemyAllowed:false,overlay:image('mountain-64.png',1.1,1.1)}),
  stoneFloor: terrain('遺跡の床', 'ruins', '#706d79', '#706d79', {transparentOnBackdrop:true}),
  stoneWall: terrain('遺跡の壁', 'ruins', '#282530d4', '#3a3741', {walkable:false,enemyAllowed:false}),
  woodFloor: terrain('板張りの床', 'interior', '#805a3a', '#805a3a', {image:'maps/wood-floor-64.png'}),
} satisfies Record<string,TerrainDefinition>;
export type TerrainId = keyof typeof terrainChips;

export const propChips = {
  tree: prop('木',image('tree-64.png',1.55,1.55),true,'depth','#2d6a3d'),
  cactus: prop('サボテン',image('cactus-64.png',1.15,1.3),true,'depth','#799054'),
  chest: prop('宝箱',image('chest-64.png',.92,.92)),
  dresser: prop('タンス',image('dresser-64.png',.92,.92)),
  bed: prop('ベッド',image('bed-64.png',.92,.92)),
  shelf: prop('棚',image('shelf-64.png',.92,.92)),
  toolRack: prop('道具掛け',image('tool-rack-64.png',.78,.78),false,'overhead'),
  wallSword: prop('飾り剣',image('wall-sword-64.png',.78,.78),false,'overhead'),
  lantern: prop('灯り',image('lantern-64.png'),false),
  sign: prop('看板',{renderer:'text',text:'',width:1,height:.4,anchor:{x:.5,y:1}},false,'overhead'),
} satisfies Record<string,ObjectDefinition>;
export type PropId = keyof typeof propChips;

const houseFootprint = Array.from({length:20},(_,i)=>({x:i%5,y:Math.floor(i/5)}))
  .filter(point=>point.x!==2||point.y!==3);
export const buildingChips = {
  house: {category:'building',label:'家',visual:image('house-town-320x256.png',5,4,{x:0,y:0}),blockedCells:houseFootprint,layer:'depth'},
  church: {category:'building',label:'教会',visual:image('church-town-320x256.png',5,4,{x:0,y:0}),blockedCells:houseFootprint,layer:'depth'},
  ruinsGate: {category:'building',label:'遺跡の門',visual:image('ruins-gate-128.png',3,3,{x:0,y:0}),blockedCells:[],layer:'depth',minimap:'#a675d0'},
  plasterWall: {category:'building',label:'室内の壁',visual:image('plaster-wall-64.png',1,1,{x:0,y:0}),blockedCells:[{x:0,y:0}],layer:'ground'},
} satisfies Record<string,ObjectDefinition>;
export type BuildingId = keyof typeof buildingChips;

const person = (name: CharacterName, label: string): ObjectDefinition => ({category:'character',label,
  visual:{renderer:'person',name,width:.88,height:1.12,anchor:{x:.5,y:1}},blockedCells:[{x:0,y:0}],layer:'depth'});
const enemy = (name: SpriteName, label: string): ObjectDefinition => ({category:'character',label,
  visual:{renderer:'sprite',name,width:.875,height:.875,anchor:{x:.5,y:.5}},blockedCells:[{x:0,y:0}],layer:'depth'});
export const characterChips = {
  hero:person('hero','主人公'), elder:person('elder','長老'), scholar:person('scholar','学者'),
  child:person('child','子ども'), priest:person('priest','司祭'), wanderer:person('wanderer','旅人'),
  father:person('father','男性'), mother:person('mother','女性'),
  slime:enemy('slime','スライム'), bat:enemy('bat','コウモリ'), ghost:enemy('ghost','幽霊'),
  shadow:enemy('shadow','影'), memory:enemy('memory','記憶'), guardian:enemy('guardian','守護者'),
  crab:enemy('crab','カニ'), wolf:enemy('wolf','狼'), treant:enemy('treant','木の魔物'),
  moth:enemy('moth','蛾'), beetle:enemy('beetle','甲虫'), scorpion:enemy('scorpion','サソリ'),
  cactus:enemy('cactus','サボテンの魔物'), serpent:enemy('serpent','蛇'), golem:enemy('golem','ゴーレム'),
  wisp:enemy('wisp','迷い火'), skeleton:enemy('skeleton','骸骨'), mimic:enemy('mimic','ミミック'),
} satisfies Record<string,ObjectDefinition>;
export type CharacterId = keyof typeof characterChips;

export const chipCatalog = {terrain:terrainChips,prop:propChips,building:buildingChips,character:characterChips};
