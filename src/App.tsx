import { ScholarQuest } from './ScholarQuest';
import { DialogueHistoryPanel } from './DialogueHistoryPanel';
import { appendDialogueLog, type DialogueLogEntry } from './dialogueLog';
import { wrongChoiceReason } from './wrongChoiceReasons';
import { relatedBook } from './bookQuestions';
import { recordLearning, type LearningRecords } from './learningRecords';
import { LearningRecordPanel } from './LearningRecordPanel';
import { validateSave } from './saveValidation';
import { LearningSession, type LearningSessionState } from './LearningSession';
import { SaveTransfer } from './SaveTransfer';
import { SaveStatus } from './SaveStatus';
import { nearbyInteraction } from './world/interactions';
import { ResumeSummary } from './ResumeSummary';
import { LearningSetupHelp } from './LearningSetupHelp';
import './learningSetupHelp.css';
import { loadAudioPreferences, saveAudioPreferences } from './audioPreferences';
import { claimChest } from './chests';
import { useCallback, useEffect, useRef, useState } from 'react';
import { areaLabel, difficultyLabel, houses, questions, type Area, type Difficulty, type Enemy, type HouseArea, type Npc, type Point, type Question, type Track } from './content';
import { worldMaps as maps, canWalkOnMap, eventAt, dungeonFieldReturn, restoreMapPosition } from './world/maps';
import { CharacterPortrait } from './CharacterPortrait';
import { WorldCharacter } from './WorldCharacter';
import { WorldScene } from './WorldScene';
import { canLeaveTown, storyNpcs, wakingScene, breakfastScene, mayorScene, knightScene, rescueScene, type StoryStage, type StoryLine } from './story';
import { ControlsGuide } from './ControlsGuide';
import { DialogueChoices } from './DialogueChoices';
import { moveButtonFocus } from './keyboardNavigation';
import { activateButtonShortcut } from './keyboardShortcuts';
import { BattleStage } from './BattleStage';
import { bossStages, bossGuardHp, bossQuestion, bossQuestionById, bossCommandResult, bossStrike, bossGuardBroken } from './bossBattle';
import { BattleEncounter } from './BattleEncounter';
import { QuestionCode } from './QuestionCode';
import { LibraryPanel } from './LibraryPanel';
import { libraryShelves, type LibraryShelf } from './library';
import { ReviewRoom } from './ReviewRoom';
import { selectQuestion, isChoiceQuestion, isFillQuestion, inputIsCorrect } from './questionSelection';
import { chooseHeroTechnique, type HeroTechnique } from './heroTechniques';
import { enemyAt, moveEnemies, spawnEnemies, type EnemyPositions } from './enemyMovement';
import { items, type Equipment, type Inventory, type ItemId, type ShopType } from './items';
import { DresserPanel, InventoryPanel, ShopPanel } from './AdventurePanels';

type Phase = 'title' | 'prologue' | 'setup' | 'world' | 'encounter' | 'battle' | 'church' | 'review-room' | 'epilogue' | 'clear';
type Save = { scholarQuestAccepted:boolean;scholarQuestReady:boolean;scholarQuestCompleted:boolean; dialogueLog:DialogueLogEntry[]; learningRecords:LearningRecords; version:number; story:StoryStage; name: string; track: Track; difficulty: Difficulty; inertia: boolean; area: Area; pos: Point; hp: number; mp: number; xp: number; level: number; gold:number; inventory:Inventory; equipment:Equipment; dresserOpened:boolean; openedChests:string[]; readBooks:string[]; bookmarks:Record<string,string>; lastSavedAt?:number; defeated: string[]; wrong: string[]; seen: string[]; answered: string[]; bossDefeated: boolean; magicUsed: boolean; completed: boolean; steps: number; correct: number; total: number };
type Dialogue = { speaker: string; face: string; lines: (string|StoryLine)[]; index: number; choices?: {label:string; response:string;onChoose?:()=>void}[]; onEnd?: () => void };
type Battle = { submitted?:string|number; enemy: Enemy; hp: number; maxHp: number; question: Question; answered: boolean; correct: boolean; eliminated: number | null; rounds: number; fromReview?: boolean; banterSeed: number; heroTechnique: HeroTechnique | null; bossStage: number; hints: number };

const STORAGE = 'code-chronicle-save-v1';
const BACKUP_STORAGE='code-chronicle-save-backup-v1';
const maxHp = (level: number) => 20 + (level - 1) * 5;
const maxMp = (level: number) => 3 + Math.floor((level - 1) / 2);
const rollDamage = (minimum: number, maximum: number) => minimum + Math.floor(Math.random() * (maximum - minimum + 1));
const initialSave = (): Save => ({ scholarQuestAccepted:false,scholarQuestReady:false,scholarQuestCompleted:false, dialogueLog:[], learningRecords:{}, version:1, story:'breakfast', name: '旅人', track: 'react', difficulty: 'beginner', inertia: true, area: 'home', pos: maps.home.entry, hp: 20, mp: 3, xp: 0, level: 1, gold:100, inventory:{woodSword:1,travelerClothes:1,herb:1}, equipment:{weapon:'woodSword',armor:'travelerClothes'}, dresserOpened:false, openedChests:[], readBooks:[], bookmarks:{}, defeated: [], wrong: [], seen: [], answered: [], bossDefeated: false, magicUsed: false, completed: false, steps: 0, correct: 0, total: 0 });
const validateIncomingSave=(value:unknown)=>{
  const result=validateSave(value,initialSave());
  if(result.save){
    const restored=restoreMapPosition(maps[result.save.area],result.save.pos);
    if(!same(result.save.pos,restored))result.notice+=' 現在地を通れる場所に戻しました。';
    result.save.pos=restored;
  }
  return result;
};
const loadSave = (storageKey=STORAGE):{save:Save|null;notice:string}=>{
  try {
    const raw=localStorage.getItem(storageKey);if(!raw)return {save:null,notice:''};
    return validateIncomingSave(JSON.parse(raw));
  }catch{return {save:null,notice:'保存データを読み込めませんでした。元のデータは変更していません。'};}
};
const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
const walkable = (area: Area, p: Point) => canWalkOnMap(maps[area],p);
const neighbors = (p: Point): Point[] => [{x:p.x,y:p.y-1},{x:p.x+1,y:p.y},{x:p.x,y:p.y+1},{x:p.x-1,y:p.y}];
function pathfind(area: Area, start: Point, goal: Point, defeated: string[], positions: EnemyPositions, story:StoryStage='legacy'): Point[] {
  const queue: Point[] = [start], seen = new Set([`${start.x},${start.y}`]), parents = new Map<string,string>();
  for(let head=0;head<queue.length;head++) {
    const p = queue[head];
    if (same(p,goal)) { const path: Point[] = []; let key = `${p.x},${p.y}`; while (key !== `${start.x},${start.y}`) { const [x,y] = key.split(',').map(Number); path.unshift({x,y}); key = parents.get(key)!; } return path; }
    for (const next of neighbors(p)) { const key = `${next.x},${next.y}`; const blocked=storyNpcs(maps[area].npcs,story).some(n=>same(n,next)) || !!enemyAt(area,next,positions,defeated); if (!seen.has(key) && walkable(area,next) && !blocked && (same(next,goal) || eventAt(maps[area],next,'enter')?.action.kind!=='transition')) { seen.add(key); parents.set(key,`${p.x},${p.y}`); queue.push(next); } }
  }
  return [];
}


