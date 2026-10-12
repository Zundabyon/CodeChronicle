import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { createServer } from 'vite';

const server=await createServer({server:{middlewareMode:true,hmr:false},appType:'custom'});
after(()=>server.close());
const {worldMaps,createWorldMap,canWalkOnMap,canEnemyOccupyMap,eventAt}=await server.ssrLoadModule('/src/world/maps.ts');
const {maps:legacyMaps,houses,fieldTownGate,fieldRuinsGate,questions}=await server.ssrLoadModule('/src/content.ts');
const {chipCatalog,terrainSets}=await server.ssrLoadModule('/src/world/catalog.ts');
const {mapDecorations}=await server.ssrLoadModule('/src/world/decorations.ts');
const {moveEnemies,spawnEnemies}=await server.ssrLoadModule('/src/enemyMovement.ts');
const {bossStages,bossGuardHp,bossQuestion,bossQuestionById,bossCommandResult,bossStrike,bossGuardBroken}=await server.ssrLoadModule('/src/bossBattle.ts');

const {selectQuestion,inputIsCorrect}=await server.ssrLoadModule('/src/questionSelection.ts');
const {fillQuestions}=await server.ssrLoadModule('/src/fillQuestions.ts');

test('every weapon must repair all three boss guards before victory',()=>{
  for (const damage of [1,2,3,6,100]) {
    let hp=bossStages.length*bossGuardHp;
    for(let stage=0;stage<bossStages.length;stage++) {
      hp=bossStrike(hp,stage,damage);
      assert.ok(hp>=(bossStages.length-stage-1)*bossGuardHp);
      if(stage<2) assert.ok(hp>0,'a strong weapon cannot finish before the final repair');
      while(!bossGuardBroken(hp,stage)) hp=bossStrike(hp,stage,damage);
    }
    assert.equal(hp,0);
  }
});

test('boss accepts equivalent CLI forms and distinguishes different effects',()=>{
  for (const [stage,input] of [[0,' php   artisan make:controller "NoteController" -n '],[0,'./artisan make:controller NoteController'],[1,'artisan --no-interaction migrate --step'],[2,'php ./artisan config:clear']]) {
    assert.equal(bossCommandResult(stage,input).correct,true,input);
  }
  for (const [stage,input] of [[0,'artisan make:controller notecontroller'],[0,'artisan make:controller NoteController --invokable'],[1,'artisan migrate:status'],[1,'artisan migrate:fresh'],[1,'artisan migrate --pretend'],[2,'artisan cache:clear'],[2,'artisan optimize:clear'],[2,'artisan config:clear; echo hello']]) {
    const result=bossCommandResult(stage,input);
    assert.equal(result.correct,false,input);
    assert.ok(result.reason.length>0);
  }
});

test('boss mistakes remain available as CLI review questions in every difficulty',()=>{
  for (const difficulty of ['beginner','intermediate','advanced']) {
    for (let stage=0;stage<bossStages.length;stage++) {
      const q=bossQuestion(stage,difficulty);
      assert.deepEqual(bossQuestionById(q.id),q);
      assert.equal(q.kind,'cli');
      assert.equal(bossCommandResult(stage,q.reveal).correct,true);
    }
  }
  assert.equal(bossQuestionById('guardian-repair-3-beginner'),undefined);
});

test('outdoor terrain passability and resident identities survive interior redesign',()=>{
  for(const [area,legacy] of Object.entries(legacyMaps)) {
    const blocked=['#','r','o','m','k','l','A','R','Z','W','w','U','V','b','c','T',...(area==='field'?[]:['s'])];
    if(area==='town'||area==='field'||area==='dungeon') legacy.tiles.forEach((row,y)=>[...row].forEach((tile,x)=>{
      const decorBlocks=(mapDecorations[area]??[]).some(p=>chipCatalog.prop[p.chip].blockedCells.some(offset=>p.x+offset.x===x&&p.y+offset.y===y));
      assert.equal(canWalkOnMap(worldMaps[area],{x,y}),!blocked.includes(tile)&&!decorBlocks,`${area} ${x},${y} (${tile})`);
    }));
    assert.equal(canWalkOnMap(worldMaps[area],{x:-1,y:0}),false);
    assert.equal(canWalkOnMap(worldMaps[area],{x:0,y:worldMaps[area].height}),false);
    assert.equal(canWalkOnMap(worldMaps[area],{x:.5,y:1}),false);
    assert.deepEqual(worldMaps[area].npcs,legacy.npcs);
    assert.deepEqual(worldMaps[area].enemies,legacy.enemies);
  }
});

