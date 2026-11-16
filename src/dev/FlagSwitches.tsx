import { storyStages, type StoryStage } from '../story';
import { questDefinition } from '../quests/definitions';
import type { QuestStates } from '../quests/types';
import { designerBox as box } from './DesignerShell';

type FlagSave={story:StoryStage;completed:boolean;bossDefeated:boolean;quests:QuestStates;level:number;hp:number;mp:number;gold:number;xp:number;defeated:string[];openedChests:string[];dailyRewardDate:string};
type Props={save:FlagSave;onChange:(fn:(s:FlagSave)=>Partial<FlagSave>,message:string)=>void;onResetLearning:()=>void;onClose:()=>void};

const storyLabels:Record<StoryStage,[string,string]>={
  breakfast:['朝食前','旅籠でハンナと朝食をとる前'],mayor:['村長の話','村長の家で話を聞く前'],ruins:['遺跡へ','忘却の遺跡で守護者に挑む'],
  knight:['騎士と会う','守護者を倒し、謎の騎士と話す前'],knowledge:['知識を取り戻した','見極めの使い方を確かめる'],
  homecoming:['帰郷','教会のハンナを救う前'],rescued:['救出済み','ハンナを救い、第一章の物語を終えた'],legacy:['旧セーブ','物語の進行がない古い形式'],
};
const LEDGER='village-ledger',DONE='complete';
const act=(n:string,dungeon:string,foe:string,key:string)=>[
  [`第${n}幕 ダンジョン中`,`${dungeon}の最初の部屋から`,{r:'read-records',c:'create-family',u:'update-address',d:'delete-duplicate'}[key]!],
  [`第${n}幕 扉を全部開けた`,`${dungeon}の扉が全部開き、奥の祭壇へ`,`collect-${key}`],
  [`第${n}幕 ${foe}戦の前`,`村の広場に${foe}が立つ`,`battle-${key}`],
] as [string,string,string][];
// [label, explanation, quest step id or '' for not started]
const chapterOptions:[string,string,string][]=[
  ['未開始','第二章の依頼を受けていない',''],
  ['襲撃前（村へ向かう）','石灯の村でオルに話すと襲撃が始まる','visit-village'],
  ['名簿の控えを探す','遺跡の東の小部屋の宝箱を調べる','find-copy'],
  ...act('一','読む記憶','ノゾミ','r'),...act('二','作る記憶','ツクネ','c'),...act('三','直す記憶','ヌリエ','u'),...act('四','消す記憶','ケシ','d'),
  ['グラフィウス戦の前','村の広場にグラフィウスが立つ','battle-graphius'],
  ['名簿を戻す前','オルに話して名簿を復元する','return-names'],
  ['第二章クリア','名簿を取り戻した',DONE],
];
const stepOrder=(step:string)=>step===''?-1:step===DONE?Infinity:questDefinition(LEDGER)!.steps.findIndex(s=>s.id===step);
const maxHp=(l:number)=>20+(l-1)*5,maxMp=(l:number)=>3+Math.floor((l-1)/2);

