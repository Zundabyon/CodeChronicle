import { useState } from 'react';
import type { Question } from './content';
export function BookPractice({question,onClose,onAnswer}:{question:Question;onClose:()=>void;onAnswer:(correct:boolean)=>void}) {
  const [selected,setSelected]=useState<number|null>(null);
  return <section aria-label="本の確認問題"><h3>読んだ内容を確かめる</h3><p>HP・所持金・経験値は変わりません。結果は学習記録の復習欄に残ります。</p><h4>{question.prompt}</h4>
    <div className="library-books">{question.options?.map((option,i)=><button key={i} disabled={selected!==null} onClick={()=>{setSelected(i);onAnswer(i===question.answer);}}>{option}</button>)}</div>
    {selected!==null&&<div role="status"><strong>{selected===question.answer?'正解！':'もう一度、本で確かめてみよう。'}</strong><p>答え：{question.reveal}</p><p>{question.explanation}</p><button onClick={()=>setSelected(null)}>もう一度解く</button></div>}
    <button onClick={onClose}>元の本へ戻る</button>
  </section>;
}
