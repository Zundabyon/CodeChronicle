# コードクロニクル ― コードの扉を開く者達

React・Vue・Laravelをクイズと2D RPGで学ぶ、PCブラウザ向けの試作です。ゲーム本体はReactとTypeScriptで実装しています。

## 起動

```bash
npm install
npm run dev
```

表示されたローカルURLをブラウザで開いてください。`npm run build` で本番用ビルドを確認できます。

## 遊び方

- タイトルの「学習設定」でReactまたはVue、難易度、Inertia環境の有無、主人公の名前を選べます。冒険中は「コマンド」から変更できます。
- 矢印キー・WASD、またはマップ上のクリックで移動します。画面は主人公を追ってスクロールします。Escでコマンド窓を開き、ステータスや目的を確認できます。敵のシンボルに接触すると戦闘になります。
- 4択やゲーム内CLIの問題に正解すると敵へダメージを与えます。回答後の解説は戦闘画面右側に表示されます。
- 町の教会ではHP・MPを回復し、間違えた問題の解説確認と再挑戦ができます。
- 敵と戦ってLV 2に達するとゲートガーディアンへ挑めます。倒すと、4択の誤答を一つ消す魔法「見極め」を覚えます。

進捗はブラウザの`localStorage`に自動保存されます。サーバーへの送信やアカウント登録はありません。

問題・物語・マップは [`src/content.ts`](src/content.ts)、ゲーム進行は [`src/App.tsx`](src/App.tsx)、探索画面は [`src/WorldScene.tsx`](src/WorldScene.tsx)、キャラクターの表示は [`src/PixelSprite.tsx`](src/PixelSprite.tsx) にあります。マップ素材と人物素材は `public/maps` と `public/sprites` にあります。
