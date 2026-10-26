import { questions } from './content';
import type { LearningRecords } from './learningRecords';
import './learningRecords.css';
const topicLabel=(id:string)=>{const q=questions.find(q=>q.id===id);return !q?'門の復旧':q.topic==='frontend'?q.track==='react'?'React':q.track==='vue'?'Vue':'共通の基礎':q.topic==='laravel'?'Laravel':'画面とサーバの連携';};
export function LearningRecordPanel({records}:{records:LearningRecords}) {
  const entries=Object.entries(records).sort((a,b)=>b[1].lastAnsweredAt-a[1].lastAnsweredAt);
  const topics=new Map<string,{answers:number;wrong:number}>();
  for(const [id,r] of entries){const label=topicLabel(id),total=topics.get(label)??{answers:0,wrong:0};topics.set(label,{answers:total.answers+r.normalAttempts+r.reviewAttempts,wrong:total.wrong+r.wrongCount});}
  return <details className="learning-records"><summary>問題ごとの学習記録</summary><p>記録を始めてからの成績です。過去のセーブから初回の成績を推測することはありません。</p>
    {entries.length===0?<p>まだ記録がありません。問題に答えると記録されます。</p>:<><h3>苦手分野の手がかり</h3><ul>{[...topics].sort((a,b)=>b[1].wrong/b[1].answers-a[1].wrong/a[1].answers).map(([label,total])=><li key={label}>{label}：{total.answers}回答中 {total.wrong}回誤答</li>)}</ul><div className="learning-record-list">{entries.map(([id,r])=><article key={id}><h4>{questions.find(q=>q.id===id)?.prompt??'門の復旧問題'}</h4><p>通常 {r.normalCorrect}/{r.normalAttempts}正解 · 復習 {r.reviewCorrect}/{r.reviewAttempts}正解 · 誤答 {r.wrongCount}回</p><p>初回の通常回答：{r.firstNormalCorrect===undefined?'未記録':r.firstNormalCorrect?'正解':'誤答'}<br/>最終回答：{r.lastAnsweredAt?new Date(r.lastAnsweredAt).toLocaleString('ja-JP'):'時刻情報なし'}</p></article>)}</div></>}
  </details>;
}
