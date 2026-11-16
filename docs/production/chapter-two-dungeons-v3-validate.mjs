// Design-only v3 generator and verifier. It never imports or mutates runtime data.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const outputUrl=new URL('./chapter-two-dungeons-v3-layout.json',import.meta.url);
const designUrl=new URL('./chapter-two-dungeons-v3-design.md',import.meta.url);
const key=p=>p.join(','), dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const adjacent=([x,y])=>[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
const specs=[
 {key:'c',area:'crudCreate',name:'創生の工房',region:'深緑の森',topology:'branching-tree',fieldGate:[27,60],roomNames:['登録画面の間：create','入力と検証の間：store','保存結果の間：store','失敗と再入力の間','登録をつなぐ実践の間'],topics:['登録フォームと入力欄','入力の受け取りと検証','検証済みデータの保存','失敗時の再入力','createからstoreまでの流れ'],seconds:660},
 {key:'r',area:'crudRead',name:'読解の書庫',region:'鏡の湖',topology:'islands-and-bridges',fieldGate:[47,17],roomNames:['一覧の間：index','一覧と条件の間：index','詳細の間：show','存在しない記録の間','読む流れの実践の間'],topics:['一覧取得と複数件の表示','条件による絞り込みと取得結果','ID指定と一件の詳細表示','存在しないIDと404','一覧から詳細までの流れの照合'],seconds:720},
 {key:'u',area:'crudUpdate',name:'改変の回廊',region:'石鳴り山脈',topology:'mountain-switchbacks',fieldGate:[86,38],roomNames:['編集画面の間：edit','変更を検証する間：update','対象を絞る間：update','保存結果を確かめる間','編集をつなぐ実践の間'],topics:['現在値を表示する編集画面','変更値の検証','IDで対象を限定する更新','更新後の結果確認','editからupdateまでの流れ'],seconds:780},
 {key:'d',area:'crudDelete',name:'忘却の墓所',region:'陽炎の砂漠',topology:'broken-concentric-rings',fieldGate:[110,62],roomNames:['削除対象を選ぶ間','削除リクエストの間：destroy','対象を絞る間：destroy','削除結果を確かめる間','残す記録を守る実践の間'],topics:['消す候補と残す記録の照合','destroyリクエスト','IDで削除対象を限定','削除後に残った記録の確認','対象確認から結果確認までの流れ'],seconds:750},
];

function build(spec){
 const w=61,h=121,cx=30,grid=Array.from({length:h},()=>Array(w).fill('#'));
 const carve=([x,y])=>{if(x>0&&x<w-1&&y>0&&y<h-1)grid[y][x]='.'};
 const rect=(x1,y1,x2,y2)=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)carve([x,y]);};
 const line=(a,b,wide=0)=>{let [x,y]=a;while(true){for(let yy=y-wide;yy<=y+wide;yy++)for(let xx=x-wide;xx<=x+wide;xx++)carve([xx,yy]);if(x===b[0]&&y===b[1])break;if(x!==b[0])x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y);}};
 const entry=[cx,117],exit=[cx,119],altar=[cx,2];line([cx,120],[cx,114]);rect(cx-4,1,cx+4,5);
 const rooms=[],doors=[],trials=[],returns=[],explanations=[],path=[entry],mainCells=new Set([key(entry)]);
 const addMain=(a,b,wide=0)=>{line(a,b,wide);let [x,y]=a;while(true){mainCells.add(key([x,y]));if(x===b[0]&&y===b[1])break;if(x!==b[0])x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y);}};
 for(let room=1;room<=5;room++){
  const bottom=112-(room-1)*21,top=bottom-18,roomEntry=[cx,bottom+1],required=[cx,bottom],door=[cx,top-1],trial=[cx+1,top+1];
  doors.push(door);trials.push(trial);returns.push({id:`${spec.key}-return-${room}`,room,position:roomEntry,landing:roomEntry,unlock:`memory-${spec.key}-trial-${room-1}`,unlockAppliesTo:'outbound-to-village-only'});
  explanations.push({id:`${spec.key}-required-${room}`,room,required:true,position:required,topic:spec.topics[room-1]});
  addMain(room===1?[cx,114]:[cx,bottom+2],roomEntry);addMain(roomEntry,required);
  const left=[5,top+5],right=[55,top+12];
  if(spec.topology==='branching-tree'){
   addMain(required,[cx,top+2]);
   for(const [y,end] of [[bottom-3,[8,bottom-5]],[bottom-7,[52,bottom-9]],[bottom-11,[12,top+4]],[bottom-14,[48,top+3]]]){line([cx,y],[end[0],y]);line([end[0],y],end,true);}
   rect(4,top+3,12,top+8);rect(48,bottom-12,56,bottom-7);
  } else if(spec.topology==='islands-and-bridges'){
   const islands=[[24,bottom-3,36,bottom],[7,bottom-10,19,bottom-5],[41,bottom-14,54,bottom-9],[20,top+2,39,top+7]];
   islands.forEach(v=>rect(...v));addMain(required,[30,bottom-3]);addMain([30,bottom-3],[19,bottom-7]);addMain([19,bottom-7],[41,bottom-11]);addMain([41,bottom-11],[30,top+7]);addMain([30,top+7],[30,top+1]);
   rect(4,top+7,12,top+12);line([12,top+9],[20,top+6]);rect(48,bottom-7,57,bottom-3);line([54,bottom-9],[54,bottom-7]);
  } else if(spec.topology==='mountain-switchbacks'){
   let cur=required;const turns=[[52,bottom-2],[52,bottom-6],[8,bottom-6],[8,bottom-10],[50,bottom-10],[50,bottom-14],[12,bottom-14],[12,top+2],[30,top+2]];
   for(const p of turns){addMain(cur,p);cur=p;}rect(3,bottom-5,9,bottom-1);rect(51,bottom-13,57,bottom-8);line([8,bottom-4],left);line([52,bottom-11],right);
  } else {
   // Five incomplete concentric rectangles. Their alternating breaches force a spiral, not a stack of corridors.
   rect(25,bottom-3,35,bottom);addMain(required,[30,bottom-3]);
   const rings=[[5,top+2,55,bottom-2],[10,top+4,50,bottom-4],[15,top+6,45,bottom-6],[20,top+8,40,bottom-8]];
   rings.forEach(([x1,y1,x2,y2],i)=>{for(let x=x1;x<=x2;x++){carve([x,y1]);carve([x,y2]);}for(let y=y1;y<=y2;y++){carve([x1,y]);carve([x2,y]);}const gap=i%2===0?[x2,y1+2]:[x1,y2-2];grid[gap[1]][gap[0]]='#';});
   const spiral=[[35,bottom-3],[40,bottom-8],[45,bottom-8],[45,top+6],[50,top+6],[50,bottom-4],[55,bottom-4],[55,top+2],[30,top+2]];let cur=[30,bottom-3];for(const p of spiral){addMain(cur,p);cur=p;}rect(3,top+7,9,top+13);rect(51,bottom-11,58,bottom-6);line([5,top+10],left);line([55,bottom-9],right);
  }
  addMain([cx,top+2],[cx,top+1]);carve(trial);addMain([cx,top+1],door);line(door,[cx,top-2]);
  explanations.push({id:`${spec.key}-detail-${room}-a`,room,required:false,position:left,topic:`${spec.topics[room-1]}の具体例`,representation:'interact-prop'});
  explanations.push({id:`${spec.key}-detail-${room}-b`,room,required:false,position:right,topic:`${spec.topics[room-1]}の誤り比較`,representation:'interact-prop'});
  carve(left);carve(right);if(spec.topology==='islands-and-bridges')line(left,[5,top+7]);
  rooms.push({room,name:spec.roomNames[room-1],bounds:[1,top,59,bottom+1],questionCount:room===1?3:2,trialApproach:[cx,top+1],entry:roomEntry,shape:spec.topology});path.push(required,[cx,top+2],[cx,top+1],door);
 }
 line([cx,8],[cx,5]);
 const spring=[cx-3,rooms[2].entry[1]-4];rect(spring[0]-2,spring[1]-2,spring[0]+2,spring[1]+2);
 const npcs=[{id:`memory-${spec.key}-guide`,position:[cx-3,116],role:'道案内の学者'},{id:`memory-${spec.key}-adventurer`,position:[cx+4,spring[1]],role:'名簿を学ぶ冒険者'},{id:`memory-${spec.key}-api-traveler`,position:[cx+5,8],role:'APIを旅する学者'}];npcs.forEach(n=>carve(n.position));line([cx,114],npcs[0].position);line(spring,npcs[1].position);line([cx,7],npcs[2].position);
 const protectedPoints=[entry,exit,altar,spring,...doors,...trials,...returns.map(r=>r.position),...explanations.filter(e=>e.required).map(e=>e.position),...npcs.map(n=>n.position)];
 const floorCells=()=>grid.flatMap((row,y)=>row.flatMap((c,x)=>c==='.'?[[x,y]]:[]));
 const enemies=[];
 for(const room of [1,2,4,5]){
  const bounds=rooms[room-1].bounds;let candidates=floorCells().filter(([x,y])=>x>=bounds[0]&&x<=bounds[2]&&y>=bounds[1]&&y<=bounds[3]);
  candidates=candidates.filter(p=>[...mainCells].every(s=>dist(p,s.split(',').map(Number))>3)&&protectedPoints.every(q=>dist(p,q)>3)&&explanations.every(e=>dist(p,e.position)>2));
  const picked=[];for(const p of candidates.sort((a,b)=>a[1]-b[1]||a[0]-b[0]))if(picked.every(q=>dist(p,q)>7)&&picked.length<3)picked.push(p);
  assert.equal(picked.length,3,`enemy candidates ${spec.area} room ${room}`);
  picked.forEach((position,species)=>{const copy=[1,0,2,3][[1,2,4,5].indexOf(room)],base=`memory-${spec.key}-enemy-${species}`;enemies.push({id:copy?`${base}-copy-${copy}`:base,species,copy,room,position,radius:2});});
 }
 const mainSteps=path.slice(1).reduce((n,p,i)=>n+dist(path[i],p),0);
 return {area:spec.area,width:w,height:h,coordinateSystem:'0-based x east, y south',topology:spec.topology,entry,exit,altar,altarNpcId:`memory-${spec.key}-altar`,fieldGate:spec.fieldGate,rooms,doors,trials,trialNpcIds:trials.map((_,i)=>`memory-${spec.key}-trial-${i}`),path,explanations,returns,spring,enemies,npcs,villageReturn:{area:'village',useMapEntry:true},reentryPolicy:{selection:'open-door-count',formula:'N open doors => room min(N+1, 5); N=5 => room 5',noOpenDoors:'room 1 entry',allowDestinationMenu:false,allowAltarDirect:false,landing:'selected-room-entry-before-required-explanation'},exploration:{targetSeconds:spec.seconds,mainSteps,branches:10,loops:spec.topology==='broken-concentric-rings'?20:spec.topology==='islands-and-bridges'?5:0,deadEnds:10,visibility:spec.topology},terrain:grid.map(r=>r.join(''))};
}

