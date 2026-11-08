# 小物・背景オブジェクトの動き

発光や揺れなど、装飾の動きを対象にする。歩行フレーム・敵の移動・通行判定・戦闘の結果確定とは別の仕組み。

## 共通部品と固有設定

| 管理するもの | 正本 |
|---|---|
| 動きの型・再生ポリシー・HTML/SVGの部品 | [ObjectMotion.tsx](../../../src/motion/ObjectMotion.tsx) |
| 発光・揺れのCSS | [objectMotion.css](../../../src/motion/objectMotion.css) |
| 背景に一致する拡大・切り抜き座標 | [ArtworkMotionLayer.tsx](../../../src/motion/ArtworkMotionLayer.tsx)、[artworkViewport.ts](../../../src/motion/artworkViewport.ts) |
| タイトルの光る対象・座標・周期・強さ | [titleMotion.ts](../../../src/titleMotion.ts) |
| 確認用画面 | [ObjectMotionHarness.tsx](../../../src/dev/ObjectMotionHarness.tsx) |

`glow`は透明度の変化、`sway`は小さな回転。`duration`と`delay`は秒、`strength`は0〜1。対象の外見・位置と、動きのプリセットは分ける。CSSの透明度・transformだけを変え、大面積のfilter・毎フレームのReact更新・タイマーは使わない。

```tsx
const playback = useObjectMotionPlayback();
<ObjectMotionScene active={playback.active}>
  <ObjectMotion motion={{ preset: 'sway', duration: 6, strength: 0.5 }}>
    <span>装飾用オブジェクト</span>
  </ObjectMotion>
</ObjectMotionScene>
```

SVGのグループには`as="g"`を指定する。部品は`aria-hidden`の装飾専用なので、ボタンや必要な説明文を中へ入れない。停止ボタンはSceneの外に置き、`playback.setEnabled`で変更する。

## 停止と保存

- 手動設定は`code-chronicle-object-motion`へ保存し、冒険セーブや音設定と分離する。保存できない環境でも画面は操作可能。
- 同じ画面内の複数の利用先と、別タブの設定変更へ同期する。
- `prefers-reduced-motion: reduce`とタブ非表示で静止。対象画面を離れると部品・イベント購読を破棄する。
- 発光の停止時は追加の光を透明にし、背景そのものへ戻す。演出を待ってゲームを開始する処理は置かない。

## 背景へ重ねる

座標は元画像のpxで指定する。`ArtworkMotionLayer`に元画像寸法とフレームのrefを渡す。フレームに`--art-position-x`、`--art-position-y`を百分率で設定し、画像の`object-position`にも同じ値を使う（未指定時は中央）。フレームのサイズ変更と画面のリサイズで再計測する。

タイトルは`object-fit: cover`と同じ拡大・切り抜きでSVGのviewBoxを求める。PC・スマホで画像の見せる範囲が変わっても、対象が動かない限り光も同じ対象へ重なる。画面比率だけでランタンの座標を置かない。背景読み込み失敗・元画像寸法不一致では演出を静止させる。

## 確認する

```bash
npm run dev:motion     # 発光・揺れ・タイトルの確認画面
npm run test:motion    # 停止・再開・切り抜き・既存タイトル操作
npm run measure:motion # 静止/再生の描画間隔と処理時間を比較
```

確認画面は通常ゲームの動作やセーブを変更しない。タイトル確認画面をクリックすると元画像の座標を表示できる。画像に光を追加するときの位置確認にも使える。部品画面で周期・強さを調整し、低いPC・縦長スマホ・横長スマホ・端末のモーション軽減で比較する。

測定はローカルheadless Chromiumのdevビルドで、通常条件と4倍CPU低速化を各3秒ずつ比較する。4倍低速化は実機スマホの測定ではない。値は環境に依存するためCIの合否しきい値にはしない。元の静止版とのバンドル差分、画像・動画の追加リクエスト、入力の応答も別に確認する。

対応状況：HTML/SVGの装飾は上記2プリセットを設定で再利用可能。タイトルは発光2対象を登録し、元画像座標の楕円とradialGradientで周辺への光を表す。ぼかしfilterや新規画像は使用しない。川やマントの動画、任意の素材の自動分割、歩行・戦闘の統合は未対応。既存オブジェクトへ自動適用はされない。
