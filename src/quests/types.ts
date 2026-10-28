import type { Area } from '../content';
import type { ItemId } from '../items';
import type { StoryLine } from '../story';
export type AnswerSource='book'|'quest'|'battle';
export type QuestTrigger=
  | {type:'npc-talked';npcId:string}
  | {type:'reported';npcId:string}
  | {type:'book-read';bookId:string}
  | {type:'chest-examined';chestId:string}
  | {type:'question-answered';questionId:string;correct:boolean;source:AnswerSource};
export type QuestEvent=
  | {type:'accepted';questId:string}
  | {type:'npc-talked'|'reported';npcId:string;questId:string}
  | Exclude<QuestTrigger,{type:'npc-talked'|'reported'}>;
export type QuestStep={
  id:string;title:string;description:string;reminder?:string;
  trigger:QuestTrigger;
  lines?:StoryLine[];questionIntro?:string;requiresReadBook?:string;after?:StoryLine[];
};
export type QuestDefinition={
  id:string;category:'side'|'chapter';title:string;description:string;
  npcId:string;npcLocation:string;requiresFirstChapter?:boolean;startAt?:Area;opening?:StoryLine[];
  startLabel?:string;offer?:string;acceptLabel?:string;acceptResponse?:string;reportLabel?:string;reportResponse?:string;completedText:string;completionObjective?:string;pauseResponse?:string;
  steps:QuestStep[];reward:{gold:number;items:Partial<Record<ItemId,number>>};
};
export type QuestProgress={step:string};
export type QuestStates=Record<string,QuestProgress>;