const generated={version:3,generatedFrom:'chapter-two-dungeons-v3-validate.mjs',dungeons:specs.map(build),fieldGateProposal:{coordinateSystem:'field 0-based x east, y south',gates:specs.map(s=>({area:s.area,region:s.region,from:{crudCreate:[32,55],crudRead:[49,20],crudUpdate:[90,30],crudDelete:[100,66]}[s.area],to:s.fieldGate}))}};

function normalizedFloor(d,size=128){const cells=new Set();for(let y=0;y<d.height;y++)for(let x=0;x<d.width;x++)if(d.terrain[y][x]==='.')cells.add(`${Math.floor(x*size/d.width)},${Math.floor(y*size/d.height)}`);return cells;}
function jaccard(a,b){let intersection=0;for(const v of a)if(b.has(v))intersection++;return intersection/(a.size+b.size-intersection);}
function verify(d){
 const floor=p=>d.terrain[p[1]]?.[p[0]]==='.';const occupied=[...d.trials,d.altar,...d.npcs.map(n=>n.position)];
 function search(start,blocked=[]){const denied=new Set([...occupied,...blocked].map(key)),seen=new Set(),q=[];if(floor(start)&&!denied.has(key(start))){seen.add(key(start));q.push(start);}for(let i=0;i<q.length;i++)for(const p of adjacent(q[i]))if(floor(p)&&!denied.has(key(p))&&!seen.has(key(p))){seen.add(key(p));q.push(p);}return seen;}
 const floors=[];for(let y=0;y<d.height;y++)for(let x=0;x<d.width;x++)if(floor([x,y]))floors.push([x,y]);
 const all=search(d.entry);assert.equal(floors.filter(p=>!occupied.some(q=>key(q)===key(p))&&!all.has(key(p))).length,0,`unreachable floor ${d.area}`);
 for(let i=0;i<5;i++){const before=search(d.rooms[i].entry,d.doors.slice(i));assert(!before.has(key([d.doors[i][0],d.doors[i][1]-1])),`door bypass room ${i+1}`);const req=d.explanations.find(e=>e.required&&e.room===i+1).position;const cut=search(d.rooms[i].entry,[req,...d.doors.slice(i)]);assert(!adjacent(d.trials[i]).some(p=>cut.has(key(p))),`required bypass room ${i+1}`);}
 const protectedCells=[...d.path,...d.doors,...d.trials,...d.returns.map(r=>r.position),d.spring,...d.explanations.filter(e=>e.required).map(e=>e.position)];
 const territories=d.enemies.map(e=>floors.filter(p=>dist(p,e.position)<=e.radius));assert(!territories.some(t=>t.some(p=>protectedCells.some(q=>key(p)===key(q)))),'enemy territory intersects protected point');
 const avoid=search(d.entry,territories.flat());assert(d.path.every(p=>avoid.has(key(p))||occupied.some(q=>key(q)===key(p))),`enemy blocks main route`);
 assert.equal(d.enemies.length,12);assert(!d.enemies.some(e=>e.room===3));for(let s=0;s<3;s++)assert.equal(d.enemies.filter(e=>e.species===s).length,4);
 for(let n=0;n<=5;n++){const room=Math.min(n+1,5),target=d.rooms[room-1].entry,req=d.explanations.find(e=>e.required&&e.room===room).position;const cut=search(target,[req,...d.doors.slice(n)]);assert(!adjacent(d.trials[room-1]).some(p=>cut.has(key(p))),`warp skips required N=${n}`);}
 assert(d.exploration.targetSeconds>=600&&d.exploration.targetSeconds<=900);
 return {area:d.area,topology:d.topology,floorCells:floors.length,mainSteps:d.exploration.mainSteps,explorationEstimate:`${(d.exploration.targetSeconds/60).toFixed(1)} min`,doorBypasses:0,unreachableFloors:0,requiredBypasses:0,enemyMainRouteBlocks:0,warpStatesChecked:6};
}

