import { questDefinitions } from './definitions';
import { COMPLETE } from './engine';
import type { QuestStates } from './types';
const record=(value:unknown):value is Record<string,unknown>=>!!value&&typeof value==='object'&&!Array.isArray(value);
export function restoreQuestStates(value:Record<string,unknown>,firstChapterComplete:boolean,readBooks:string[]):QuestStates{
  const quests:QuestStates={};
  if(value.quests!==undefined){
    if(!record(value.quests))return quests;
    for(const def of questDefinitions){
      const progress=value.quests[def.id];
      if(def.requiresFirstChapter&&!firstChapterComplete||!record(progress))continue;
      if(progress.step===COMPLETE||def.steps.some(step=>step.id===progress.step))quests[def.id]={step:progress.step as string};
    }
    return quests;
  }
  if(value.version===2)return quests;
  // Legacy fields are understood only here, and are never written again.
  if(value.scholarQuestCompleted===true)quests['library-signboard']={step:COMPLETE};
  else if(value.scholarQuestReady===true)quests['library-signboard']={step:'report'};
  else if(value.scholarQuestAccepted===true)quests['library-signboard']={step:readBooks.includes('laravel-routes-01')?'practice-route':'read-route'};
  if(firstChapterComplete){
    const stages:Record<string,string>={village:'visit-village',cave:'find-copy',complete:COMPLETE};
    let step=typeof value.chapterTwo==='string'?stages[value.chapterTwo]:undefined;
    if(value.chapterTwo==='restore'){
      const index=typeof value.chapterTwoStep==='number'&&Number.isFinite(value.chapterTwoStep)?Math.max(0,Math.min(4,Math.floor(value.chapterTwoStep))):0;
      step=['read-records','update-address','create-family','delete-duplicate','return-names'][index];
    }
    if(step)quests['village-ledger']={step};
  }
  return quests;
}
