import { questions } from './content';
export type LearningRecord={normalAttempts:number;normalCorrect:number;reviewAttempts:number;reviewCorrect:number;wrongCount:number;lastAnsweredAt:number;lastCorrect:boolean;firstNormalCorrect?:boolean};
export type LearningRecords=Record<string,LearningRecord>;
const ids=new Set(questions.map(q=>q.id));
const known=(id:string)=>ids.has(id)||/^guardian-repair-[0-2]-(beginner|intermediate|advanced)$/.test(id);
export function normalizeLearningRecords(value:unknown):LearningRecords {
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  const result:LearningRecords={};
  for(const [id,raw] of Object.entries(value)) {
    if(!known(id)||!raw||typeof raw!=='object'||Array.isArray(raw))continue;
    const r=raw as Record<string,unknown>;
    const count=(key:string)=>typeof r[key]==='number'&&Number.isFinite(r[key])?Math.max(0,Math.min(1000000,Math.floor(r[key] as number))):0;
    const normalAttempts=count('normalAttempts'),reviewAttempts=count('reviewAttempts');
    if(!normalAttempts&&!reviewAttempts)continue;
    const at=typeof r.lastAnsweredAt==='number'&&Number.isFinite(r.lastAnsweredAt)&&r.lastAnsweredAt>0&&r.lastAnsweredAt<=8640000000000000?r.lastAnsweredAt:0;
    result[id]={normalAttempts,normalCorrect:Math.min(normalAttempts,count('normalCorrect')),reviewAttempts,reviewCorrect:Math.min(reviewAttempts,count('reviewCorrect')),wrongCount:Math.min(normalAttempts+reviewAttempts,count('wrongCount')),lastAnsweredAt:at,lastCorrect:r.lastCorrect===true,...(typeof r.firstNormalCorrect==='boolean'&&normalAttempts>0?{firstNormalCorrect:r.firstNormalCorrect}:{})};
  }
  return result;
}
export function recordLearning(records:LearningRecords,id:string,correct:boolean,review:boolean,at=Date.now()):LearningRecords {
  if(!known(id))return records;
  const r=records[id]??{normalAttempts:0,normalCorrect:0,reviewAttempts:0,reviewCorrect:0,wrongCount:0,lastAnsweredAt:0,lastCorrect:false};
  return {...records,[id]:{...r,normalAttempts:r.normalAttempts+(review?0:1),normalCorrect:r.normalCorrect+(!review&&correct?1:0),reviewAttempts:r.reviewAttempts+(review?1:0),reviewCorrect:r.reviewCorrect+(review&&correct?1:0),wrongCount:r.wrongCount+(correct?0:1),lastAnsweredAt:at,lastCorrect:correct,...(!review&&r.normalAttempts===0?{firstNormalCorrect:correct}:{})}};
}
