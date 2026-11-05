import { memoryDungeons } from '../world/memoryDungeons';
import { chapterTwoLessons } from './chapterTwoLessons';
import type { QuestStates } from './types';

export function collectedMemories(quests:QuestStates):string[]{
  const step=quests['village-ledger']?.step;
  if(step==='complete'||step==='return-names')return memoryDungeons.map(d=>d.key);
  const current=chapterTwoLessons.findIndex(s=>s.id===step);
  if(current<0)return [];
  return memoryDungeons.filter(d=>chapterTwoLessons.findIndex(s=>s.id==='collect-'+d.key)<current).map(d=>d.key);
}
export function MemoryFragments({quests}:{quests:QuestStates}){
  if(!quests['village-ledger'])return null;
  const collected=collectedMemories(quests);
  return <div className="memory-fragments" role="group" aria-label={'記憶の欠片 '+collected.length+' / 4'}>
    {memoryDungeons.map(d=><span key={d.key} data-collected={collected.includes(d.key)} title={d.name+'：'+d.operation}
      aria-label={d.key.toUpperCase()+'の記憶：'+(collected.includes(d.key)?'入手済み':'未入手')}>
      <b>{collected.includes(d.key)?'◆':'◇'} {d.key.toUpperCase()}</b><small>{d.operation}</small>
    </span>)}
  </div>;
}
