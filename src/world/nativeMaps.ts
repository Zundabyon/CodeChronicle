import type { Area } from '../content';
import type { WorldMapInput, BuildingPlacement } from './maps';

// A complete map authored without letter codes. Furniture is independent of
// the floor, and a doorway is an event rather than a special terrain symbol.
const walls:BuildingPlacement[]=Array.from({length:9},(_,y)=>Array.from({length:11},(_,x)=>({x,y})))
  .flat().filter(({x,y})=>(x===0||x===10||y===0||y===8)&&!(x===5&&y===8))
  .map(point=>({...point,id:`wall-${point.x}-${point.y}`,chip:'plasterWall'}));

export const nativeMaps:Partial<Record<Area,WorldMapInput>>={
  home:{
    environment:'interior',entry:{x:5,y:7},
    terrain:Array.from({length:9},()=>Array(11).fill('woodFloor')),
    buildings:walls,
    props:[
      {id:'home-shelf',chip:'shelf',x:4,y:1},
      {id:'home-bed',chip:'bed',x:3,y:3},
      {id:'home-chest',chip:'chest',x:7,y:4},
      {id:'home-dresser',chip:'dresser',x:3,y:5},
      {id:'home-tool-rack',chip:'toolRack',x:2,y:0},
      {id:'home-wall-sword',chip:'wallSword',x:8,y:0},
    ],
    characters:[],
    events:[
      {id:'home-dresser-event',x:3,y:5,trigger:'interact',label:'タンスを調べる',action:{kind:'dresser'}},
      {id:'home-exit',x:5,y:8,trigger:'enter',label:'町へ出る',action:{kind:'transition',to:'town'}},
    ],
  },
};
