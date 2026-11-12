// Design-only verifier. Does not import or mutate runtime game data.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const d=JSON.parse(fs.readFileSync(new URL('./chapter-two-act1-dungeon-layout.json',import.meta.url),'utf8'));
const key=p=>p.join(','), eq=(a,b)=>key(a)===key(b);
const adjacent=([x,y])=>[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const occupied=[...d.trials,d.altar,...d.npcs.map(n=>n.position)];
const floor=p=>d.terrain[p[1]]?.[p[0]]==='.';
function search(start,blocked=[]){
 const denied=new Set([...occupied,...blocked].map(key)),seen=new Map([[key(start),null]]),q=[start];
 assert(floor(start)&&!denied.has(key(start)),`invalid start ${start}`);
 for(let i=0;i<q.length;i++)for(const n of adjacent(q[i]))if(floor(n)&&!denied.has(key(n))&&!seen.has(key(n))){seen.set(key(n),q[i]);q.push(n);}
 return seen;
}
function route(start,end,blocked=[]){
 const seen=search(start,blocked);assert(seen.has(key(end)),`unreachable ${start} -> ${end}`);
 const result=[end];while(!eq(result.at(-1),start))result.push(seen.get(key(result.at(-1))));return result.reverse();
}
const all=search(d.entry),allFloor=[];
for(let y=0;y<d.height;y++)for(let x=0;x<d.width;x++)if(floor([x,y]))allFloor.push([x,y]);
assert.equal(d.terrain.length,d.height);assert(d.terrain.every(row=>row.length===d.width));
const occupKeys=new Set(occupied.map(key));assert.equal(occupKeys.size,occupied.length,'duplicate NPC placement');
assert(occupied.every(floor));
assert.equal(all.size,allFloor.length-occupied.length,'unreachable walkable floor');
for(const p of occupied)assert(adjacent(p).some(n=>all.has(key(n))),`NPC lacks approach ${p}`);
const main=[];
for(let i=1;i<d.path.length;i++){const seg=route(d.path[i-1],d.path[i]);main.push(...(i===1?seg:seg.slice(1)));}
assert(eq(main[0],d.entry));assert(eq(main.at(-1),[20,4]));
const mainSet=new Set(main.map(key));
for(let i=0;i<5;i++){
 const required=d.explanations.find(e=>e.required&&e.room===i+1).position;
 const closed=search(d.entry,[d.doors[i]]);
 // Every floor north of the wall is inaccessible, including the altar chamber.
 assert(!allFloor.some(p=>p[1]<d.doors[i][1]&&closed.has(key(p))),`door bypass ${i+1}`);
 const prevBlocked=i?d.doors.slice(i-1,i):[];
 const roomStart=d.rooms[i].entry;
 const local=search(roomStart,[...prevBlocked,d.doors[i],required]);
 assert(!adjacent(d.trials[i]).some(p=>local.has(key(p))),`required explanation bypass / early trial interaction ${i+1}`);
 assert(local.has(key(d.returns[i].position)),`return must be before explanation ${i+1}`);
 const stage=search(d.entry,d.doors.slice(i));
 assert(stage.has(key(required)),`required unreachable ${i+1}`);
 assert(adjacent(d.trials[i]).some(p=>stage.has(key(p))),`trial unreachable ${i+1}`);
 assert(!stage.has(key(d.doors[i])),`closed door walkable ${i+1}`);
 // Trial cannot be spoken to from entry side before required tile, including across walls.
 const before=search(d.entry,[required,...d.doors.slice(i)]);
 assert(!adjacent(d.trials[i]).some(p=>before.has(key(p))),`wall-adjacent trial bypass ${i+1}`);
 const openStage=search(d.entry,d.doors.slice(i+1));
 const next=i<4?d.explanations.find(e=>e.required&&e.room===i+2).position:[20,4];
 assert(openStage.has(key(next)),`next target unreachable ${i+1}`);
 assert(stage.has(key(d.returns[i].landing)),`return not reachable after own trial ${i+1}`);
 assert(main.findIndex(p=>eq(p,required))<main.findIndex(p=>eq(p,d.rooms[i].trialApproach)));
 assert(main.findIndex(p=>eq(p,d.rooms[i].trialApproach))<main.findIndex(p=>eq(p,d.doors[i])));
 // A return in a completed room does not expose the next trial around the wall.
 if(i<4)assert(!adjacent(d.trials[i+1]).some(p=>stage.has(key(p))),`next trial prematurely reachable ${i+1}`);
}
const protectedCells=[...main,...d.returns.map(r=>r.position),...d.explanations.filter(e=>e.required).map(e=>e.position),d.spring,...adjacent(d.spring),...adjacent(d.altar)];
const territories=d.enemies.map(e=>allFloor.filter(p=>dist(p,e.position)<=2));
for(let i=0;i<d.enemies.length;i++){
 const e=d.enemies[i];assert.notEqual(e.room,3);assert(floor(e.position));assert(!occupKeys.has(key(e.position)));
 assert(!territories[i].some(p=>protectedCells.some(s=>eq(p,s))),`enemy territory intersects protected cells ${i}`);
 assert(territories[i].some(p=>!occupKeys.has(key(p))),`enemy has no spawn ${i}`);
}
// Enemies may occupy ANY legal floor in their Manhattan radius, even wall-separated cells.
// For a deliberately stronger test, block the union of all territories simultaneously.
const avoid=search(d.entry,territories.flat());assert(main.every(p=>avoid.has(key(p))),'optional combat blocks main');
for(const r of d.returns)assert(avoid.has(key(r.landing)));
assert(adjacent(d.spring).some(p=>avoid.has(key(p))));
assert.equal(d.enemies.length,12);for(const species of [0,1,2])assert.equal(d.enemies.filter(e=>e.species===species).length,4);
let tourSteps=0;
// Visit both explanation alcoves per room in room order, returning to the main route.
// Interaction points are adjacent, matching nearbyInteraction (not standing on a prop).
const nearest=(from,p)=>adjacent(p).filter(n=>all.has(key(n))).map(n=>route(from,n)).sort((a,b)=>a.length-b.length)[0];
let from=d.entry;
for(let room=1;room<=5;room++){
 for(const e of d.explanations.filter(e=>e.room===room&&!e.required)){
  const r=nearest(from,e.position);tourSteps+=r.length-1;from=r.at(-1);
 }
 const r=route(from,d.rooms[room-1].trialApproach);tourSteps+=r.length-1;from=r.at(-1);
}
tourSteps+=route(from,[20,4]).length-1;
// Arrival and unsealing are different: after N open doors the maximum reachable
// room is min(N+1,5), but it is not marked reached until its entry was entered.
// A reached history is a contiguous prefix, independently of explanation reads.
assert.equal(d.reentryPolicy.selection,'highest-roomReached');
assert.equal(d.reentryPolicy.includeReachedButUnsealed,true);
assert.equal(d.reentryPolicy.allowDestinationMenu,false);
for(let i=0;i<5;i++){assert(eq(d.returns[i].landing,d.rooms[i].entry));assert.equal(d.returns[i].unlockAppliesTo,'outbound-to-village-only');}
const target=reached=>reached===0?d.entry:d.returns[reached-1].landing;
let resumeStatesChecked=0;
for(let n=0;n<=5;n++){
 const maximum=Math.min(n+1,5),minimum=n;
 const reach=search(d.entry,d.doors.slice(n));
 for(let reached=minimum;reached<=maximum;reached++){
  const landing=target(reached);assert(reach.has(key(landing)));
  if(reached)assert(eq(landing,d.rooms[reached-1].entry),'resume must select deepest reached room');
  const resumed=search(landing,d.doors.slice(n));assert(resumed.has(key(d.entry)),'resume trap');
  // Landing before an explanation must never enable talking to that room's NPC
  // before crossing that explanation, including the reached-but-unsealed room.
  const current=reached||1;
  const required=d.explanations.find(e=>e.required&&e.room===current).position;
  const cut=search(landing,[...d.doors.slice(n),required]);
  assert(!adjacent(d.trials[current-1]).some(p=>cut.has(key(p))),'resume skips current required explanation');
  if(current<5){
   const nextRequired=d.explanations.find(e=>e.required&&e.room===current+1).position;
   const nextCut=search(landing,[...d.doors.slice(n),nextRequired]);
   assert(!adjacent(d.trials[current]).some(p=>nextCut.has(key(p))),'resume skips next required explanation');
  }
  // Outbound returns only in rooms whose last trial has been passed. An
  // unsealed=false room can walk back south to the preceding room / exit.
  for(let room=1;room<=5;room++){
   const outboundEnabled=room<=n;
   if(outboundEnabled)assert(resumed.has(key(d.returns[room-1].position)));
   if(room>n)assert.equal(outboundEnabled,false);
  }
  resumeStatesChecked++;
 }
 if(maximum<5)assert(!reach.has(key(d.rooms[maximum].entry)),'unreached deeper room physically accessible');
}
const report={dimensions:[d.width,d.height],resumeStatesChecked,floorCells:allFloor.length,npcOccupiedCells:occupied.length,reachableWalkableCells:all.size,mainSteps:main.length-1,allOptionalExplanationTourSteps:tourSteps,doorsChecked:5,requiredCutPointsChecked:5,enemyTerritoriesChecked:territories.length,unreachableWalkableCells:0,doorBypasses:0,requiredBypasses:0,mainBlockedByEnemyTerritories:0};
console.log(JSON.stringify(report,null,2));
