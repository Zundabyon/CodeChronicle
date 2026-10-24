import { useState } from 'react';
import { difficultyLabel, type Question } from './content';
import { WorldCharacter } from './WorldCharacter';
import './reviewRoom.css';

type Props = {
  questions: Question[];
  onStart: (question: Question) => void;
  onLeave: () => void;
  onStartCourse:(questions:Question[])=>void;
  courseResult?:string;
};

const formatLabels:Record<Question['kind'],string>={choice:'4択',cli:'CLI入力','fill-choice':'穴埋め選択','fill-input':'穴埋め入力'};
const subjectOf=(q:Question)=>q.topic==='frontend'?q.track??'common':q.topic;
const subjectLabels:Record<string,string>={react:'React',vue:'Vue',common:'共通の基礎',laravel:'Laravel',connection:'画面とサーバの連携'};
export function ReviewRoom({ questions, onStart, onLeave, onStartCourse, courseResult }: Props) {
  const [subject,setSubject]=useState('all'),[difficulty,setDifficulty]=useState('all'),[format,setFormat]=useState('all');
  const filtered=questions.filter(q=>(subject==='all'||subjectOf(q)===subject)&&(difficulty==='all'||q.difficulty===difficulty)&&(format==='all'||q.kind===format));
  const reset=()=>{setSubject('all');setDifficulty('all');setFormat('all');};
  return <main className="review-room-screen" aria-labelledby="review-room-title">
    <section className="review-room-scene" aria-label="教会の別室">
      <div className="review-room-heading"><span className="eyebrow">CHURCH · STUDY ROOM</span><h2 id="review-room-title">復習の部屋</h2><p>忘れた言葉を、もう一度あなたの力に。</p></div>
      <div className="study-interior" aria-hidden="true">
        <div className="study-window"/>
        <div className="study-shelf left">{Array.from({length:12},(_,i)=><i key={i}/>)}</div>
        <div className="study-shelf right">{Array.from({length:12},(_,i)=><i key={i}/>)}</div>
        <div className="study-rug"/>
        <div className="study-desk"><span>▱</span></div>
        <div className="study-hero"><WorldCharacter name="hero"/></div>
        <div className="study-door"/>
      </div>
      <button className="secondary" onClick={onLeave}>← 教会の本堂へ戻る</button>
    </section>
    <section className="church-card review-room-card" aria-label="復習する問題">
      <div className="review-room-list-heading"><h3>記憶の書</h3><span>{questions.length} 問</span></div>
      <p className="review-room-guide">答えを見ずに、もう一度挑戦してみましょう。回答後に正解と解説が表示されます。間違えても HP は減りません。</p>
      {courseResult&&<p role="status">{courseResult}</p>}
      {filtered.length>0&&<button className="primary" onClick={()=>onStartCourse(filtered.slice(0,3))}>まとめて{Math.min(3,filtered.length)}問を復習する</button>}
      {questions.length>0&&<fieldset className="review-room-filters"><legend>復習する問題を選ぶ</legend>
        <label>分野<select aria-label="分野" value={subject} onChange={e=>setSubject(e.target.value)}><option value="all">すべての分野</option>{Object.entries(subjectLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
        <label>難易度<select aria-label="難易度" value={difficulty} onChange={e=>setDifficulty(e.target.value)}><option value="all">すべての難易度</option>{Object.entries(difficultyLabel).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
        <label>問題形式<select aria-label="問題形式" value={format} onChange={e=>setFormat(e.target.value)}><option value="all">すべての形式</option>{Object.entries(formatLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
        <button disabled={subject==='all'&&difficulty==='all'&&format==='all'} onClick={reset}>絞り込みを解除</button><p role="status">全{questions.length}問中 {filtered.length}問を表示</p>
      </fieldset>}
      {questions.length===0 ? <div className="empty-review"><span aria-hidden="true">✧</span><h3>復習する問題はありません</h3><p>思い出した知識を胸に、冒険を続けましょう。</p><button className="secondary" onClick={onLeave}>教会の本堂へ戻る</button></div> : filtered.length===0 ? <div className="empty-review"><h3>条件に合う問題はありません</h3><p>絞り込みを変えると、ほかの復習問題を表示できます。</p><button onClick={reset}>すべての復習問題を表示</button></div> : <div className="review-room-list">
        {filtered.map(q=><article className="review-room-question" key={q.id}>
          <span className="review-room-topic">{subjectLabels[subjectOf(q)]} · {difficultyLabel[q.difficulty]} · {formatLabels[q.kind]}</span>
          <h4>{q.prompt}</h4>
          <button className="primary" onClick={()=>onStart(q)}>答えを見ずに再挑戦する ▶</button>
          <details><summary>答えと解説を見る</summary><div className="review-room-explanation"><strong>答え：{q.reveal}</strong><p>{q.explanation}</p></div></details>
        </article>)}
      </div>}
    </section>
  </main>;
}
