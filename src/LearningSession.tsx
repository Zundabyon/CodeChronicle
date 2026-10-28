import './learningSession.css';
export type SessionAnswer={id:string;prompt:string;correct:boolean;reveal:string};
export type LearningSessionState={active:boolean;answers:SessionAnswer[]};
export function LearningSession({value,onChange}:{value:LearningSessionState;onChange:(value:LearningSessionState)=>void}) {
  const count=value.answers.length,correct=value.answers.filter(a=>a.correct).length;
  return <details className="learning-session"><summary>{value.active?`今回の学習 ${count}/5問${count>=5?' · 目標達成！':''}`:'今日は5問の学習'}</summary>
    <p>今回の回答だけを数えます。5問を超えても冒険は続けられます。</p>
    {value.active?<><p role="status">回答 {count}問 · 正解 {correct}問{count>=5?' · 5問の目標を達成しました！':''}</p><button onClick={()=>onChange({...value,active:false})}>ここまでの結果を見る</button></>:<><button onClick={()=>onChange({active:true,answers:[]})}>新しく5問の目標を始める</button>{count>0&&<p>前回の結果：回答 {count}問 · 正解 {correct}問</p>}</>}
    {count>0&&<ul>{value.answers.map((a,i)=><li key={`${a.id}-${i}`}>{a.correct?'○':'△'} {a.prompt}<br/><small>{a.reveal}</small></li>)}</ul>}
  </details>;
}
