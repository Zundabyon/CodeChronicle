import type { Difficulty, Question, Track } from '../content';
import { selectQuestion } from '../questionSelection';

type Learning={difficulty:Difficulty;track:Track;inertia:boolean;answered:string[]};
const operations:Record<string,string>={c:'create',r:'read',u:'update',d:'delete'};
// Theme questions take up to half of the draws; a small theme pool gives the general pool more turns.
const FULL_THEME_POOL=16;
function themePool(questions:Question[],save:Learning,enemyId:string):Question[]|undefined {
  const fits=(q:Question)=>q.kind!=='cli'&&(!q.track||q.track===save.track)&&(q.inertia===undefined||q.inertia===save.inertia);
  // Undersea foes review the chapter two CRUD/resource lessons.
  // Weary townsfolk at the royal gate review one-to-many and N+1 / with().
  if(enemyId.startsWith('royal-'))return questions.filter(q=>fits(q)&&q.id.startsWith('clown-'));
  if(enemyId.startsWith('undersea-'))return questions.filter(q=>fits(q)&&/^(basics-crud-|ledger-|resource-)/.test(q.id));
  const key=/^memory-([crud])-enemy-/.exec(enemyId)?.[1],name=key&&operations[key];
  if(!name)return undefined;
  return questions.filter(q=>fits(q)&&q.topic==='laravel'&&(q.id===`basics-crud-${key}`||q.id.startsWith(`ledger-${name}-`)||q.id.startsWith(`resource-${name}-`)));
}
// Ordinary foes mix their place's theme with the general pool that fits the learning settings.
// If the chosen difficulty is missing from the theme, use a real lesson and show its real level.
export function memoryBattleQuestion(questions:Question[],save:Learning,enemyId:string,random=Math.random):Question {
  const theme=themePool(questions,save,enemyId);
  if(!theme?.length)return selectQuestion(questions,save,random);
  const difficulty=theme.some(q=>q.difficulty===save.difficulty)?save.difficulty:theme[0].difficulty;
  const eligible=theme.filter(q=>q.difficulty===difficulty);
  return random()<.5*Math.min(1,eligible.length/FULL_THEME_POOL)?selectQuestion(theme,{...save,difficulty},random):selectQuestion(questions,save,random);
}
