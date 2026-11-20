import type { Difficulty, Question, Track } from '../content';
import { selectQuestion } from '../questionSelection';

type Learning={difficulty:Difficulty;track:Track;inertia:boolean;answered:string[]};
const operations:Record<string,{name:string}>={
  c:{name:'create'},r:{name:'read'},
  u:{name:'update'},d:{name:'delete'},
};
// Optional guardians rehearse the operation taught in their dungeon. If the
// chosen difficulty is unavailable, use a real lesson and show its real level.
export function memoryBattleQuestion(questions:Question[],save:Learning,enemyId:string,random=Math.random):Question {
  // Undersea foes review both chapters: half from the chapter two CRUD/resource lessons, half from the general pool.
  if(enemyId.startsWith('undersea-')){
    const crud=questions.filter(q=>q.kind!=='cli'&&(!q.track||q.track===save.track)&&(q.inertia===undefined||q.inertia===save.inertia)&&/^(basics-crud-|ledger-|resource-)/.test(q.id));
    const difficulty=crud.some(q=>q.difficulty===save.difficulty)?save.difficulty:crud[0]?.difficulty;
    return crud.length&&random()<.5?selectQuestion(crud,{...save,difficulty:difficulty!},random):selectQuestion(questions,save,random);
  }
  const key=/^memory-([crud])-enemy-/.exec(enemyId)?.[1];
  const operation=key?operations[key]:undefined;
  if(!operation)return selectQuestion(questions,save,random);
  const pool=questions.filter(q=>q.kind!=='cli'&&q.topic==='laravel'&&(!q.track||q.track===save.track)&&(q.inertia===undefined||q.inertia===save.inertia)&&
    (q.id===`basics-crud-${key}`||q.id.startsWith(`ledger-${operation.name}-`)||q.id.startsWith(`resource-${operation.name}-`)));
  if(!pool.length)return selectQuestion(questions,save,random);
  const difficulty=pool.some(q=>q.difficulty===save.difficulty)?save.difficulty:pool[0].difficulty;
  return selectQuestion(pool,{...save,difficulty},random);
}
