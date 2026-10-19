import type { Point, Npc } from '../content';
import { storyNpcs, type StoryStage } from '../story';
import type { WorldMap, MapAction } from './maps';

type NearbyInteraction={point:Point;label:string}&(
  {kind:'npc';npc:Npc}|{kind:'event';action:MapAction}
);
export function nearbyInteraction(map:WorldMap,position:Point,facing:Point,story:StoryStage):NearbyInteraction|null {
  const front={x:position.x+facing.x,y:position.y+facing.y};
  const others=[{x:position.x,y:position.y-1},{x:position.x+1,y:position.y},{x:position.x,y:position.y+1},{x:position.x-1,y:position.y}];
  const targets=[front,...others.filter(p=>p.x!==front.x||p.y!==front.y)];
  for(const point of targets) {
    const npc=storyNpcs(map.npcs,story).find(n=>n.x===point.x&&n.y===point.y);
    if(npc)return {kind:'npc',npc,point,label:`${npc.name}と話す`};
    const event=map.eventIndex.get(`${point.x},${point.y}`)?.find(e=>e.trigger==='interact');
    if(event)return {kind:'event',action:event.action,point,label:event.label};
  }
  return null;
}
