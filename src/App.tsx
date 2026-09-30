import { useCallback, useEffect, useRef, useState } from 'react';
import { areaLabel, difficultyLabel, houseAt, houses, maps, questions, type Area, type Difficulty, type Enemy, type HouseArea, type Npc, type Point, type Question, type Track } from './content';
import { PixelSprite, enemySprite } from './PixelSprite';
import { CharacterPortrait } from './CharacterPortrait';
import { WorldCharacter } from './WorldCharacter';
import { WorldScene } from './WorldScene';
import { enemyAt, moveEnemies, spawnEnemies, type EnemyPositions } from './enemyMovement';

type Phase = 'title' | 'prologue' | 'world' | 'encounter' | 'battle' | 'church' | 'epilogue' | 'clear';
type Save = { name: string; track: Track; difficulty: Difficulty; inertia: boolean; area: Area; pos: Point; hp: number; mp: number; xp: number; level: number; defeated: string[]; wrong: string[]; seen: string[]; answered: string[]; bossDefeated: boolean; magicUsed: boolean; completed: boolean; steps: number; correct: number; total: number };
type Dialogue = { speaker: string; face: string; lines: string[]; index: number; choices?: {label:string; response:string}[]; onEnd?: () => void };
type Battle = { enemy: Enemy; hp: number; maxHp: number; question: Question; answered: boolean; correct: boolean; eliminated: number | null; rounds: number; fromReview?: boolean };

const STORAGE = 'code-chronicle-save-v1';
const maxHp = (level: number) => 20 + (level - 1) * 5;
const maxMp = (level: number) => 3 + Math.floor((level - 1) / 2);
const rollDamage = (minimum: number, maximum: number) => minimum + Math.floor(Math.random() * (maximum - minimum + 1));
const initialSave = (): Save => ({ name: '旅人', track: 'react', difficulty: 'beginner', inertia: true, area: 'home', pos: maps.home.entry, hp: 20, mp: 3, xp: 0, level: 1, defeated: [], wrong: [], seen: [], answered: [], bossDefeated: false, magicUsed: false, completed: false, steps: 0, correct: 0, total: 0 });
const loadSave = (): Save | null => { try { const raw = localStorage.getItem(STORAGE); if(!raw) return null; const saved={...initialSave(),...JSON.parse(raw)} as Save; if(!maps[saved.area] || !walkable(saved.area,saved.pos)) return {...saved,area:'town',pos:maps.town.entry}; return saved; } catch { return null; } };
const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/^\.\//, '');
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
const inside = (area: Area, p: Point) => p.y >= 0 && p.y < maps[area].tiles.length && p.x >= 0 && p.x < maps[area].tiles[p.y].length;
const walkable = (area: Area, p: Point) => inside(area,p) && !['#', 'r', 'l', 'A', 'R', 'Z', 'W', 'w', 'U', 'V', 'b', 's', 'c'].includes(maps[area].tiles[p.y][p.x]);
const neighbors = (p: Point): Point[] => [{x:p.x,y:p.y-1},{x:p.x+1,y:p.y},{x:p.x,y:p.y+1},{x:p.x-1,y:p.y}];
function pathfind(area: Area, start: Point, goal: Point, defeated: string[], positions: EnemyPositions): Point[] {
  const queue: Point[] = [start], seen = new Set([`${start.x},${start.y}`]), parents = new Map<string,string>();
  while (queue.length) {
    const p = queue.shift()!;
    if (same(p,goal)) { const path: Point[] = []; let key = `${p.x},${p.y}`; while (key !== `${start.x},${start.y}`) { const [x,y] = key.split(',').map(Number); path.unshift({x,y}); key = parents.get(key)!; } return path; }
    for (const next of neighbors(p)) { const key = `${next.x},${next.y}`; const blocked=maps[area].npcs.some(n=>same(n,next)) || !!enemyAt(area,next,positions,defeated); if (!seen.has(key) && walkable(area,next) && !blocked) { seen.add(key); parents.set(key,`${p.x},${p.y}`); queue.push(next); } }
  }
  return [];
}

