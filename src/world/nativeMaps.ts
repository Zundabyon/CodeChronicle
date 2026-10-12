import { maps as legacyMaps, type HouseArea, type Area } from '../content';
import { npcSprite } from '../PixelSprite';
import type { WorldMapInput, BuildingPlacement } from './maps';
import type { CharacterId } from './catalog';

// Share only the building shell. Each household's furniture is authored in
// decorations.ts, rather than inheriting a bed, chest and weapons from a template.
const walls:BuildingPlacement[]=Array.from({length:9},(_,y)=>Array.from({length:11},(_,x)=>({x,y})))
  .flat().filter(({x,y})=>(x===0||x===10||y===0||y===8)&&!(x===5&&y===8))
  .map(point=>({...point,id:`wall-${point.x}-${point.y}`,chip:'plasterWall'}));
const houseAreas:HouseArea[]=['home','elderHouse','scholarHouse','childHouse','guestHouse','weaponShop','armorShop','itemShop'];

export const nativeMaps:Partial<Record<Area,WorldMapInput>>=Object.fromEntries(houseAreas.map(area=>{
  const room:WorldMapInput={
    environment:'interior',entry:{x:5,y:7},
    terrain:Array.from({length:9},()=>Array(11).fill('woodFloor')),
    buildings:walls,props:[],
    characters:(legacyMaps[area]?.npcs??[]).map(npc=>({
      id:npc.id,chip:npcSprite(npc.id) as CharacterId,x:npc.x,y:npc.y,role:'npc',npc,
    })),
    events:[
      ...(area==='home'?[{id:'home-dresser-event',x:3,y:5,trigger:'interact',label:'タンスを調べる',action:{kind:'dresser'}} as const]:[]),
      {id:`${area}-exit`,x:5,y:8,trigger:'enter',label:'町へ出る',action:{kind:'transition',to:'town'}},
    ],
  };
  return [area,room];
}));