test('house, church, field, ruins and dresser actions survive migration',()=>{
  for(const [area,house] of Object.entries(houses)) {
    assert.deepEqual(eventAt(worldMaps.town,house.door,'enter').action,{kind:'transition',to:area});
    assert.deepEqual(eventAt(worldMaps[area],{x:5,y:8},'enter').action,{kind:'transition',to:'town'});
  }
  assert.equal(eventAt(worldMaps.home,{x:3,y:5},'interact').action.kind,'dresser');
  assert.equal(eventAt(worldMaps.town,{x:13,y:15},'enter').action.kind,'church');
  assert.deepEqual(eventAt(worldMaps.field,fieldTownGate,'enter').action,{kind:'transition',to:'town'});
  assert.deepEqual(eventAt(worldMaps.field,fieldRuinsGate,'enter').action,{kind:'transition',to:'dungeon'});
  assert.deepEqual(eventAt(worldMaps.town,{x:14,y:31},'enter').action,{kind:'transition',to:'field'});
  assert.deepEqual(eventAt(worldMaps.dungeon,{x:10,y:11},'enter').action,{kind:'transition',to:'field'});
});

const example=()=>({environment:'outdoor',entry:{x:0,y:0},terrain:Array.from({length:6},()=>Array(7).fill('grass')),
  props:[],buildings:[],characters:[],events:[]});

test('native placement uses definitions for collision and supports multiple props on one cell',()=>{
  const input=example();
  input.props=[{id:'tree',chip:'tree',x:1,y:1},{id:'sign',chip:'sign',x:1,y:1,text:'森'},
    {id:'decoration',chip:'tree',x:2,y:1,blocksMovement:false}];
  input.buildings=[{id:'house',chip:'house',x:1,y:2}];
  const map=createWorldMap(input);
  assert.equal(canWalkOnMap(map,{x:1,y:1}),false);
  assert.equal(canWalkOnMap(map,{x:2,y:1}),true);
  assert.equal(canWalkOnMap(map,{x:1,y:2}),false);
  assert.equal(canWalkOnMap(map,{x:5,y:5}),false);
  assert.equal(canWalkOnMap(map,{x:3,y:5}),true,'house doorway stays open');
  assert.equal(map.terrain[1][1],'grass','props do not replace terrain');
});

test('native character placement is authoritative for game identity and position',()=>{
  const input=example();
  input.characters=[{id:'new-npc',chip:'scholar',x:2,y:3,role:'npc',npc:{id:'old',x:0,y:0,name:'学者',face:'',lines:['こんにちは']}}];
  const map=createWorldMap(input);
  assert.equal(map.npcs[0].id,'new-npc');
  assert.equal(map.npcs[0].x,2);
  assert.equal(map.npcs[0].y,3);
  assert.equal(map.characters[0].npc,map.npcs[0]);
  assert.equal(canEnemyOccupyMap(map,{x:2,y:3}),false);
});

test('invalid terrain, unknown chips and duplicate placement IDs fail clearly',()=>{
  assert.throws(()=>createWorldMap({...example(),terrain:[]}),/長方形/);
  assert.throws(()=>createWorldMap({...example(),terrain:[['grass'],['grass','grass']]}),/長方形/);
  assert.throws(()=>createWorldMap({...example(),terrain:[['unknown']]}),/未登録/);
  assert.throws(()=>createWorldMap({...example(),props:[{id:'a',chip:'unknown',x:0,y:0}]}),/未登録/);
  assert.throws(()=>createWorldMap({...example(),props:[{id:'a',chip:'tree',x:0,y:0},{id:'a',chip:'sign',x:1,y:0}]}),/重複/);
});

test('enemy spawning and movement respect migrated terrain, props and NPCs',()=>{
  const defeated=['f1','d1'];
  let positions=spawnEnemies(defeated);
  assert.equal(positions.f1,undefined);
  assert.equal(positions.d1,undefined);
  for(let tick=0;tick<30;tick++) {
    for(const area of ['field','dungeon']) {
      positions=moveEnemies(area,positions,defeated,worldMaps[area].entry);
      for(const enemy of worldMaps[area].enemies.filter(enemy=>!defeated.includes(enemy.id))) {
        const point=positions[enemy.id];
        assert.equal(canEnemyOccupyMap(worldMaps[area],point),true,enemy.id);
        const distance=Math.abs(point.x-enemy.x)+Math.abs(point.y-enemy.y);
        if(area==='field') assert.ok(distance<=7,enemy.id);
      }
    }
  }
});

