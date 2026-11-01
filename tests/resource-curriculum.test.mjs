import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});after(()=>server.close());
const {resourceTrials}=await server.ssrLoadModule('/src/resourceQuestions.ts');
const {questions}=await server.ssrLoadModule('/src/content.ts');
const {questReviewSteps}=await server.ssrLoadModule('/src/quests/review.ts');
test('resource lessons are registered, cover seven roles and separate practice from new board scenarios',()=>{
 assert.equal(resourceTrials.length,31);
 const steps=questReviewSteps('village-ledger'),ids=new Set(steps.map(s=>s.trigger.questionId));
 for(const trial of resourceTrials){
   const q=trial.question;assert.ok(ids.has(q.id));assert.deepEqual(questions.find(item=>item.id===q.id),q);
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
 const old=questReviewSteps('village-ledger').find(s=>s.id==='ledger-delete-transfer').study.before;
 const board=resourceTrials.find(t=>t.question.id==='resource-checkpoint-index').study.before;
 assert.notDeepEqual(board.rows,old.rows,'the capstone must use different records from the earlier board example');
});
