import { questDefinition } from './definitions';
import type { QuestSave } from './engine';

export function questReviewSteps(questId:string) {
  const def=questDefinition(questId);
  return def?.category==='chapter'?def.steps.filter(step=>step.trigger.type==='question-answered'&&step.trigger.source==='quest'):[];
}

export function startQuestReview<T extends QuestSave>(save:T,questId:string):T {
  const progress=save.quests[questId],steps=questReviewSteps(questId);
  if(!progress||!steps.length)return save;
  const step=steps.find(step=>step.id===progress.reviewStep)??steps[0];
  if(progress.reviewStep===step.id)return save;
  return {...save,quests:{...save.quests,[questId]:{...progress,reviewStep:step.id}}};
}

/** Review is a separate saved cursor; it cannot collect fragments or grant rewards. */
export function applyQuestReviewAnswer<T extends QuestSave>(save:T,questId:string,stepId:string,questionId:string,correct:boolean):T {
  const progress=save.quests[questId],steps=questReviewSteps(questId);
  if(!progress||!correct||progress.reviewStep!==stepId)return save;
  const index=steps.findIndex(step=>step.id===stepId),step=steps[index];
  if(!step||step.trigger.type!=='question-answered'||step.trigger.questionId!==questionId)return save;
  return {...save,quests:{...save.quests,[questId]:{...progress,reviewStep:steps[index+1]?.id??'complete'}}};
}
