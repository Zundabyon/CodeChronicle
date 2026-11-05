import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});after(()=>server.close());
const {startQuestReview,applyQuestReviewAnswer,questReviewSteps}=await server.ssrLoadModule('/src/quests/review.ts');
const {restoreQuestStates}=await server.ssrLoadModule('/src/quests/persistence.ts');
const {applyQuestEvent}=await server.ssrLoadModule('/src/quests/engine.ts');
const {collectedMemories}=await server.ssrLoadModule('/src/quests/MemoryFragments.tsx');
const base=()=>({quests:{'village-ledger':{step:'complete'}},completed:true,readBooks:[],gold:321,inventory:{ether:1}});
test('a completed old adventure can review all 51 lessons without rewards or fragment changes',()=>{
 let save=base();const initial=structuredClone(save);save=startQuestReview(save,'village-ledger');
 const steps=questReviewSteps('village-ledger');assert.equal(steps.length,51);
 for(const step of steps){
   assert.equal(save.quests['village-ledger'].reviewStep,step.id);
   assert.strictEqual(applyQuestReviewAnswer(save,'village-ledger',step.id,step.trigger.questionId,false),save);
   assert.strictEqual(applyQuestReviewAnswer(save,'village-ledger',step.id,'unrelated',true),save);
   assert.deepEqual(restoreQuestStates(JSON.parse(JSON.stringify(save)),true,[]),save.quests);
   save=applyQuestReviewAnswer(save,'village-ledger',step.id,step.trigger.questionId,true);
   assert.equal(save.quests['village-ledger'].step,'complete');
   assert.deepEqual(collectedMemories(save.quests),['c','r','u','d']);
   assert.equal(save.gold,321);assert.deepEqual(save.inventory,initial.inventory);
 }
 assert.equal(save.quests['village-ledger'].reviewStep,'complete');
 const restarted=startQuestReview(save,'village-ledger');
 assert.equal(restarted.quests['village-ledger'].reviewStep,steps[0].id);
 assert.equal(restarted.gold,321);
});
test('review resumes independently while the active adventure remains at its seal',()=>{
 let save={...base(),quests:{'village-ledger':{step:'read-records'}}};
 save=startQuestReview(save,'village-ledger');
 const first=questReviewSteps('village-ledger')[0];
 save=applyQuestReviewAnswer(save,'village-ledger',first.id,first.trigger.questionId,true);
 const reviewStep=save.quests['village-ledger'].reviewStep;
 assert.equal(save.quests['village-ledger'].step,'read-records');
 assert.deepEqual(startQuestReview(save,'village-ledger'),save);
 save=applyQuestEvent(save,{...first.trigger}).save;
 assert.equal(save.quests['village-ledger'].reviewStep,reviewStep);
 assert.notEqual(save.quests['village-ledger'].step,'read-records');
 const corrupt=restoreQuestStates({quests:{'village-ledger':{step:'complete',reviewStep:'unknown'}}},true,[]);
 assert.deepEqual(corrupt,{'village-ledger':{step:'complete'}});
 const never={...base(),quests:{}};assert.strictEqual(startQuestReview(never,'village-ledger'),never);
});
