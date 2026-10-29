import type { LearningRecords } from './learningRecords';
export const reviewDelay=24*60*60*1000;
export function reviewSchedule(records:LearningRecords,now=Date.now()){
  return Object.entries(records).filter(([,r])=>r.wrongCount>0&&r.lastCorrect&&r.lastAnsweredAt>0&&Number.isFinite(r.lastAnsweredAt)).map(([id,r])=>({id,dueAt:r.lastAnsweredAt+reviewDelay})).sort((a,b)=>a.dueAt-b.dueAt).map(entry=>({...entry,due:entry.dueAt<=now}));
}