test('registered image assets exist and terrain themes can be extended independently',async()=>{
  for(const collection of Object.values(chipCatalog)) for(const chip of Object.values(collection)) {
    const paths=[chip.image,['image','atlas'].includes(chip.visual?.renderer)?chip.visual.src:undefined,chip.overlay?.src].filter(Boolean);
    for(const path of paths) await access(new URL(`../public/${path}`,import.meta.url));
  }
  for(const set of ['snow','space','hell','underworld','otherworld','cave','abyss']) assert.ok(terrainSets[set]);
});



test('every learning route and difficulty has both fill formats with one blank',()=>{
  assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
  assert.equal(fillQuestions.length,30);
  for(const q of fillQuestions) {
    assert.equal(q.code.split('【①】').length,2,q.id);
    assert.ok(q.code.split('\n').length>=10 && q.code.split('\n').length<=25,q.id);
    if(q.kind==='fill-choice') {
      assert.equal(q.options.length,4);
      assert.equal(q.options[q.answer],q.reveal);
      assert.equal(new Set(q.options).size,4);
    } else assert.equal(inputIsCorrect(q,q.reveal),true);
  }
  for(const difficulty of ['beginner','intermediate','advanced']) {
    for(const track of ['react','vue']) for(const inertia of [true,false]) {
      const eligible=fillQuestions.filter(q=>q.difficulty===difficulty&&(!q.track||q.track===track)&&(q.inertia===undefined||q.inertia===inertia));
      assert.equal(eligible.length,6);
      for(const topic of ['frontend','laravel','connection']) for(const kind of ['fill-choice','fill-input']) {
        assert.ok(eligible.some(q=>q.topic===topic&&q.kind===kind));
      }
    }
  }
});

test('selection weights formats 50/25/25 and preserves route and unanswered priority',()=>{
  const save={difficulty:'beginner',track:'react',inertia:true,answered:[]};
  const eligible=questions.filter(q=>q.difficulty===save.difficulty&&(!q.track||q.track===save.track)&&(q.inertia===undefined||q.inertia===save.inertia)&&q.kind!=='cli');
  const counts={choice:0,'fill-choice':0,'fill-input':0};
  for(let i=0;i<100;i++) {
    const q=selectQuestion(questions,save,()=> (i+.5)/100);
    assert.ok(eligible.includes(q));
    counts[q.kind]++;
  }
  assert.deepEqual(counts,{choice:50,'fill-choice':25,'fill-input':25});
  const remaining=eligible.find(q=>q.kind==='fill-input');
  const answered=eligible.filter(q=>q!==remaining).map(q=>q.id);
  assert.equal(selectQuestion(questions,{...save,answered},()=>0).id,remaining.id);
  const completed={...save,answered:eligible.map(q=>q.id)};
  assert.notEqual(selectQuestion(questions,completed,()=>.99).id,completed.answered.at(-1));
  assert.equal(selectQuestion(questions,save,()=>.99,true).kind,'choice');
});

test('fill input trims ends but preserves code case and internal whitespace',()=>{
  const input=fillQuestions.find(q=>q.kind==='fill-input'&&q.reveal==='json');
  assert.equal(inputIsCorrect(input,'  '+input.reveal+'  '),true);
  assert.equal(inputIsCorrect(input,input.reveal.toUpperCase()),false);
  const expression=fillQuestions.find(q=>q.kind==='fill-input'&&q.reveal==='prev + 1');
  assert.equal(inputIsCorrect(expression,'prev+1'),true);
  assert.equal(inputIsCorrect(expression,'prev + 2'),false);
  assert.equal(inputIsCorrect({...input,accepted:["'a b'"]},"'a  b'"),false);
});


test('prop atlas frames stay within the source and retain object collision rules',()=>{
  const props=chipCatalog.prop;
  const images=Object.values(props).filter(prop=>prop.visual.renderer==='atlas');
  assert.equal(images.length,12);
  for(const prop of images){
    const {sourceWidth,sourceHeight,frame:[x,y,width,height]}=prop.visual;
    assert.ok(x>=0&&y>=0&&width>0&&height>0);
    assert.ok(x+width<=sourceWidth&&y+height<=sourceHeight,prop.label);
  }
  assert.equal(props.rug.blockedCells.length,0);
  assert.equal(props.flowers.blockedCells.length,0);
  assert.equal(props.diningTable.blockedCells.length,2);
  assert.equal(props.bench.blockedCells.length,2);
  assert.equal(props.well.blockedCells.length,4);
});
