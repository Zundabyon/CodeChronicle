import './saveStatus.css';

export function SaveStatus({failed,savedAt,onRetry}:{failed:boolean;savedAt:number|null;onRetry:()=>void}) {
  if(failed)return <aside className="save-status save-error" role="alert">
    <strong>自動保存できていません。</strong><p>この画面を閉じると、最後に保存できた後の進み具合が失われます。</p>
    <button onClick={onRetry}>保存を再試行</button>
  </aside>;
  return <small className="save-status" role="status" title={savedAt===null?'進み具合が変わったときに自動保存します。':`最終保存：${new Date(savedAt).toLocaleString('ja-JP')}`}>
    {savedAt===null?'変更時に自動保存':'自動保存済み'}
  </small>;
}
