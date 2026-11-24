import {test,after} from 'node:test';
import {createServer} from 'vite';
import assert from 'node:assert/strict';
const server=await createServer({server:{middlewareMode:true,hmr:false,ws:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});after(()=>server.close());
const {enemyStats,heroAttack,heroDefense,scaledXp}=await server.ssrLoadModule('/src/enemyStats.ts');

test('deeper areas field stronger enemies and kinds differ',()=>{
  const field=enemyStats({id:'f1'},'field'),sea=enemyStats({id:'f1'},'undersea');
  assert.ok(sea.hp>field.hp&&sea.attack>field.attack&&sea.xp>field.xp);
  assert.ok(enemyStats({id:'f9'},'field').hp>enemyStats({id:'f2'},'field').hp,'golem outlasts bat');
});
test('leveling up raises attack and defense and cuts xp from weak foes',()=>{
  assert.ok(heroAttack(9,0)>heroAttack(1,0)&&heroDefense(9,0)>heroDefense(1,0));
  assert.equal(scaledXp(10,3,1),10);assert.ok(scaledXp(10,9,1)<10);
});
test('bestiary lists ordinary monsters but not story foes',async()=>{
  const {bestiary}=await server.ssrLoadModule('/src/bestiary.ts');
  assert.ok(bestiary.length>30);
  assert.ok(!bestiary.some(e=>e.ids.some(id=>/^(ranger|graphius|boss|hedoro)/.test(id))));
});
test('the cursed book appears only during its side quest and fights with three hard questions',async()=>{
  const {villageFoeVisible,questDefinition}=await server.ssrLoadModule('/src/quests/definitions.ts');
  const {rangerBattles}=await server.ssrLoadModule('/src/quests/rangerBattles.ts');
  assert.equal(villageFoeVisible('mimic-book',{}),false);
  assert.equal(villageFoeVisible('mimic-book',{'cursed-book':{step:'defeat-mimic'}}),true);
  assert.equal(villageFoeVisible('mimic-book',{'cursed-book':{step:'complete'}}),false);
  assert.ok(questDefinition('cursed-book').requiresFirstChapter);
  const mimic=rangerBattles['mimic-book'];assert.equal(mimic.count,3);assert.ok(mimic.set.length>=3);
});
test('page-scramble adds four wrong options and keeps the right answer',async()=>{
  const {withDecoys}=await server.ssrLoadModule('/src/questionSelection.ts');
  const {questions}=await server.ssrLoadModule('/src/content.ts');
  const q=questions.find(q=>q.difficulty==='advanced'&&q.topic==='laravel'&&q.options);
  const s=withDecoys(q,questions);
  assert.equal(s.options.length,8);assert.equal(new Set(s.options).size,8);
  assert.equal(s.options[s.answer],q.options[q.answer]);
});
test('weary townsfolk at the royal gate can always draw a question and have battle lines',async()=>{
  const {memoryBattleQuestion}=await server.ssrLoadModule('/src/quests/memoryBattleQuestion.ts');
  const {questions}=await server.ssrLoadModule('/src/content.ts');
  const {battleBanter}=await server.ssrLoadModule('/src/battleBanter.ts');
  for(const difficulty of ['beginner','intermediate','advanced'])for(let i=0;i<20;i++)
    assert.ok(memoryBattleQuestion(questions,{difficulty,track:'react',inertia:true,answered:[]},'royal-resident-01',()=>i/20));
  assert.match(battleBanter({id:'royal-resident-01',name:'待ちくたびれた商人'},'intro',0,0).enemy,/順番/);
});
