import type { DialogueLogEntry } from './dialogueLog';
export function DialogueHistoryPanel({entries}:{entries:DialogueLogEntry[]}){
  return <details className="learning-records"><summary>会話・物語の履歴</summary><p>実際に読んだ会話を新しい順に100件まで残します。読み返しても出来事は再実行しません。</p>{entries.length===0?<p>まだ会話の履歴はありません。</p>:<div className="learning-record-list">{[...entries].reverse().map((entry,i)=><article key={`${entry.at}-${i}`}><strong>{entry.speaker||'語り手'}</strong><p>{entry.text}</p><small>{new Date(entry.at).toLocaleString('ja-JP')}</small></article>)}</div>}</details>;
}
