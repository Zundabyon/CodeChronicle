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
- 序章の後は自宅から始まります。矢印キー・WASD、またはマップ上のクリックで移動します。町の家は玄関から入り、室内の出口から町へ戻れます。画面は主人公を追ってスクロールします。Escでコマンド窓を開き、ステータスや目的を確認できます。敵のシンボルに接触すると戦闘になります。
- 通常の敵と復習は4択、石版を守るボス戦はゲーム内CLIで回答します。正解すると敵へダメージを与え、回答後の解説は戦闘画面右側に表示されます。
- 町の教会ではHP・MPを回復し、間違えた問題の解説確認と再挑戦ができます。
- 敵と戦ってLV 2に達するとゲートガーディアンへ挑めます。倒すと、4択の誤答を一つ消す魔法「見極め」を覚えます。

進捗はブラウザの`localStorage`に自動保存されます。サーバーへの送信やアカウント登録はありません。

問題・会話と旧形式のマップは [`src/content.ts`](src/content.ts)、物語とゲーム進行は [`src/App.tsx`](src/App.tsx)、探索画面は [`src/WorldScene.tsx`](src/WorldScene.tsx)、主人公と住民のドット絵は [`src/WorldCharacter.tsx`](src/WorldCharacter.tsx) にあります。序章の場面画像は `public/prologue` にあります。

## 世界を構成するチップ

素材の定義と配置は独立しています。素材は [`src/world/catalog.ts`](src/world/catalog.ts) の4分類に登録し、マップは [`src/world/nativeMaps.ts`](src/world/nativeMaps.ts) に配置します。画像を移動・複製する必要はなく、既存の `public/maps`・`public/sprites` とSVGキャラを利用します。

| 分類 | 登録先 | 内容 |
| --- | --- | --- |
| 地形 | `terrainChips` | 草地、道、川・湖、海、砂地、山、遺跡の床・壁、室内の床 |
| 小物 | `propChips` | 木、サボテン、宝箱、タンス、ベッド、棚、飾り剣、道具掛け、灯り、看板 |
| 建物 | `buildingChips` | 家、教会、遺跡の門、建物の壁 |
| キャラ | `characterChips` | 主人公、住民、敵、ボス。役割・会話・戦闘情報は配置側に持たせる |

地形内の大分類は `terrainSets` で定義しています。草原・川・海・洞窟・山・砂漠・雪・奈落・宇宙・別世界・地獄・冥界・遺跡・室内を用意しています。雪・宇宙などの画像や新しいマップはまだ追加していません。地形セット名の追加と、そのセットに属するチップの追加は別の作業です。

### 素材を追加する

例えば椅子の画像を `public/maps/chair-64.png` に置いたら、同じ `catalog.ts` の `propChips` に以下を追加します。

```ts
chair: prop('椅子', image('chair-64.png')),
```

配置はマップの `props` に追加します。床は変更しません。同じ素材を複数の場所に使えますが、配置IDはマップ内で一意にします。

```ts
{ id: 'home-chair', chip: 'chair', x: 6, y: 3 },
```

地形は `terrainChips` に画像・色・通行可否・敵の移動可否を登録し、`terrain[y][x]` にそのIDを指定します。`connection` を `road`・`sand`・`water` にすると、同じ接続種別の隣接チップと境界を描き分けます。川と海は別のIDですが、水面同士として接続します。

小物・建物は `blockedCells` で配置座標に対する相対的な通行禁止マスを定義します。建物の画像サイズと通行禁止範囲は独立しており、入口だけ開けることもできます。小物を装飾として使う配置には `blocksMovement: false` を指定できます。

画像の表示サイズはマス単位の `visual.width`・`height` です。`anchor: { x: .5, y: 1 }` は画像の下中央を配置マスの下中央に合わせ、`{ x: 0, y: 0 }` は左上を合わせます。画像のピクセル数とは独立して設定できます。

### マップを作る・移行する

`nativeMaps.ts` の自宅が、新形式の実例です。`terrain` に地形の長方形配列、`props`・`buildings`・`characters` に配置、`events` に調べる／移動先への入口を定義します。

```ts
// 小物の配置と、調べたときの動作は独立している。
props: [{ id: 'dresser', chip: 'dresser', x: 3, y: 5 }],
events: [
  { id: 'dresser-event', x: 3, y: 5, trigger: 'interact',
    label: 'タンスを調べる', action: { kind: 'dresser' } },
  { id: 'exit', x: 5, y: 8, trigger: 'enter',
    label: '町へ出る', action: { kind: 'transition', to: 'town', position: { x: 4, y: 7 } } },
],
```

既存の動作は `dresser`・`church`・`transition` の3種類です。新しい仕掛けや宝箱の中身などの動作を追加する場合は、`MapAction` と `App.tsx` のイベント処理を追加します。素材を登録するだけで新しい動作が自動的に生まれるわけではありません。

キャラの配置は、例えば `{ id: 'assistant', chip: 'scholar', x: 7, y: 5, role: 'npc', npc: 会話データ }` の形です。敵には `role: 'enemy', enemy: 戦闘データ` を指定します。配置のIDと座標がゲーム側でも使用されます。既存の敵IDは倒した敵のセーブに使われるため、移行時に変更しません。主人公はセーブの現在位置から配置されます。

新しいエリアを追加する場合は `content.ts` の `Area` と `areaLabel` にID・名前を追加し、`nativeMaps.ts` にマップを登録します。旧形式の文字マップを用意する必要はありません。

`world/maps.ts` の `createWorldMap` は登録済みのチップ、地形の形、配置IDを検証し、通行判定・イベント・小地図用の情報を作ります。旧マップの文字解釈は同ファイルの `adaptLegacyMap` に集約しています。自宅以外の既存マップはこの変換を通して4分類として利用します。旧マップの歩ける木や敵の移動範囲は互換設定で維持し、新規配置の木は標準で通行を塞ぎます。

描画は `WorldChip.tsx` が素材の表示方法を読み、地面・足元の奥行き・頭上の3つのレイヤーで前後を決めます。分類と描画順は別なので、木・建物・キャラが同じ奥行き規則で重なります。地形の境界描画は `TerrainTile.tsx` が担当します。

### 検証

`npm test` で既存全マップの通行判定、入口・タンスのイベント、配置と素材の分離、敵の移動、画像パスを確認します。`npm run build` で型と本番用ビルドを確認します。
