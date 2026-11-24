// Deterministic layout v2 generator and verifier. Default execution is read-only.
import fs from "node:fs";
import assert from "node:assert/strict";
const key = p => p.join(',');
const adjacent = ([x,y]) => [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
const square = ([x,y],r) => Array.from({length:2*r+1},(_,j)=>Array.from({length:2*r+1},(_,i)=>[x+i-r,y+j-r])).flat();
const jsonUrl = new URL('./chapter-three-undersea-layout.json',import.meta.url);
const docUrl = new URL('./chapter-three-undersea-design.md',import.meta.url);
const base = {
  "area": "underseaOldRoad",
  "name": "海底の古道",
  "tilePixels": 64,
  "coordinateSystem": "0-based x east, y south; bounds inclusive",
  "terrainTheme": "one undersea floor/wall family; # wall, . floor; no other terrain types",
  "entry": [
    8,
    104
  ],
  "exit": [
    40,
    4
  ],
  "entryConnection": {
    "sourceArea": "mountainVillage",
    "buildingId": "village-ledger-house",
    "buildingAnchor": [
      2,
      3
    ],
    "villageApproach": [
      4,
      6
    ],
    "interior": "地下書庫（新規・未実装）",
    "basementLanding": [
      8,
      104
    ],
    "deepStairs": [
      8,
      104
    ],
    "rule": "第二章クリア後に建物→地下書庫の奥→古道。村の建物座標を古道の床座標へ流用しない。"
  },
  "exitConnection": {
    "destination": "temporary far-continent beach (included in this map)",
    "landing": [
      40,
      4
    ],
    "unfinishedTown": true
  },
  "boss": {
    "id": "undersea-spaghetti",
    "name": "ヘドロの主・スパゲッティ",
    "position": [
      40,
      12
    ],
    "footprint": [
      [
        40,
        11
      ],
      [
        40,
        12
      ],
      [
        40,
        13
      ]
    ],
    "approach": [
      40,
      14
    ],
    "forecourt": [
      34,
      14,
      46,
      19
    ],
    "state": "alive blocks footprint; defeated removes collision",
    "defeatedFlag": "undersea-spaghetti-defeated"
  },
  "sign": {
    "id": "undersea-work-in-progress",
    "position": [
      44,
      4
    ],
    "approach": [
      43,
      4
    ],
    "text": "この先の職人の町は制作中です。海底の古道から石灯の村へ戻れます。",
    "blocking": true
  },
  "doors": [],
  "trials": [],
  "exploration": {
    "targetSeconds": 720,
    "rangeSeconds": [
      600,
      900
    ],
    "movementTilesPerSecond": 2,
    "inspectionWalkTiles": 480,
    "branchDecisionSeconds": 240,
    "orientationSeconds": 240,
    "excludes": [
      "石板の読書",
      "戦闘",
      "長い会話"
    ],
    "optionalReadingSeconds": 120,
    "expectedOptionalBattles": 6,
    "secondsPerBattle": 30,
    "bossSeconds": 90,
    "rule": "探索12分は仮定による見積もり。全22体討伐は任意。戦闘を含む初見総時間の目安は18.5分。"
  }
};

function build(){
  const d={...structuredClone(base),version:2,generatedFrom:'chapter-three-undersea-validate.mjs',status:'layout-v2; runtime integration and visual playtest pending',width:81,height:111};
  const grid=Array.from({length:d.height},()=>Array(d.width).fill('#'));
  const carve=([x,y])=>{assert(x>0&&x<80&&y>0&&y<110);grid[y][x]='.';};
  const rect=([a,b,c,e])=>{for(let y=b;y<=e;y++)for(let x=a;x<=c;x++)carve([x,y]);};
  const path=points=>{const cells=[points[0]];carve(points[0]);for(let i=1;i<points.length;i++){let [x,y]=points[i-1];const [a,b]=points[i];assert(x===a||y===b);while(x!==a||y!==b){x+=Math.sign(a-x);y+=Math.sign(b-y);cells.push([x,y]);carve([x,y]);}}return cells;};
  d.waypoints=[[8,104],[8,98],[14,98],[14,94],[28,94],[28,90],[42,90],[42,94],[56,94],[56,88],[64,88],[64,84],
    [54,84],[54,80],[40,80],[40,84],[26,84],[26,78],[18,78],[18,74],
    [28,74],[28,70],[42,70],[42,74],[56,74],[56,68],[64,68],[64,64],
    [54,64],[54,60],[40,60],[40,64],[26,64],[26,58],[18,58],[18,54],
    [18,50],[30,50],[30,46],[44,46],[44,50],[56,50],[56,44],[64,44],[64,40],
    [64,36],[54,36],[54,32],[40,32],[40,36],[28,36],[28,30],[20,30],[20,24],[30,24],[30,21],[40,21],[40,14],[40,4]];
  d.mainRoute=path(d.waypoints);
  rect([7,103,10,105]); // Runtime stairs at entry+[0,1], warp at entry+[1,1].
  rect(d.boss.forecourt);rect([32,1,48,8]);
  d.features=[
    {name:'崩れた書庫前の裂け目',bounds:[1,89,78,108],description:'幅1の段違いの裂け目。崩れた棚と裂け目の奥の目。白い三本傷をたどる。'},
    {name:'泥水の浸水区画',bounds:[1,77,78,88],description:'泥水で失われた足場の間を、幅1の堤だけが屈曲して残る。流れに逆らう細い水筋が目印。水は壁背景で表す。'},
    {name:'沈船の船腹回廊',bounds:[1,65,78,76],description:'折れた船肋を回り込む。朽ちた線路が船腹を縫い、錆びた鎖の向こうに敵が潜む。'},
    {name:'骨と本の捨て場',bounds:[1,53,78,64],description:'骨と湿った本が壁に押し込まれた廃棄坑。見通しの悪い枝道と、広間へ続く引きずり跡。'},
    {name:'暗い海窓の回廊',bounds:[1,39,78,52],description:'唯一の長めの幅2の床。黒い海の壁面を見て休める。泉と石板、灯りの帰還点をまとめる。'},
    {name:'汚泥の広間への坑道',bounds:[1,20,78,38],description:'線路が泥に埋まり、壁の三本傷だけが残る。迂回坑を抜けて、幅1の入口から汚泥の広間へ。'},
    {name:'汚泥の広間',bounds:[34,11,46,19],description:'骨も本も泥に呑まれる広間。北の首はボスの体だけが塞ぎ、撃破後に浜辺の階段が開く。'},
    {name:'向こう岸の浜辺',bounds:[32,1,48,8],description:'階段の先の一時的な行き止まり。出口と制作中看板の役割を維持。'},
  ];
  // A second tile only along the sea window; never dilate the whole route.
  rect([19,49,28,50]);
  const routeSet=new Set(d.mainRoute.map(key));
  const enemies=[];
  // Narrow alternate galleries: ends meet the route, middle turns hide enemies.
  // Select distinct, separated doglegs; no enemy rooms or 5x5 floor squares.
  const used=new Set();
  const ambushSegments=new Set([4,8,12,16,20,24,28,32,37,46,50]);
  for(let i=1;i<d.waypoints.length&&enemies.length<22;i++){
    if(!ambushSegments.has(i))continue;
    const a=d.waypoints[i-1],b=d.waypoints[i];
    if(a[1]!==b[1]||Math.abs(a[0]-b[0])<10||a[1]<24)continue;
    const left=Math.min(a[0],b[0])+1,right=Math.max(a[0],b[0])-1,y=a[1];
    for(const sign of [i%2?1:-1,i%2?-1:1]){
      const depth=[12,24,32].includes(i)?6:5,yy=y+sign*depth;
      const origins=[[left+2,yy],[right-2,yy]];
      if(yy<22||yy>107||origins.some(p=>square(p,2).some(q=>routeSet.has(key(q))||used.has(key(q)))))continue;
      const jog=i%3===0?2:1;
      path([[left,y],[left,yy-sign*jog],[left+2,yy-sign*jog],[left+2,yy],[right,yy],[right,y]]);
      for(const position of origins){enemies.push({id:`undersea-enemy-${String(enemies.length+1).padStart(2,'0')}`,variant:['漂着した基礎の敵','泥を被ったCRUDの敵','絡まった役割の敵'][enemies.length%3],position,radius:2,rangeMetric:'Chebyshev square clipped to floor; no pursuit outside range'});square(position,2).forEach(p=>used.add(key(p)));}
      break;
    }
  }
  assert.equal(enemies.length,22,'need eleven ambush galleries');d.enemies=enemies;
  const alcove=(branch,position)=>{path([branch,[position[0],branch[1]],position]);rect([position[0]-1,position[1]-1,position[0]+1,position[1]+1]);};
  const specs=[['basics-ui','基礎①：React / Vueの表示・状態',[4,100],[8,100]],['basics-server','基礎②：Laravelの入口とMVC',[72,84],[64,84]],['read','Read：index / showと取得対象',[10,74],[18,74]],['create','Create：create / storeと検証',[72,64],[64,64]],['update','Update：edit / updateと対象限定',[10,50],[18,50]],['delete','Delete：destroyと残す記録',[12,24],[20,24]]];
  d.reviews=specs.map(([id,topic,position,branch])=>{alcove(branch,position);return {id:'undersea-review-'+id,topic,position,bounds:[position[0]-1,position[1]-1,position[0]+1,position[1]+1],branch,required:false,representation:'optional-tablet',blocking:false};});
  d.spring={id:'undersea-spring',position:[35,42],approach:[35,43],bounds:[34,41,36,43]};path([[35,46],[35,43]]);rect(d.spring.bounds);
  d.returns=[{id:'undersea-return-1',position:[10,78],approach:[11,78],branch:[18,78]},{id:'undersea-return-2',position:[72,40],approach:[71,40],branch:[64,40]}].map(r=>{alcove(r.branch,r.position);return {...r,destination:'underseaOldRoad',destinationLabel:'地下書庫前室（入口階段から石灯の村へ）',destinationPosition:[8,104],resumeLanding:r.approach,unlock:'visited'};});
  d.chests=[{id:'undersea-chest-1',position:[48,105],approach:[48,104],contents:'回復消耗品（内容量は実装時調整）'},{id:'undersea-chest-2',position:[8,60],approach:[9,60],contents:'MP回復消耗品（内容量は実装時調整）'},{id:'undersea-chest-3',position:[72,27],approach:[72,28],contents:'ボス前の補給品（内容量は実装時調整）'}];
  path([[48,94],[48,99],[52,99],[52,103],[48,103],[48,105]]);
  path([[18,58],[14,58],[14,62],[10,62],[10,60],[8,60]]);
  path([[64,36],[72,36],[72,32],[76,32],[76,28],[72,28],[72,27]]);
  // Short empty dead ends interrupt the certainty of a loop, but have a visible end.
  path([[36,90],[36,86],[32,86]]);path([[34,70],[34,66],[31,66]]);path([[48,60],[48,56],[44,56]]);
  d.terrain=grid.map(r=>r.join(''));
  const occupied=new Set([...d.reviews,...d.returns,...d.chests,d.spring,d.sign,...d.enemies].map(o=>key(o.position)));
  d.decor=[];
  for(const [i,f] of d.features.entries()){
    if(i===7)continue;
    const [x1,y1,x2,y2]=f.bounds;
    const candidates=[];
    for(let y=y1;y<=y2;y++)for(let x=x1;x<=x2;x++)if(grid[y][x]==='#'&&grid[y+1]?.[x]==='.'&&!occupied.has(key([x,y+1])))candidates.push([x,y]);
    assert(candidates.length>=4);
    const kinds=[['books','eyes','chains','bones'],['drip','chains','eyes','drip'],['wreck','chains','wreck','bones'],['bones','books','eyes','books'],['drip','chains','eyes','wreck'],['bones','books','drip','eyes'],['bones','chains','books','drip']][i];
    for(let j=0;j<4;j++){const position=candidates[Math.floor((j+.5)*candidates.length/4)];if(!d.decor.some(v=>key(v.position)===key(position)))d.decor.push({kind:kinds[j],position});}
  }
  d.exploration.inspectionWalkTiles=560;d.exploration.branchDecisionSeconds=220;d.exploration.orientationSeconds=220;
  d.exploration.rule='探索12分は560歩と分岐判断・景観確認を含む仮定。全22体討伐は任意。初見総時間の例18.5分。';
  return d;
}

function verify(d){
  assert.equal(d.version,2);assert.equal(d.width,81);assert.equal(d.height,111);assert.equal(d.tilePixels,64);
  assert.equal(d.terrain.length,d.height);assert(d.terrain.every(r=>r.length===d.width&&/^[.#]+$/.test(r)));
  assert(d.terrain[0].split('').every(c=>c==='#')&&d.terrain.at(-1).split('').every(c=>c==='#'));assert(d.terrain.every(r=>r[0]==='#'&&r.at(-1)==='#'));
  const floor=p=>d.terrain[p[1]]?.[p[0]]==='.';
  const floors=d.terrain.flatMap((r,y)=>[...r].flatMap((v,x)=>v==='.'?[[x,y]]:[]));
  const flood=(start,blocked=new Set())=>{const distances=new Map();if(!floor(start)||blocked.has(key(start)))return distances;const q=[start];distances.set(key(start),0);for(let i=0;i<q.length;i++)for(const p of adjacent(q[i]))if(floor(p)&&!blocked.has(key(p))&&!distances.has(key(p))){distances.set(key(p),distances.get(key(q[i]))+1);q.push(p);}return distances;};
  const clear=flood(d.entry);assert.equal(clear.size,floors.length,'unreachable floor');
  const shortest=clear.get(key(d.exit));assert(shortest>=286&&shortest<=429,`shortest path ${shortest} outside v1 286..429`);
  assert.deepEqual(d.mainRoute[0],d.entry);assert.deepEqual(d.mainRoute.at(-1),d.exit);
  let narrow=0,turns=0,broadRun=0,maxBroadRun=0;
  for(let i=0;i<d.mainRoute.length;i++){
    const p=d.mainRoute[i];assert(floor(p));if(i)assert(adjacent(p).some(q=>key(q)===key(d.mainRoute[i-1])));
    if(i&&i<d.mainRoute.length-1){const a=d.mainRoute[i-1],b=d.mainRoute[i+1];if(a[0]!==b[0]&&a[1]!==b[1])turns++;}
    if(p[1]>=20&&p[1]<=102){ // Measured local transverse width, excluding junctions and end rooms.
      const before=d.mainRoute[i-1],after=d.mainRoute[i+1];if(!before||!after)continue;
      if(before[0]===p[0]&&after[0]===p[0]||before[1]===p[1]&&after[1]===p[1]){
        const delta=before[0]===after[0]?[1,0]:[0,1];let width=1;
        for(const sign of [-1,1])for(let n=1;floor([p[0]+sign*n*delta[0],p[1]+sign*n*delta[1]]);n++)width++;
        if(width<=2){narrow++;broadRun=0;}else{broadRun++;maxBroadRun=Math.max(maxBroadRun,broadRun);}
      }else broadRun=0;
    }
  }
  const tunnelCells=d.mainRoute.filter(p=>p[1]>=20&&p[1]<=102).length;
  assert(narrow/tunnelCells>=.70,`too much broad main route ${narrow}/${tunnelCells}`);assert(turns>=35);
  assert(maxBroadRun<=3,`broad avenue persists for ${maxBroadRun} consecutive tiles`);
  const bossSet=new Set(d.boss.footprint.map(key));
  assert.deepEqual(d.boss,base.boss,'boss contract changed');
  const alive=flood(d.entry,bossSet);assert(alive.has(key(d.boss.approach)));assert(!alive.has(key(d.exit)),'boss bypass');
  d.boss.footprint.forEach(p=>assert(floor(p)));
  assert.equal(d.enemies.length,22);assert.equal(d.reviews.length,6);assert.equal(d.returns.length,2);assert.equal(d.chests.length,3);assert.equal(d.doors.length,0);assert.equal(d.trials.length,0);
  assert.deepEqual(d.reviews.map(r=>r.id),['basics-ui','basics-server','read','create','update','delete'].map(id=>'undersea-review-'+id));
  const ranges=new Set(),positions=new Set();
  for(const e of d.enemies){assert(floor(e.position));assert(!positions.has(key(e.position)));positions.add(key(e.position));assert.equal(e.radius,2);const range=square(e.position,2).filter(floor);range.forEach(p=>ranges.add(key(p)));assert(range.length<20,`${e.id} is in a broad enemy room`);assert(adjacent(e.position).filter(floor).length>=2,`${e.id} isolated in a dead-end cell`);}
  // Simultaneously block every possible enemy tile, not just starting positions.
  const staticBlocks=[...d.reviews,...d.returns,d.sign].map(o=>key(o.position));staticBlocks.push(key([d.entry[0]+1,d.entry[1]+1]));
  const safe=flood(d.entry,new Set([...ranges,...bossSet,...staticBlocks]));
  d.mainRoute.filter(p=>!bossSet.has(key(p))).forEach(p=>assert(!ranges.has(key(p)),`enemy can occupy clue route ${p}`));
  assert(safe.has(key(d.boss.approach)),'enemies block all forward paths');
  assert(flood(d.entry,new Set([...ranges,...staticBlocks])).has(key(d.exit)));
  const approachable=o=>{assert(floor(o.position));assert(adjacent(o.position).some(p=>safe.has(key(p))),`unsafe interaction ${o.id}`);if(o.approach){assert(adjacent(o.position).some(p=>key(p)===key(o.approach)));assert(safe.has(key(o.approach)),`unsafe approach ${o.id}`);}};
  [...d.reviews,...d.returns,...d.chests,d.spring].forEach(approachable);
  for(const r of d.returns){assert.equal(r.destination,'underseaOldRoad');assert.deepEqual(r.destinationPosition,d.entry);assert(safe.has(key(r.resumeLanding)));assert.equal(r.unlock,'visited');}
  assert(flood(d.entry,new Set(staticBlocks)).has(key(d.sign.approach)));
  assert(floor([d.entry[0],d.entry[1]+1]));assert(floor([d.entry[0]+1,d.entry[1]+1]));
  for(const c of d.chests)assert.equal(adjacent(c.position).filter(floor).length,1,'chest must end a branch');
  const decorKeys=new Set();for(const o of d.decor){assert(['drip','bones','wreck','books','eyes','chains'].includes(o.kind));assert.equal(d.terrain[o.position[1]]?.[o.position[0]],'#','decor must anchor on wall');assert(floor([o.position[0],o.position[1]+1]),'decor needs wall face above floor');assert(!decorKeys.has(key(o.position)));decorKeys.add(key(o.position));}
  // Even a one-cell solid footprint at every decor anchor changes no walkability.
  assert.equal(flood(d.entry,decorKeys).size,clear.size);
  for(const f of d.features.slice(0,7)){const [a,b,c,e]=f.bounds;const n=d.decor.filter(o=>o.position[0]>=a&&o.position[0]<=c&&o.position[1]>=b&&o.position[1]<=e).length;assert(n>=3&&n<=8,`decor density ${f.name}: ${n}`);}
  const ids=[...d.enemies,...d.reviews,...d.chests,...d.returns,d.spring,d.boss,d.sign].map(o=>o.id);assert.equal(new Set(ids).size,ids.length);
  assert.equal(d.exploration.targetSeconds,d.exploration.inspectionWalkTiles/d.exploration.movementTilesPerSecond+d.exploration.branchDecisionSeconds+d.exploration.orientationSeconds);
  return {result:'PASS',floorCells:floors.length,unreachableFloors:0,shortestSteps:shortest,previousShortestSteps:286,maxShortestSteps:429,mainRouteSteps:d.mainRoute.length-1,turns,narrowMainRouteCells:narrow,tunnelRouteCells:tunnelCells,narrowRatio:Number((narrow/tunnelCells).toFixed(3)),maxBroadRun,enemyCount:d.enemies.length,enemyRangeCells:ranges.size,allEnemyRangesBlocked:{bossApproach:true,facilities:true,exitAfterBoss:true},runtimeSolidPropsChecked:true,bossAliveExitReachable:false,bossDefeatedExitReachable:true,decorCount:d.decor.length,decorBlockedFloorCells:0,reviewTablets:6,returnPoints:2,chests:3,springs:1};
}

function markdown(d,r){
  const grid=d.terrain.map(row=>[...row]);const put=(p,c)=>grid[p[1]][p[0]]=c;
  d.mainRoute.forEach(p=>put(p,':'));d.decor.forEach(o=>put(o.position,'*'));d.enemies.forEach(o=>put(o.position,'e'));d.reviews.forEach(o=>put(o.position,'o'));d.chests.forEach(o=>put(o.position,'C'));d.returns.forEach(o=>put(o.position,'R'));put(d.spring.position,'S');d.boss.footprint.forEach(p=>put(p,'B'));put(d.boss.approach,'A');put(d.sign.position,'!');put(d.entry,'I');put(d.exit,'X');
  return ['# 第三章 序幕「海底の古道」設計 v2','','対象は配置JSON・設計・検証の3ファイル。ゲーム側の組み込みと実画面の検証は担当側で実施する。生成時の配置が正本で、保存済みの石板・敵・宝箱・帰還点・ボスIDは維持する。','','## 接続と進行','','父の古い依頼書の宛先を確かめるため、自分の意思で海を渡る。[第三章計画](chapter-three-plan.md)の導入を維持し、両親の生死を確定せず「縁の台帳」はここでは教えない。石灯の村の既存建物 `village-ledger-house` → 地下書庫 → 入口 [8,104]。入口南隣 [8,105] の階段と [9,105] の帰還灯用床を維持する。第二章クリア後の開通・村との遷移は実装側の管理。','','帰還点は2個。訪問で有効になり、地下書庫前室 [8,104] へ戻る。再利用時は対応する `resumeLanding` に任意で戻る。浜辺の出口 [40,4]・制作中看板 [44,4] とその操作位置 [43,4] は維持する。新しい街への遷移はこの配置設計では追加しない。','','## 坑道の形と区画','','81×111、64pxセル、座標は左上原点のx東・y南。地形は `.` と `#` だけ。主導線は基本幅1、海窓のみ一部幅2。分岐の合流、石板の3×3の窪み、泉、ボス広間、浜辺は局所的な拡幅。一本の幅3の大通りを廃止し、段違いの屈曲と11本の細い迂回坑、短い空の行き止まりと3本の宝箱支路を組み合わせる。','','|順序・区画|範囲 x1,y1,x2,y2|形状・気配・手がかり|','|---|---|---|',...d.features.map((f,i)=>`|${i+1}. ${f.name}|${f.bounds}|${f.description}|`),'','入口→浸水→船腹→捨て場→海窓→汚泥広間→浜辺の順。浸水の壁は水に呑まれた空間、床は残った細い足場として描く。船腹は船材と鎖、捨て場は骨と本、広間へ近づくほど本の泥汚れと引きずり跡を濃くする。海窓では広い部屋を新設せず、幅2の棚道と泉の窪みで一息つく。','','## 正解の道を読む','','`mainRoute` は任意戦闘を避けて進める連続した案内線。`waypoints` はその曲がり角。書庫の三本傷→浸水の細い水筋→船腹の古い線路→捨て場の引きずり跡→海窓の線路→泥に埋もれた壁の三本傷、と区画ごとの連続した手がかりで追える。分岐では案内線側の壁に同じ印を続ける。単独の鎖・目・水滴は道案内にせず、不安を誘う周辺演出にする。これらの連続手がかりの描画は実装担当への指示であり、地形だけで表示済みとはしない。',``, `最短 ${r.shortestSteps} 歩（従来286歩、上限429歩）。手がかりに沿う主導線は ${r.mainRouteSteps} 歩、曲がり角 ${r.turns} 個。広間・浜辺を除く導線の幅1〜2の比率 ${Math.round(r.narrowRatio*100)}%。短い迂回坑は同じ区画に戻り、区画を丸ごと飛ばす接続やボスへの裏口は作らない。`, '', '## 敵と寄り道','','敵22体は11本の迂回坑の折れ角と狭所に2体ずつ置く。敵のための小部屋はない。分岐の暗がりに姿を覗かせ、深く入る前に本線を選べる。迂回坑に入り戦うか、手がかりの坑道に戻るかを選ぶ。各敵は初期位置から半径2のChebyshev正方形を床で切った範囲だけを動き、範囲外追跡はしない。全行動候補セルを一度に塞いでも、主導線と全施設への操作位置へ到達できる。敵が主導線へ入らない安全性を保持しつつ、敵の位置を部屋の奥から坑道の角へ移した。','','|敵ID|位置|半径|','|---|---|---|',...d.enemies.map(e=>`|${e.id}|${e.position}|2|`),'','宝箱は折れた支路の突き当たり。石板6枚は敵の届かない3×3の窪みで任意閲覧、進行条件なし。泉1・帰還点2も敵の行動範囲から離す。封印扉・実習部屋は追加しない。','','|施設ID|位置|操作位置 / 分岐|','|---|---|---|',...d.reviews.map(o=>`|${o.id}|${o.position}|分岐 ${o.branch} / ${o.topic}|`),...d.returns.map(o=>`|${o.id}|${o.position}|${o.approach} / 再開 ${o.resumeLanding}|`),...d.chests.map(o=>`|${o.id}|${o.position}|${o.approach} / ${o.contents}|`),`|${d.spring.id}|${d.spring.position}|${d.spring.approach}|`,'','## ボスと装飾契約','','ヘドロの主・スパゲッティの `boss` の全キー・値はv1を維持する。原点 [40,12]、占有 [40,11],[40,12],[40,13]、対峙位置 [40,14]、広間 [34,14,46,19]。生存中は体の3セルで北の首を完全に塞ぎ、撃破で3セルの衝突が消える。通常敵は広間と対峙位置へ入れない。','','`decor` は `{kind, position}` の配列。各地下区画と広間に4個、計28個。kindは `drip / bones / wreck / books / eyes / chains`。全て直下に床のある壁セルをアンカーにする。`blocksMovement:false`、描画は壁内に収め、床へは影や水滴のみを重ねる。壁側アンカーを全て仮に衝突セルにしても歩ける床数は変わらない。大きな素材のはみ出し・視認性は組み込み後の実画面で確認する。','','|装飾kind|壁アンカー|','|---|---|',...d.decor.map(o=>`|${o.kind}|${o.position}|`),'','## ASCII全体図','','`#` 壁、`.` 床、`:` 案内主導線、`*` 壁装飾、`e` 敵、`o` 石板、`C` 宝箱、`R` 帰還点、`S` 泉、`B` ボス、`A` 対峙位置、`I` 入口、`X` 浜辺出口、`!` 看板。行頭はy、列はx。','','```text','    '+Array.from({length:d.width},(_,i)=>Math.floor(i/10)%10).join(''),'    '+Array.from({length:d.width},(_,i)=>i%10).join(''),...grid.map((row,y)=>String(y).padStart(3,'0')+' '+row.join('')),'```','','## 検証と引き継ぎ','','`node docs/production/chapter-three-undersea-validate.mjs` は読み取りのみ。`--write` は配置JSONと本書を決定的に生成する。全床到達、幅1〜2の割合、曲がり角、従来比最短距離、敵半径全体を塞いだ施設到達性、実装の石板・帰還灯・看板・入口灯の衝突、ボス足止めと撃破後の開通、宝箱の行き止まり、装飾の非干渉、IDと個数を検証する。','','```json',JSON.stringify(r,null,2),'```','','探索12分は560歩÷2セル/秒＋分岐判断220秒＋再定位220秒の仮定。任意読書2分＋任意戦闘6回×30秒＋ボス90秒で初見18.5分の例。初見実測は未実施。組み込み担当は地形画像・壁の水面・手がかりの連続表示・暗さと小物の視認性・カメラの先読み・古い保存座標の復元を実画面で確認する。`src/` と制作記録はこの担当では編集しない。',''].join('\n');
}

const generated=build();
const report=verify(generated);
if(process.argv.includes('--write')){fs.writeFileSync(jsonUrl,JSON.stringify(generated,null,2)+'\n');fs.writeFileSync(docUrl,markdown(generated,report));}
const saved=JSON.parse(fs.readFileSync(jsonUrl,'utf8'));assert.deepEqual(saved,generated,'saved JSON differs: use --write');assert.equal(fs.readFileSync(docUrl,'utf8'),markdown(generated,report),'saved design differs: use --write');
console.log(JSON.stringify(verify(saved),null,2));