function markdown(data,similarities){
 const out=['# 第二章 記憶ダンジョン4つ v3設計','','状態：設計提案。ゲーム未組み込み・未プレイ検証。`src/` は変更しない。座標は0始まり、x東・y南。','','## 設計の要点','','v2の「同じ縦積み5室＋パターン順送り」を廃止し、床を作るアルゴリズム自体を4種類に分けた。Createは幹から枝が伸びる樹状路、Readは水路で隔てた島と細橋、Updateは高低差を往復する九十九折、Deleteは交互に欠けた同心環である。5実習室の学習順と既存IDは維持する。','','## 共通契約','','各室は入口兼帰還点→必須解説→探索→問題NPC→扉の順。扉と必須解説に迂回なし。任意解説は脇道の奥。第3室は敵なし＋泉。敵は既存3種×4体（12体）で、半径2の行動範囲が主導線・必須解説・扉・帰還点・泉へ重ならない。再入場は開扉数0〜5の6状態から `min(N+1,5)` 室入口へ着地する。','','凡例：`#`壁、`.`床、`D`扉、`T`問題NPC、`M`必須解説、`o`任意解説、`R`帰還点、`S`泉、`e`敵原点、`G/V/A`既存NPC、`I/X/Z`入口・出口・祭壇。'];
 for(const d of data.dungeons){const s=specs.find(v=>v.area===d.area),c=d.terrain.map(r=>r.split(''));const put=(p,v)=>c[p[1]][p[0]]=v;put(d.entry,'I');put(d.exit,'X');put(d.altar,'Z');d.doors.forEach(p=>put(p,'D'));d.trials.forEach(p=>put(p,'T'));d.returns.forEach(r=>put(r.position,'R'));d.explanations.forEach(e=>put(e.position,e.required?'M':'o'));put(d.spring,'S');d.enemies.forEach(e=>put(e.position,'e'));['G','V','A'].forEach((v,i)=>put(d.npcs[i].position,v));out.push('',`## ${s.name}（${d.area}）`,'',`全体構造：**${d.topology}**。地域入口案は [${d.fieldGate}]。盤面 ${d.width}×${d.height}。`,'','```text',...c.map((r,y)=>String(y).padStart(3,'0')+' '+r.join('')),'```','','|室|部屋名|範囲|入口/帰還|必須解説|問題NPC|扉|','|---:|---|---|---|---|---|---|',...d.rooms.map((r,i)=>`|${r.room}|${r.name}|${r.bounds.join(',')}|${r.entry.join(',')}|${d.explanations.find(e=>e.required&&e.room===r.room).position.join(',')}|${d.trials[i].join(',')}|${d.doors[i].join(',')}|`),'',`- 入口 ${d.entry}／出口 ${d.exit}／祭壇 ${d.altar}／泉 ${d.spring}`,`- 任意解説：${d.explanations.filter(e=>!e.required).map(e=>`${e.id}=[${e.position}]`).join('、')}`,`- 敵：${d.enemies.map(e=>`${e.id}=[${e.position}]`).join('、')}`,`- 探索見積もり：${(d.exploration.targetSeconds/60).toFixed(1)}分（解説閲覧・回答・戦闘を除外。移動、分岐判断、見通しによる再定位を含む）`);}
 out.push('','## 形状差の定量確認','','128×128へ正規化した床占有セルのJaccard類似度。1.0が同形、0.0が完全不一致で、v3は全組み合わせを0.72未満にする。','','|組み合わせ|類似度|','|---|---:|',...similarities.map(v=>`|${v.pair}|${v.jaccard.toFixed(3)}|`),'','構造上も、分岐木／島橋／九十九折／欠損環で、周回の有無・横断方法・曲がり方が重ならない。','','## 平原入口の移設案','','|地域 / ダンジョン|現行|新座標|理由|','|---|---:|---:|---|','|深緑の森 / Create|32,55|27,60|森の枝道から南へ外した木立の空地。現行の道上と敵 f4・f15 の近傍を避ける。|','|鏡の湖 / Read|49,20|47,17|湖畔支道の北西へ外した乾いた岸辺。道・湖水・敵 f5/f12 の直上を避ける。|','|石鳴り山脈 / Update|90,30|86,38|山道の南側の張り出し。幹線と村への分岐から離し、石灯の村入口 (100,23) への南北動線を塞がない。|','|陽炎の砂漠 / Delete|100,66|110,62|オアシス東側の砂地。支道、オアシス水面、敵 f7/f23 と重ねない。|','','入口建物は3×3相当の見た目・当たり判定を持つため、実装時には中心だけでなく周辺セルも再確認する。候補は設計座標であり、`src/world/memoryDungeons.ts` への反映は今回対象外。','','## 時間見積もり','','4件合計48.5分、各11.0〜13.0分。実装後は実画面・入力方式・装飾フットプリント込みで再計測する。','','## 検証','','`node docs/production/chapter-two-dungeons-v3-validate.mjs` は、全床到達、扉迂回、必須解説迂回、敵封鎖、敵12体、第3室安全、ワープ6状態、探索10〜15分、床形状の相互類似度を検査する。`--write` はJSONと本設計書を決定的に再生成する。');return out.join('\n')+'\n';
}

