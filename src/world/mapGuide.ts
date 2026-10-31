import { areaLabel, fieldRegion, houses, type Area, type Point } from '../content';
import { libraryFloors } from '../library';
import { canWalkOnMap, eventAt, worldMaps } from './maps';

const descriptions:Record<string,string>={town:'南の町。教会・商店・図書館で旅の支度ができます。',village:'北東の村。灯守のもとでHP・MPを無料で回復できます。',dungeon:'村のさらに北東。山道の先にある遺跡です。'};
export const worldPlaces=worldMaps.field.events.flatMap(event=>event.action.kind==='transition'&&descriptions[event.action.to]?[{id:event.action.to,name:areaLabel[event.action.to],point:{x:event.x,y:event.y},description:descriptions[event.action.to]}]:[]);
export const townEntrances=worldMaps.town.events.filter(event=>event.action.kind==='church'||event.action.kind==='transition'&&Object.hasOwn(houses,event.action.to));

export function mapLocation(area:Area,pos:Point,inChurch=false){
  const floor=libraryFloors.find(floor=>floor.area===area);
  const house=houses[area as keyof typeof houses]??(floor?houses[floor.wing==='frontend'?'scholarHouse':'backendLibrary']:undefined);
  const worldArea=area==='village'?'village':area==='dungeon'?'dungeon':'town';
  const outside=area==='field'?pos:worldPlaces.find(place=>place.id===worldArea)!.point;
  const church=townEntrances.find(event=>event.action.kind==='church');
  return {world:outside,worldLabel:areaLabel[worldArea],town:inChurch&&church?{x:church.x,y:church.y}:area==='town'?pos:house?.door??null,label:inChurch?'黎明の教会':area==='field'?fieldRegion(pos):areaLabel[area]};
}

/** A terrain-safe route for orientation; inspecting the map never moves the player. */
export function mapRoute(start:Point,end:Point):Point[]{
  const map=worldMaps.field,key=(p:Point)=>`${p.x},${p.y}`;
  const queue=[start],parents=new Map<string,Point|null>([[key(start),null]]);
  for(let i=0;i<queue.length;i++){
    const p=queue[i];
    if(p.x===end.x&&p.y===end.y){const route:Point[]=[];let cursor:Point|null=p;while(cursor){route.push(cursor);cursor=parents.get(key(cursor))??null;}return route.reverse();}
    for(const next of [{x:p.x,y:p.y-1},{x:p.x+1,y:p.y},{x:p.x,y:p.y+1},{x:p.x-1,y:p.y}]){
      if(parents.has(key(next))||!canWalkOnMap(map,next)||map.npcs.some(n=>n.x===next.x&&n.y===next.y))continue;
      if(eventAt(map,next,'enter')?.action.kind==='transition'&&(next.x!==end.x||next.y!==end.y))continue;
      parents.set(key(next),p);queue.push(next);
    }
  }
  return [];
}
export function compassDirection(from:Point,to:Point){
  const dy=to.y-from.y,dx=to.x-from.x;
  return `${dy<0?'北':dy>0?'南':''}${dx<0?'西':dx>0?'東':''}`||'すぐそば';
}
