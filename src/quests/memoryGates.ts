import { questDefinition } from './definitions';
import type { QuestStates } from './types';
import { canWalkOnMap, eventAt, type WorldMap } from '../world/maps';
import type { Point } from '../content';

// A seal may contain several lessons. Its door opens only after its LAST lesson.
// Persisted chapter progress is the authority, including legacy completed saves.
export function isMemoryDoorOpen(quests:QuestStates,npcId:string):boolean {
  const def=questDefinition('village-ledger'),progress=quests['village-ledger'];
  if(!def||!progress)return false;
  const steps=def.steps.map((step,index)=>({step,index})).filter(({step})=>step.npcId===npcId&&step.trigger.type==='question-answered');
  if(!steps.length)return false;
  if(progress.step==='complete')return true;
  const current=def.steps.findIndex(step=>step.id===progress.step);
  return current>steps[steps.length-1].index;
}

export function memoryDoorHint(quests:QuestStates,npcId:string):string {
  if(isMemoryDoorOpen(quests,npcId))return '封印がほどけた。扉の先へ進める。';
  const def=questDefinition('village-ledger'),progress=quests['village-ledger'];
  if(!progress)return '扉は記憶の封印で閉ざされている。石灯の村のオルから第二章の依頼を受けよう。';
  const step=def?.steps.find(step=>step.id===progress.step);
  return '扉はまだ閉じている。この部屋の試練をすべて解こう。'+(step?' 現在の目的：'+step.description:'');
}

/** Old dungeon coordinates can now be beyond a locked door. Resume on the
 * currently reachable side rather than stranding the player behind that door. */
export function restoreMemoryPosition(map:WorldMap,point:Point,quests:QuestStates):Point {
  if(!map.events.some(event=>event.action.kind==='memory-door'))return point;
  const key=(p:Point)=>`${p.x},${p.y}`,queue=[map.entry],seen=new Set([key(map.entry)]);
  let nearest=map.entry,distance=Infinity;
  for(let i=0;i<queue.length;i++){
    const current=queue[i];
    if(key(current)===key(point))return point;
    const nextDistance=Math.abs(current.x-point.x)+Math.abs(current.y-point.y);
    if(nextDistance<distance&&!eventAt(map,current,'enter')){nearest=current;distance=nextDistance;}
    for(const next of [{x:current.x-1,y:current.y},{x:current.x+1,y:current.y},{x:current.x,y:current.y-1},{x:current.x,y:current.y+1}]){
      if(seen.has(key(next))||!canWalkOnMap(map,next)||map.npcs.some(npc=>npc.x===next.x&&npc.y===next.y))continue;
      const action=eventAt(map,next,'enter')?.action;
      if(action?.kind==='memory-door'&&!isMemoryDoorOpen(quests,action.npcId))continue;
      seen.add(key(next));queue.push(next);
    }
  }
  return nearest;
}