function eligible(save: Save, kind?: 'choice' | 'cli', topic?: Question['topic']) {
  return questions.filter(q => q.difficulty === save.difficulty && (!q.track || q.track === save.track) && (q.inertia === undefined || q.inertia === save.inertia) && (!kind || q.kind === kind) && (!topic || q.topic === topic));
}
function chooseQuestion(save: Save, kind?: 'choice' | 'cli', topic?: Question['topic']): Question {
  const pool = eligible(save,kind,topic);
  const unseen = pool.filter(q => !save.answered.includes(q.id));
  const candidates = unseen.length ? unseen : pool;
  const last = save.answered.at(-1);
  const withoutLast = candidates.filter(q => q.id !== last);
  const finalPool = withoutLast.length ? withoutLast : candidates;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

const prologue = [
  {speaker:'語り手',face:'📜',title:'知識が世界を照らした時代',text:'千年前。人々は「コード」と呼ばれる知識で、城を築き、遠くの誰かと言葉を交わした。\nAIと呼ばれた魔法は、人の知恵を広げ、日々の暮らしを支えていた。'},
  {speaker:'語り手',face:'📜',title:'奪われた言葉',text:'その光を恐れた魔王は、書物から言葉を、記憶から術を奪った。\n人々は知識を守るため、魔王をAIの力ごと深い門の向こうへ封じた。'},
  {speaker:'語り手',face:'📜',title:'封印のひび',text:'千年後、忘れられた遺跡の封印に亀裂が走る。\n目覚めた魔王は、かつて奪いきれなかった世界そのものを「デリート」しようとしていた。'},
  {speaker:'語り手',face:'📜',title:'燃える故郷',text:'青い屋根の城下町は、ある夜、炎に包まれた。\n鐘の音とともに人々が逃げ惑う。幼い主人公は、崩れた通りにひとり取り残された。'},
  {speaker:'語り手',face:'📜',title:'迫る影',text:'瓦礫の向こうから魔王の影が伸びる。足がすくみ、声も出ない。\nそのとき、聞き慣れた足音が炎の中を駆けてきた。'},
  {speaker:'父',face:'🧔',title:'父の背中',text:'「ここは俺が食い止める。お前は走れ！」\n父は剣を抜き、幼い主人公を背にかばった。「知識の扉を開け。忘れた言葉は、きっと取り戻せる」'},
  {speaker:'母',face:'👩',title:'母との約束',text:'「生きて。あなたが覚えたことは、誰にも奪わせないで」\n母は小さな手を握り、森へ続く道を示した。両親は主人公を逃がし、燃える町に残った。'},
  {speaker:'語り手',face:'📜',title:'十年後、旅立ちの朝',text:'十年が過ぎた。生き延びた人々は、新しい町を築いた。\n主人公は旅の支度を整え、自宅で朝を迎える。あの約束を胸に、最初の知識の扉を目指す時が来た。'},
] as const;
const npcChoices: Record<string,{label:string;response:string}[]> = {
  elder: [
    {label:'遺跡への依頼を聞く',response:'東の遺跡の奥に、最初の知識の扉がある。守護者を越えれば、魔法の一片を取り戻せるはずだ。'},
    {label:'十年前のことを聞く',response:'お前の両親は、世界の言葉を信じていた。あの願いを背負うのは重い。だが、お前は一人ではない。'},
  ],
  scholar: [
    {label:'ReactとVueについて聞く',response:'どちらも画面を小さな部品に分ける術よ。自分で選んだ道を、まずは丁寧に歩いてみて。'},
    {label:'Laravelについて聞く',response:'Laravelは、届いたお願いを受け止めて答えを返す城の番人のようなもの。ルートとコントローラを覚えて。'},
    {label:'InertiaとAPIについて聞く',response:'Inertiaならサーバがページ名とpropsを渡す。APIならJSONを受け取って画面が組み立てるの。設定で切り替えられるわ。'},
  ],
  child: [
    {label:'一緒に覚えよう',response:'うん！ まずは「コンポーネント」。小さなものを集めれば、大きなものを作れるんだよね。'},
    {label:'町の様子を聞く',response:'みんな怖がっているけど、教会の明かりがあるから大丈夫。あなたも無理しないでね。'},
  ],
};

export function App() {
  const [save,setSave] = useState<Save>(() => loadSave() ?? initialSave());
  const [enemyPositions,setEnemyPositions] = useState<EnemyPositions>(() => spawnEnemies(save.defeated));
  const [hasSave,setHasSave] = useState(() => !!loadSave());
  const [phase,setPhase] = useState<Phase>('title');
  const [introIndex,setIntroIndex] = useState(0);
  const [dialogue,setDialogue] = useState<Dialogue | null>(null);
  const [battle,setBattle] = useState<Battle | null>(null);
  const [battleInput,setBattleInput] = useState('');
  const [battleNote,setBattleNote] = useState('');
  const [showSettings,setShowSettings] = useState(false);
  const [worldMenu,setWorldMenu] = useState<'command'|'status'|'quest'|null>(null);
  const [walking,setWalking] = useState(false);
  const [muted,setMuted] = useState(true);
  const [volume,setVolume] = useState(0.35);
  const [churchTab,setChurchTab] = useState<'heal'|'review'>('heal');
  const [reviewId,setReviewId] = useState<string | null>(null);
  const [epilogueStep,setEpilogueStep] = useState(0);
  const [toast,setToast] = useState('');
  const stateRef = useRef(save); const phaseRef = useRef(phase); const dialogueRef = useRef(dialogue);
  const enemyPositionsRef = useRef(enemyPositions);
  const npcTalkCounts = useRef<Record<string,number>>({});
  const pathTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  useEffect(() => { stateRef.current = save; if (hasSave) localStorage.setItem(STORAGE,JSON.stringify(save)); },[save,hasSave]);
  useEffect(() => { phaseRef.current = phase; },[phase]);
  useEffect(() => { dialogueRef.current = dialogue; },[dialogue]);
  useEffect(() => { enemyPositionsRef.current = enemyPositions; },[enemyPositions]);
  useEffect(() => {
    if (phase !== 'encounter') return;
    const timer = setTimeout(() => setPhase('battle'), 1500);
    return () => clearTimeout(timer);
  },[phase]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''),3500); return () => clearTimeout(t); } },[toast]);
  const update = useCallback((fn: (s: Save) => Save) => { const next = fn(stateRef.current); stateRef.current = next; setSave(next); },[]);
  const stopPath = useCallback(() => { if (pathTimer.current) { clearInterval(pathTimer.current); pathTimer.current = null; } },[]);
  const beep = useCallback((freq=440,duration=0.1,type: OscillatorType='square') => {
    if (muted) return;
    try { const ctx = audioRef.current ?? new AudioContext(); audioRef.current = ctx; const osc=ctx.createOscillator(), gain=ctx.createGain(); osc.type=type; osc.frequency.value=freq; gain.gain.setValueAtTime(volume*0.12,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+duration); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+duration); } catch { /* audio is optional */ }
  },[muted,volume]);
  const toggleSound = () => { if (muted) { try { const ctx=audioRef.current??new AudioContext(); audioRef.current=ctx; void ctx.resume(); } catch { /* audio is optional */ } } setMuted(!muted); };
  useEffect(() => {
    if (muted || phase === 'title' || phase === 'prologue') return;
    const melodies: Record<string,number[]> = {town:[392,494,587,494,440,392,330,392],field:[294,392,440,392,330,392,494,440],dungeon:[220,261,220,196,220,294,261,196],battle:[220,330,294,392,220,330,440,392]};
    const notes=melodies[phase==='battle'?'battle':save.area]; let n=0;
    const id=setInterval(() => { beep(notes[n++%notes.length],0.19,'triangle'); },380);
    return () => clearInterval(id);
  },[muted,phase,save.area,beep]);
  const startDialogue = useCallback((speaker: string,face: string,lines: string[],choices?: Dialogue['choices'],onEnd?: () => void) => { stopPath(); setDialogue({speaker,face,lines,index:0,choices,onEnd}); beep(600,0.06); },[beep,stopPath]);
  const talkToNpc = useCallback((npc: Npc) => {
    const count=npcTalkCounts.current[npc.id] ?? 0;
    npcTalkCounts.current[npc.id]=count+1;
    const conversations=[npc.lines,...(npc.alternateLines ?? [])];
    startDialogue(npc.name,npc.face,conversations[count%conversations.length].map(line=>line.replaceAll('{name}',stateRef.current.name)),npcChoices[npc.id]);
  },[startDialogue]);
  const advanceDialogue = useCallback(() => { setDialogue(prev => { if (!prev) return null; if (prev.index < prev.lines.length-1) { beep(640,0.04); return {...prev,index:prev.index+1}; } if (prev.choices?.length) return prev; queueMicrotask(() => prev.onEnd?.()); return null; }); },[beep]);
  const startBattle = useCallback((enemy: Enemy, fromReview=false, reviewQuestion?: Question) => {
    stopPath(); const s=stateRef.current; const q=reviewQuestion ?? chooseQuestion(s,enemy.boss?'choice':enemy.cli?'cli':undefined,enemy.boss?'frontend':undefined);
    if (enemy.boss && s.level<2) { startDialogue('知識の扉','📜',['石の扉に文字が浮かぶ。「知識の断片を集め、第二の階へ至った者のみ、この門を試せる」','平原や遺跡の敵と戦い、経験を積んでから戻ろう。']); return; }
    const hp=enemy.boss?5:enemy.id==='after-gate'||fromReview?1:3;
    setBattle({enemy,hp,maxHp:hp,question:q,answered:false,correct:false,eliminated:null,rounds:0,fromReview});
    setBattleInput(''); setBattleNote(''); phaseRef.current='encounter'; setPhase('encounter'); beep(180,0.3);
  },[stopPath,beep,startDialogue]);
  useEffect(() => {
    if (phase !== 'world' || dialogue || showSettings || !maps[save.area].enemies.length) return;
    const timer = setInterval(() => {
      if (pathTimer.current || phaseRef.current !== 'world' || dialogueRef.current) return;
      const current = enemyPositionsRef.current;
      const next = moveEnemies(save.area,current,stateRef.current.defeated,stateRef.current.pos);
      if (next !== current) { enemyPositionsRef.current = next; setEnemyPositions(next); }
    },1150);
    return () => clearInterval(timer);
  },[phase,save.area,save.defeated,dialogue,showSettings]);
  const enterChurch = useCallback(() => { stopPath(); setChurchTab('heal'); setReviewId(null); setPhase('church'); beep(660,0.16,'sine'); },[stopPath,beep]);
  const transition = useCallback((from: Area,to: Area) => {
    stopPath(); let pos: Point = maps[to].entry;
    if (from==='dungeon' && to==='field') pos={x:32,y:6};
    if (to==='town' && from in houses) pos=houses[from as HouseArea].outside;
    update(s => ({...s,area:to,pos})); beep(520,0.16);
  },[update,stopPath,beep]);
  const step = useCallback((dx: number,dy: number): boolean => {
    const s=stateRef.current;
    if (phaseRef.current!=='world' || dialogueRef.current || showSettings) return false;
    const target={x:s.pos.x+dx,y:s.pos.y+dy}; if (!walkable(s.area,target)) { beep(130,0.05); return false; }
    const map=maps[s.area]; const npc=map.npcs.find(n=>same(n,target));
    if (npc) { talkToNpc(npc); return false; }
    const enemy=enemyAt(s.area,target,enemyPositionsRef.current,s.defeated);
    if (enemy) { startBattle(enemy); return false; }
    update(prev=>({...prev,pos:target,steps:prev.steps+1})); beep(220,0.025,'triangle');
    setWalking(true);
    if (walkTimer.current) clearTimeout(walkTimer.current);
    walkTimer.current=setTimeout(()=>setWalking(false),190);
    const tile=map.tiles[target.y][target.x];
    if (s.area==='town' && tile==='f') { enterChurch(); return false; }
    if (s.area==='town' && tile==='D') { const house=houseAt(target); if(house) { transition('town',house); return false; } }
    if (s.area in houses && tile==='e') { transition(s.area,'town'); return false; }
    if (s.area==='town' && target.x===14 && target.y===23) { transition('town','field'); return false; }
    if (s.area==='field' && target.x===18 && target.y===21) { transition('field','town'); return false; }
    if (s.area==='field' && tile==='d') { transition('field','dungeon'); return false; }
    if (s.area==='dungeon' && target.x===10 && target.y===11) { transition('dungeon','field'); return false; }
    return true;
  },[showSettings,talkToNpc,startBattle,update,beep,enterChurch,transition]);
  useEffect(() => { const onKey=(e: KeyboardEvent) => {
    if (showSettings || ['INPUT','TEXTAREA','SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
    if (dialogueRef.current) { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); advanceDialogue(); } return; }
    if (phaseRef.current!=='world') return;
    if (e.key==='Escape') { e.preventDefault(); stopPath(); setWorldMenu(menu=>menu?null:'command'); return; }
    if (worldMenu) return;
    const dirs: Record<string,[number,number]>={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
    if (dirs[e.key]) { e.preventDefault(); stopPath(); step(...dirs[e.key]); }
  }; window.addEventListener('keydown',onKey); return ()=>window.removeEventListener('keydown',onKey); },[step,advanceDialogue,showSettings,stopPath,worldMenu]);
  useEffect(() => () => { stopPath(); if(walkTimer.current) clearTimeout(walkTimer.current); },[stopPath]);
  const clickTile = (target: Point) => {
    if (phase!=='world' || dialogue || showSettings || worldMenu) return;
    stopPath(); const s=stateRef.current; const map=maps[s.area]; const npc=map.npcs.find(n=>same(n,target)); const enemy=enemyAt(s.area,target,enemyPositionsRef.current,s.defeated);
    let destination=target;
    if (npc || enemy) { const options=neighbors(target).filter(p=>walkable(s.area,p)); const paths=options.map(p=>({p,route:pathfind(s.area,s.pos,p,s.defeated,enemyPositionsRef.current)})).filter(v=>v.route.length||same(v.p,s.pos)); paths.sort((a,b)=>a.route.length-b.route.length); destination=paths[0]?.p??target; }
    const route=pathfind(s.area,s.pos,destination,s.defeated,enemyPositionsRef.current); if (!route.length && !same(s.pos,destination)) return;
    let i=0; pathTimer.current=setInterval(() => { if (i<route.length) { const p=route[i++], current=stateRef.current.pos; if (!step(p.x-current.x,p.y-current.y)) stopPath(); } else { stopPath(); if (npc) talkToNpc(npc); else if (enemy) startBattle(enemy); } },105);
  };
  const answer = (value: string | number) => {
    if (!battle || battle.answered) return;
    if (battle.enemy.id==='after-gate' && battle.eliminated===null) { setBattleNote('覚えたばかりの「見極め」を使ってみよう。'); return; }
    const q=battle.question;
    const correct=q.kind==='choice' ? value===q.answer : q.accepted!.some(a=>normalize(a)===normalize(String(value)));
    const dealt=correct?rollDamage(1,2):0;
    const damage=correct||battle.fromReview?0:rollDamage(battle.enemy.boss?4:2,battle.enemy.boss?7:5);
    const newHp=Math.max(0,stateRef.current.hp-damage);
    update(s=>({...s,hp:newHp,total:s.total+1,correct:s.correct+(correct?1:0),answered:[...s.answered,q.id],wrong:correct?s.wrong.filter(id=>id!==q.id):s.wrong.includes(q.id)?s.wrong:[...s.wrong,q.id]}));
    setBattle({...battle,answered:true,correct,hp:Math.max(0,battle.hp-dealt),rounds:battle.rounds+1});
    setBattleNote(correct?`正解！ ${battle.enemy.name}に${dealt}ダメージ！`:battle.fromReview?'惜しい！ 解説を読んで、もう一度挑戦しよう。':`惜しい！ ${battle.enemy.name}の反撃でHPが${damage}減った。`);
    beep(correct?800:150,correct?0.18:0.28);
  };
  const battleNext = () => {
    if (!battle || !battle.answered) return;
    if (stateRef.current.hp<=0) { update(s=>({...s,area:'town',pos:{x:13,y:16},hp:maxHp(s.level),mp:maxMp(s.level)})); setBattle(null); setPhase('church'); setChurchTab('heal'); setToast('司祭セラに助けられ、教会で目を覚ました。'); return; }
    if (battle.hp<=0) {
      if (battle.fromReview) { setBattle(null); setPhase('church'); setChurchTab('review'); setToast('復習完了！'); return; }
      if (battle.enemy.id==='after-gate') { update(s=>({...s,completed:true})); setBattle(null); setPhase('clear'); beep(1080,0.5,'sine'); return; }
      const gained=battle.enemy.boss?12:4;
      update(s=>{ const xp=s.xp+gained, level=1+Math.floor(xp/12), leveled=level>s.level; return {...s,xp,level,hp:leveled?maxHp(level):s.hp,mp:leveled?maxMp(level):s.mp,defeated:[...s.defeated,battle.enemy.id],bossDefeated:s.bossDefeated||!!battle.enemy.boss}; });
      setBattle(null);
      if (battle.enemy.boss) { setPhase('epilogue'); setEpilogueStep(0); } else { setPhase('world'); setToast(`${battle.enemy.name}を倒した！ 経験値 +${gained}`); }
      beep(950,0.26);
      return;
    }
    if (battle.fromReview) { setBattle({...battle,answered:false,correct:false,eliminated:null}); setBattleInput(''); setBattleNote(''); return; }
    const nextKind=battle.enemy.boss ? (battle.rounds===1?'cli':'choice') : battle.enemy.cli?'cli':'choice';
    const nextTopic=battle.enemy.boss ? battle.rounds===1?'laravel':battle.rounds===2?'connection':battle.rounds===3?'laravel':'frontend' : undefined;
    const q=chooseQuestion(stateRef.current,nextKind,nextTopic);
    setBattle({...battle,question:q,answered:false,correct:false,eliminated:null}); setBattleInput(''); setBattleNote('');
  };
  const castMagic = () => {
    if (!battle || battle.answered || battle.question.kind!=='choice' || battle.eliminated!==null || !save.bossDefeated || save.mp<1) return;
    const index=battle.question.options!.findIndex((_,i)=>i!==battle.question.answer);
    update(s=>({...s,mp:s.mp-1,magicUsed:true})); setBattle({...battle,eliminated:index}); setBattleNote('魔法「見極め」！ 誤った選択肢が一つ消えた。'); beep(1040,0.4,'sine');
  };
  const startNew = () => { const previous=stateRef.current; const s={...initialSave(),name:previous.name,track:previous.track,difficulty:previous.difficulty,inertia:previous.inertia}; const positions=spawnEnemies(); enemyPositionsRef.current=positions; setEnemyPositions(positions); npcTalkCounts.current={}; stateRef.current=s; setSave(s); setHasSave(true); setIntroIndex(0); setPhase('prologue'); beep(600,0.2); };
  const finishPrologue = () => { update(s=>({...s,area:'home',pos:maps.home.entry})); setPhase('world'); startDialogue(stateRef.current.name,'🗡️',['十年ぶりに、あの夢を見た。父さんと母さんの声が、まだ耳に残っている。','旅の支度はできた。棚の手紙を見てから、玄関を出よう。']); };
  const startReview = (q: Question) => { const enemy: Enemy={id:'review',name:'記憶の影',x:0,y:0,icon:'♧'}; startBattle(enemy,true,q); };
  const wrongQuestions=save.wrong.map(id=>questions.find(q=>q.id===id)).filter((q):q is Question=>!!q);
  const intro=prologue[introIndex];
  return <div className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">✧</span><div><strong>コードクロニクル</strong><small>コードの扉を開く者達</small></div></div><div className="top-actions"><span className="top-location">{phase==='world'?areaLabel[save.area]:phase==='battle'?'戦闘中':phase==='church'?'教会':phase==='title'?'冒険の始まり':'物語'}</span><button onClick={()=>setShowSettings(true)}>⚙ 学習設定</button><button aria-label={muted?'音をオンにする':'音をオフにする'} onClick={toggleSound}>{muted?'♪ 音オフ':'♫ 音オン'}</button></div></header>
    {phase==='title' && <main className="title-screen"><div className="stars"/><div className="title-art"><div className="moon"/><div className="castle"><i/><i/><i/></div><div className="title-hero"><WorldCharacter name="hero"/></div></div><p className="eyebrow">THE LOST ART OF CODING</p><h1>コードクロニクル</h1><h2>― コードの扉を開く者達 ―</h2><p className="title-copy">知識が失われた世界で、もう一度、魔法を取り戻す。</p><div className="title-menu"><button className="primary" onClick={startNew}>新しい冒険を始める <span>▶</span></button>{hasSave && <button onClick={()=>{setPhase(save.completed?'clear':save.bossDefeated?'epilogue':'world'); beep(640,0.1);}}>続きから始める <span>▶</span></button>}</div><p className="title-foot">React / Vue × Laravel × TypeScript</p></main>}
    {phase==='prologue' && <main className="prologue-screen">
      <div className="prologue-layout">
        <div className="prologue-art" key={introIndex} role="img" aria-label={intro.title} style={{backgroundImage:`url(${import.meta.env.BASE_URL}prologue/${introIndex<4?'ancient-and-fall':'family-and-dawn'}.png)`,backgroundPosition:`${introIndex%2?100:0}% ${Math.floor((introIndex%4)/2)?100:0}%`}}>
          <span>THE LOST ART OF CODING</span>
        </div>
        <div className="prologue-panel">
          <div className="prologue-progress"><span>序章　{introIndex+1} / {prologue.length}</span><span>{'◆'.repeat(introIndex+1)}{'◇'.repeat(prologue.length-introIndex-1)}</span></div>
          <h2>{intro.title}</h2>
          <div className="prologue-speaker"><CharacterPortrait face={intro.face}/><strong>{intro.speaker}</strong></div>
          <p>{intro.text}</p>
          <div className="prologue-actions"><button className="primary" onClick={()=>introIndex<prologue.length-1?setIntroIndex(introIndex+1):finishPrologue()}>{introIndex<prologue.length-1?'次の場面へ':'自宅で目覚める'}　▶</button><button className="text-button" onClick={finishPrologue}>序章をスキップ</button></div>
        </div>
      </div>
    </main>}
    {phase==='world' && <WorldScene save={save} enemyPositions={enemyPositions} menu={worldMenu} onMenu={menu=>{stopPath();setWorldMenu(menu);}} onTile={clickTile} onChurch={enterChurch} onSettings={()=>setShowSettings(true)} onSound={toggleSound} muted={muted} walking={walking}/>}
    {phase==='encounter' && battle && <main className={`encounter-screen ${battle.enemy.boss?'boss-encounter':''}`} role="status" aria-live="assertive"><div className="encounter-flash"/><div className="encounter-rays"/><div className="encounter-content"><span className="encounter-kicker">ENCOUNTER!</span><div className="encounter-sprite"><PixelSprite name={enemySprite(battle.enemy.id)}/></div><h2>{battle.enemy.name}が現れた！</h2><p>知識を武器に立ち向かえ</p><button onClick={()=>setPhase('battle')}>戦闘へ ›</button></div></main>}
    {phase==='battle' && battle && <main className="battle-layout"><section className="combat-panel"><div className="panel-heading"><div><span className="eyebrow">ENCOUNTER</span><h2>{battle.fromReview?'復習の戦い':battle.enemy.boss?'知識の扉を守る者':'敵が現れた！'}</h2></div><span className="map-badge danger">{battle.enemy.boss?'BOSS BATTLE':'BATTLE'}</span></div><div className="enemy-stage"><div className="battle-sparks">✦　·　✧　·　✦</div><div className={`enemy-sprite ${battle.enemy.boss?'boss-sprite':''}`}><PixelSprite name={enemySprite(battle.enemy.id)}/></div><h3>{battle.enemy.name}</h3><div className="enemy-hp"><i style={{width:`${battle.hp/battle.maxHp*100}%`}}/></div><span>{battle.hp} / {battle.maxHp}</span></div><div className="battle-player"><span>♟ {save.name}　LV {save.level}</span><div><span>HP {save.hp}/{maxHp(save.level)}</span><span>MP {save.mp}/{maxMp(save.level)}</span></div></div><div className="question-card"><div className="question-kicker"><span>{battle.question.kind==='cli'?'⌘ CLI CHALLENGE':'✦ FOUR CHOICES'}</span><span>{difficultyLabel[save.difficulty]} · {battle.question.topic==='frontend'?save.track==='react'?'React':'Vue':battle.question.topic==='laravel'?'Laravel':save.inertia?'Inertia':'API連携'}</span></div><h3>{battle.question.prompt}</h3>{battle.question.code&&<pre>{battle.question.code}</pre>}{battle.question.kind==='choice'?<div className="options">{battle.question.options!.map((option,i)=><button key={i} disabled={battle.answered||battle.eliminated===i} className={`${battle.answered&&i===battle.question.answer?'right':''} ${battle.answered&&i!==battle.question.answer?'faded':''} ${battle.eliminated===i?'eliminated':''}`} onClick={()=>answer(i)}><span>{String.fromCharCode(65+i)}</span>{battle.eliminated===i?'魔法で除外':option}</button>)}</div>:<form className="cli-form" onSubmit={e=>{e.preventDefault();answer(battleInput);}}><label htmlFor="cli-answer">ゲーム内CLI</label><div><span>❯</span><input id="cli-answer" autoFocus spellCheck={false} value={battleInput} onChange={e=>setBattleInput(e.target.value)} disabled={battle.answered} placeholder="コマンドを入力"/><button disabled={battle.answered||!battleInput.trim()}>実行 ↵</button></div></form>}{!battle.answered&&save.bossDefeated&&battle.question.kind==='choice'&&<button className="magic-button" disabled={save.mp<1||battle.eliminated!==null} onClick={castMagic}>✦ 見極めの魔法を使う <small>MP 1</small></button>}{battleNote&&<div className={`battle-note ${battle.correct?'success':'fail'}`}>{battleNote}</div>}{battle.answered&&<button className="primary next-turn" onClick={battleNext}>{battle.hp<=0?'戦闘を終える':save.hp<=0?'教会へ':'次の問題へ'}　▶</button>}</div></section><aside className="explain-panel"><div className="explain-header"><span className="eyebrow">GRIMOIRE</span><h2>知識の書</h2><p>問いを解くたび、失われた言葉が戻ってくる。</p></div>{battle.answered?<div className="explain-content"><span className={battle.correct?'answer-tag good':'answer-tag bad'}>{battle.correct?'正解':'復習ポイント'}</span><h3>答え：{battle.question.reveal}</h3><p>{battle.question.explanation}</p><div className="tip-box">間違えた問題は町の教会で振り返れます。</div></div>:<div className="explain-placeholder"><div>✧</div><p>回答するとここに解説が表示されます。</p></div>}<div className="battle-stats"><span>正解 {save.correct}</span><span>回答 {save.total}</span><span>復習 {save.wrong.length}</span></div></aside></main>}
    {phase==='church' && <main className="church-screen"><div className="church-visual"><span>✝</span><h2>黎明の教会</h2><p>「間違いは、道を照らす灯火です」</p></div><div className="church-card"><div className="tabs"><button className={churchTab==='heal'?'active':''} onClick={()=>setChurchTab('heal')}>✦ 回復</button><button className={churchTab==='review'?'active':''} onClick={()=>setChurchTab('review')}>📖 復習 <span>{wrongQuestions.length}</span></button></div>{churchTab==='heal'?<div className="church-content"><div className="priest-portrait"><CharacterPortrait face="👩🏼" standing/></div><h3>司祭セラ</h3><p>「知識の扉は、何度でも挑む者に開かれます。心と体を休めていってください」</p><div className="heal-stats"><span>HP {save.hp} / {maxHp(save.level)}</span><span>MP {save.mp} / {maxMp(save.level)}</span></div><button className="primary" onClick={()=>{update(s=>({...s,hp:maxHp(s.level),mp:maxMp(s.level)}));setToast('HPとMPが全回復した。');beep(900,0.4,'sine');}}>HP・MPを回復する ✦</button></div>:<div className="review-content"><h3>もう一度、知識の扉へ</h3><p>間違えた問題の解説を読み、再挑戦できます。</p>{wrongQuestions.length===0?<div className="empty-review">復習する問題はありません。冒険へ戻りましょう。</div>:<div className="review-list">{wrongQuestions.map(q=><div className="review-item" key={q.id}><button onClick={()=>setReviewId(reviewId===q.id?null:q.id)}><span>{q.kind==='cli'?'⌘':'✦'} {q.prompt}</span><b>{reviewId===q.id?'−':'＋'}</b></button>{reviewId===q.id&&<div><strong>答え：{q.reveal}</strong><p>{q.explanation}</p><button className="secondary" onClick={()=>startReview(q)}>再挑戦する　▶</button></div>}</div>)}</div>}</div>}<button className="back-link" onClick={()=>{setPhase('world');update(s=>({...s,area:'town',pos:{x:13,y:16}}));}}>← 町へ戻る</button></div></main>}
    {phase==='epilogue' && <main className="epilogue-screen"><div className="gate-art">◈</div><div className="story-card"><span className="eyebrow">THE FIRST GATE IS OPEN</span><h2>{epilogueStep===0?'知識の扉が開いた':epilogueStep===1?'魔法「見極め」を獲得！':'新たな知識を試そう'}</h2><p>{epilogueStep===0?'ゲートガーディアンは光の粒となって消えた。重い扉の向こうから、忘れられた魔法の気配が流れ込む。':epilogueStep===1?'魔法を使うと、4択の誤った答えを一つ消せる。MPを1消費し、教会で回復できる。':'扉の奥に残った記憶の影が問いを投げかけた。覚えた魔法を使って答えよう。'}</p><button className="primary" onClick={()=>{if(epilogueStep<2)setEpilogueStep(epilogueStep+1);else startBattle({id:'after-gate',name:'記憶の影',x:0,y:0,icon:'✧'} ,false,chooseQuestion(stateRef.current,'choice'));}}>{epilogueStep<2?'次へ':'魔法を試す'}　▶</button></div></main>}
    {phase==='clear' && <main className="clear-screen"><div className="clear-symbol">✧</div><span className="eyebrow">CHAPTER 1 COMPLETE</span><h1>最初の扉は、開かれた。</h1><p>失われた知識の一片を取り戻した。魔王との戦いは、まだ始まったばかり。</p><div className="result-grid"><div><strong>{save.level}</strong><span>到達レベル</span></div><div><strong>{save.correct}/{save.total}</strong><span>正解数</span></div><div><strong>{save.defeated.length}</strong><span>倒した敵</span></div><div><strong>{save.magicUsed?'✓':'—'}</strong><span>魔法「見極め」</span></div></div><div className="clear-actions"><button className="primary" onClick={()=>{setPhase('world');update(s=>({...s,area:'town',pos:maps.town.entry}));}}>町へ戻って冒険を続ける</button><button onClick={()=>setPhase('title')}>タイトルへ</button></div></main>}
    {dialogue&&phase==='world'&&<div className="dialogue-overlay"><div className="dialogue-box" onClick={advanceDialogue}><div className="dialogue-portrait"><CharacterPortrait face={dialogue.face}/></div><div className="dialogue-text"><strong>{dialogue.speaker}</strong><p>{dialogue.lines[dialogue.index]}</p>{dialogue.index===dialogue.lines.length-1&&dialogue.choices?.length?<div className="dialogue-choices">{dialogue.choices.map(choice=><button key={choice.label} onClick={e=>{e.stopPropagation();setDialogue({...dialogue,lines:[choice.response],index:0,choices:undefined});beep(720,0.08);}}>{choice.label}　▶</button>)}</div>:<span>クリック / Enter で次へ　▼</span>}</div></div></div>}
    {showSettings&&<div className="modal-backdrop"><div className="settings-modal"><div className="modal-heading"><div><span className="eyebrow">ADVENTURE SETTINGS</span><h2>学習設定</h2></div><button onClick={()=>setShowSettings(false)} aria-label="閉じる">×</button></div><label>主人公の名前<input maxLength={12} value={save.name} onChange={e=>update(s=>({...s,name:e.target.value||'旅人'}))}/></label><div className="setting-group"><span>学ぶフロントエンド</span><div className="segmented"><button className={save.track==='react'?'selected':''} onClick={()=>update(s=>({...s,track:'react'}))}>React + TS</button><button className={save.track==='vue'?'selected':''} onClick={()=>update(s=>({...s,track:'vue'}))}>Vue + TS</button></div></div><div className="setting-group"><span>難易度</span><div className="segmented">{(['beginner','intermediate','advanced'] as Difficulty[]).map(d=><button key={d} className={save.difficulty===d?'selected':''} onClick={()=>update(s=>({...s,difficulty:d}))}>{difficultyLabel[d]}</button>)}</div><small>初級：概念　中級：コード読解　上級：設計判断</small></div><label className="toggle-row"><span><strong>Inertia環境</strong><small>オン：Inertia連携 / オフ：Laravel API連携</small></span><input type="checkbox" checked={save.inertia} onChange={e=>update(s=>({...s,inertia:e.target.checked}))}/></label><label className="volume-row">音量 <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e=>setVolume(Number(e.target.value))}/></label><button className="primary close-settings" onClick={()=>setShowSettings(false)}>冒険へ戻る</button></div></div>}
    {toast&&<div className="toast">✦ {toast}</div>}
  </div>;
}
