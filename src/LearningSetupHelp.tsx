export function LearningSetupHelp() {
  return <aside className="learning-setup-help" aria-label="学習設定の選び方">
    <p><strong>迷ったら、React + TypeScript・初級・Inertia連携から。</strong><br/>どの道でもLaravelを学べます。設定は冒険中にも変更できます。</p>
    <details><summary>React・Vue・Inertia・APIって何？</summary>
      <p><strong>React / Vue</strong>：どちらも画面を作るための道具です。学びたい方、または使っている方を選びましょう。</p>
      <p><strong>Inertia連携</strong>：Laravelから画面へデータを渡す仕組みを使う道です。</p>
      <p><strong>API連携</strong>：画面からLaravelへ通信し、JSONなどのデータを受け取る道です。</p>
      <p>この選択で変わるのは出題内容です。ゲーム内で開発環境を用意する必要はありません。</p>
    </details>
  </aside>;
}
