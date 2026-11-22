import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});after(()=>server.close());
const {abilityOf,afterAnswer,initialAbilityState,nextQuestion,abilityDamage,sealed}=await server.ssrLoadModule('/src/enemyAbilities.ts');
const {questions}=await server.ssrLoadModule('/src/content.ts');
const q=questions.find(q=>q.options&&q.difficulty==='advanced'&&q.topic==='laravel'),fresh=questions.find(o=>o.options&&o.id!==q.id);

test('new monsters and the mimic carry one ability each; ordinary foes have none',()=>{
  assert.equal(abilityOf('f28').id,'deadlock');assert.equal(abilityOf('f29').id,'memory-leak');assert.equal(abilityOf('f30').id,'cache-afterimage');
  assert.equal(abilityOf('mimic-book').id,'page-scramble');assert.equal(abilityOf('f1'),undefined);
});
test('cache afterimage repeats the missed question, then lets go',()=>{
  const a=abilityOf('f30');let s=afterAnswer(a,initialAbilityState(),false);
  let [next,state]=nextQuestion(a,s,q,fresh,questions);assert.equal(next.id,q.id);assert.ok(state.shown);
  [next]=nextQuestion(a,afterAnswer(a,state,true),next,fresh,questions);assert.equal(next.id,fresh.id);
});
test('memory leak stacks to three on misses and drains on a correct answer',()=>{
  const a=abilityOf('f29');let s=initialAbilityState();
  for(let i=0;i<5;i++)s=afterAnswer(a,s,false);assert.equal(s.leak,3);assert.equal(abilityDamage(a,s,4,30),7);
  assert.equal(afterAnswer(a,s,true).leak,2);
});
test('deadlock seals magic and items for the next two questions, and a correct answer frees them',()=>{
  const a=abilityOf('f28');let s=afterAnswer(a,initialAbilityState(),false);
  [,s]=nextQuestion(a,s,q,fresh,questions);assert.ok(sealed(s));
  [,s]=nextQuestion(a,s,q,fresh,questions);assert.ok(sealed(s));
  [,s]=nextQuestion(a,s,q,fresh,questions);assert.ok(!sealed(s));
  assert.ok(!sealed(afterAnswer(a,afterAnswer(a,initialAbilityState(),false),true)));
});
test('page scramble keeps its eight choices and heavy bite',()=>{
  const a=abilityOf('mimic-book');const s=afterAnswer(a,initialAbilityState(),false);
  const [next]=nextQuestion(a,s,q,q,questions);assert.equal(next.options.length,8);assert.equal(abilityDamage(a,s,1,30),14);
});
