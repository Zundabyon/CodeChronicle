import { items } from '../items';
import { questDefinitions } from './definitions';
import { canStartQuest, COMPLETE, currentQuestStep } from './engine';
import type { QuestSave } from './engine';
import type { ItemId } from '../items';
export function QuestStartButtons({save,onStart}:{save:QuestSave;onStart:(id:string)=>void}){
  return <>{questDefinitions.filter(def=>def.category==='chapter'&&canStartQuest(def,save)).map(def=><button className="primary" key={def.id} onClick={()=>onStart(def.id)}>{def.startLabel??`${def.title}を始める`}</button>)}</>;
}
export function QuestJournal({save,onStart}:{save:QuestSave;onStart:(id:string)=>void}){
  return <>{questDefinitions.map(def=>{
    const progress=save.quests[def.id],step=currentQuestStep(def,save.quests),complete=progress?.step===COMPLETE;
    const reward=[`${def.reward.gold}G`,...Object.entries(def.reward.items).map(([id,count])=>`${items[id as ItemId].name}${count}個`)].join('・');
    return <details className="learning-records" key={def.id}><summary>{def.title}</summary>
      {complete?<p>完了：{def.completedText} お礼は受け取り済みです。</p>:!progress?<><p>{def.description}</p><p>{def.requiresFirstChapter&&!save.completed?'第一章を終えると始められます。':`未受注：${def.npcLocation}。`}</p>{def.category==='chapter'&&canStartQuest(def,save)&&<button onClick={()=>onStart(def.id)}>第二章を始める</button>}</>:<><p>{step?.trigger.type==='reported'?'報告待ち':'進行中'}：{step?.description}</p><ol>{def.steps.map(s=><li key={s.id} aria-current={s.id===step?.id?'step':undefined}>{s.description}</li>)}</ol></>}
      {!complete&&<p>お礼：{reward}</p>}
    </details>;
  })}</>;
}