export function FlagSwitches({save,onChange,onResetLearning,onClose}:Props) {
  const ledger=save.quests[LEDGER]?.step??'';
  const setStory=(stage:StoryStage)=>{
    if(storyStages.indexOf(stage)<storyStages.indexOf(save.story)&&!confirm(`第一章を「${storyLabels[stage][0]}」に戻します。よろしいですか？`))return;
    onChange(()=>({story:stage}),`第一章を『${storyLabels[stage][0]}』にしました`);
  };
  const setChapter=([label,,step]:[string,string,string])=>{
    if(stepOrder(step)<stepOrder(ledger)&&!confirm(`第二章を「${label}」に戻します。よろしいですか？`))return;
    onChange(s=>{const quests={...s.quests};if(step)quests[LEDGER]={step};else delete quests[LEDGER];return {quests};},`第二章を『${label}』にしました`);
  };
  const row=(on:boolean,label:string,note:string,onClick:()=>void,kind:'radio'|'switch'='radio')=>
    <button key={label} role={kind==='radio'?'radio':'switch'} aria-checked={on} onClick={onClick}
      style={{display:'flex',gap:10,alignItems:'baseline',width:'100%',textAlign:'left',padding:'6px 10px',margin:'2px 0',background:on?'#3a3050':'transparent',border:`1px solid ${on?'#e8c88a':'#4a4060'}`,color:'#f2e8d6',cursor:'pointer'}}>
      <b style={{minWidth:44,color:on?'#ffd27a':'#8a8098'}}>{kind==='radio'?(on?'● 今':'○'):(on?'オン':'オフ')}</b>
      <span><strong>{label}</strong><br/><small style={{color:'#b8aec8'}}>{note}</small></span>
    </button>;
  const action=(label:string,note:string,onClick:()=>void)=><button key={label} onClick={onClick} style={{padding:'6px 10px',margin:4,background:'#2a2438',border:'1px solid #c3a06d',color:'#f2e8d6',cursor:'pointer'}} title={note}>{label}<br/><small style={{color:'#b8aec8'}}>{note}</small></button>;
  return <div style={{color:'#f2e8d6',padding:16}} aria-label="進行スイッチ">
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h2 style={{margin:0}}>デバッグ：進行スイッチ</h2><button onClick={onClose}>とじる（Esc）</button></div>
    <p style={{fontSize:12,color:'#e8a07a',margin:'4px 0 12px'}}>※ デバッグ用。セーブデータが書き換わります。</p>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:12}}>
      <section style={box} role="radiogroup" aria-label="物語の進み">
        <h3 style={{marginTop:0}}>1. 物語の進み（第一章）</h3>
        {storyStages.map(stage=>row(save.story===stage,storyLabels[stage][0],storyLabels[stage][1],()=>setStory(stage)))}
        <hr/>
        {row(save.completed,'第一章クリア済み','オンで第二章を始められる・守護者を倒した扱い',()=>{
          const on=!save.completed;if(!on&&!confirm('第一章クリアをオフにします。よろしいですか？'))return;
          onChange(()=>({completed:on,bossDefeated:on}),`第一章クリアを${on?'オン':'オフ'}にしました`);},'switch')}
      </section>
      <section style={box} role="radiogroup" aria-label="第二章の進み">
        <h3 style={{marginTop:0}}>2. 第二章の進み</h3>
        {chapterOptions.map(option=>row(ledger===option[2],option[0],option[1],()=>setChapter(option)))}
      </section>
      <section style={box} aria-label="よく使うスイッチ">
        <h3 style={{marginTop:0}}>3. よく使うスイッチ</h3>
        {action('倒した敵をすべて復活',`今 ${save.defeated.length} 体倒している（守護者はそのまま）`,()=>onChange(s=>({defeated:s.defeated.filter(id=>id==='boss')}),'倒した敵をすべて復活させました'))}
        {action('宝箱をすべて未開封に',`今 ${save.openedChests.length} 個開けている`,()=>onChange(()=>({openedChests:[]}),'宝箱をすべて未開封にしました'))}
        {action('デイリー報酬を未受取に',save.dailyRewardDate?`受取日 ${save.dailyRewardDate}`:'今は未受取',()=>onChange(()=>({dailyRewardDate:''}),'デイリー報酬を未受取にしました'))}
        {action('今日の学習の進みをリセット','「今日の5問」を最初から',onResetLearning)}
        {action('HP/MP全回復',`HP ${save.hp}/${maxHp(save.level)}　MP ${save.mp}/${maxMp(save.level)}`,()=>onChange(s=>({hp:maxHp(s.level),mp:maxMp(s.level)}),'HPとMPを全回復しました'))}
        {action('所持金を +1000',`今 ${save.gold} G`,()=>onChange(s=>({gold:s.gold+1000}),'所持金を1000G増やしました'))}
        <label style={{display:'block',margin:4}}>レベルを指定（今 LV {save.level}）{' '}
          <select aria-label="レベル" value={Math.min(20,save.level)} onChange={e=>{const level=Number(e.target.value);onChange(()=>({level,xp:(level-1)*12,hp:maxHp(level),mp:maxMp(level)}),`レベルを${level}にしました`);}}>
            {Array.from({length:20},(_,i)=><option key={i} value={i+1}>LV {i+1}</option>)}
          </select>
        </label>
      </section>
    </div>
  </div>;
}
