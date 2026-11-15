import './learningSession.css';
export type SessionAnswer={id:string;prompt:string;correct:boolean;reveal:string};
export type LearningSessionState={active:boolean;answers:SessionAnswer[];rewardXp?:number};
// Browser-local calendar date, e.g. 2026-11-15.
export const localDay=(date=new Date())=>date.toLocaleDateString('sv');
// One level is 12 XP; the daily five give a bit under one level early on, +50% for a perfect run.
export const dailyRewardXp=(level:number,correct:number)=>{const base=6+2*level;return correct>=5?Math.round(base*1.5):base;};
export function LearningSession({value,onChange,claimed}:{value:LearningSessionState;onChange:(value:LearningSessionState)=>void;claimed:boolean}) {
  const count=value.answers.length,correct=value.answers.filter(a=>a.correct).length;
  const label=value.active&&count<5?`今日の5問 ${count}/5`:claimed?'報酬受取済み✓':'▶ 今日の5問';
  return <details className="learning-session"><summary>{label}</summary><div className="learning-session-panel">
    <p>5問解くと1日1回、経験値をもらえます（全問正解で+50%）。</p>
    {claimed&&<p className="learning-session-claimed">本日の報酬は受け取り済み。また明日。解き直しはできます（報酬なし）。</p>}
    {value.rewardXp!==undefined&&<p role="status">今日の5問を達成！ 経験値 +{value.rewardXp}</p>}
    {value.active?<><p role="status">回答 {count}問 · 正解 {correct}問{count>=5?' · 5問の目標を達成しました！':''}</p><button onClick={()=>onChange({...value,active:false})}>ここまでの結果を見る</button></>:<><button onClick={()=>onChange({active:true,answers:[]})}>新しく5問の目標を始める</button>{count>0&&<p>前回の結果：回答 {count}問 · 正解 {correct}問</p>}</>}
    {count>0&&<ul>{value.answers.map((a,i)=><li key={`${a.id}-${i}`}>{a.correct?'○':'△'} {a.prompt}<br/><small>{a.reveal}</small></li>)}</ul>}
  </div></details>;
}
