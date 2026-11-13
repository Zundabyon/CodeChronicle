import { useCallback, type RefObject } from 'react';
import { questions as bundledQuestions, type Area, type Npc, type Point, type Question } from '../content';
import type { StoryLine } from '../story';
import { worldMaps } from '../world/maps';
import { questDefinitions } from './definitions';
import { applyQuestEvent, COMPLETE, currentQuestStep, type QuestSave } from './engine';
import type { AnswerSource, QuestEvent } from './types';
import type { QuestStudy } from './studyTypes';
import { startQuestReview, applyQuestReviewAnswer, questReviewSteps } from './review';
type Choice={label:string;response:string;onChoose?:()=>void;correct?:boolean};
type Options<T>={
  questionBank?:Question[];
  stateRef:RefObject<T>;update:(fn:(save:T)=>T)=>void;
  startDialogue:(speaker:string,face:string,lines:(string|StoryLine)[],choices?:Choice[],onEnd?:()=>void,question?:Question,study?:QuestStudy)=>void;
  playStory:(lines:StoryLine[])=>void;onChapterStart:()=>void;recordPractice:(question:Question,correct:boolean)=>void;
  startBattle:(enemyId:string)=>void;
};
export function useQuests<T extends QuestSave&{area:Area;pos:Point}>({questionBank=bundledQuestions,stateRef,update,startDialogue,playStory,onChapterStart,recordPractice,startBattle}:Options<T>){
  const questions=questionBank;
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
  const reviewQuest=useCallback((questId:string)=>{
    const steps=questReviewSteps(questId);
    const next=startQuestReview(stateRef.current,questId);
    if(next===stateRef.current&&!stateRef.current.quests[questId]?.reviewStep)return;
    if(next!==stateRef.current)update(()=>next);
    function present():void{
      const progress=stateRef.current.quests[questId];
      if(progress?.reviewStep==='complete'){
        startDialogue('記憶の案内人','📜',['7つの役割の復習を終えた。表示と保存、対象ID、DBが変わる条件を、自分の言葉でも振り返ってみよう。冒険の進行や欠片、お礼はそのまま残っている。']);return;
      }
      const index=steps.findIndex(step=>step.id===progress?.reviewStep),step=steps[index];
      if(!step||step.trigger.type!=='question-answered')return;
      const questionId=step.trigger.questionId,q=questions.find(q=>q.id===questionId);
      if(!q?.options)return;
      let paused=false;
      const choices:Choice[]=q.options.map((label,answer)=>({label,correct:answer===q.answer,
        response:answer===q.answer?`その通り。${q.explanation}`:`取り違えを確かめよう。${q.explanation}`,
        onChoose:()=>{
          if(stateRef.current.quests[questId]?.reviewStep!==step.id)return;
          recordPractice(q,answer===q.answer);
          const result=applyQuestReviewAnswer(stateRef.current,questId,step.id,q.id,answer===q.answer);
          if(result!==stateRef.current)update(()=>result);
        }}));
      choices.push({label:'あとで続ける',response:'復習の続きは保存した。学習設定の「7つの役割を復習する」から再開できる。',onChoose:()=>{paused=true;}});
      startDialogue('記憶の案内人','📜',[`復習 ${index+1}/${steps.length}：${step.questionIntro??step.description}`,q.prompt],choices,()=>{if(!paused)present();},q,step.study);
    }
    present();
  },[stateRef,update,recordPractice,startDialogue,questions]);
  const talkToQuestNpc=useCallback((npc:Npc,normalChoices:Choice[]=[]):boolean=>{
    const candidates=questDefinitions.filter(def=>(def.npcId===npc.id||def.steps.some(step=>step.npcId===npc.id))&&(stateRef.current.quests[def.id]||def.offer));
    const selected=candidates.find(def=>{const p=stateRef.current.quests[def.id];return p&&p.step!==COMPLETE;})??candidates.find(def=>!stateRef.current.quests[def.id])??candidates[0];if(!selected)return false;
    const def=selected;
    function present():void{
      const progress=stateRef.current.quests[def.id],step=currentQuestStep(def,stateRef.current.quests);
      if(!progress){startDialogue(npc.name,npc.face,[...npc.lines,def.offer!],[{label:def.acceptLabel??'依頼を受ける',response:def.acceptResponse??def.description,onChoose:()=>startQuest(def.id)},...normalChoices]);return;}
      if(progress.step===COMPLETE){startDialogue(npc.name,npc.face,[...npc.lines,def.completedText],normalChoices);return;}
      if(!step)return;
      const targetNpc=step.npcId??def.npcId;
      if(targetNpc!==npc.id){
        const npcSteps=def.steps.filter(s=>s.npcId===npc.id&&s.trigger.type==='question-answered');
        const last=npcSteps.at(-1),finished=last&&def.steps.indexOf(step)>def.steps.indexOf(last);
        const altarIndex=def.steps.findIndex(s=>s.npcId===npc.id&&s.trigger.type==='npc-talked'),altarCollected=npc.id.endsWith('-altar')&&altarIndex>=0&&def.steps.indexOf(step)>altarIndex;
        const memoryHint=npc.id.startsWith('memory-')?[altarCollected?'この祭壇の記憶の欠片は、すでに取り戻している。次の目的を確かめよう。':finished?'この封印の実習は終わった。北の扉は開いている。次の目的を確かめよう。':'この記憶にはまだ順番がある。まず現在の目的を進めよう。']:npc.id===def.npcId?[]:npc.lines;
        startDialogue(npc.name,npc.face,[...memoryHint,step.reminder??step.description]);return;
      }
      if(step.trigger.type==='question-answered'&&step.trigger.source==='quest'){
        const questionId=step.trigger.questionId,q=questions.find(q=>q.id===questionId);if(!q?.options)return;let paused=false;
        const nextStep=def.steps[def.steps.indexOf(step)+1],opensDoor=step.npcId?.includes('-trial-')&&nextStep?.npcId!==step.npcId;
        const choices:Choice[]=q.options.map((label,index)=>({label,correct:index===q.answer,response:index===q.answer?`その通り。${q.explanation}${opensDoor?' この部屋の全実習を終え、北の扉が開いた。':''}`:`その操作をする前に、もう一度確かめよう。${q.explanation}`,onChoose:()=>{
          if(stateRef.current.quests[def.id]?.step!==step.id)return;
          answerQuestQuestion(q,index===q.answer,'quest');
        }}));
        choices.push({label:'あとで続ける',response:def.pauseResponse??'続きは、また話しかけてください。',onChoose:()=>{paused=true;}});
        startDialogue(npc.name,npc.face,[step.questionIntro??step.description,step.title+'：'+q.prompt],choices,()=>{if(!paused)present();},q,step.study);return;
      }
      if(step.trigger.type==='battle-won'){
        const enemyId=step.trigger.enemyId;
        startDialogue(npc.name,npc.face,step.lines??[step.description],undefined,()=>startBattle(enemyId));return;
      }
      if(step.trigger.type==='npc-talked'){
        startDialogue(npc.name,npc.face,step.lines??[step.description],undefined,()=>sendQuestEvent({type:'npc-talked',npcId:npc.id,questId:def.id}));return;
      }
      const choices=step.trigger.type==='reported'?[{label:def.reportLabel??'成果を報告する',response:def.reportResponse??def.completedText,onChoose:()=>sendQuestEvent({type:'reported',npcId:npc.id,questId:def.id})},...normalChoices]:normalChoices;
      startDialogue(npc.name,npc.face,[...npc.lines,step.reminder??step.description],choices);
    }
    present();return true;
  },[stateRef,startDialogue,startQuest,answerQuestQuestion,sendQuestEvent,questions,startBattle]);
  return {sendQuestEvent,startQuest,talkToQuestNpc,answerQuestQuestion,reviewQuest};
}
