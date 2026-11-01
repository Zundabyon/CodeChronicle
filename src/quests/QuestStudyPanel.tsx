import type { QuestStudy, TableSnapshot } from './studyTypes';

const purposes={index:'一覧を表示',show:'1件の詳細を表示',create:'登録フォームを表示',store:'検証して新規保存',edit:'編集フォームを表示',update:'検証して変更を保存',destroy:'対象の記録を削除'};
function StudyTable({table,label}:{table:TableSnapshot;label:string}) {
  return <div className="quest-study-table" tabIndex={0} onKeyDown={event=>event.stopPropagation()} aria-label={label}><table><caption>{label}</caption><thead><tr>{table.columns.map((column,index)=><th key={index} scope="col">{column}</th>)}</tr></thead><tbody>{table.rows.map((row,index)=><tr key={index}>{row.map((value,i)=><td key={i}>{value}</td>)}</tr>)}</tbody></table>{table.rows.length===0&&<p>該当する記録はありません。</p>}</div>;
}
export function QuestStudyPanel({study,answered,correct}:{study:QuestStudy;answered?:boolean;correct?:boolean}) {
  return <section className="quest-study" aria-label="試練の実習">
    <span className="quest-study-badge">{study.mode==='checkpoint'?'応用の関門':'記憶の実習'}</span>
    <p><strong>目標：</strong>{study.objective}</p>
    {study.request&&<p className="quest-study-request">依頼：{study.request}</p>}
    {study.before&&<StudyTable table={study.before} label="操作前のDBの状態（教材例）"/>}
    {answered&&correct&&<div className="quest-study-result" role="status">
      {study.action&&<strong><code>{study.action}</code> — {purposes[study.action]}</strong>}
      {study.after&&<StudyTable table={study.after} label="操作後のDBの状態（教材例）"/>}
      <p>{study.result}</p>
    </div>}
    <small>表とコードは学習用の例です。実際の PHP 実行や DB 接続は行いません。</small>
  </section>;
}
