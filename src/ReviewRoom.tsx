import type { Question } from './content';
import { WorldCharacter } from './WorldCharacter';
import './reviewRoom.css';

type Props = {
  questions: Question[];
  onStart: (question: Question) => void;
  onLeave: () => void;
};

export function ReviewRoom({ questions, onStart, onLeave }: Props) {
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
      {questions.length===0 ? <div className="empty-review"><span aria-hidden="true">✧</span><h3>復習する問題はありません</h3><p>思い出した知識を胸に、冒険を続けましょう。</p><button className="secondary" onClick={onLeave}>教会の本堂へ戻る</button></div> : <div className="review-room-list">
        {questions.map(q=><article className="review-room-question" key={q.id}>
          <span className="review-room-topic">{q.topic==='frontend' ? q.track==='vue'?'Vue':'React' : q.topic==='laravel'?'Laravel':'画面とサーバの連携'}</span>
          <h4>{q.prompt}</h4>
          <button className="primary" onClick={()=>onStart(q)}>答えを見ずに再挑戦する ▶</button>
          <details><summary>答えと解説を見る</summary><div className="review-room-explanation"><strong>答え：{q.reveal}</strong><p>{q.explanation}</p></div></details>
        </article>)}
      </div>}
    </section>
  </main>;
}
