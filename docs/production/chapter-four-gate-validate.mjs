// Deterministic design generator. Only --write writes the two sibling deliverables.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const jsonUrl = new URL('./chapter-four-gate-layout.json', import.meta.url);
const docUrl = new URL('./chapter-four-gate-design.md', import.meta.url);
const key = p => p.join(',');
const neighbors = ([x,y]) => [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
const distance = (a,b) => Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1]);
const cells = ([x1,y1,x2,y2]) => Array.from({length:y2-y1+1},(_,j)=>Array.from({length:x2-x1+1},(_,i)=>[x1+i,y1+j])).flat();
function build() {
  const width=60, height=50, terrain=Array.from({length:height},()=>Array(width).fill('#'));
  const rect = bounds => cells(bounds).forEach(([x,y])=>{assert(x>0&&x<width-1&&y>0&&y<height);terrain[y][x]='.';});
  const segment = (a,b) => {assert(a[0]===b[0]||a[1]===b[1]);const out=[a];let [x,y]=a;while(x!==b[0]||y!==b[1]){x+=Math.sign(b[0]-x);y+=Math.sign(b[1]-y);out.push([x,y]);}return out;};
  rect([19,39,21,49]); // Southern landing reaches the map edge.
  rect([13,37,23,43]); // The only haven.
  rect([19,19,21,39]);
  rect([18,19,22,35]);
  rect([20,28,32,30]);
  rect([28,10,32,29]); // Five-cell avenue; queue leaves the centre open.
  rect([20,18,40,20]); // West loop rejoins the avenue in the north.
  rect([30,28,40,30]);
  rect([38,18,42,34]); // East loop, with a short southern shop frontage.
  rect([27,10,33,14]);
  rect([29,8,31,9]); // No other floor crosses this wall.
  rect([26,3,34,7]);
  const houses = [[11,19],[11,27],[11,34],[44,16],[44,23],[44,30],[23,10],[34,10]].map((position,i)=>{
    const [x,y]=position, door=[x+2,y+3];
    rect([x,y,x+4,y+4]); // Underlying stone pavement, including every blocked tile.
    const target=x<18?[20,y+4]:x>42?[40,y+4]:[30,y+4];
    segment([door[0],y+4],target).forEach(p=>rect([...p,...p]));
    return {id:`royal-house-${i+1}`,position,door,size:[5,4],state:'closed'};
  });
  const entry=[20,48], back={id:'royal-back',position:[21,48],approach:entry,label:'海底の古道へ戻る',destination:'underseaOldRoad'};
  const waypoints=[entry,[20,40],[20,29],[30,29],[30,10]], mainRoute=[];
  for(let i=1;i<waypoints.length;i++)mainRoute.push(...segment(waypoints[i-1],waypoints[i]).slice(i===1?0:1));
  const queue=[12,15,18,21,24,27].flatMap(y=>[28,32].map(x=>({id:`royal-queue-${x}-${y}`,position:[x,y],blocking:false})));
  const enemies=[[18,21],[22,24],[18,27],[22,32],[39,19],[41,21],[39,23],[41,25],[39,27],[41,29],[39,31],[41,33]].map((position,i)=>({id:`royal-resident-${String(i+1).padStart(2,'0')}`,position,radius:1,rangeMetric:'Chebyshev radius 1; reachable pavement only; never leave this range',afterRescue:'seated; nonblocking'}));
  const haven={bounds:[13,37,23,43],spring:{id:'royal-spring',position:[16,40],approach:[17,40],blocking:true},havenNpc:{id:'royal-teahouse-host',position:[16,42],approach:[17,42],blocking:true}};
  const boards=[{id:'royal-board-1',position:[23,38],approach:[22,38]},{id:'royal-board-2',position:[33,12],approach:[32,12]}];
  const reviews=[[18,25],[42,22],[42,32]].map((position,i)=>({id:`royal-review-${i+1}`,position,approach:[position[0],position[1]+1],blocking:true}));
  const boss={id:'royal-nkoiruichi',name:'道化師エヌコイールイーチ',footprint:[[29,9],[30,9],[31,9]],approach:[30,10],forecourt:[27,10,33,14]};
  const gate={id:'royal-gate',position:[30,8],footprint:[[29,8],[30,8],[31,8]],approach:[30,9],opensOnDefeat:boss.id};
  const sign={id:'royal-castle-unfinished',position:[30,4],approach:[30,5],text:'この先の王城は制作中です',blocking:true};
  return {version:1,area:'royalGate',name:'王都の関所街',width,height,tilePixels:64,entry,back,mainRoute,queue,enemies,haven,houses,boards,reviews,boss,gate,sign,terrain:terrain.map(r=>r.join(''))};
}
function verify(d) {
  assert.equal(d.version,1);assert.equal(d.area,'royalGate');assert.equal(d.name,'王都の関所街');assert.equal(d.tilePixels,64);
  assert(d.width>=50&&d.width<=70&&d.height>=40&&d.height<=60);
  assert.equal(d.terrain.length,d.height);assert(d.terrain.every(r=>r.length===d.width&&/^[.#]+$/.test(r)));
  const valid=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isInteger)&&p[0]>=0&&p[0]<d.width&&p[1]>=0&&p[1]<d.height;
  const floor=p=>valid(p)&&d.terrain[p[1]][p[0]]==='.';
  const floors=d.terrain.flatMap((r,y)=>[...r].flatMap((c,x)=>c==='.'?[[x,y]]:[]));
  assert(d.terrain[0].split('').every(c=>c==='#'));assert(d.terrain.every(r=>r[0]==='#'&&r.at(-1)==='#'));
  const houseBlocks=[];
  for(const h of d.houses){assert.deepEqual(h.size,[5,4]);const [x,y]=h.position;assert.deepEqual(h.door,[x+2,y+3]);const base=cells([x,y,x+4,y+3]);base.forEach(p=>assert(floor(p),`${h.id} needs pavement ${p}`));houseBlocks.push(...base.filter(p=>key(p)!==key(h.door)));assert(floor([x+2,y+4]));}
  const solids=[...d.boards,...d.reviews,d.haven.spring,d.haven.havenNpc,d.sign];
  const occupied=new Map();
  const reserve=(p,id)=>{assert(floor(p),`${id}: off floor ${p}`);assert(!occupied.has(key(p)),`${id} overlaps ${occupied.get(key(p))} at ${p}`);occupied.set(key(p),id);};
  houseBlocks.forEach(p=>reserve(p,'house'));
  for(const o of [...solids,...d.enemies,...d.queue,d.back])reserve(o.position,o.id);
  reserve(d.entry,'entry');d.boss.footprint.forEach(p=>reserve(p,d.boss.id));d.gate.footprint.forEach(p=>reserve(p,d.gate.id));
  const staticBlocks=new Set([...houseBlocks,...solids.map(o=>o.position)].map(key));
  const flood=(start,blocked=staticBlocks)=>{const steps=new Map();if(!floor(start)||blocked.has(key(start)))return steps;const q=[start];steps.set(key(start),0);for(let i=0;i<q.length;i++)for(const p of neighbors(q[i]))if(floor(p)&&!blocked.has(key(p))&&!steps.has(key(p))){steps.set(key(p),steps.get(key(q[i]))+1);q.push(p);}return steps;};
  const clear=flood(d.entry),aliveBlocks=new Set([...staticBlocks,...d.boss.footprint.map(key)]),alive=flood(d.entry,aliveBlocks);
  assert.equal(clear.size,floors.filter(p=>!staticBlocks.has(key(p))).length,'disconnected usable pavement');
  assert(alive.has(key(d.boss.approach)));assert(!alive.has(key(d.gate.position)),'boss can be bypassed');assert(!alive.has(key(d.sign.approach)));assert(clear.has(key(d.gate.position)));assert(clear.has(key(d.sign.approach)));
  assert(d.boss.footprint.length>=1&&d.boss.footprint.length<=3);assert(d.boss.footprint.some(p=>distance(p,d.boss.approach)===1));
  assert.deepEqual(d.boss.approach,d.mainRoute.at(-1));assert.deepEqual(d.entry,d.mainRoute[0]);
  for(const [i,p] of d.mainRoute.entries()){assert(alive.has(key(p)),`main route blocked ${p}`);if(i)assert.equal(distance(p,d.mainRoute[i-1]),1);}
  const shortest=alive.get(key(d.boss.approach));assert(shortest>=40&&shortest<=70,`shortest ${shortest}`);
  assert(d.entry[1]>=d.height-2);assert.equal(distance(d.entry,d.back.position),1);assert(d.queue.length>=10&&d.queue.length<=16);assert(d.enemies.length>=10&&d.enemies.length<=14);assert(d.houses.length>=6&&d.houses.length<=10);assert(d.boards.length>=2&&d.boards.length<=3);
  assert.deepEqual(d.reviews.map(r=>r.id),['royal-review-1','royal-review-2','royal-review-3']);
  const routeSet=new Set(d.mainRoute.map(key)),havenCells=new Set(cells(d.haven.bounds).map(key));
  assert(d.mainRoute.some(p=>havenCells.has(key(p))));
  for(const q of d.queue){assert.equal(q.blocking,false);assert([28,32].includes(q.position[0]));assert(!routeSet.has(key(q.position)));assert(alive.has(key(q.position)));}
  const ranges=new Set();
  for(const e of d.enemies){assert(alive.has(key(e.position)));assert(alive.get(key(e.position))>=18,`${e.id} too close to entrance`);assert.equal(e.radius,1);assert(!routeSet.has(key(e.position)));const [x,y]=e.position;const allowed=new Set(cells([x-1,y-1,x+1,y+1]).filter(p=>floor(p)&&!staticBlocks.has(key(p))).map(key));const outside=new Set([...staticBlocks,...floors.filter(p=>!allowed.has(key(p))).map(key)]);for(const k of flood(e.position,outside).keys()){assert(!havenCells.has(k),`${e.id} invades haven`);assert(!routeSet.has(k),`${e.id} invades main route`);ranges.add(k);}}
  for(const o of [...solids,d.back]){assert.equal(distance(o.position,o.approach),1);assert((o===d.sign?clear:alive).has(key(o.approach)),`${o.id}: approach blocked`);}
  for(const r of d.reviews)assert.deepEqual(r.approach,[r.position[0],r.position[1]+1],'tablet must face south');
  for(const h of d.houses){assert(alive.has(key(h.door)),`${h.id}: door unreachable`);assert(alive.has(key([h.door[0],h.door[1]+1])));}
  const worst=flood(d.entry,new Set([...aliveBlocks,...ranges]));assert(worst.has(key(d.boss.approach)));assert(worst.has(key(d.haven.spring.approach)));assert(worst.has(key(d.haven.havenNpc.approach)));
  const ids=[...d.houses,...d.boards,...d.reviews,...d.queue,...d.enemies,d.back,d.haven.spring,d.haven.havenNpc,d.boss,d.gate,d.sign].map(o=>o.id);assert.equal(new Set(ids).size,ids.length);
  return {result:'PASS',dimensions:[d.width,d.height],mainRouteSteps:d.mainRoute.length-1,shortestEntryToBoss:shortest,enemies:d.enemies.length,queue:d.queue.length,houses:d.houses.length,boards:d.boards.length,reviews:d.reviews.length,unreachableUsableFloor:0,nearestEnemySteps:Math.min(...d.enemies.map(e=>alive.get(key(e.position)))),enemyRangeCells:ranges.size,havenEnemyOverlaps:0,bossAliveGateReachable:false,bossDefeatedGateReachable:true,allEnemyRangesBlockedBossApproachReachable:true};
}
function markdown(d,r) {
  const view=d.terrain.map(row=>[...row]),put=(p,s)=>view[p[1]][p[0]]=s;
  d.mainRoute.forEach(p=>put(p,':'));d.houses.forEach(h=>{const [x,y]=h.position;cells([x,y,x+4,y+3]).forEach(p=>put(p,'H'));put(h.door,'D');});
  d.queue.forEach(q=>put(q.position,'q'));d.enemies.forEach(e=>put(e.position,'e'));d.boards.forEach(o=>put(o.position,'P'));d.reviews.forEach(o=>put(o.position,'R'));put(d.haven.spring.position,'S');put(d.haven.havenNpc.position,'T');d.boss.footprint.forEach(p=>put(p,'B'));d.gate.footprint.forEach(p=>put(p,'G'));put(d.sign.position,'!');put(d.entry,'I');put(d.back.position,'<');
  return `# 第四章 導入「王都の関所街」設計

状態：設計のみ。ゲームへの登録・素材制作・実画面検証は組み込み担当の作業。本設計は3ファイルのみを生成し、src/・records.md・制作台帳は変更しない。

## 接続と導線

海底の古道の浜辺から南端の入口 [20,48] へ着地する。隣の帰還階段 [21,48] は「海底の古道へ戻る」。遷移先IDは underseaOldRoad、浜辺の着地座標は組み込み側で既存の出口と接続する。南端 y=49 の3マスも床で、画面外へ歩ける遷移は階段だけに登録する。

60×50マス、1マス64px、全体3840×3200px。座標は左上原点、x東・y南、矩形は両端込み。terrain は石畳「.」と壁「#」だけ。家・小物・人の衝突は別リストから加える。

入口 → [20,40] の安全な灯り → [20,29] までの西路地 → [30,29] の大通り → [30,10] の城門前。mainRoute はこの経路を1マスずつ列挙し、${r.mainRouteSteps}歩。実際の障害物込み最短も${r.shortestEntryToBoss}歩。入口から灯りまで8歩で、泉と茶屋は主導線から見える西側にある。

路地の選択は西の小周回と東の小周回の2本。西は y=19 と29、東は y=19 と29 で大通りへ戻る。家の玄関前は短い寄り道で、敵を袋小路の奥へ大量配置しない。東路地の y=30〜34 は家2軒の前庭が続く短い終端。主導線の敵との戦闘は任意で、道を見失わず城門へ進める。

## 街の意味と配置

道化師エヌコイールイーチが通行人を一人ずつ止め、そのたびに名簿倉庫へ往復させている。大通りの両脇の行列12人、閉じた家8軒、手配書2枚、灯りの消えた路地で停滞を伝える。倉庫は新たな入室先を作らず、royal-house-5 の閉じた外観を使う。名簿往復は台詞や演出で表現し、プレイヤーに12往復を課す進行条件は設けない。

敵は魔物ではなく待たされ疲弊した住人12人。接近して正気に戻す戦闘を行い、救済後は同じ場所付近に座る非衝突NPCへ置換する。初期位置の半径1正方形内で、壁・建物・小物を越えず連結した床だけをのろのろ移動する。主導線・灯り・城門前へ追跡しない。速度、戦闘内容、救済状態の保存は組み込み担当が設定する。全住人救済は城門解放の条件にしない。

|要素|位置・範囲|役割・衝突|
|---|---|---|
|安全な灯り|[13,37,23,43]|敵の移動候補と完全分離した小広場|
|回復泉 / 接近|[16,40] / [17,40]|無料回復。泉本体は1マス衝突|
|隠れ茶屋の主人 / 接近|[16,42] / [17,42]|安全な場所と街の事情を伝える。1マス衝突|
|行列|x=28,32、y=12,15,18,21,24,27|NPC各1人。非衝突で中央3マスを空ける|
|道化師占有|[29,9],[30,9],[31,9]|生存時のみ3マスすべて通行不可|
|対峙位置 / 前庭|[30,10] / [27,10,33,14]|敵なし。中央の道化師 [30,9] に南から話す|
|城門|[30,8]、横3マス|撃破で開く。地形を替えず門とボスの衝突を解除|
|制作中看板 / 接近|[30,4] / [30,5]|「この先の王城は制作中です」。看板本体は衝突|
${[...d.boards,...d.reviews].map(o=>`|${o.id}|[${o.position}] / 接近 [${o.approach}]|1マス衝突、石板は南正面から任意閲覧|`).join('\n')}

城門の壁を横断する床は x=29〜31 だけ。ボスはその全幅を塞ぐので、門自体を検証上開放していてもボス生存中は向こうへ届かない。撃破後は北の小庭へ歩き、制作中看板を読んで帰れる。北端は壁で閉じ、王城への遷移は登録しない。

## 家と敵の座標

家は position を左上とする5×4マス。下地20マスすべて石畳、そのうち扉 (x+2,y+3) を除く19マスが衝突。扉の南1マスも石畳かつ到達可能。閉店・閉鎖の表現であり内部マップは作らない。

|家ID|左上|扉|
|---|---|---|
${d.houses.map(h=>`|${h.id}|[${h.position}]|[${h.door}]|`).join('\n')}

|住人ID|初期位置|移動|
|---|---|---|
${d.enemies.map(e=>`|${e.id}|[${e.position}]|半径1内の連結した石畳、追跡も範囲内限定|`).join('\n')}

## 全体図

図だけの記号：: 主導線、I 入口、< 帰還階段、H 家の衝突、D 扉、q 行列、e 疲れた住人、S 泉、T 茶屋主人、P 掲示板、R 石板、B ボス、G 門、! 看板。JSON の terrain にこれらの追加記号は含めない。

\`\`\`text
    ${Array.from({length:d.width},(_,i)=>Math.floor(i/10)).join('')}
    ${Array.from({length:d.width},(_,i)=>i%10).join('')}
${view.map((row,y)=>String(y).padStart(3,'0')+' '+row.join('')).join('\n')}
\`\`\`

## 読み込みと検証

[既存の読み込み側](../../src/world/undersea.ts) と同じく JSON を import し、座標タプル [x,y] を Point に変換する。enemies / houses / boards / reviews / queue は id と position を持つ配列。haven.spring と haven.havenNpc、back、gate、sign は id・position を持つオブジェクト。boss.forecourt と haven.bounds は [x1,y1,x2,y2]。mainRoute は描画用地形ではなく導線検証用。

家の当たり判定は5×4から扉を除外し、掲示板・石板・泉・主人・看板は1マス衝突、行列と救済済み住人は非衝突。boss.footprint は撃破フラグに連動して全解除する。gate.footprint も同じフラグで全解除する。看板や石板は position の南側など approach から調べるイベントを実装する。実行側が敵の自由追跡を許す場合、本設計の安全範囲保証は成立しないため必ず radius の制限も反映する。

\`node docs/production/chapter-four-gate-validate.mjs --write\` でJSONと本書を決定的に生成。通常実行は書き込みなしで生成結果との完全一致、4近傍BFS、全オブジェクト重複、家の下地と扉、敵の入口からの距離、敵範囲と灯りの分離、ボス迂回不可と撃破後開通を検証する。全敵範囲を同時に塞いでも泉・茶屋・ボス前へ到達できる。

\`\`\`json
${JSON.stringify(r,null,2)}
\`\`\`

未実施：実行側登録、海底マップとの接続、素材と実画面衝突、台詞とN+1教材、救済・撃破フラグ、移動速度、プレイ時間の計測、制作台帳への登録。編集範囲を3ファイルへ限定する依頼に従い、これらは組み込み担当へ引き継ぐ。
`;
}
const generated=build(),report=verify(generated);
if(process.argv.includes('--write')){fs.writeFileSync(jsonUrl,JSON.stringify(generated,null,2)+'\n');fs.writeFileSync(docUrl,markdown(generated,report));}
assert(fs.existsSync(jsonUrl),'layout missing: run with --write');
const saved=JSON.parse(fs.readFileSync(jsonUrl,'utf8'));assert.deepEqual(saved,generated,'layout differs from deterministic generator');
assert.equal(fs.readFileSync(docUrl,'utf8'),markdown(generated,report),'design differs from deterministic generator');
console.log(JSON.stringify(verify(saved),null,2));
