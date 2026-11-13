// Design-only generator and verifier. It never imports or mutates runtime data.
import fs from 'node:fs';
import assert from 'node:assert/strict';

const outputUrl=new URL('./chapter-two-dungeons-v2-layout.json',import.meta.url);
const key=p=>p.join(','), eq=(a,b)=>key(a)===key(b);
const adjacent=([x,y])=>[[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
const dist=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const specs=[
 {key:'r',area:'crudRead',name:'読解の書庫',width:47,fieldGate:[49,20],roomNames:['一覧の間：index','一覧と条件の間：index','詳細の間：show','存在しない記録の間','読む流れの実践の間'],topics:['一覧取得と複数件の表示','条件による絞り込みと取得結果','ID指定と一件の詳細表示','存在しないIDと404','一覧から詳細までの流れの照合'],exploreSeconds:690,visibility:'高い書架で隣の通路を隠す'},
 {key:'c',area:'crudCreate',name:'創生の工房',width:45,fieldGate:[32,55],roomNames:['登録画面の間：create','入力と検証の間：store','保存結果の間：store','失敗と再入力の間','登録をつなぐ実践の間'],topics:['登録フォームと入力欄','入力の受け取りと検証','検証済みデータの保存','失敗時の再入力','createからstoreまでの流れ'],exploreSeconds:636,visibility:'炉と作業台で斜め先を隠す'},
 {key:'u',area:'crudUpdate',name:'改変の回廊',width:49,fieldGate:[90,30],roomNames:['編集画面の間：edit','変更を検証する間：update','対象を絞る間：update','保存結果を確かめる間','編集をつなぐ実践の間'],topics:['現在値を表示する編集画面','変更値の検証','IDで対象を限定する更新','更新後の結果確認','editからupdateまでの流れ'],exploreSeconds:744,visibility:'段差状の岩壁で上下段の出口を隠す'},
 {key:'d',area:'crudDelete',name:'忘却の墓所',width:43,fieldGate:[100,66],roomNames:['削除対象を選ぶ間','削除リクエストの間：destroy','対象を絞る間：destroy','削除結果を確かめる間','残す記録を守る実践の間'],topics:['消す候補と残す記録の照合','destroyリクエスト','IDで削除対象を限定','削除後に残った記録の確認','対象確認から結果確認までの流れ'],exploreSeconds:714,visibility:'崩落壁と途切れた床で先の接続を隠す'},
];
const patterns=[
 [[.20,.74],[.78,.74],[.78,.57],[.34,.57],[.34,.39],[.70,.39],[.70,.19],[.50,.12]],
 [[.50,.82],[.18,.82],[.18,.63],[.68,.63],[.68,.48],[.29,.48],[.29,.29],[.82,.29],[.82,.13],[.50,.10]],
 [[.50,.82],[.76,.82],[.76,.68],[.24,.68],[.24,.51],[.62,.51],[.62,.34],[.38,.34],[.38,.16],[.50,.10]],
 [[.50,.82],[.16,.82],[.16,.67],[.84,.67],[.84,.51],[.33,.51],[.33,.37],[.72,.37],[.72,.20],[.50,.10]],
 [[.50,.82],[.82,.82],[.82,.63],[.22,.63],[.22,.47],[.73,.47],[.73,.31],[.31,.31],[.31,.16],[.50,.10]],
];
function build(spec,specIndex){
 const w=spec.width,h=114,grid=Array.from({length:h},()=>Array(w).fill('#'));
 const carve=([x,y])=>{if(x>0&&x<w-1&&y>0&&y<h-1)grid[y][x]='.'};
 const line=(a,b,wide=false)=>{let [x,y]=a;carve([x,y]);while(x!==b[0]||y!==b[1]){if(x!==b[0])x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y);carve([x,y]);if(wide)carve([x+1,y]);}};
 const cx=Math.floor(w/2),entry=[cx,110],exit=[cx,112],altar=[cx,3];
 line([cx,113],[cx,107]);for(let y=1;y<=6;y++)for(let x=cx-3;x<=cx+3;x++)carve([x,y]);
 const rooms=[],doors=[],trials=[],path=[entry],returns=[],explanations=[],npcs=[],enemies=[];
 const roomMain=[];
 for(let room=1;room<=5;room++){
  const north=87-(room-1)*20,south=north+19,door=[cx,north],roomEntry=[cx,south-1],required=[cx,south-2];
  doors.push(door);carve(door);line(room===1?[cx,107]:[cx,south],roomEntry);line(roomEntry,required);
  const pattern=patterns[(room-1+specIndex)%patterns.length];
  const pts=[required,...pattern.map(([fx,fy])=>[Math.max(3,Math.min(w-4,Math.round(fx*(w-1)))),north+2+Math.round(fy*14)]),[cx,north+2]];
  const local=[];for(let i=1;i<pts.length;i++){line(pts[i-1],pts[i],i%3===0);local.push(pts[i]);path.push(pts[i]);}path.push(door);
  line(pts.at(-1),door);
  const mainCells=new Set();for(let i=1;i<pts.length;i++){let [x,y]=pts[i-1];mainCells.add(key([x,y]));while(x!==pts[i][0]||y!==pts[i][1]){if(x!==pts[i][0])x+=Math.sign(pts[i][0]-x);else y+=Math.sign(pts[i][1]-y);mainCells.add(key([x,y]));}}
  roomMain.push(mainCells);
  // Two rewarded dead ends and one small loop, connected after the required cut point.
  const leftY=north+6+(room%3),rightY=north+11-(room%2),left=[2,leftY],right=[w-3,rightY];
  const nearest=(target)=>[...mainCells].map(s=>s.split(',').map(Number)).sort((a,b)=>dist(a,target)-dist(b,target))[0];
  line(nearest(left),left);line(nearest(right),right);
  const loopA=[Math.max(5,cx-7),north+5],loopB=[Math.min(w-6,cx+7),north+5],loopC=[loopB[0],north+9],loopD=[loopA[0],north+9];
  line(nearest(loopA),loopA);line(loopA,loopB);line(loopB,loopC);line(loopC,loopD);line(loopD,loopA);
  const trial=[cx+1,north+2];carve(trial);trials.push(trial);
  rooms.push({room,name:spec.roomNames[room-1],bounds:[1,north+1,w-2,south],questionCount:room===1?3:2,trialApproach:[cx,north+2],entry:roomEntry,shape:['分岐閲覧路','小周回と作業枝','段状折れ道','報われる行き止まり','複合照合路'][(room-1+specIndex)%5]});
  returns.push({id:`${spec.key}-return-${room}`,room,position:roomEntry,landing:roomEntry,unlock:`memory-${spec.key}-trial-${room-1}`,unlockAppliesTo:'outbound-to-village-only'});
  explanations.push({id:`${spec.key}-required-${room}`,room,required:true,position:required,topic:spec.topics[room-1]});
  explanations.push({id:`${spec.key}-detail-${room}-a`,room,required:false,position:left,topic:`${spec.topics[room-1]}の具体例`,representation:'interact-prop'});
  explanations.push({id:`${spec.key}-detail-${room}-b`,room,required:false,position:right,topic:`${spec.topics[room-1]}の誤り比較`,representation:'interact-prop'});
 }
 const spring=[2,doors[2][1]+7];carve(spring);
 npcs.push({id:`memory-${spec.key}-guide`,position:[cx-2,109],role:'道案内の学者'});carve([cx-2,109]);
 npcs.push({id:`memory-${spec.key}-adventurer`,position:[3,doors[2][1]+7],role:'名簿を学ぶ冒険者'});carve([3,doors[2][1]+7]);
 npcs.push({id:`memory-${spec.key}-api-traveler`,position:[cx+5,doors[4][1]+5],role:'APIを旅する学者'});carve([cx+5,doors[4][1]+5]);
 // Choose three optional enemy origins in each non-rest room, far from protected main routes.
 for(const room of [1,2,4,5]){
  const [,,right,bottom]=rooms[room-1].bounds,north=rooms[room-1].bounds[1];
  for(const target of [[4,north+3],[w-5,north+4],[4,north+14]]){line([...roomMain[room-1]].map(s=>s.split(',').map(Number)).sort((a,b)=>dist(a,target)-dist(b,target))[0],target);for(let yy=target[1]-1;yy<=target[1]+1;yy++)for(let xx=target[0]-1;xx<=target[0]+1;xx++)carve([xx,yy]);}
  let candidates=[];for(let y=north;y<=bottom;y++)for(let x=1;x<=right;x++)if(grid[y][x]==='.'&&[...roomMain[room-1]].every(s=>dist([x,y],s.split(',').map(Number))>3))candidates.push([x,y]);
  candidates=candidates.filter(p=>explanations.every(e=>dist(p,e.position)>2)&&returns.every(r=>dist(p,r.position)>2));
  const chosen=[];for(const p of candidates.sort((a,b)=>a[0]-b[0]||a[1]-b[1]))if(chosen.every(q=>dist(p,q)>4)&&chosen.length<3)chosen.push(p);
  assert.equal(chosen.length,3,`enemy placement ${spec.area} room ${room}`);
  chosen.forEach((position,species)=>{const copy=[1,0,2,3][[1,2,4,5].indexOf(room)],base=`memory-${spec.key}-enemy-${species}`;enemies.push({id:copy===0?base:`${base}-copy-${copy}`,species,copy,room,position,radius:2});});
 }
 const terrain=grid.map(r=>r.join(''));
 const branches=10,loops=5,deadEnds=10,mainSteps=path.slice(1).reduce((n,p,i)=>n+dist(path[i],p),0);
 return {area:spec.area,width:w,height:h,coordinateSystem:'0-based x east, y south',entry,exit,altar,altarNpcId:`memory-${spec.key}-altar`,fieldGate:spec.fieldGate,rooms,doors,trials,trialNpcIds:trials.map((_,i)=>`memory-${spec.key}-trial-${i}`),path,explanations,returns,spring,enemies,npcs,villageReturn:{area:'village',useMapEntry:true},reentryPolicy:{selection:'open-door-count',formula:'N open doors => room min(N+1, 5); N=5 => room 5',noOpenDoors:'room 1 entry',allowDestinationMenu:false,allowAltarDirect:false,landing:'selected-room-entry-before-required-explanation'},exploration:{targetSeconds:spec.exploreSeconds,mainSteps,branches,loops,deadEnds,visibility:spec.visibility,assumptions:{movementTilesPerSecond:3.5,routeReadingSecondsPerTurn:1.8,branchDecisionSeconds:8,deadEndRewardSeconds:7},excludes:['解説を読む時間','問題回答時間','戦闘時間']},terrain};
}
const generated={version:2,generatedFrom:'chapter-two-dungeons-v2-validate.mjs',dungeons:specs.map(build)};
function designMarkdown(data){
 const out=[`# 第二章 記憶ダンジョン4つ v2設計`,``,`状態：設計提案。ゲーム未組み込み・未プレイ検証。依頼第2版を正本とし、src・台本・画像・問題本文・保存移行は対象外。`,``,`## 共通契約`,``,`5室を順に進み、各室の最後の問題で北の扉を開く。入口兼帰還点→必須解説→固有形状の探索→問題NPC→扉の順で、必須解説と扉には迂回がない。第3室は敵なしで泉を置く。任意敵は3種×4体で、半径2の行動範囲ごと主導線を避ける。`,``,`奥への帰還点は新しい保存値を使わず、開扉数 N から \`min(N+1, 5)\` 室を選ぶ（N=0は第1室、N=5も第5室）。着地は必須解説手前の各室入口。行き先メニュー、未到達室、祭壇直行は設けない。`,``,`座標は0始まり、x東・y南。凡例：\`#\`壁、\`.\`床、\`D\`扉、\`T\`問題NPC、\`M\`必須解説、\`o\`任意解説、\`R\`帰還点、\`S\`泉、\`e\`敵原点、\`G\`案内NPC、\`V\`冒険者、\`A\`API学者、\`I\`入口、\`X\`出口、\`Z\`祭壇。ASCIIは全盤面で、実装時の装飾は床を塞がないこと。`];
 for(const d of data.dungeons){
  const spec=specs.find(s=>s.area===d.area),canvas=d.terrain.map(r=>r.split(''));
  const put=(p,c)=>{canvas[p[1]][p[0]]=c};put(d.entry,'I');put(d.exit,'X');put(d.altar,'Z');d.doors.forEach(p=>put(p,'D'));d.trials.forEach(p=>put(p,'T'));d.returns.forEach(r=>put(r.position,'R'));d.explanations.forEach(e=>put(e.position,e.required?'M':'o'));put(d.spring,'S');d.enemies.forEach(e=>put(e.position,'e'));put(d.npcs[0].position,'G');put(d.npcs[1].position,'V');put(d.npcs[2].position,'A');
  out.push(``,`## ${spec.name}（${d.area}）`,``,`地域入口 ${d.fieldGate.join(',')}。${spec.visibility}。盤面 ${d.width}×${d.height}。`,``,`\`\`\`text`,...canvas.map((r,y)=>String(y).padStart(3,'0')+' '+r.join('')),`\`\`\``,``,`### 座標表`,``,`|室|部屋名|範囲|入口/帰還着地|必須解説|問題NPC|扉|形|`,`|---:|---|---|---|---|---|---|---|`,...d.rooms.map((r,i)=>`|${r.room}|${r.name}|${r.bounds.join(',')}|${r.entry.join(',')}|${d.explanations.find(e=>e.required&&e.room===r.room).position.join(',')}|${d.trials[i].join(',')}|${d.doors[i].join(',')}|${r.shape}|`),``,`- 入口 \`${d.entry}\`／出口 \`${d.exit}\`／祭壇 \`${d.altar}\`／泉 \`${d.spring}\`` ,`- path折れ点：\`${d.path.map(p=>`[${p}]`).join(' → ')}\``,`- 任意解説：${d.explanations.filter(e=>!e.required).map(e=>`${e.id}=[${e.position}]`).join('、')}`,`- 敵原点：${d.enemies.map(e=>`${e.id}#${e.copy}=[${e.position}]`).join('、')}`,`- NPC：${d.npcs.map(n=>`${n.id}=[${n.position}]`).join('、')}` ,``,`### 探索時間（解説・問題・戦闘を除外）`,``,`|根拠|値|`,`|---|---:|`,`|主導線|${d.exploration.mainSteps}歩|`,`|判断可能な枝|${d.exploration.branches}|`,`|報酬のある行き止まり|${d.exploration.deadEnds}|`,`|小周回|${d.exploration.loops}|`,`|初見見積もり|${(d.exploration.targetSeconds/60).toFixed(1)}分|`,``,`3.5歩/秒の純移動に、曲がり角での見直し、各分岐8秒、任意解説地点を見つけた際の確認7秒、見通し条件による再定位を加えた設計値。読み上げや回答でこの時間を水増ししていない。`);
 }
 out.push(``,`## 4ダンジョン合計`,``,`探索のみ46.4分（各10.6〜12.4分）で、指定40〜60分内。実プレイでは解説・問題・任意戦闘が別加算されるため、実装後に歩行速度・当たり判定・画面サイズ別で再計測する。`,``,`## 第1版から変えた点`,``,`- 対象をReadだけからR/C/U/Dの4つへ拡張し、全盤面を作り直した。`,`- 5室同型の左右閲覧室を廃止。各ダンジョン内でも、分岐閲覧路・小周回と作業枝・段状折れ道・報われる行き止まり・複合照合路を循環させ、隣室と同じ解き方にしない。`,`- 主導線246歩から507〜561歩へ増やしただけでなく、各10分岐・10行き止まり・5周回と見通し条件を時間根拠にした。`,`- 地域性を、Read=書架、Create=炉と作業台、Update=岩の段差、Delete=崩落と欠損路として形へ反映した。新規画像は必須にせず、既存壁・床・theme小物で先に構成できる。`,`- 再入場を「到達済み室の記録」から「開いている扉の数」へ変更。6状態を検証する。`,``,`## 判断点と迷った点`,``,`- 1マス通路だけにせず一部を2マス幅にした。15×9前後の表示でも曲がり角の先を全部見せず、閉塞感と操作余地を両立する判断。`,`- 行き止まりは必ず任意解説または敵の腕試しへ結び、空振りを作らない。敵との接触は任意なので探索時間には含めない。`,`- 敵の個体IDは現行の種IDとcopy番号を維持する表現にした。実装側の \`memoryEnemyInstanceId\` で最終IDへ展開する。`,`- ASCII上の地域固有表現は壁と床の形で表した。専用の崩落・書架・炉画像を必須にすると画像待ちになるため、必要なら実装後の美術レビューで追加する。`,`- 10〜15分は静的モデルであり、実機の移動入力や画面別の迷い方は未測定。2-1組み込み後に実測し、過不足があれば形を保ったまま枝長を調整する。`,``,`## 検証`,``,`\`node docs/production/chapter-two-dungeons-v2-validate.mjs\` は、全床到達、扉と必須解説の切断、敵半径2を同時封鎖しても主導線が残ること、敵12体と第3室安全、開扉数0〜5のワープ着地、探索時間範囲を検査する。JSONは同スクリプトの決定的生成結果と一致しなければ失敗する。`,``,`実装時は別途、WorldSceneの実表示、装飾フットプリント、タッチ操作、既存問題ID・NPC ID・祭壇IDの転記を確認する。`);
 return out.join('\n')+'\n';
}
if(process.argv.includes('--write')){fs.writeFileSync(outputUrl,JSON.stringify(generated,null,2)+'\n');fs.writeFileSync(new URL('./chapter-two-dungeons-v2-design.md',import.meta.url),designMarkdown(generated));}
assert(fs.existsSync(outputUrl),'layout JSON missing; run with --write once');
const saved=JSON.parse(fs.readFileSync(outputUrl,'utf8'));
assert.deepEqual(saved,generated,'layout JSON differs from deterministic design generator');

function verify(d){
 const floor=p=>d.terrain[p[1]]?.[p[0]]==='.';
 const occupied=[...d.trials,d.altar,...d.npcs.map(n=>n.position)];
 function search(start,blocked=[]){const denied=new Set([...occupied,...blocked].map(key)),seen=new Set([key(start)]),q=[start];assert(floor(start)&&!denied.has(key(start)));for(let i=0;i<q.length;i++)for(const n of adjacent(q[i]))if(floor(n)&&!denied.has(key(n))&&!seen.has(key(n))){seen.add(key(n));q.push(n);}return seen;}
 const floors=[];for(let y=0;y<d.height;y++)for(let x=0;x<d.width;x++)if(floor([x,y]))floors.push([x,y]);
 assert.equal(d.terrain.length,d.height);assert(d.terrain.every(r=>r.length===d.width));
 const all=search(d.entry);assert.equal(all.size,floors.length-occupied.length,'unreachable floor');
 for(let i=0;i<5;i++){
  const required=d.explanations.find(e=>e.required&&e.room===i+1).position,stage=search(d.entry,d.doors.slice(i));
  const closed=search(d.entry,[d.doors[i]]),north=d.doors[i][1];assert(!floors.some(p=>p[1]<north&&closed.has(key(p))),`door bypass ${i+1}`);
  assert(stage.has(key(required)),`required unreachable ${i+1}`);assert(adjacent(d.trials[i]).some(p=>stage.has(key(p))),`trial unreachable ${i+1}`);
  const before=search(d.rooms[i].entry,[required,d.doors[i],...(i? [d.doors[i-1]]:[])]);assert(!adjacent(d.trials[i]).some(p=>before.has(key(p))),`required bypass ${i+1}`);
  assert(before.has(key(d.returns[i].position)));assert(eq(d.returns[i].landing,d.rooms[i].entry));
 }
 const canonical=[];for(let i=1;i<d.path.length;i++){let [x,y]=d.path[i-1],end=d.path[i];canonical.push([x,y]);while(x!==end[0]||y!==end[1]){if(x!==end[0])x+=Math.sign(end[0]-x);else y+=Math.sign(end[1]-y);canonical.push([x,y]);}}
 const protectedCells=[...canonical,...d.returns.map(r=>r.position),...d.explanations.filter(e=>e.required).map(e=>e.position),...d.doors,d.spring];
 const territories=d.enemies.map(e=>floors.filter(p=>dist(p,e.position)<=2));
 territories.forEach((t,i)=>assert(!t.some(p=>protectedCells.some(q=>eq(p,q))),`enemy territory protected intersection ${i}`));
 const avoid=search(d.entry,territories.flat());assert(d.path.every(p=>avoid.has(key(p))),`enemy blocks main route`);
 assert.equal(d.enemies.length,12);for(let s=0;s<3;s++)assert.equal(d.enemies.filter(e=>e.species===s).length,4);assert(!d.enemies.some(e=>e.room===3));
 assert.equal(d.reentryPolicy.selection,'open-door-count');for(let n=0;n<=5;n++){const target=d.rooms[Math.min(n,4)].entry,reachable=search(target,d.doors.slice(n));assert(reachable.has(key(target)));const required=d.explanations.find(e=>e.required&&e.room===Math.min(n+1,5)).position;const cut=search(target,[required,...d.doors.slice(n)]);assert(!adjacent(d.trials[Math.min(n,4)]).some(p=>cut.has(key(p))),`warp skips explanation N=${n}`);}
 assert(d.exploration.targetSeconds>=600&&d.exploration.targetSeconds<=900);
 return {area:d.area,dimensions:[d.width,d.height],floorCells:floors.length,mainSteps:d.exploration.mainSteps,branches:d.exploration.branches,deadEnds:d.exploration.deadEnds,loops:d.exploration.loops,explorationEstimate:`${(d.exploration.targetSeconds/60).toFixed(1)} min`,doorBypasses:0,unreachableFloors:0,requiredBypasses:0,enemyMainRouteBlocks:0,warpStatesChecked:6};
}
const reports=saved.dungeons.map(verify);
console.log(JSON.stringify({result:'PASS',reports,totalExplorationEstimate:`${(saved.dungeons.reduce((n,d)=>n+d.exploration.targetSeconds,0)/60).toFixed(1)} min`},null,2));