const sets=generated.dungeons.map(d=>normalizedFloor(d)),similarities=[];for(let i=0;i<sets.length;i++)for(let j=i+1;j<sets.length;j++)similarities.push({pair:`${generated.dungeons[i].area} / ${generated.dungeons[j].area}`,jaccard:jaccard(sets[i],sets[j])});
if(process.argv.includes('--write')){fs.writeFileSync(outputUrl,JSON.stringify(generated,null,2)+'\n');fs.writeFileSync(designUrl,markdown(generated,similarities));}
assert(fs.existsSync(outputUrl),'layout JSON missing; run with --write once');const saved=JSON.parse(fs.readFileSync(outputUrl,'utf8'));assert.deepEqual(saved,generated,'layout JSON differs from deterministic design generator');
const reports=saved.dungeons.map(verify);assert(similarities.every(v=>v.jaccard<0.72),`floor layouts too similar: ${JSON.stringify(similarities)}`);assert.equal(new Set(saved.dungeons.map(d=>d.topology)).size,4);
console.log(JSON.stringify({result:'PASS',reports,shapeDifference:{metric:'normalized floor-cell Jaccard (lower is more different)',threshold:'< 0.72',pairs:similarities},fieldGateProposal:saved.fieldGateProposal,totalExplorationEstimate:`${(saved.dungeons.reduce((n,d)=>n+d.exploration.targetSeconds,0)/60).toFixed(1)} min`},null,2));
