import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});after(()=>server.close());
const {resourceTrials}=await server.ssrLoadModule('/src/resourceQuestions.ts');
const {questions}=await server.ssrLoadModule('/src/content.ts');
const {questReviewSteps}=await server.ssrLoadModule('/src/quests/review.ts');
const {rangerBattleSets}=await server.ssrLoadModule('/src/rangerBattleQuestions.ts');
test('resource lessons are registered, cover seven roles and separate practice from new board scenarios',()=>{
 assert.equal(resourceTrials.length,31);
 const steps=questReviewSteps('village-ledger'),ids=new Set(steps.map(s=>s.trigger.questionId));
 for(const trial of resourceTrials){
   // The board capstone was replaced by the final battle; its questions stay in the catalog.
   const q=trial.question;assert.equal(ids.has(q.id),trial.unit!=='checkpoint');assert.deepEqual(questions.find(item=>item.id===q.id),q);
   assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.options[q.answer],q.reveal);
   assert.ok(q.explanation.length);assert.ok(trial.study.objective);assert.ok(trial.study.result);
   if(trial.unit==='checkpoint'){assert.equal(trial.study.mode,'checkpoint');assert.equal(trial.study.before.columns.includes('title'),true);}
 }
 const final=resourceTrials.filter(t=>t.unit==='checkpoint');
 assert.equal(final.length,7);assert.equal(new Set(final.map(t=>t.study.action)).size,7);
 for(const key of ['r','u','c','d'])assert.equal(resourceTrials.filter(t=>t.unit===key).length,6);
 const positions=[0,1,2,3].map(i=>resourceTrials.filter(t=>t.question.answer===i).length);
 assert.ok(Math.max(...positions)-Math.min(...positions)<=1);
});
test('DB snapshots distinguish read-only screens from a successful new registration',()=>{
 for(const trial of resourceTrials.filter(t=>['index','show','create','edit'].includes(t.study.action))){
   assert.deepEqual(trial.study.after,trial.study.before,trial.question.id+' must not write merely by displaying a screen');
 }
 const registration=resourceTrials.find(t=>t.question.id==='resource-create-transfer');
 assert.equal(registration.study.action,'store');
 assert.equal(registration.study.after.rows.length,registration.study.before.rows.length+1);
 for(const row of registration.study.before.rows)assert.ok(registration.study.after.rows.some(after=>JSON.stringify(after)===JSON.stringify(row)));
 const final=rangerBattleSets.graphius.map(id=>questions.find(q=>q.id===id));
 assert.ok(final.every(q=>q.code?.includes('// posts')),'the final battle uses the board, which no act uses');
 for(const key of ['r','c','u','d'])assert.ok(rangerBattleSets[key].every(id=>!questions.find(q=>q.id===id).code?.includes('// posts')));
});
