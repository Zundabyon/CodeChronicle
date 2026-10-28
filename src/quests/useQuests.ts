import { useCallback, type RefObject } from 'react';
import { questions, type Area, type Npc, type Point, type Question } from '../content';
import type { StoryLine } from '../story';
import { worldMaps } from '../world/maps';
import { questDefinitions } from './definitions';
import { applyQuestEvent, COMPLETE, currentQuestStep, type QuestSave } from './engine';
import type { AnswerSource, QuestEvent } from './types';
type Choice={label:string;response:string;onChoose?:()=>void};
type Options<T>={
  stateRef:RefObject<T>;update:(fn:(save:T)=>T)=>void;
  startDialogue:(speaker:string,face:string,lines:(string|StoryLine)[],choices?:Choice[],onEnd?:()=>void)=>void;
  playStory:(lines:StoryLine[])=>void;onChapterStart:()=>void;recordPractice:(question:Question,correct:boolean)=>void;
};
export function useQuests<T extends QuestSave&{area:Area;pos:Point}>({stateRef,update,startDialogue,playStory,onChapterStart,recordPractice}:Options<T>){
  const sendQuestEvent=useCallback((event:QuestEvent)=>{
    const result=applyQuestEvent(stateRef.current,event);let next=result.save;
    if(result.started?.startAt){const area=result.started.startAt;next={...next,area,pos:worldMaps[area].entry};}
    if(next!==stateRef.current)update(()=>next);
    if(result.started?.category==='chapter')onChapterStart();
    if(result.scenes.length)playStory(result.scenes);
  },[stateRef,update,playStory,onChapterStart]);
  const startQuest=useCallback((questId:string)=>sendQuestEvent({type:'accepted',questId}),[sendQuestEvent]);
  const answerQuestQuestion=useCallback((q:Question,correct:boolean,source:AnswerSource)=>{
    recordPractice(q,correct);sendQuestEvent({type:'question-answered',questionId:q.id,correct,source});
  },[recordPractice,sendQuestEvent]);
  const talkToQuestNpc=useCallback((npc:Npc,normalChoices:Choice[]=[]):boolean=>{
    const candidates=questDefinitions.filter(def=>def.npcId===npc.id&&(stateRef.current.quests[def.id]||def.offer));
    const selected=candidates.find(def=>{const p=stateRef.current.quests[def.id];return p&&p.step!==COMPLETE;})??candidates.find(def=>!stateRef.current.quests[def.id])??candidates[0];if(!selected)return false;
    const def=selected;
    function present():void{
      const progress=stateRef.current.quests[def.id],step=currentQuestStep(def,stateRef.current.quests);
      if(!progress){startDialogue(npc.name,npc.face,[...npc.lines,def.offer!],[{label:def.acceptLabel??'依頼を受ける',response:def.acceptResponse??def.description,onChoose:()=>startQuest(def.id)},...normalChoices]);return;}
      if(progress.step===COMPLETE){startDialogue(npc.name,npc.face,[...npc.lines,def.completedText],normalChoices);return;}
      if(!step)return;
      if(step.trigger.type==='question-answered'&&step.trigger.source==='quest'){
        const questionId=step.trigger.questionId,q=questions.find(q=>q.id===questionId);if(!q?.options)return;let paused=false;
        const choices:Choice[]=q.options.map((label,index)=>({label,response:index===q.answer?`その通り。${q.explanation}`:`その操作をする前に、もう一度確かめよう。${q.explanation}`,onChoose:()=>{
          if(stateRef.current.quests[def.id]?.step!==step.id)return;
          answerQuestQuestion(q,index===q.answer,'quest');
        }}));
        choices.push({label:'あとで続ける',response:def.pauseResponse??'続きは、また話しかけてください。',onChoose:()=>{paused=true;}});
        startDialogue(npc.name,npc.face,[step.questionIntro??step.description,q.prompt],choices,()=>{if(!paused)present();});return;
      }
      if(step.trigger.type==='npc-talked'){
        startDialogue(npc.name,npc.face,step.lines??[step.description],undefined,()=>sendQuestEvent({type:'npc-talked',npcId:npc.id,questId:def.id}));return;
      }
      const choices=step.trigger.type==='reported'?[{label:def.reportLabel??'成果を報告する',response:def.reportResponse??def.completedText,onChoose:()=>sendQuestEvent({type:'reported',npcId:npc.id,questId:def.id})},...normalChoices]:normalChoices;
      startDialogue(npc.name,npc.face,[...npc.lines,step.reminder??step.description],choices);
    }
    present();return true;
  },[stateRef,startDialogue,startQuest,answerQuestQuestion,sendQuestEvent]);
  return {sendQuestEvent,startQuest,talkToQuestNpc,answerQuestQuestion};
}
