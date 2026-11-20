// Design-only deterministic generator and verifier; no runtime imports or writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const jsonUrl = new URL('./chapter-three-undersea-layout.json', import.meta.url);
const docUrl = new URL('./chapter-three-undersea-design.md', import.meta.url);
const key = p => p.join(',');
const adjacent = ([x,y]) => [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
const square = ([x,y], r) => Array.from({length:r*2+1}, (_,j) => Array.from({length:r*2+1},(_,i) => [x+i-r,y+j-r])).flat();
function build() {
  const width=81, height=111;
  const terrain=Array.from({length:height},()=>Array(width).fill('#'));
  const carve=([x,y])=>{ assert(x>0&&x<width-1&&y>0&&y<height-1); terrain[y][x]='.'; };
  const rect=([x1,y1,x2,y2])=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)carve([x,y]);};
  const line=(a,b,r=0)=>{let [x,y]=a; const cells=[]; while(true){const p=[x,y];cells.push(p);square(p,r).forEach(carve);if(x===b[0]&&y===b[1])break;if(x!==b[0])x+=Math.sign(b[0]-x);else y+=Math.sign(b[1]-y);}return cells;};
  const entry=[8,104], exit=[40,4];
  const waypoints=[entry,[8,94],[66,94],[66,76],[14,76],[14,58],[66,58],[66,40],[14,40],[14,22],[40,22],[40,19],[40,14],[40,9],exit];
  const mainRoute=[];
  for(let i=1;i<waypoints.length;i++) mainRoute.push(...line(waypoints[i-1],waypoints[i], i>=12?0:1).slice(i===1?0:1));
  // Only x=40 crosses y=9..13: the boss's body occupies the passage itself.
  rect([34,14,46,19]); rect([32,1,48,8]);
  const reviewSpecs=[
    ['basics-ui','基礎①：React / Vueの表示・状態',[3,100],[8,100]],
    ['basics-server','基礎②：Laravelの入口とMVC',[75,87],[66,87]],
    ['read','Read：index / showと取得対象',[4,68],[14,68]],
    ['create','Create：create / storeと検証',[75,50],[66,50]],
    ['update','Update：edit / updateと対象限定',[4,32],[14,32]],
    ['delete','Delete：destroyと残す記録',[22,35],[22,22]],
  ];
  // Distinct side-route geometry: a broken fissure, a ship's rib loop,
  // a leaking bypass and an observation loop. The main route remains clear.
  for(const path of [
    [[18,94],[18,98],[22,98],[22,96],[24,96],[24,94]],
    [[24,76],[24,81],[54,81],[54,76]],
    [[24,58],[24,55],[50,55],[50,58]],
    [[20,40],[20,44],[44,44],[44,40]],
  ]) for(let i=1;i<path.length;i++) line(path[i-1],path[i]);
  const reviews=reviewSpecs.map(([id,topic,position,branch])=>{
    const [x,y]=position, bounds=[x-2,y-2,x+2,y+2];rect(bounds);line(branch,position);
    return {id:`undersea-review-${id}`,topic,position,bounds,branch,required:false,representation:'optional-tablet',blocking:false};
  });
  const spring={id:'undersea-spring',position:[74,64],approach:[73,64],bounds:[71,62,77,66]};rect(spring.bounds);line([66,58],[66,64]);line([66,64],spring.position);
  const returns=[{id:'undersea-return-1',position:[5,80],approach:[6,80],branch:[14,80]}, {id:'undersea-return-2',position:[74,36],approach:[73,36],branch:[66,36]}];
  // The second return branches from the bend via a safe side route.
  line([66,40],[66,36],1);line([14,76],[14,80]);
  returns.forEach(r=>{rect([r.position[0]-1,r.position[1]-1,r.position[0]+1,r.position[1]+1]);line(r.branch,r.position);r.destination='underseaOldRoad';r.destinationLabel='地下書庫前室（入口階段から石灯の村へ）';r.destinationPosition=[8,104];r.resumeLanding=r.approach;r.unlock='visited';});
  const chests=[{id:'undersea-chest-1',position:[35,105],approach:[35,104],contents:'回復消耗品（内容量は実装時調整）'}, {id:'undersea-chest-2',position:[18,84],approach:[18,83],contents:'MP回復消耗品（内容量は実装時調整）'}, {id:'undersea-chest-3',position:[54,30],approach:[54,31],contents:'ボス前の補給品（内容量は実装時調整）'}];
  for(const c of chests){line([c.position[0],c.position[1]>100?94:c.position[1]>50?76:40],c.position);square(c.position,1).forEach(carve);}
  const boss={id:'undersea-spaghetti',name:'ヘドロの主・スパゲッティ',position:[40,12],footprint:[[40,11],[40,12],[40,13]],approach:[40,14],forecourt:[34,14,46,19],state:'alive blocks footprint; defeated removes collision',defeatedFlag:'undersea-spaghetti-defeated'};
  const features=[{name:'地下書庫の奥',bounds:[6,100,10,105],description:'記録所の地下書庫から降りる。父の依頼書を追う旅の入口。'}, {name:'岩の裂け目',bounds:[7,90,67,96],description:'裂け目沿いの横道。奥の敵を見て脇道へ踏み込むか選ぶ。'}, {name:'沈船の残骸',bounds:[13,72,67,78],description:'船肋骨・折れた帆柱を壁側に配置。船体を模した支路で宝箱へ回る。'}, {name:'漏水区画',bounds:[13,54,67,60],description:'壁の漏水と浅い水たまりは非衝突の装飾。足場の速度低下はなし。'}, {name:'海窓の回廊',bounds:[13,36,67,42],description:'壁面越しに海の影。ガラスの表現は壁の上の装飾で、第二の地形にはしない。'}, {name:'古い運搬路',bounds:[13,20,67,32],description:'二手の支路と泥溜まり。出口に近づくほど絡まった廃材が増える。'}, {name:'ヘドロの広間',bounds:[34,11,46,19],description:'南側の広い対峙床から、幅1セルの北の首へ繋ぐ。ボスの体が首を完全に塞ぐ。'}, {name:'向こう岸の浜辺',bounds:[32,1,48,8],description:'通行床は同じ海底テーマ。砂・空・波は床外の背景/非衝突装飾で仮表現。'}];
  const enemies=[];
  for(const y of [94,76,58,40,22]) for(const x of [28,38,48,58]){
    const cy=y===22?29:y-7;
    rect([x-2,cy-2,x+2,cy+2]);line([x,y],[x,cy]);
    enemies.push({id:`undersea-enemy-${String(enemies.length+1).padStart(2,'0')}`,variant:['漂着した基礎の敵','泥を被ったCRUDの敵','絡まった役割の敵'][enemies.length%3],position:[x,cy],radius:2,rangeMetric:'Chebyshev square clipped to floor; no pursuit outside range'});
  }
  for(const x of [46,58]) {const position=[x,103];rect([x-2,101,x+2,105]);line([x,94],position);enemies.push({id:`undersea-enemy-${enemies.length+1}`,variant:'漂着した基礎の敵',position,radius:2,rangeMetric:'Chebyshev square clipped to floor; no pursuit outside range'});}
  const sign={id:'undersea-work-in-progress',position:[44,4],approach:[43,4],text:'この先の職人の町は制作中です。海底の古道から石灯の村へ戻れます。',blocking:true};
  return {version:1,generatedFrom:'chapter-three-undersea-validate.mjs',status:'design-only; not integrated or playtested',area:'underseaOldRoad',name:'海底の古道',width,height,tilePixels:64,coordinateSystem:'0-based x east, y south; bounds inclusive',terrainTheme:'one undersea floor/wall family; # wall, . floor; no other terrain types',entry,exit,entryConnection:{sourceArea:'mountainVillage',buildingId:'village-ledger-house',buildingAnchor:[2,3],villageApproach:[4,6],interior:'地下書庫（新規・未実装）',basementLanding:entry,deepStairs:entry,rule:'第二章クリア後に建物→地下書庫の奥→古道。村の建物座標を古道の床座標へ流用しない。'},exitConnection:{destination:'temporary far-continent beach (included in this map)',landing:exit,unfinishedTown:true},waypoints,mainRoute,reviews,spring,returns,chests,boss,sign,features,enemies,doors:[],trials:[],exploration:{targetSeconds:720,rangeSeconds:[600,900],movementTilesPerSecond:2,inspectionWalkTiles:480,branchDecisionSeconds:240,orientationSeconds:240,excludes:['石板の読書','戦闘','長い会話'],optionalReadingSeconds:120,expectedOptionalBattles:6,secondsPerBattle:30,bossSeconds:90,rule:'探索12分は仮定による見積もり。全22体討伐は任意。戦闘を含む初見総時間の目安は18.5分。'},terrain:terrain.map(r=>r.join(''))};
}
function verify(d){
  assert.equal(d.tilePixels,64);assert.equal(d.terrain.length,d.height);assert(d.terrain.every(r=>r.length===d.width&&/^[#.]+$/.test(r)));assert(d.terrain[0].split('').every(c=>c==='#')&&d.terrain.at(-1).split('').every(c=>c==='#'));assert(d.terrain.every(r=>r[0]==='#'&&r.at(-1)==='#'));
  const floor=p=>d.terrain[p[1]]?.[p[0]]==='.';
  const floors=d.terrain.flatMap((r,y)=>[...r].flatMap((c,x)=>c==='.'?[[x,y]]:[]));
  const flood=(start,blocked=new Set())=>{const seen=new Set();if(!floor(start)||blocked.has(key(start)))return seen;const q=[start];seen.add(key(start));for(let i=0;i<q.length;i++)for(const p of adjacent(q[i]))if(floor(p)&&!blocked.has(key(p))&&!seen.has(key(p))){seen.add(key(p));q.push(p);}return seen;};
  const clear=flood(d.entry);assert.equal(clear.size,floors.length,'unreachable floor after boss defeat');assert(clear.has(key(d.exit)),'exit unreachable');
  const alive=flood(d.entry,new Set(d.boss.footprint.map(key)));assert(alive.has(key(d.boss.approach)),'boss approach unreachable alive');assert(!alive.has(key(d.exit)),'boss bypass exists');
  assert.equal(d.boss.name,'ヘドロの主・スパゲッティ');assert(d.boss.footprint.some(p=>key(p)===key(d.boss.position)));d.boss.footprint.forEach(p=>assert(floor(p)));
  assert(d.enemies.length>=20&&d.enemies.length<=24);assert.equal(d.reviews.length,6);assert.equal(d.doors.length,0);assert.equal(d.trials.length,0);assert.equal(d.chests.length,3);assert(d.returns.length>=1&&d.returns.length<=2);
  assert.deepEqual(d.reviews.map(r=>r.id.replace('undersea-review-','')),['basics-ui','basics-server','read','create','update','delete']);
  assert.equal(key(d.mainRoute[0]),key(d.entry));assert.equal(key(d.mainRoute.at(-1)),key(d.exit));d.mainRoute.forEach((p,i)=>{assert(floor(p));if(i)assert.equal(Math.abs(p[0]-d.mainRoute[i-1][0])+Math.abs(p[1]-d.mainRoute[i-1][1]),1);});
  const protectedCells=new Set(d.mainRoute.flatMap(p=>square(p,1)).filter(floor).map(key));
  const protectRect=([x1,y1,x2,y2])=>{for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)protectedCells.add(key([x,y]));};
  protectRect(d.boss.forecourt);protectRect(d.spring.bounds);
  for(const p of [...d.returns.flatMap(r=>[r.position,r.approach]),...d.reviews.map(r=>r.position),...d.chests.flatMap(c=>[c.position,c.approach])]) square(p,1).forEach(q=>protectedCells.add(key(q)));
  const ranges=new Set(),positions=new Set();
  for(const e of d.enemies){assert(floor(e.position));assert(!positions.has(key(e.position)));positions.add(key(e.position));assert.equal(e.radius,2);const range=square(e.position,e.radius).filter(floor);for(const p of range){assert(!protectedCells.has(key(p)),`${e.id} range blocks protected cell ${p}`);ranges.add(key(p));}}
  // Stronger than origin-only checks: all possible enemy cells are blocked simultaneously.
  const safeAlive=flood(d.entry,new Set([...ranges,...d.boss.footprint.map(key)]));
  const safeDefeated=flood(d.entry,ranges);assert(safeAlive.has(key(d.boss.approach)));assert(safeDefeated.has(key(d.exit)));
  for(const p of [d.spring.position,d.spring.approach,...d.returns.flatMap(r=>[r.position,r.approach,r.resumeLanding]),...d.reviews.map(r=>r.position),...d.chests.flatMap(c=>[c.position,c.approach])])assert(safeAlive.has(key(p)),`facility unreachable with enemy ranges blocked ${p}`);
  // Tablets, chest and spring are walkable interaction markers; the sign is a solid prop.
  assert(floor(d.sign.position));assert(floor(d.sign.approach));const withSign=flood(d.entry,new Set([...ranges,key(d.sign.position)]));assert(withSign.has(key(d.exit)));assert(withSign.has(key(d.sign.approach)));
  for(const r of d.returns){assert.equal(r.destination,'underseaOldRoad');assert.deepEqual(r.destinationPosition,d.entry);assert(safeAlive.has(key(r.resumeLanding)));}
  assert(new Set([...d.enemies,...d.reviews,...d.returns,...d.chests,d.spring,d.sign,d.boss].map(v=>v.id)).size===d.enemies.length+d.reviews.length+d.returns.length+d.chests.length+3);
  const ex=d.exploration;assert.equal(ex.targetSeconds,ex.inspectionWalkTiles/ex.movementTilesPerSecond+ex.branchDecisionSeconds+ex.orientationSeconds);assert(ex.targetSeconds>=600&&ex.targetSeconds<=900);assert(ex.inspectionWalkTiles>=d.mainRoute.length-1);
  return {result:'PASS',floorCells:floors.length,unreachableFloors:0,mainRouteSteps:d.mainRoute.length-1,enemyCount:d.enemies.length,enemyRangeCells:ranges.size,enemyProtectedOverlaps:0,allEnemyRangesBlocked:{bossApproach:true,spring:true,returns:true,tablets:true,chests:true,exitAfterBoss:true},bossAlive:{approachReachable:true,exitReachable:false},bossDefeated:{exitReachable:true,allFloorsReachable:true},reviewRooms:6,chests:3,springs:1,returnPoints:2,sealedDoors:0,trialRooms:0,explorationEstimateMinutes:ex.targetSeconds/60};
}
function markdown(d,report){
  const c=d.terrain.map(r=>[...r]),put=(p,s)=>c[p[1]][p[0]]=s;
  d.mainRoute.forEach(p=>put(p,':'));d.enemies.forEach(e=>put(e.position,'e'));d.reviews.forEach(r=>put(r.position,'o'));d.chests.forEach(r=>put(r.position,'C'));d.returns.forEach(r=>put(r.position,'R'));put(d.spring.position,'S');d.boss.footprint.forEach(p=>put(p,'B'));put(d.boss.approach,'A');put(d.sign.position,'!');put(d.entry,'I');put(d.exit,'X');
  const out=['# 第三章 序幕「海底の古道」設計','','状態：設計のみ。ゲーム組み込み・画像制作・実画面の検証は未実施。`src/` の変更、commit/pushは行わない。', '', '## 接続と役割','','[第三章計画](chapter-three-plan.md#第二章から第三章へのつなぎユーザー決定-2026-11-20)に従い、父の古い依頼書の宛先を確かめるため主人公が自分の意思で海を渡る。船の代わりに、昔知識を運んだ地下道を通る。両親の生死は確定しない。「縁の台帳」はここでは教えない。','','石灯の村 `mountainVillage` の既存建物 `village-ledger-house`（建物基準 [2,3]、村側接近案 [4,6]）→新規の地下書庫→その奥の階段→古道入口 [8,104]。地下書庫は未実装なので内部座標は実装時に決める。既存建物基準は `src/world/mountainVillage.ts` を参照し、建物へ入る接触判定と階段の操作を別に設ける。第二章クリア後の開通が前提。', '', '帰還点は地下書庫へ戻り、既存建物から村へ出られる。最小実装では地下書庫と古道南端の書庫前室 [8,104] を同じマップに収めるため、JSONの帰還先は設計上のエリア `underseaOldRoad` の入口 [8,104] とし、前室の階段から村へ戻る。エリアID自体も未登録の設計値である。入口階段は村側建物への戻り遷移も必ず持つ。帰還点再利用時は対応する `resumeLanding` へ任意で戻れる設計とし、強制ワープしない。', '', '出口 [40,4] は同マップ北端の向こう岸。浜辺に行き止まりと制作中看板 [44,4] を置く。職人の町への遷移はまだ登録しない。浜辺から古道・村へ歩いて戻れる。', '', '## 形状・素材契約','','81×111セル、1セル64×64px（盤面全体が64×64セルという意味ではない）。原点は左上、x東・y南、範囲は両端を含む。床と壁は海底テーマ1系統（通行床 `.` と非通行壁 `#`）のみ。水漏れ、船材、ガラスの海窓、浜辺の砂の印象は非衝突の装飾・背景で表す。別地形や泳ぎ・速度低下は追加しない。素材の実際のフットプリント込みの表示確認は実装後に必要。','','長い折れ道を、裂け目→沈船→漏水→海窓→泥の運搬路として辿る。裂け目の段違いの小周回、船肋骨を囲む横長ループ、漏水区画の短い並行路、海窓に沿う観察周回が床形状として異なる。側方の敵溜まり、宝箱へ続く細い支路、小部屋の往復も持つ。主導線の幅は通常3セル。通常敵は主導線へ追跡せず半径2の正方形内の床だけを動く。22体が見える密度と、戦うか避けるかを両立する。', '', '「5つ程度」は基礎×2＋CRUD各1の計6項目を優先して6室とした。全石板は任意で、読了・正答・扉解放を進行条件にしない。封印扉・実習部屋・問題NPCは使わない。', '', 'ボスは四天王ではなく、長年のゴミと泥と絡まったコードの塊。広間南側 [34,14]〜[46,19] の先の細い首 [40,11]〜[40,13] を体で塞ぐ。原点は [40,12]。生存中は3セルすべて衝突、撃破後はすべて除去する。扉の代用オブジェクトを置かず、近接で戦闘を起こす。南の対峙位置 [40,14] には通常敵が入らない。', '', '## ASCII全体図','','`#` 壁、`.` 床、`:` 主導線、`I` 入口、`X` 出口、`o` 任意石板、`e` 敵初期位置、`C` 宝箱、`S` 泉、`R` 帰還点、`B` ボス占有、`A` ボス前、`!` 制作中看板。行頭はy、各文字の列がx（0〜80）。', '', '```text', '    '+Array.from({length:d.width},(_,i)=>Math.floor(i/10)%10).join(''), '    '+Array.from({length:d.width},(_,i)=>i%10).join(''),...c.map((r,y)=>String(y).padStart(3,'0')+' '+r.join('')),'```','','## 座標表','','|地点|座標 / 範囲|用途|','|---|---|---|',`|入口 / 地下書庫側帰還着地|${d.entry}|村の記録所の地下から入る|`,`|出口 / 浜辺|${d.exit}|職人の町は未実装|`,`|看板|${d.sign.position}|${d.sign.text}|`,`|ボス原点 / 占有|${d.boss.position} / ${d.boss.footprint.map(key).join('・')}|生存時だけ通行不可|`,`|ボス前 / 広間|${d.boss.approach} / ${d.boss.forecourt}|通常敵なし|`,`|回復泉 / 接近|${d.spring.position} / ${d.spring.approach}|HP/MP回復、進行条件なし|`,...d.returns.map(r=>`|${r.id}|${r.position} / 再開 ${r.resumeLanding}|地下書庫 ${r.destinationPosition} へ。訪問で利用可能|`),...d.chests.map(r=>`|${r.id}|${r.position} / 接近 ${r.approach}|${r.contents}|`),'','|小部屋 / 石板ID|石板座標|部屋範囲|主導線からの分岐|テーマ|','|---|---|---|---|---|',...d.reviews.map(r=>`|${r.id}|${r.position}|${r.bounds}|${r.branch}|${r.topic}|`),'','石板・泉・宝箱は足元床を塞がない操作地点として設計する。立体小物の衝突を追加する場合は隣接操作位置と全床到達を再検証する。看板だけは衝突ありとし、脇から出口と操作位置へ届くことを検証する。','','|区画|範囲|見どころ|','|---|---|---|',...d.features.map(f=>`|${f.name}|${f.bounds}|${f.description}|`),'','|敵個体ID|初期位置|行動範囲|仮の種類|','|---|---|---|',...d.enemies.map(e=>`|${e.id}|${e.position}|x=${e.position[0]-2}〜${e.position[0]+2}, y=${e.position[1]-2}〜${e.position[1]+2} 内の床|${e.variant}|`),'','敵の種類名は素材・問題群を割り当てるための仮分類。既存敵IDを変更しない。第一章のReact/Vue/Laravel入門、第二章のCRUD・7つの役割を混ぜ、戦闘問題の追加・採点設計は別作業とする。ボスでは処理の役割とバグの位置を見抜く総復習を想定。','','## 時間見積もり','','|内訳|仮定|時間|','|---|---|---:|',`|探索移動|主導線 ${report.mainRouteSteps} 歩、支路・往復を含め480歩、2セル/秒|240秒|`,'|支路の選択・見回し|約12回×20秒|240秒|','|長い曲がり角での再定位・景観の確認|6区画×40秒|240秒|','|探索計|読書・戦闘・長い会話を除く|12分|','|石板6枚の任意閲覧|各20秒|+2分|','|任意戦闘の例|22体中6体、各30秒|+3分|','|ボス戦の例|1戦|+1.5分|','|初見総時間の例|上記を全て足した例|18.5分|','','探索10〜15分は歩数だけの実測値ではなく、判断・景観確認を含む計画値。最短直進や慣れた再訪はより短い。全22体を倒す場合は戦闘だけで約11分となり総時間が延びる。実装後は初見・キーボード/タッチで測り、判断待ち時間を過大に置いていないか確認して距離や分岐を調整する。','','## 検証・引き継ぎ','','第二章v3と同じ、決定的なJSON生成・ASCII・座標表・4近傍BFSを使う。`node docs/production/chapter-three-undersea-validate.mjs --write` で許可されたJSONと本書だけを生成。通常実行は読み取り検証のみで、保存JSONと生成結果の完全一致も検査する。', '', '1. 撃破後は入口から出口・全床へ到達し、行けない床0。','2. 生存中はボス前まで到達、出口へは到達不可。撃破で開通し、脇道での迂回0。','3. 敵の半径2正方形を壁で切った全候補セルが、主導線の幅3・広間・泉・帰還/再開点・石板・宝箱の保護域と非重複。','4. 全22体の行動範囲を同時に通行不可にしてもボス前・泉・帰還点・全石板・全宝箱へ届き、撃破後は出口へ届く。','5. 6石板、3宝箱、1泉、2帰還点、封印扉0・実習部屋0、64pxタイル、探索10〜15分を確認。','','```json',JSON.stringify(report,null,2),'```','','未対応：建物内部と往復イベント、章解放・ボス撃破の保存、敵素材と問題群、背景/地形画像、回復/宝箱の実データ、実画面での小物衝突と時間計測。新しいファイルの制作台帳への登録は編集許可がこの3ファイルに限られるため未実施（組み込み担当へ引き継ぐ）。'];
  return out.join('\n')+'\n';
}
const generated=build();
const report=verify(generated);
if(process.argv.includes('--write')){fs.writeFileSync(jsonUrl,JSON.stringify(generated,null,2)+'\n');fs.writeFileSync(docUrl,markdown(generated,report));}
assert(fs.existsSync(jsonUrl),'layout missing: run --write');const saved=JSON.parse(fs.readFileSync(jsonUrl,'utf8'));assert.deepEqual(saved,generated,'saved layout differs from deterministic generator');
assert.equal(fs.readFileSync(docUrl,'utf8'),markdown(generated,report),'design differs from deterministic generator');
console.log(JSON.stringify(verify(saved),null,2));
