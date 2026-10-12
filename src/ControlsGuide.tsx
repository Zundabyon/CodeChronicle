export function ControlsGuide({onClose}:{onClose:()=>void}) {
  return <div className="modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section className="controls-guide retro-window" role="dialog" aria-modal="true" aria-labelledby="controls-title">
      <h2 id="controls-title">操作方法</h2>
      <p>キーボードでもマウスでも冒険できます。</p>
      <dl>
        <div><dt><kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> / WASD</dt><dd>探索中：主人公を移動</dd></div>
        <div><dt><kbd>Enter</kbd></dt><dd>隣の人と話す・タンスや宝箱を調べる。複数あるときは最後に移動した方向を優先</dd></div>
        <div><dt><kbd>Enter</kbd> / <kbd>Space</kbd></dt><dd>会話を次へ進める</dd></div>
        <div><dt><kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd></dt><dd>選択肢・メニュー・ボタンの選択を移動</dd></div>
        <div><dt><kbd>Enter</kbd> / <kbd>Space</kbd></dt><dd>選択中のボタンを決定。Tab / Shift + Tab でも選択できます</dd></div>
        <div><dt><kbd>Esc</kbd></dt><dd>探索中：コマンドを開く・閉じる。操作ガイドや持ち物などの画面を閉じる</dd></div>
        <div><dt>クリック</dt><dd>マップ上の目的地へ移動。人・タンス・宝箱をクリックすると近づいて話す・調べる。扉には歩いて入れます</dd></div>
        <div><dt><kbd>A</kbd> <kbd>B</kbd> <kbd>C</kbd> <kbd>D</kbd></dt><dd>戦闘の選択肢を直接回答（入力欄では文字入力）</dd></div>
        <div><dt><kbd>I</kbd> / <kbd>F2</kbd></dt><dd>戦闘・コマンドから持ち物を開く</dd></div>
        <div><dt><kbd>M</kbd> / <kbd>F3</kbd></dt><dd>戦闘で見極めの魔法を使う（習得後）</dd></div>
        <div><dt><kbd>H</kbd> / <kbd>F4</kbd></dt><dd>ボス戦のヒントを見る</dd></div>
        <div><dt><kbd>N</kbd> / <kbd>R</kbd></dt><dd>回答後に次へ進む / 復習の戦いから部屋へ戻る</dd></div>
        <div><dt><kbd>F1</kbd></dt><dd>操作ガイドを開く・閉じる</dd></div>
      </dl>
      <p className="controls-note">入力中もF2〜F4の操作が使えます。入力欄では通常どおり文字を編集できます。戦闘の入力問題はEnterで回答します。</p>
      <button onClick={onClose}>冒険へ戻る <small>Esc</small></button>
    </section>
  </div>;
}
