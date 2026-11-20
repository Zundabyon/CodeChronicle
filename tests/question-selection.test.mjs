import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
after(()=>server.close());
const {questions}=await server.ssrLoadModule('/src/content.ts');
const {shuffleChoices,selectQuestion,RECENT_LIMIT}=await server.ssrLoadModule('/src/questionSelection.ts');
const {memoryBattleQuestion}=await server.ssrLoadModule('/src/quests/memoryBattleQuestion.ts');
const {rangerBattles,drawSet}=await server.ssrLoadModule('/src/quests/rangerBattles.ts');
const save={difficulty:'beginner',track:'react',inertia:true,answered:[]};

test('shuffled options keep the same correct answer and leave the catalog untouched',()=>{
  const q=questions.find(q=>q.kind==='choice'),before=JSON.stringify(q),orders=new Set();
  for(let i=0;i<60;i++){const s=shuffleChoices(q);assert.equal(s.options[s.answer],q.options[q.answer]);assert.deepEqual([...s.options].sort(),[...q.options].sort());orders.add(s.options.join('|'));}
  assert.equal(JSON.stringify(q),before);assert.ok(orders.size>6,'re-asking gives varied orders');
  const input=questions.find(q=>q.kind==='fill-input');assert.equal(shuffleChoices(input),input);
});

test('selection avoids the recent questions while others remain',()=>{
  const pool=questions.filter(q=>q.difficulty==='beginner'&&q.kind==='choice').slice(0,RECENT_LIMIT+2);
  const answered=pool.slice(0,RECENT_LIMIT).map(q=>q.id).concat(pool.map(q=>q.id));
  for(let i=0;i<40;i++)assert.ok(!answered.slice(-RECENT_LIMIT).includes(selectQuestion(pool,{...save,answered}).id));
});

test('ordinary foes mix their theme with the general pool; spoilers stay out',()=>{
  const ids=Array.from({length:300},()=>memoryBattleQuestion(questions,save,'memory-c-enemy-1').id);
  const theme=ids.filter(id=>/^(basics-crud-c|ledger-create-|resource-create-)/.test(id)).length;
  assert.ok(theme>0&&theme<ids.length,'both theme and general questions appear');
  assert.ok(!ids.some(id=>/^(ranger|graphius|hedoro)-/.test(id)));
  const sea=Array.from({length:200},()=>memoryBattleQuestion(questions,save,'undersea-1').id);
  assert.ok(sea.some(id=>/^(basics-crud-|ledger-|resource-)/.test(id))&&sea.some(id=>!/^(basics-crud-|ledger-|resource-)/.test(id)));
});

test('fixed story battles keep their own question sets',()=>{
  for(const battle of Object.values(rangerBattles)){const set=drawSet(battle);assert.equal(set.length,battle.count);assert.ok(set.every(id=>battle.set.includes(id)));}
});