const prologue = [
  {speaker:'語り手',face:'📜',title:'知識が世界を照らした時代',text:'千年前。人々は「コード」と呼ばれる知識で、城を築き、遠くの誰かと言葉を交わした。\nAIと呼ばれた魔法は、人の知恵を広げ、日々の暮らしを支えていた。'},
  {speaker:'語り手',face:'📜',title:'奪われた言葉',text:'その光を恐れた魔王は、書物から言葉を、記憶から術を奪った。\n人々は知識を守るため、魔王をAIの力ごと深い門の向こうへ封じた。'},
  {speaker:'語り手',face:'📜',title:'封印のひび',text:'千年後、忘れられた遺跡の封印に亀裂が走る。\n目覚めた魔王は、人々の知識を再び奪い始めた。大切な言葉も記憶も、少しずつ失われていく。'},
  {speaker:'語り手',face:'📜',title:'燃える故郷',text:'青い屋根の城下町は、ある夜、炎に包まれた。\n鐘の音とともに人々が逃げ惑う。幼い主人公は、崩れた通りにひとり取り残された。'},
  {speaker:'語り手',face:'📜',title:'迫る影',text:'瓦礫の向こうから魔王の影が伸びる。足がすくみ、声も出ない。\nそのとき、聞き慣れた足音が炎の中を駆けてきた。'},
  {speaker:'父',face:'🧔',title:'父の背中',text:'「ここは俺が食い止める。お前は走れ！」\n父は剣を抜き、幼い主人公を背にかばった。「知識の扉を開け。忘れた言葉は、きっと取り戻せる」'},
  {speaker:'母',face:'👩',title:'母との約束',text:'「生きて。あなたが覚えたことは、誰にも奪わせないで」\n母は小さな手を握り、森へ続く道を示した。両親は主人公を逃がし、燃える町に残った。'},
  {speaker:'語り手',face:'📜',title:'十年後、旅立ちの朝',text:'十年が過ぎた。生き延びた人々は、新しい町を築いた。\n主人公は、両親があの夜に命を落としたのだと信じている。その思いを抱えながら、自宅で朝を迎える。今日も、育ての親が待つ旅籠へ向かうはずだった。'},
] as const;
const difficultyDetails: Record<Difficulty,{summary:string;examples:string}> = {
  beginner: {summary:'用語と基本のしくみを知る',examples:'コンポーネント、Laravelのルート、画面との連携など'},
  intermediate: {summary:'コードを読んで使い方を考える',examples:'state / ref の更新、ルートの読み方、データ取得など'},
  advanced: {summary:'実装や設計の判断をする',examples:'状態の共有、公開するデータ、認証や検証など'},
};
const difficulties: Difficulty[] = ['beginner','intermediate','advanced'];
function DifficultyPicker({value,onChange}:{value:Difficulty;onChange:(difficulty:Difficulty)=>void}) {
  return <div className="difficulty-options" role="group" aria-label="難易度を選択">
    {difficulties.map(d=><button type="button" key={d} className={`difficulty-option ${value===d?'selected':''}`} aria-pressed={value===d} onClick={()=>onChange(d)}>
      <strong>{difficultyLabel[d]}</strong><span>{difficultyDetails[d].summary}</span><small>{difficultyDetails[d].examples}</small>
    </button>)}
  </div>;
}
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
  const [loaded]=useState(()=>loadSave());
  const [save,setSave] = useState<Save>(() => loaded.save ?? initialSave());
  const [saveNotice,setSaveNotice]=useState(loaded.notice);
  const [enemyPositions,setEnemyPositions] = useState<EnemyPositions>(() => spawnEnemies(save.defeated));
  const [hasSave,setHasSave] = useState(() => !!loaded.save);
  const [backup,setBackup]=useState<Save|null>(()=>loadSave(BACKUP_STORAGE).save);
  const [phase,setPhase] = useState<Phase>('title');
  const [lastSavedAt,setLastSavedAt]=useState<number|null>(()=>typeof save.lastSavedAt==='number'&&Number.isFinite(save.lastSavedAt)&&save.lastSavedAt>0&&save.lastSavedAt<=8640000000000000?save.lastSavedAt:null);
  const [introIndex,setIntroIndex] = useState(0);
  const [setup,setSetup] = useState<{name:string;track:Track;difficulty:Difficulty;inertia:boolean}>({name:'',track:'react',difficulty:'beginner',inertia:true});
  const [dialogue,setDialogue] = useState<Dialogue | null>(null);
  const [battle,setBattle] = useState<Battle | null>(null);
  const [reviewCourse,setReviewCourse]=useState<{questions:Question[];index:number;answered:number;correct:number}|null>(null);
  const [reviewResult,setReviewResult]=useState('');
  const [battleInput,setBattleInput] = useState('');
  const [battleNote,setBattleNote] = useState('');
  const [attackAnimating,setAttackAnimating] = useState(false);
  const [showSettings,setShowSettings] = useState(false);
  const [showGuide,setShowGuide] = useState(false);
  const [worldMenu,setWorldMenu] = useState<'command'|'status'|'quest'|null>(null);
  const [inventoryOpen,setInventoryOpen] = useState(false);
  const [libraryShelf,setLibraryShelf] = useState<LibraryShelf|null>(null);
  const [dresserOpen,setDresserOpen] = useState(false);
  const [dresserFound,setDresserFound] = useState(false);
  const [readingLetter,setReadingLetter] = useState(false);
  const [shopType,setShopType] = useState<ShopType|null>(null);
  const [shopMode,setShopMode] = useState<'buy'|'sell'>('buy');
  const [learningSession,setLearningSession]=useState<LearningSessionState>({active:false,answers:[]});
  const [walking,setWalking] = useState(false);
  const [audioPreferences,setAudioPreferences] = useState(loadAudioPreferences);
  const {muted,volume}=audioPreferences;
  const [epilogueStep,setEpilogueStep] = useState(0);
  const [toast,setToast] = useState('');
  const [saveFailed,setSaveFailed]=useState(false);
  const stateRef = useRef(save); const phaseRef = useRef(phase); const dialogueRef = useRef(dialogue);
  const enemyPositionsRef = useRef(enemyPositions);
  const facingRef = useRef<Point>({x:0,y:-1});
  const [facing,setFacing]=useState<Point>({x:0,y:-1});
  const npcTalkCounts = useRef<Record<string,number>>({});
  const pathTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const audioUnlocked=useRef(false);
  useEffect(()=>saveAudioPreferences(audioPreferences),[audioPreferences]);
  useEffect(()=>{
    const unlock=()=>{
      audioUnlocked.current=true;
      if(audioRef.current?.state==='suspended')void audioRef.current.resume().catch(()=>{});
      window.removeEventListener('pointerdown',unlock,true);
      window.removeEventListener('keydown',unlock,true);
    };
    window.addEventListener('pointerdown',unlock,true);window.addEventListener('keydown',unlock,true);
    return ()=>{window.removeEventListener('pointerdown',unlock,true);window.removeEventListener('keydown',unlock,true);};
  },[]);
  const persistSave=useCallback((current:Save)=>{
    try {
      const savedAt=Date.now();localStorage.setItem(STORAGE,JSON.stringify({...current,lastSavedAt:savedAt}));
      setLastSavedAt(savedAt);setSaveFailed(false);
    } catch {setSaveFailed(true);}
  },[]);
  useEffect(() => {
    stateRef.current = save;
    if(hasSave&&phaseRef.current!=='title')persistSave(save);
  },[save,hasSave,persistSave]);
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
  useEffect(()=>{
    if(!dialogue)return;const line=dialogue.lines[dialogue.index];if(!line)return;
    const text=typeof line==='string'?line:line.text,speaker=typeof line==='string'?dialogue.speaker:line.speaker;
    update(s=>({...s,dialogueLog:appendDialogueLog(s.dialogueLog,speaker,text)}));
  },[dialogue,update]);
  const stopPath = useCallback(() => { if (pathTimer.current) { clearInterval(pathTimer.current); pathTimer.current = null; } },[]);
  const beep = useCallback((freq=440,duration=0.1,type: OscillatorType='square') => {
    if (muted || !audioUnlocked.current) return;
    try { const ctx = audioRef.current ?? new AudioContext(); audioRef.current = ctx; const osc=ctx.createOscillator(), gain=ctx.createGain(); osc.type=type; osc.frequency.value=freq; gain.gain.setValueAtTime(volume*0.12,ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+duration); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime+duration); } catch { /* audio is optional */ }
  },[muted,volume]);
  const toggleSound = () => { if (muted) { try { const ctx=audioRef.current??new AudioContext(); audioRef.current=ctx; void ctx.resume().catch(()=>{}); } catch { /* audio is optional */ } } setAudioPreferences(value=>({...value,muted:!value.muted})); };
  useEffect(() => {
    if (muted || phase === 'title' || phase === 'prologue') return;
    const melodies: Record<string,number[]> = {town:[392,494,587,494,440,392,330,392],field:[294,392,440,392,330,392,494,440],dungeon:[220,261,220,196,220,294,261,196],battle:[220,330,294,392,220,330,440,392]};
    const notes=melodies[phase==='battle'?'battle':save.area] ?? melodies.town; let n=0;
    const id=setInterval(() => { beep(notes[n++%notes.length],0.19,'triangle'); },380);
    return () => clearInterval(id);
  },[muted,phase,save.area,beep]);
  const startDialogue = useCallback((speaker: string,face: string,lines: (string|StoryLine)[],choices?: Dialogue['choices'],onEnd?: () => void) => { stopPath(); const next={speaker,face,lines,index:0,choices,onEnd}; dialogueRef.current=next; setDialogue(next); beep(600,0.06); },[beep,stopPath]);
  const playStory = useCallback((lines:StoryLine[],onEnd?:()=>void)=>{
    const name=stateRef.current.name;
    startDialogue('','',lines.map(line=>({...line,speaker:line.speaker.replaceAll('{name}',name),text:line.text.replaceAll('{name}',name)})),undefined,onEnd);
  },[startDialogue]);
  const talkToNpc = useCallback((npc: Npc) => {
    const stage=stateRef.current.story;
    if(npc.id==='assistant'){
      const s=stateRef.current;
      const request=!s.scholarQuestAccepted?{label:'案内板の修理を手伝う',response:'ありがとう！ 東棟2階「ルート」の「01 URLに応答する」を読んで既読にして、確認問題に正解してほしいの。URLと処理の対応が分かったら、ここへ報告してね。',onChoose:()=>update(v=>({...v,scholarQuestAccepted:true}))}:s.scholarQuestReady&&!s.scholarQuestCompleted?{label:'案内板の修理を報告する',response:'そう、URLと処理をつなぐのはルート！ 案内板の行き先を直せたわ。ありがとう。お礼に40Gとやくそうを受け取って。',onChoose:()=>update(v=>v.scholarQuestCompleted?v:{...v,scholarQuestCompleted:true,gold:v.gold+40,inventory:{...v.inventory,herb:(v.inventory.herb??0)+1}})}:null;
      startDialogue(npc.name,npc.face,[...npc.lines,s.scholarQuestCompleted?'案内板は今日も元気よ。手伝ってくれてありがとう。':s.scholarQuestAccepted?'依頼の続きは東棟2階の「ルート」の本で確かめられるわ。':'図書館の案内板で、URLと処理の行き先が混ざってしまったの。学びながら修理を手伝ってくれない？'],[...(request?[request]:[]),...(npcChoices[npc.id]??[])]);return;
    }
    if(npc.id==='mountainHealer') {
      startDialogue(npc.name,npc.face,[...npc.lines,'温かな灯りのそばでひと休みした。HPとMPが全回復した。'],undefined,()=>{
        update(s=>({...s,hp:maxHp(s.level),mp:maxMp(s.level)}));
        setToast('HPとMPが全回復した。');
      }); return;
    }
    if(npc.id==='innkeeper'&&stage==='breakfast') {
      playStory(breakfastScene,()=>{
        update(s=>({...s,story:'mayor',area:'town',pos:houses.guestHouse.outside}));
        setToast('ハンナは教会へ運ばれた。村長の家で話を聞こう。');
      }); return;
    }
    if(npc.id==='elder'&&stage==='breakfast') {
      startDialogue(npc.name,npc.face,['おはよう。ハンナが朝食を用意して待っておったぞ。街の東の旅籠へ行っておいで。']); return;
    }
    if(npc.id==='elder'&&stage==='mayor') {
      playStory(mayorScene,()=>{update(s=>({...s,story:'ruins'}));setToast('東の忘却の遺跡で、女将を救う知識を取り戻そう。');}); return;
    }
    if(npc.id==='elder'&&stage!=='legacy') {
      startDialogue(npc.name,npc.face,[stage==='homecoming'?'よく戻った。ハンナは教会で待っている。取り戻した見極めで、あの人を救ってくれ。':stage==='rescued'?'ハンナを救ってくれて、ありがとう。世界には、まだ知識を失った人々がいる。忘れたら、また学べばよい。お前が示してくれた。':'まずは支度を整え、平原で経験を積むのだ。LV 2になったら東の遺跡へ。暴走した守護者を正気に戻し、見極めを持ち帰ってくれ。']); return;
    }
    if(npc.id==='innkeeper'&&stage==='rescued') {
      startDialogue(npc.name,npc.face,['おかえり。今日のスープは、あんたに教わった味だよ。','忘れたって、また覚えられるんだね。……どんなに遠くへ行っても、ここに帰っておいで。']); return;
    }
    const merchant:Record<string,ShopType>={weaponMerchant:'weapon',armorMerchant:'armor',itemMerchant:'item'};
    if (merchant[npc.id]) { stopPath(); setShopMode('buy'); setShopType(merchant[npc.id]); beep(720,0.08); return; }
    const count=npcTalkCounts.current[npc.id] ?? 0;
    npcTalkCounts.current[npc.id]=count+1;
    const conversations=[npc.lines,...(npc.alternateLines ?? [])];
    startDialogue(npc.name,npc.face,conversations[count%conversations.length].map(line=>line.replaceAll('{name}',stateRef.current.name)),npcChoices[npc.id]);
  },[startDialogue,playStory,update,stopPath,beep]);
  const openDresser = useCallback(() => {
    stopPath(); const first=!stateRef.current.dresserOpened;
    if(first) { update(s=>({...s,dresserOpened:true,inventory:{...s.inventory,familyLetter:1,herb:(s.inventory.herb??0)+1}})); setToast('家族の手紙とやくそうを手に入れた！'); }
    setDresserFound(first); setReadingLetter(false); setDresserOpen(true); beep(640,0.12);
  },[stopPath,update,beep]);
  const openChest = useCallback((id:string) => {
    stopPath();
    const result=claimChest(stateRef.current,id);
    if(result.opened) update(()=>({...result.save,dialogueLog:appendDialogueLog(result.save.dialogueLog,'宝箱',result.message)}));
    setToast(result.message); beep(result.opened?880:320,0.15);
  },[stopPath,update,beep]);
  const toggleReadBook=useCallback((id:string)=>update(s=>({...s,readBooks:s.readBooks.includes(id)?s.readBooks.filter(value=>value!==id):[...s.readBooks,id]})),[update]);
  const bookmarkBook=useCallback((shelfId:string,bookId:string)=>update(s=>s.bookmarks[shelfId]===bookId?s:{...s,bookmarks:{...s.bookmarks,[shelfId]:bookId}}),[update]);
  const openBookshelf = useCallback((id:string) => {
    const shelf=libraryShelves.find(item=>item.id===id);
    if(shelf) { stopPath(); setLibraryShelf(shelf); beep(640,0.08); }
  },[stopPath,beep]);
  const advanceDialogue = useCallback(() => {
    const prev=dialogueRef.current;
    if(!prev)return;
    if(prev.index<prev.lines.length-1) {
      beep(640,0.04);const next={...prev,index:prev.index+1};dialogueRef.current=next;setDialogue(next);return;
    }
    if(prev.choices?.length)return;
    dialogueRef.current=null;setDialogue(null);prev.onEnd?.();
  },[beep]);
  useEffect(()=>{
    if(phase==='world'&&save.story==='knight'&&!dialogueRef.current) {
      playStory(knightScene,()=>{update(s=>({...s,story:'knowledge'}));setEpilogueStep(0);setPhase('epilogue');});
    }
  },[phase,save.story,playStory,update]);

  const startBattle = useCallback((enemy: Enemy, fromReview=false, reviewQuestion?: Question) => {
    stopPath(); const s=stateRef.current; const q=reviewQuestion ?? (enemy.boss ? bossQuestion(0,s.difficulty) : selectQuestion(questions,s));
    if (enemy.boss && s.level<2) { startDialogue('知識の扉','📜',['石の扉に文字が浮かぶ。「知識の断片を集め、第二の階へ至った者のみ、この門を試せる」','平原や遺跡の敵と戦い、経験を積んでから戻ろう。']); return; }
    const hp=enemy.boss?bossStages.length*bossGuardHp:enemy.id==='after-gate'||fromReview?1:3;
    setBattle({enemy,hp,maxHp:hp,question:q,answered:false,correct:false,eliminated:null,rounds:0,fromReview,banterSeed:Math.floor(Math.random()*0x100000000),heroTechnique:null,bossStage:0,hints:0});
    setBattleInput(''); setBattleNote(''); phaseRef.current='encounter'; setPhase('encounter'); beep(180,0.3);
  },[stopPath,beep,startDialogue]);
  useEffect(() => {
    if (phase !== 'world' || dialogue || showSettings || showGuide || worldMenu || inventoryOpen || dresserOpen || libraryShelf || shopType || !maps[save.area].enemies.length) return;
    const timer = setInterval(() => {
      if (pathTimer.current || phaseRef.current !== 'world' || dialogueRef.current) return;
      const current = enemyPositionsRef.current;
      const next = moveEnemies(save.area,current,stateRef.current.defeated,stateRef.current.pos);
      if (next !== current) { enemyPositionsRef.current = next; setEnemyPositions(next); }
    },1150);
    return () => clearInterval(timer);
  },[phase,save.area,save.defeated,dialogue,showSettings,showGuide,worldMenu,inventoryOpen,dresserOpen,libraryShelf,shopType]);
  const visitHanna = useCallback(()=>{
    stopPath();setPhase('world');update(s=>({...s,area:'town',pos:{x:13,y:16}}));
    if(stateRef.current.story==='homecoming') {
      playStory(rescueScene,()=>{update(s=>({...s,story:'rescued',completed:true}));setPhase('clear');beep(1080,0.5,'sine');});
    } else {
      startDialogue('司祭セラ','👩🏼',['ハンナさんはここで休んでいます。変化は抑えていますが、まだ目を覚ましていません。','あなたの声に、少しだけ手が動きました。どうか、あの方を救う知識を持ち帰ってください。']);
    }
  },[stopPath,update,playStory,startDialogue,beep]);
  const enterChurch = useCallback(() => {
    stopPath();if(stateRef.current.story==='homecoming'){visitHanna();return;}
    setPhase('church');beep(660,0.16,'sine');
  },[stopPath,visitHanna,beep]);
  const transition = useCallback((from: Area,to: Area,position?:Point) => {
    stopPath();
    if(from==='town'&&to==='field'&&!canLeaveTown(stateRef.current.story)) {
      update(s=>({...s,pos:{x:14,y:30}}));
      startDialogue(stateRef.current.name,'🗡️',[stateRef.current.story==='breakfast'?'ハンナさんが朝食を用意して待っている。先に街の東の旅籠へ行こう。':'ハンナさんを助ける方法を聞かなくちゃ。まずは街の北中央にある村長の家だ。']);return;
    }
    let pos: Point = maps[to].entry;
    if (from==='dungeon' && to==='field') pos=dungeonFieldReturn;
    if (to==='town' && from in houses) pos=houses[from as HouseArea].outside;
    if (position) pos=position;
    update(s => ({...s,area:to,pos})); beep(520,0.16);
  },[update,stopPath,startDialogue,beep]);
  const step = useCallback((dx: number,dy: number): boolean => {
    const s=stateRef.current;
    if (phaseRef.current!=='world' || dialogueRef.current || showSettings || showGuide || worldMenu || inventoryOpen || dresserOpen || libraryShelf || shopType) return false;
    facingRef.current={x:dx,y:dy};
    setFacing(value=>value.x===dx&&value.y===dy?value:{x:dx,y:dy});
    const target={x:s.pos.x+dx,y:s.pos.y+dy};
    const interaction=eventAt(maps[s.area],target,'interact')?.action;
    if(interaction?.kind==='bookshelf') { openBookshelf(interaction.shelf); return false; }
    if (interaction?.kind==='dresser') { openDresser(); return false; }
    if (interaction?.kind==='chest') { openChest(interaction.id); return false; }
    if (!walkable(s.area,target)) { beep(130,0.05); return false; }
    const map=maps[s.area]; const npc=storyNpcs(map.npcs,s.story).find(n=>same(n,target));
    if (npc) { talkToNpc(npc); return false; }
    const enemy=enemyAt(s.area,target,enemyPositionsRef.current,s.defeated);
    if (enemy) { startBattle(enemy); return false; }
    update(prev=>({...prev,pos:target,steps:prev.steps+1})); beep(220,0.025,'triangle');
    setWalking(true);
    if (walkTimer.current) clearTimeout(walkTimer.current);
    walkTimer.current=setTimeout(()=>setWalking(false),190);
    const action=eventAt(map,target,'enter')?.action;
    if (action?.kind==='church') { enterChurch(); return false; }
    if (action?.kind==='transition') { transition(s.area,action.to,action.position); return false; }
    return true;
  },[showSettings,showGuide,worldMenu,inventoryOpen,dresserOpen,libraryShelf,shopType,openDresser,openChest,openBookshelf,talkToNpc,startBattle,update,beep,enterChurch,transition]);
  const interact = useCallback(() => {
    stopPath();
    const s=stateRef.current, map=maps[s.area];
    const target=nearbyInteraction(map,s.pos,facingRef.current,s.story);
    if(target?.kind==='npc') {talkToNpc(target.npc);return;}
    if(target?.kind==='event') {
      const action=target.action;
      if(action.kind==='bookshelf') {openBookshelf(action.shelf);return;}
      if(action.kind==='dresser') {openDresser();return;}
      if(action.kind==='chest') {openChest(action.id);return;}
    }
    setToast('隣に人や調べられるものがない。近づいてEnterを押そう。');
  },[stopPath,talkToNpc,openDresser,openChest,openBookshelf]);
  const navigationScope = () => Array.from(document.querySelectorAll('.modal-backdrop')).at(-1)
    ?? document.querySelector('.dialogue-overlay')
    ?? document.querySelector('.world-menu')
    ?? document.querySelector('main');
  useEffect(() => {
    const scope=navigationScope();
    if (phase==='world' && !dialogue && !worldMenu && !showGuide && !showSettings && !inventoryOpen && !dresserOpen && !libraryShelf && !shopType) {
      document.querySelector<HTMLElement>('.world-viewport')?.focus({preventScroll:true});
      return;
    }
    if (scope?.contains(document.activeElement) && document.activeElement?.matches('input:not(:disabled),textarea,select')) return;
    const target=scope?.querySelector<HTMLElement>('.next-turn:not(:disabled), .options button:not(:disabled)')
      ?? scope?.querySelector<HTMLElement>('input:not(:disabled):not([type="checkbox"]):not([type="range"])')
      ?? scope?.querySelector<HTMLElement>('button:not(:disabled)');
    target?.focus({preventScroll:true});
  },[phase,dialogue?.index,!!dialogue,worldMenu,showGuide,showSettings,inventoryOpen,dresserOpen,libraryShelf,shopType,battle?.question.id,battle?.answered,attackAnimating]);
  useEffect(() => { const onKey=(e: KeyboardEvent) => {
    if (e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey) return;
    const target=e.target instanceof HTMLElement ? e.target : null;
    if (e.key==='Escape') {
      if (libraryShelf) { e.preventDefault(); setLibraryShelf(null); return; }
      if (showGuide) { e.preventDefault(); setShowGuide(false); return; }
      if (showSettings) { e.preventDefault(); setShowSettings(false); return; }
      if (inventoryOpen) { e.preventDefault(); setInventoryOpen(false); return; }
      if (dresserOpen) { e.preventDefault(); setDresserOpen(false); return; }
      if (shopType) { e.preventDefault(); setShopType(null); return; }
    }
    if (e.key==='F1') { e.preventDefault(); if(!e.repeat) {stopPath();setShowGuide(value=>!value);} return; }
    if (activateButtonShortcut(e,navigationScope())) return;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    const choosing=!!dialogueRef.current && dialogueRef.current.index===dialogueRef.current.lines.length-1 && !!dialogueRef.current.choices?.length;
    if (showGuide || showSettings || inventoryOpen || dresserOpen || libraryShelf || shopType || worldMenu || choosing || phaseRef.current!=='world') {
      if (e.key==='Escape' && worldMenu) { e.preventDefault(); setWorldMenu(null); return; }
      moveButtonFocus(e,navigationScope());
      // Native buttons handle Enter / Space; ignore held keys to avoid double decisions.
      if (e.repeat && (e.key==='Enter' || e.key===' ')) e.preventDefault();
      return;
    }
    if (dialogueRef.current) { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); if (!e.repeat) advanceDialogue(); } return; }
    if (e.key==='Escape') { e.preventDefault(); if (!e.repeat) { stopPath(); setWorldMenu('command'); } return; }
    if (e.key==='Enter') {
      if (target?.closest('button, a')) return;
      e.preventDefault(); if (!e.repeat) interact(); return;
    }
    const dirs: Record<string,[number,number]>={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0],w:[0,-1],s:[0,1],a:[-1,0],d:[1,0]};
    if (dirs[e.key.toLowerCase()] ?? dirs[e.key]) { e.preventDefault(); stopPath(); if(target?.closest('button')) document.querySelector<HTMLElement>('.world-viewport')?.focus({preventScroll:true}); step(...(dirs[e.key.toLowerCase()] ?? dirs[e.key])); }
  }; window.addEventListener('keydown',onKey); return ()=>window.removeEventListener('keydown',onKey); },[step,interact,advanceDialogue,showGuide,showSettings,inventoryOpen,dresserOpen,libraryShelf,shopType,stopPath,worldMenu]);
  useEffect(() => () => { stopPath(); if(walkTimer.current) clearTimeout(walkTimer.current); if(attackTimer.current) clearTimeout(attackTimer.current); },[stopPath]);
  const clickTile = (target: Point) => {
    if (phase!=='world' || dialogue || showSettings || showGuide || worldMenu || inventoryOpen || dresserOpen || libraryShelf || shopType) return;
    stopPath(); const s=stateRef.current; const map=maps[s.area]; const npc=storyNpcs(map.npcs,s.story).find(n=>same(n,target)); const enemy=enemyAt(s.area,target,enemyPositionsRef.current,s.defeated); const interaction=eventAt(map,target,'interact')?.action;
    let destination=target;
    if (npc || enemy || interaction) { const options=neighbors(target).filter(p=>walkable(s.area,p)); const paths=options.map(p=>({p,route:pathfind(s.area,s.pos,p,s.defeated,enemyPositionsRef.current,s.story)})).filter(v=>v.route.length||same(v.p,s.pos)); paths.sort((a,b)=>a.route.length-b.route.length); destination=paths[0]?.p??target; }
    const route=pathfind(s.area,s.pos,destination,s.defeated,enemyPositionsRef.current,s.story);
    if (!route.length && !same(s.pos,destination)) {
      setToast(npc||enemy||interaction?'近づける道が見つからない。':'そこへは行けない。通れる場所を選ぼう。');
      return;
    }
    let i=0; pathTimer.current=setInterval(() => { if (i<route.length) { const p=route[i++], current=stateRef.current.pos; if (!step(p.x-current.x,p.y-current.y)) stopPath(); } else { stopPath(); if (npc) talkToNpc(npc); else if (enemy) startBattle(enemy); else if (interaction?.kind==='dresser') openDresser(); else if (interaction?.kind==='chest') openChest(interaction.id); else if (interaction?.kind==='bookshelf') openBookshelf(interaction.shelf); } },105);
  };
  const answer = (value: string | number) => {
    if (!battle || battle.answered) return;
    if (battle.enemy.id==='after-gate' && battle.eliminated===null) { setBattleNote('覚えたばかりの「見極め」を使ってみよう。'); return; }
    const q=battle.question;
    const bossResult=battle.enemy.boss ? bossCommandResult(battle.bossStage,String(value)) : battle.fromReview && bossQuestionById(q.id) ? bossCommandResult(Number(q.id.split('-')[2]),String(value)) : null;
    const correct=bossResult ? bossResult.correct : isChoiceQuestion(q) ? value===q.answer : inputIsCorrect(q,String(value));
    setLearningSession(session=>session.active?{...session,answers:[...session.answers,{id:q.id,prompt:q.prompt,correct,reveal:q.reveal}].slice(-100)}:session);
    if(battle.fromReview)setReviewCourse(course=>course?{...course,answered:course.answered+1,correct:course.correct+(correct?1:0)}:null);
    const dealt=correct?rollDamage(1,2)+(items[stateRef.current.equipment.weapon].power??0):0;
    const damage=correct||battle.fromReview?0:Math.max(1,rollDamage(battle.enemy.boss?4:2,battle.enemy.boss?7:5)-(items[stateRef.current.equipment.armor].power??0));
    const newHp=Math.max(0,stateRef.current.hp-damage);
    const animateAttack=(correct||!battle.fromReview)&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(attackTimer.current) clearTimeout(attackTimer.current);
    setAttackAnimating(animateAttack);
    if(animateAttack) attackTimer.current=setTimeout(()=>{setAttackAnimating(false);attackTimer.current=null;},1300);
    update(s=>({...s,learningRecords:recordLearning(s.learningRecords,q.id,correct,!!battle.fromReview),hp:newHp,total:s.total+1,correct:s.correct+(correct?1:0),answered:[...s.answered,q.id],wrong:correct?s.wrong.filter(id=>id!==q.id):s.wrong.includes(q.id)?s.wrong:[...s.wrong,q.id]}));
    const heroTechnique=correct?chooseHeroTechnique(battle.heroTechnique):battle.heroTechnique;
    const enemyHp=battle.enemy.boss && correct ? bossStrike(battle.hp,battle.bossStage,dealt) : Math.max(0,battle.hp-dealt);
    setBattle({...battle,submitted:value,answered:true,correct,hp:enemyHp,rounds:battle.rounds+1,heroTechnique});
    setBattleNote(correct?`${heroTechnique!.name}！ ${battle.enemy.name}に${battle.hp-enemyHp}ダメージ！${bossResult ? ` ${bossResult.reason}` : ''}`:battle.fromReview?'惜しい！ 解説を読んで、もう一度挑戦しよう。':`${battle.enemy.name}の「${battle.enemy.attackName}」！ HPが${damage}減った。${bossResult ? ` ${bossResult.reason}` : ''}`);
    beep(correct?800:150,correct?0.18:0.28);
  };
  const battleNext = () => {
    if (!battle || !battle.answered || attackAnimating) return;
    if(battle.fromReview&&reviewCourse){
      const next=reviewCourse.index+1;
      if(next<reviewCourse.questions.length){setReviewCourse({...reviewCourse,index:next});startReview(reviewCourse.questions[next]);}
      else {setReviewResult(`復習コース完了：回答 ${reviewCourse.answered}問 · 正解 ${reviewCourse.correct}問`);setReviewCourse(null);setBattle(null);setPhase('review-room');}
      return;
    }
    if (!battle.fromReview && stateRef.current.hp<=0) { update(s=>({...s,area:'town',pos:{x:13,y:16},hp:maxHp(s.level),mp:maxMp(s.level)})); setBattle(null); setPhase('church'); setToast('司祭セラに助けられ、教会で目を覚ました。'); return; }
    if (battle.hp<=0) {
      if (battle.fromReview) { setBattle(null); setPhase('review-room'); setToast('復習完了！'); return; }
      if (battle.enemy.id==='after-gate') {
        setBattle(null);
        if(stateRef.current.story==='legacy') {update(s=>({...s,completed:true}));setPhase('clear');}
        else {update(s=>({...s,story:'homecoming',area:'town',pos:{x:13,y:16}}));setPhase('world');setToast('教会へ。見極めでハンナを救おう。');}
        beep(1080,0.5,'sine');return;
      }
      const gained=battle.enemy.boss?12:4, earned=battle.enemy.boss?100:35;
      update(s=>{ const xp=s.xp+gained, level=1+Math.floor(xp/12), leveled=level>s.level; return {...s,xp,level,gold:s.gold+earned,hp:leveled?maxHp(level):s.hp,mp:leveled?maxMp(level):s.mp,defeated:[...s.defeated,battle.enemy.id],bossDefeated:s.bossDefeated||!!battle.enemy.boss}; });
      setBattle(null);
      if (battle.enemy.boss) { if(stateRef.current.story==='legacy'){setPhase('epilogue');setEpilogueStep(0);}else{update(s=>({...s,story:'knight'}));setPhase('world');} } else { setPhase('world'); setToast(`${battle.enemy.name}を倒した！ 経験値 +${gained}、${earned} G`); }
      beep(950,0.26);
      return;
    }
    if (battle.enemy.boss) {
      if (battle.correct && !bossGuardBroken(battle.hp,battle.bossStage)) {
        const hp=bossStrike(battle.hp,battle.bossStage,rollDamage(1,2)+(items[stateRef.current.equipment.weapon].power??0));
        const heroTechnique=chooseHeroTechnique(battle.heroTechnique);
        const animate=!window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        setAttackAnimating(animate);
        if (animate) attackTimer.current=setTimeout(()=>{setAttackAnimating(false);attackTimer.current=null;},1300);
        setBattle({...battle,hp,rounds:battle.rounds+1,heroTechnique});
        setBattleNote(`${heroTechnique.name}！ 防御を崩した隙に追撃、${battle.hp-hp}ダメージ！`);
        beep(800,0.18);
        return;
      }
      const bossStage=battle.correct ? battle.bossStage+1 : battle.bossStage;
      setBattle({...battle,bossStage,question:bossQuestion(bossStage,battle.question.difficulty),answered:false,correct:false,eliminated:null,hints:battle.correct?0:battle.hints});
      setBattleInput(''); setBattleNote(''); return;
    }
    if (battle.fromReview) { setBattle({...battle,answered:false,correct:false,eliminated:null}); setBattleInput(''); setBattleNote(''); return; }
    const q=selectQuestion(questions,stateRef.current);
    setBattle({...battle,question:q,answered:false,correct:false,eliminated:null}); setBattleInput(''); setBattleNote('');
  };
  const retreat=()=>{
    if(!battle||battle.fromReview||battle.enemy.boss||battle.enemy.id==='after-gate'||attackAnimating||stateRef.current.hp<=0)return;
    stopPath();const s=stateRef.current;
    if(enemyAt(s.area,s.pos,enemyPositionsRef.current,s.defeated)){
      const queue=[s.pos],visited=new Set<string>();let safe:Point|undefined;
      for(let i=0;i<queue.length&&!safe;i++)for(const p of neighbors(queue[i])){
        const key=`${p.x},${p.y}`;if(visited.has(key)||!walkable(s.area,p)||eventAt(maps[s.area],p,'enter'))continue;visited.add(key);
        if(!enemyAt(s.area,p,enemyPositionsRef.current,s.defeated)&&!storyNpcs(maps[s.area].npcs,s.story).some(n=>same(n,p))){safe=p;break;}queue.push(p);
      }
      if(!safe){setToast('安全に退ける場所がありません。');return;}update(value=>({...value,pos:safe!}));
    }
    setBattle(null);setBattleInput('');setBattleNote('');setAttackAnimating(false);phaseRef.current='world';setPhase('world');setToast('戦いから退いた。経験値とお金は得られません。');
  };
  const castMagic = () => {
    if (!battle || battle.answered || !isChoiceQuestion(battle.question) || battle.eliminated!==null || !save.bossDefeated || save.mp<1) return;
    const index=battle.question.options!.findIndex((_,i)=>i!==battle.question.answer);
    update(s=>({...s,mp:s.mp-1,magicUsed:true})); setBattle({...battle,eliminated:index}); setBattleNote('魔法「見極め」！ 誤った選択肢が一つ消えた。'); beep(1040,0.4,'sine');
  };
  const buyItem = (id:ItemId) => {
    const item=items[id]; if(!shopType || item.kind!==shopType || stateRef.current.gold<item.price) return;
    update(s=>({...s,gold:s.gold-item.price,inventory:{...s.inventory,[id]:(s.inventory[id]??0)+1}}));
    setToast(`${item.name}を買った！`); beep(840,0.1);
  };
  const sellItem = (id:ItemId) => {
    const s=stateRef.current,item=items[id]; if((s.inventory[id]??0)<1 || item.price<1 || s.equipment.weapon===id || s.equipment.armor===id) return;
    update(prev=>({...prev,gold:prev.gold+Math.floor(item.price/2),inventory:{...prev.inventory,[id]:(prev.inventory[id]??0)-1}}));
    setToast(`${item.name}を売った！`); beep(690,0.1);
  };
  const useItem = (id:ItemId) => {
    const item=items[id],s=stateRef.current; if(item.kind!=='item'||(s.inventory[id]??0)<1) return;
    const hp=item.healHp?Math.min(maxHp(s.level),s.hp+item.healHp):s.hp;
    const mp=item.healMp?Math.min(maxMp(s.level),s.mp+item.healMp):s.mp;
    if(hp===s.hp&&mp===s.mp) return;
    update(prev=>({...prev,hp,mp,inventory:{...prev.inventory,[id]:(prev.inventory[id]??0)-1}}));
    setToast(`${item.name}を使った！ ${item.healHp?`HP +${hp-s.hp}`:`MP +${mp-s.mp}`}`); beep(930,0.15,'sine');
  };
  const equipItem = (id:ItemId) => {
    const item=items[id]; if((stateRef.current.inventory[id]??0)<1 || (item.kind!=='weapon'&&item.kind!=='armor')) return;
    update(s=>({...s,equipment:{...s.equipment,[item.kind]:id}})); setToast(`${item.name}を装備した！`); beep(760,0.12);
  };
  const restoreBackup=()=>{
    if(!backup)return;
    const restored={...backup,lastSavedAt:Date.now()};
    try {localStorage.setItem(STORAGE,JSON.stringify(restored));}
    catch {setToast('復元できませんでした。今の冒険は変更していません。');return;}
    update(()=>restored);setHasSave(true);setLastSavedAt(restored.lastSavedAt);setSaveFailed(false);
    const positions=spawnEnemies(restored.defeated);enemyPositionsRef.current=positions;setEnemyPositions(positions);
    npcTalkCounts.current={};setToast('前の冒険を復元しました。「続きから始める」で再開できます。');
  };
  const importSave=(incoming:Save):string|null=>{
    const restored={...incoming,lastSavedAt:Date.now()},previous={...stateRef.current,lastSavedAt:Date.now()};
    try {
      if(hasSave)localStorage.setItem(BACKUP_STORAGE,JSON.stringify(previous));
      localStorage.setItem(STORAGE,JSON.stringify(restored));
    }catch{return '保存先に書き込めませんでした。現在の冒険は変更していません。';}
    if(hasSave)setBackup(previous);
    setLearningSession({active:false,answers:[]});stopPath();update(()=>restored);setHasSave(true);setLastSavedAt(restored.lastSavedAt);setSaveFailed(false);setSaveNotice('');
    const positions=spawnEnemies(restored.defeated);enemyPositionsRef.current=positions;setEnemyPositions(positions);npcTalkCounts.current={};
    setDialogue(null);dialogueRef.current=null;setWorldMenu(null);setShowSettings(false);setLibraryShelf(null);setInventoryOpen(false);setShopType(null);setBattle(null);setPhase('title');
    setToast('読み込みました。「続きから始める」で再開できます。');return null;
  };
  const startNew = () => { const previous=stateRef.current;
    if(hasSave){
      const snapshot={...previous,lastSavedAt:Date.now()};
      try {localStorage.setItem(BACKUP_STORAGE,JSON.stringify(snapshot));setBackup(snapshot);}
      catch {setToast('前の冒険を保護できませんでした。新しい冒険はまだ始めていません。');return;}
    }
    setLearningSession({active:false,answers:[]});
    const s={...initialSave(),name:previous.name,track:previous.track,difficulty:previous.difficulty,inertia:previous.inertia}; setSetup({name:hasSave?previous.name:'',track:previous.track,difficulty:previous.difficulty,inertia:previous.inertia}); const positions=spawnEnemies(); enemyPositionsRef.current=positions; setEnemyPositions(positions); npcTalkCounts.current={}; stateRef.current=s; setSave(s); setHasSave(false);setDialogue(null);dialogueRef.current=null;setWorldMenu(null);setShowGuide(false);setShowSettings(false); setInventoryOpen(false); setDresserOpen(false); setShopType(null); setIntroIndex(0); setPhase('prologue'); beep(600,0.2); };
  const finishPrologue = () => { setPhase('setup'); beep(620,0.14); };
  const beginAdventure = () => { const name=setup.name.trim(); if(!name) return; update(s=>({...s,name,track:setup.track,difficulty:setup.difficulty,inertia:setup.inertia,area:'home',pos:maps.home.entry})); setHasSave(true); setPhase('world'); playStory(wakingScene); };
  const startReview = (q: Question) => { const enemy: Enemy={id:'review',name:'リトライシャドウ',attackName:'記憶のささやき',x:0,y:0,icon:'♧'}; startBattle(enemy,true,q); };
  const related=battle?.answered?relatedBook(battle.question.id):null;
  const wrongQuestions=save.wrong.map(id=>bossQuestionById(id) ?? questions.find(q=>q.id===id)).filter((q):q is Question=>!!q);
  const near=phase==='world'&&!dialogue&&!worldMenu&&!showGuide&&!showSettings&&!inventoryOpen&&!dresserOpen&&!libraryShelf&&!shopType?nearbyInteraction(maps[save.area],save.pos,facing,save.story):null;
  const nearbyHint=near?{point:near.point,label:near.kind==='event'&&near.action.kind==='chest'&&save.openedChests.includes(near.action.id)?'空の宝箱を調べる':near.label}:undefined;
  const intro=prologue[introIndex];
  const currentLine=dialogue?.lines[dialogue.index];
  const dialogueText=typeof currentLine==='string'?currentLine:currentLine?.text;
  const dialogueSpeaker=typeof currentLine==='string'?dialogue?.speaker:currentLine?.speaker;
  const dialogueFace=typeof currentLine==='string'?dialogue?.face:currentLine?.face;

  return <div className="app-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">✧</span><div><strong>コードクロニクル</strong><small>コードの扉を開く者達</small></div></div><div className="top-actions"><span className="top-location">{phase==='world'?areaLabel[save.area]:phase==='battle'?'戦闘中':phase==='church'?'教会':phase==='review-room'?'復習の部屋':phase==='title'?'冒険の始まり':'物語'}</span>{phase!=='title'&&phase!=='prologue'&&phase!=='setup'&&<button onClick={()=>setShowSettings(true)}>⚙ 学習設定</button>}<button onClick={()=>{stopPath();setShowGuide(true);}} aria-keyshortcuts="F1">操作方法 <kbd className="shortcut-key">F1</kbd></button><button aria-label={muted?'音をオンにする':'音をオフにする'} onClick={toggleSound}>{muted?'♪ 音オフ':'♫ 音オン'}</button></div></header>
    {phase==='title' && <main className="title-screen"><div className="stars"/><div className="title-art"><div className="moon"/><div className="castle"><i/><i/><i/></div><div className="title-hero"><WorldCharacter name="hero"/></div></div><p className="eyebrow">THE LOST ART OF CODING</p><h1>コードクロニクル</h1><h2>― コードの扉を開く者達 ―</h2><p className="title-copy">知識が失われた世界で、もう一度、魔法を取り戻す。</p>{hasSave&&<ResumeSummary save={save} savedAt={lastSavedAt}/>}<div className="title-menu"><button className="primary" onClick={startNew}>新しい冒険を始める <span>▶</span></button>{hasSave && <button onClick={()=>{setPhase(save.completed?'clear':save.bossDefeated&&['knowledge','legacy','ruins'].includes(save.story)?'epilogue':'world'); beep(640,0.1);}}>続きから始める <span>▶</span></button>}</div>{backup&&<details className="resume-summary backup-summary"><summary>保護した前の冒険</summary><p>{backup.name}　LV {backup.level} · {areaLabel[backup.area]}</p><p>復元すると、現在の冒険はこのデータに置き換わります。</p><button onClick={restoreBackup}>この冒険を復元する</button></details>}<SaveTransfer current={hasSave?save:null} validate={validateIncomingSave} onImport={importSave}/><p className="title-foot">React / Vue × Laravel × TypeScript</p></main>}
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
          <div className="prologue-actions"><button className="primary" onClick={()=>introIndex<prologue.length-1?setIntroIndex(introIndex+1):finishPrologue()}>{introIndex<prologue.length-1?'次の場面へ':'目覚める'}　▶</button><button className="text-button" onClick={finishPrologue}>序章をスキップ</button></div>
        </div>
      </div>
    </main>}
    {phase==='setup' && <main className="setup-screen"><div className="setup-panel">
      <span className="eyebrow">THE JOURNEY BEGINS</span>
      <h1>ええと、俺の名前は、、、</h1>
      <p className="setup-intro">目を覚ましたあなたは、自分の名前と、これから学ぶ道を思い出す。</p>
      <LearningSetupHelp/>
      <form onSubmit={e=>{e.preventDefault();beginAdventure();}}>
        <label className="setup-name" htmlFor="hero-name">主人公の名前<input id="hero-name" autoFocus maxLength={12} required value={setup.name} onChange={e=>setSetup(s=>({...s,name:e.target.value}))} placeholder="名前を入力"/></label>
        <fieldset className="setup-field"><legend>学ぶフロントエンド</legend><div className="setup-choice-row"><button type="button" className={setup.track==='react'?'selected':''} aria-pressed={setup.track==='react'} onClick={()=>setSetup(s=>({...s,track:'react'}))}>React + TypeScript</button><button type="button" className={setup.track==='vue'?'selected':''} aria-pressed={setup.track==='vue'} onClick={()=>setSetup(s=>({...s,track:'vue'}))}>Vue + TypeScript</button></div><p>Laravelはどちらの道でも学びます。</p></fieldset>
        <fieldset className="setup-field"><legend>Laravelと画面のつなぎ方</legend><div className="setup-choice-row"><button type="button" className={setup.inertia?'selected':''} aria-pressed={setup.inertia} onClick={()=>setSetup(s=>({...s,inertia:true}))}>Inertia連携</button><button type="button" className={!setup.inertia?'selected':''} aria-pressed={!setup.inertia} onClick={()=>setSetup(s=>({...s,inertia:false}))}>API連携</button></div><p>選んだ連携方法に応じて問題が変わります。</p></fieldset>
        <fieldset className="setup-field"><legend>難易度</legend><DifficultyPicker value={setup.difficulty} onChange={difficulty=>setSetup(s=>({...s,difficulty}))}/><p className="difficulty-note">難易度で変わるのは出題内容です。通常戦は4択とコード穴埋め（選択・入力）。ボスは全難易度共通の3段階の復旧をCLI入力で攻略します。敵の強さ・HP・報酬は共通です。</p></fieldset>
        <button className="primary setup-submit" type="submit" disabled={!setup.name.trim()}>この名前で冒険を始める　▶</button>
      </form>
    </div></main>}
    {['world','battle','church','review-room'].includes(phase)&&<LearningSession value={learningSession} onChange={setLearningSession}/>}
    {phase==='world' && <WorldScene save={save} nearbyHint={nearbyHint} enemyPositions={enemyPositions} menu={worldMenu} knightVisible={!dialogue?.lines.slice(0,dialogue.index+1).some(line=>typeof line!=='string'&&line.action==='knight-leaves')} onGuide={()=>{stopPath();setShowGuide(true);}} onMenu={menu=>{stopPath();setWorldMenu(menu);}} onTile={clickTile} onChurch={enterChurch} onInventory={()=>setInventoryOpen(true)} onSettings={()=>setShowSettings(true)} onSound={toggleSound} muted={muted} walking={walking} facing={facing}/>}
    {phase==='encounter' && battle && <BattleEncounter enemy={battle.enemy} heroName={save.name} banterSeed={battle.banterSeed} onEnter={()=>setPhase('battle')}/>}
    {phase==='battle' && battle && <main className={`battle-layout ${isFillQuestion(battle.question)?'fill-battle':''}`}><section className="combat-panel"><div className="panel-heading"><div><span className="eyebrow">ENCOUNTER</span><h2>{battle.fromReview?'復習の戦い':battle.enemy.boss?'知識の扉を守る者':'敵が現れた！'}</h2></div><span className="map-badge danger">{battle.enemy.boss?'BOSS BATTLE':'BATTLE'}</span></div><BattleStage area={battle.fromReview ? 'church' : save.area} enemy={battle.enemy} enemyHp={battle.hp} enemyMaxHp={battle.maxHp} hero={save} heroMaxHp={maxHp(save.level)} heroMaxMp={maxMp(save.level)} attack={battle.answered ? battle.correct ? 'hero' : battle.fromReview ? null : 'enemy' : null} attackRound={battle.rounds} answered={battle.answered} attackAnimating={attackAnimating} banterSeed={battle.banterSeed} heroTechnique={battle.heroTechnique}/><div className="question-card"><div className="question-kicker"><span>{isFillQuestion(battle.question)?isChoiceQuestion(battle.question)?'✦ CODE CHOICE':'✎ CODE INPUT':battle.question.kind==='cli'?'⌘ CLI CHALLENGE':'✦ FOUR CHOICES'}</span><span>{difficultyLabel[save.difficulty]} · {battle.question.topic==='frontend'?save.track==='react'?'React':'Vue':battle.question.topic==='laravel'?'Laravel':save.inertia?'Inertia':'API連携'}</span></div>{battle.enemy.boss&&<div className="boss-progress"><strong>復旧 {battle.bossStage+1} / {bossStages.length} · {bossStages[battle.bossStage].title}</strong><ol>{bossStages.map((stage,i)=><li key={stage.title} aria-current={i===battle.bossStage?'step':undefined} className={i<battle.bossStage?'done':i===battle.bossStage?'current':''}>{i<battle.bossStage?'✓':i+1} {stage.title}</li>)}</ol><p>症状を読んで対処すると防御が崩れます。追撃で突破し、次の復旧へ。時間制限はありません。</p></div>}<h3>{battle.question.prompt}</h3>{isFillQuestion(battle.question)&&<div className="mobile-question-code"><QuestionCode question={battle.question} answered={battle.answered}/></div>}{battle.question.code&&!isFillQuestion(battle.question)&&<pre>{battle.question.code}</pre>}{isChoiceQuestion(battle.question)?<div className="options">{battle.question.options!.map((option,i)=><button key={i} data-shortcut={String.fromCharCode(97+i)} aria-keyshortcuts={String.fromCharCode(65+i)} title={`${String.fromCharCode(65+i)}キーで回答`} disabled={battle.answered||battle.eliminated===i} className={`${battle.answered&&i===battle.question.answer?'right':''} ${battle.answered&&i!==battle.question.answer?'faded':''} ${battle.eliminated===i?'eliminated':''}`} onClick={()=>answer(i)}><span>{String.fromCharCode(65+i)}</span>{battle.eliminated===i?'魔法で除外':option}</button>)}</div>:<form className="cli-form" onSubmit={e=>{e.preventDefault();answer(battleInput);}}><label htmlFor="cli-answer">{isFillQuestion(battle.question)?'① に入るコード':'ゲーム内CLI'}</label><div><span>❯</span><input id="cli-answer" autoFocus spellCheck={false} value={battleInput} onChange={e=>setBattleInput(e.target.value)} disabled={battle.answered} autoComplete="off" autoCapitalize="off" placeholder={isFillQuestion(battle.question)?'① に入る単語・式を入力':'コマンドを入力'}/><button disabled={battle.answered||!battleInput.trim()}>{isFillQuestion(battle.question)?'回答 ↵':'実行 ↵'}</button></div></form>}{battle.enemy.boss&&!battle.answered&&<div className="boss-hints"><button className="magic-button" data-shortcut="h f4" aria-keyshortcuts="H F4" disabled={battle.hints>=2} onClick={()=>setBattle({...battle,hints:Math.min(2,battle.hints+1)})}>✦ ヒントを見る（無料） {battle.hints} / 2 <kbd className="shortcut-key">H / F4</kbd></button>{bossStages[battle.bossStage].hints.slice(0,battle.hints).map((hint,i)=><p key={i}>{hint}</p>)}</div>}{!battle.answered&&save.bossDefeated&&isChoiceQuestion(battle.question)&&<button className="magic-button" data-shortcut="m f3" aria-keyshortcuts="M F3" disabled={save.mp<1||battle.eliminated!==null} onClick={castMagic}>✦ 見極めの魔法を使う <small>MP 1</small> <kbd className="shortcut-key">M / F3</kbd></button>}{!battle.answered&&<button className="magic-button" data-shortcut="i f2" aria-keyshortcuts="I F2" onClick={()=>setInventoryOpen(true)}>✦ どうぐを使う <kbd className="shortcut-key">I / F2</kbd></button>}{battleNote&&<div className={`battle-note ${battle.correct?'success':'fail'}`}>{battleNote}</div>}{!battle.fromReview&&!battle.enemy.boss&&battle.enemy.id!=='after-gate'&&<button className="back-link" disabled={attackAnimating||save.hp<=0} onClick={retreat}>戦闘から退く（報酬なし）</button>}{battle.fromReview&&<button className="back-link" data-shortcut="r" aria-keyshortcuts="R" disabled={attackAnimating} onClick={()=>{if(reviewCourse)setReviewResult(`復習コースを中断：回答 ${reviewCourse.answered}問 · 正解 ${reviewCourse.correct}問`);setReviewCourse(null);setBattle(null);setBattleInput('');setBattleNote('');setPhase('review-room');}}>← 復習の部屋へ戻る <kbd className="shortcut-key">R</kbd></button>}{battle.answered&&<button className="primary next-turn" data-shortcut="n" aria-keyshortcuts="N" disabled={attackAnimating} onClick={battleNext}>{battle.fromReview&&reviewCourse?reviewCourse.index+1<reviewCourse.questions.length?'次の復習へ':'復習結果を見る':battle.hp<=0?'戦闘を終える':save.hp<=0&&!battle.fromReview?'教会へ':battle.enemy.boss?battle.correct?bossGuardBroken(battle.hp,battle.bossStage)?'次の復旧へ':'隙を突いて追撃する':'同じ状況に再挑戦':battle.fromReview&&!battle.correct?'もう一度挑戦する':'次の問題へ'}　▶ <kbd className="shortcut-key">N / Enter</kbd></button>}</div></section><aside className="explain-panel">{isFillQuestion(battle.question)&&<div className="desktop-question-code"><QuestionCode question={battle.question} answered={battle.answered}/></div>}<div className="explain-header"><span className="eyebrow">GRIMOIRE</span><h2>知識の書</h2><p>問いを解くたび、失われた言葉が戻ってくる。</p></div>{battle.answered?<div className="explain-content"><span className={battle.correct?'answer-tag good':'answer-tag bad'}>{battle.correct?'正解':'復習ポイント'}</span><h3>答え：{battle.question.reveal}</h3><p>{battle.question.explanation}</p>{wrongChoiceReason(battle.question,battle.submitted)&&<p className="tip-box"><strong>選んだ答えについて</strong><br/>{wrongChoiceReason(battle.question,battle.submitted)}</p>}{related&&<button onClick={()=>{bookmarkBook(related.shelf.id,related.book.id);setLibraryShelf(related.shelf);}}>関連する本「{related.book.title}」を読む</button>}<div className="tip-box">間違えた問題は教会の「復習の部屋」で振り返れます。</div></div>:<div className="explain-placeholder"><div>✧</div><p>回答するとここに解説が表示されます。</p></div>}<div className="battle-stats"><span>正解 {save.correct}</span><span>回答 {save.total}</span><span>復習 {save.wrong.length}</span></div></aside></main>}
    {phase==='church' && <main className="church-screen"><div className="church-visual"><img src={`${import.meta.env.BASE_URL}maps/church-town-320x256.png`} alt="黎明の教会"/><h2>黎明の教会</h2><p>「間違いは、道を照らす灯火です」</p></div><div className="church-card"><div className="church-content"><div className="priest-portrait"><CharacterPortrait face="👩🏼" standing/></div><h3>司祭セラ</h3>{['mayor','ruins','homecoming'].includes(save.story)&&<button className="primary" onClick={visitHanna}>ハンナを見舞う</button>}<p>「心と体を休めていってください。問いを振り返りたいときは、奥の復習の部屋へどうぞ」</p><div className="heal-stats"><span>HP {save.hp} / {maxHp(save.level)}</span><span>MP {save.mp} / {maxMp(save.level)}</span></div><button className="primary" onClick={()=>{update(s=>({...s,hp:maxHp(s.level),mp:maxMp(s.level)}));setToast('HPとMPが全回復した。');beep(900,0.4,'sine');}}>HP・MPを回復する ✦</button><button className="church-room-door" onClick={()=>{setPhase('review-room');beep(660,0.12,'sine');}}><span><strong>📖 復習の部屋へ入る</strong><small>教会の奥の別室 · 復習する問題 {wrongQuestions.length} 問</small></span><span aria-hidden="true">▶</span></button></div><button className="back-link" onClick={()=>{setPhase('world');update(s=>({...s,area:'town',pos:{x:13,y:16}}));}}>← 町へ戻る</button></div></main>}
    {phase==='review-room' && <ReviewRoom questions={wrongQuestions} courseResult={reviewResult} onStartCourse={qs=>{if(!qs.length)return;setReviewResult('');setReviewCourse({questions:qs,index:0,answered:0,correct:0});startReview(qs[0]);}} onStart={q=>{setReviewCourse(null);startReview(q);}} onLeave={()=>{setPhase('church');beep(520,0.12);}}/>}
    {phase==='epilogue' && <main className="epilogue-screen"><img className="gate-art" src={`${import.meta.env.BASE_URL}maps/ruins-gate-128.png`} alt="開いた遺跡の門"/><div className="story-card"><span className="eyebrow">THE FIRST GATE IS OPEN</span><h2>{epilogueStep===0?'知識の扉が開いた':epilogueStep===1?'魔法「見極め」を獲得！':'新たな知識を試そう'}</h2><p>{epilogueStep===0?'守護者の目に静かな光が戻った。「私は知識を守る者。魔王の声に、務めさえ忘れていた……」。開いた扉の先から、失われた知識があふれ出す。':epilogueStep===1?'魔法を使うと、4択の誤った答えを一つ消せる。MPを1消費し、教会で回復できる。':'正気に戻った守護者が訓練用の問いを示した。見極めで偽りを見破り、答えよう。この力を、ハンナのもとへ持ち帰るために。'}</p><button className="primary" onClick={()=>{if(epilogueStep<2)setEpilogueStep(epilogueStep+1);else startBattle({id:'after-gate',name:'デバッグキーパー',attackName:'記憶の衝撃',x:0,y:0,icon:'✧'} ,false,selectQuestion(questions,stateRef.current,Math.random,true));}}>{epilogueStep<2?'次へ':'魔法を試す'}　▶</button></div></main>}
    {phase==='clear' && <main className="clear-screen"><img className="clear-symbol" src={`${import.meta.env.BASE_URL}maps/ruins-gate-128.png`} alt="開いた遺跡の門"/><span className="eyebrow">CHAPTER 1 COMPLETE</span><h1>{save.story==='rescued'?'今度は、助けられた。':'最初の扉は、開かれた。'}</h1><p>{save.story==='rescued'?'ハンナの魔物化を止め、あなたのことを思い出してもらえた。世界の知識を救う旅と、騎士の証言を手がかりに両親の行方を確かめる旅が、ここから始まる。':'失われた知識の一片を取り戻した。魔王との戦いは、まだ始まったばかり。'}</p><div className="result-grid"><div><strong>{save.level}</strong><span>到達レベル</span></div><div><strong>{save.correct}/{save.total}</strong><span>正解数</span></div><div><strong>{save.defeated.length}</strong><span>倒した敵</span></div><div><strong>{save.magicUsed?'✓':'—'}</strong><span>魔法「見極め」</span></div></div><div className="clear-actions"><button className="primary" onClick={()=>{setPhase('world');update(s=>({...s,area:'town',pos:maps.town.entry}));}}>町へ戻って冒険を続ける</button><button onClick={()=>setPhase('title')}>タイトルへ</button></div></main>}
    {dialogue&&phase==='world'&&<div className="dialogue-overlay"><div className="dialogue-box" onClick={advanceDialogue}><div className="dialogue-portrait"><CharacterPortrait face={dialogueFace??'📜'}/></div><div className="dialogue-text"><strong>{dialogueSpeaker}</strong><p>{dialogueText}</p>{dialogue.index===dialogue.lines.length-1&&dialogue.choices?.length?<DialogueChoices choices={dialogue.choices} onChoose={choice=>{choice.onChoose?.();setDialogue({...dialogue,lines:[choice.response],index:0,choices:undefined});beep(720,0.08);}}/>:<span>クリック / Enter で次へ　▼</span>}</div></div></div>}
    {libraryShelf&&<LibraryPanel key={libraryShelf.id} shelf={libraryShelf} readBooks={save.readBooks} bookmark={save.bookmarks[libraryShelf.id]} onBookmark={bookmarkBook} onPracticeAnswer={(q,correct)=>{update(s=>({...s,learningRecords:recordLearning(s.learningRecords,q.id,correct,true),scholarQuestReady:s.scholarQuestReady||(s.scholarQuestAccepted&&!s.scholarQuestCompleted&&s.readBooks.includes('laravel-routes-01')&&q.id==='l-b-1'&&correct)}));setLearningSession(session=>session.active?{...session,answers:[...session.answers,{id:q.id,prompt:q.prompt,correct,reveal:q.reveal}].slice(-100)}:session);}} onSelectBook={(shelf,bookId)=>{bookmarkBook(shelf.id,bookId);setLibraryShelf(shelf);}} onToggleRead={toggleReadBook} onClose={()=>setLibraryShelf(null)}/> }
    {dresserOpen&&<DresserPanel opened={dresserFound} reading={readingLetter} onRead={()=>setReadingLetter(value=>!value)} onClose={()=>setDresserOpen(false)}/> }
    {shopType&&<ShopPanel type={shopType} mode={shopMode} save={save} onMode={setShopMode} onBuy={buyItem} onSell={sellItem} onClose={()=>setShopType(null)}/> }
    {inventoryOpen&&<InventoryPanel save={save} onUse={useItem} onEquip={equipItem} onReadLetter={()=>{setInventoryOpen(false);setReadingLetter(true);setDresserFound(false);setDresserOpen(true);}} onClose={()=>setInventoryOpen(false)}/> }
    {showSettings&&<div className="modal-backdrop"><div className="settings-modal"><div className="modal-heading"><div><span className="eyebrow">ADVENTURE SETTINGS</span><h2>学習設定</h2></div><button onClick={()=>setShowSettings(false)} aria-label="閉じる">×</button></div><LearningSetupHelp/><label>主人公の名前<input maxLength={12} value={save.name} onChange={e=>update(s=>({...s,name:e.target.value||'旅人'}))}/></label><div className="setting-group"><span>学ぶフロントエンド</span><div className="segmented"><button className={save.track==='react'?'selected':''} onClick={()=>update(s=>({...s,track:'react'}))}>React + TS</button><button className={save.track==='vue'?'selected':''} onClick={()=>update(s=>({...s,track:'vue'}))}>Vue + TS</button></div></div><div className="setting-group"><span>難易度</span><DifficultyPicker value={save.difficulty} onChange={difficulty=>update(s=>({...s,difficulty}))}/><small>出題内容が切り替わります。敵の強さ・HP・報酬は共通です。</small></div><label className="toggle-row"><span><strong>Inertia環境</strong><small>オン：Inertia連携 / オフ：Laravel API連携</small></span><input type="checkbox" checked={save.inertia} onChange={e=>update(s=>({...s,inertia:e.target.checked}))}/></label><label className="volume-row">音量 <input type="range" min="0" max="1" step="0.05" value={volume} onChange={e=>{const volume=Number(e.target.value);setAudioPreferences(value=>({...value,volume}));}}/></label><ScholarQuest accepted={save.scholarQuestAccepted} ready={save.scholarQuestReady} completed={save.scholarQuestCompleted}/><DialogueHistoryPanel entries={save.dialogueLog}/><LearningRecordPanel records={save.learningRecords}/><SaveTransfer current={hasSave?save:null} validate={validateIncomingSave} onImport={importSave}/><button className="primary close-settings" onClick={()=>setShowSettings(false)}>冒険へ戻る</button></div></div>}
    {showGuide&&<ControlsGuide onClose={()=>setShowGuide(false)}/>}
    {saveNotice&&<aside className="save-status save-error" role="status"><p>{saveNotice}</p><button onClick={()=>setSaveNotice('')}>確認しました</button></aside>}
    {hasSave&&<SaveStatus failed={saveFailed} savedAt={lastSavedAt} onRetry={()=>persistSave(stateRef.current)}/>}
    {toast&&<div className="toast">✦ {toast}</div>}
  </div>;
}
