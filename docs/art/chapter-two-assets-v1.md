# 第二章の人物・小物画像 v1 制作記録

## 日付・範囲・状態

2026-11-13。[Claudeの画像依頼](../production/chapter-two-art-request.md)に基づき、会話アトラス1枚、マップ人物6枚、戦闘人物5枚、小物5枚の計17枚を生成した。**画像引き渡し用の候補として保存済み。src登録・ゲーム内表示確認・最終採用はClaude担当で未実施。**

[一覧プレビュー](chapter-two-assets-v1-preview.png)と[生成指示・参照・原画パス・実測metadata](chapter-two-assets-v1.prompts.json)を付属する。プレビューは比較用で、本番素材ではない。

## 入力と制作方法

- 使用仕様：[美術基準](../art-direction.md)、[会話画像](../production/uses/dialogue-portraits.md)、[マップ画像](../production/uses/map-sprites.md)、[戦闘画像](../production/uses/combat-art.md)、[環境素材](../production/uses/environment-art.md)、[状態差分](../production/uses/state-variants.md)。
- 全画像は組み込み `image_gen.imagegen` で生成または参照編集した。API/CLIへの切替はしていない。透過指定の16枚は `transparent_background: true`、会話アトラスは背景付きで生成。
- 実際に画像を目視し、`faces.png` を会話の絵柄・構図、`elder-64.png` と `child-64.png` をマップの大きさと密度、`guardian-right.png` を戦闘の密度と右向き、`lantern-64.png` を小物と消灯編集の基準として生成へ渡した。`knight-v2.png` は識別上の比較のため目視したが生成入力には渡していない。
- 最初に会話アトラスを作り、各人物のマップ・戦闘画像にはそのアトラスを人物同定用として渡した。ケシとフミの各2表情を同じアトラス内に配置。
- 各プロンプト・補正プロンプトは付属JSONに記録。初回会話アトラスの `prompt` は指示の要約で、人物の全指定は依頼書も参照する。以降の生成・補正は渡した指示文を記録している。
- 生成原画はJSONの `source`／`previousSource` に示す生成ツール既定の保存先に保持。今回の候補画像は指定どおりプロジェクト内へ保存した。

## 成果物

| 用途 | 保存先 | 実寸・背景 |
| --- | --- | --- |
| 会話8コマ | [chapter-two-faces-v1.png](../../public/portraits/chapter-two-faces-v1.png) | 1536×1024、4×2、各384×512、紺背景 |
| グラフィウス・マップ | [graphius-64.png](../../public/sprites/graphius-64.png) | 64×64、透過 |
| ノゾミ・マップ | [ranger-read-64.png](../../public/sprites/ranger-read-64.png) | 64×64、透過 |
| ツクネ・マップ | [ranger-create-64.png](../../public/sprites/ranger-create-64.png) | 64×64、透過 |
| ヌリエ・マップ | [ranger-update-64.png](../../public/sprites/ranger-update-64.png) | 64×64、透過 |
| ケシ・マップ | [ranger-delete-64.png](../../public/sprites/ranger-delete-64.png) | 64×64、透過 |
| フミ・マップ | [fumi-64.png](../../public/sprites/fumi-64.png) | 64×64、透過 |
| グラフィウス・戦闘 | [graphius-right.png](../../public/sprites/graphius-right.png) | 1254×1254、透過、右向き |
| ノゾミ・戦闘 | [ranger-read-right.png](../../public/sprites/ranger-read-right.png) | 1254×1254、透過、右向き |
| ツクネ・戦闘 | [ranger-create-right.png](../../public/sprites/ranger-create-right.png) | 1254×1254、透過、右向き |
| ヌリエ・戦闘 | [ranger-update-right.png](../../public/sprites/ranger-update-right.png) | 1254×1254、透過、右向き |
| ケシ・戦闘 | [ranger-delete-right.png](../../public/sprites/ranger-delete-right.png) | 1254×1254、透過、右向き |
| 帰還点・有効 | [return-point-64.png](../../public/maps/return-point-64.png) | 64×64、透過 |
| 帰還点・無効 | [return-point-off-64.png](../../public/maps/return-point-off-64.png) | 64×64、透過 |
| ランタン・消灯 | [lantern-unlit-64.png](../../public/maps/lantern-unlit-64.png) | 64×64、透過 |
| 裂かれた名簿 | [torn-pages-64.png](../../public/maps/torn-pages-64.png) | 64×64、透過 |
| 翡翠の絵の具 | [paint-splash-64.png](../../public/maps/paint-splash-64.png) | 64×64、透過 |

会話セルは上段左からグラフィウス／ノゾミ／ツクネ／ヌリエ、下段左からケシ無表情／ケシためらい／フミ不安／フミ涙。キャラクターの輪郭と服・持ち物を用途間で比較した。グラフィウスは紫系の初回出力を不採用とし、黒〜濃紺へ補正した。

## 仕上げと確認

- 64px素材は原画を最近傍で縮小。紙片だけ原画が1536×1024だったため、縦横比を維持し64×64へ透過余白付きで収めた。戦闘原画は指定と同じ1254×1254。
- 帰還点OFFはON原画の参照編集。64pxでalpha>127の輪郭境界矩形は両方 `[21,21,43,44]` と一致。光の有無を比較し、キャンバスと位置が揃っていることを目視した。全画素同一の輪郭まで保証する数値検査ではない。
- ランタンは元絵を参照して消灯編集した後、AI出力の消灯内部だけを元絵の `x26,y28,width12,height12` へ合成した。変更範囲外はRGBA全画素が元画像と一致し、外枠・位置・キャンバスを維持している。
- 会話アトラスの色補正結果には意図しないケシの服の変化があったため、その全体は不採用。補正後のグラフィウスの左上384×512セルだけを初回アトラスへ合成した。残る7セルのRGBA画素が初回と完全一致することを確認した。
- 17枚すべての寸法をデコードして確認。透過指定の16枚すべてにalpha=0の背景とalpha>=250の描画部分が存在する。alpha>127の描画部分が画像端へ接していないことを確認した。透過に伴う半透明の輪郭は保持。
- 既存の村人と新規マップ人物を64px基準で並べ、頭部・足・道具が収まり、レンジャーの色と持ち物、フミの三つ編み・帳面、グラフィウスの羽ペン・帳簿が識別できることを目視した。プレビューには既存村人2人・既存ランタンも比較用として含む。

これらはファイルと静的比較の確認。ゲーム内のマップ・会話・遭遇・戦闘、PC/スマホでの表示確認やcrop/anchor登録は未実施。PNGの寸法・alpha検査を、美観や全表示経路の最終合格と同一視しない。

## Claudeへの引き渡し

依頼の指定パスに17枚が揃っている。既存画像と今回の参照原画は上書きしていない。新しい原画・画像の存在だけで人物の出現や会話・戦闘対応が完成したとは扱わない。

次はClaudeが `src/` の画像参照・会話セル・人物のマップと戦闘画像を登録し、実表示サイズで輪郭・密度・足元・余白・状態切替を確認する。`npm run check:art` と必要なビルド・表示確認を行い、採否をこの記録へ追記する。個別のcrop/anchor等は実行コードへ置く。追加の攻撃・歩行コマ、台本、問題本文は今回制作していない。

> 2026-11-14 更新：ユーザー指示により、まとめ画像（`chapter-two-faces-v1.png`・`chapter-two-standing-v1.png`・`chapter-two-attack.png`）は1枚ずつに分割した。現在の素材は `public/portraits/chapter-two/face-*.png`・`standing-*.png` と `public/prologue/chapter-two/attack-{sky,fire,rangers,final}.png`。新しい素材も1キャラ・1ポーズ・1場面ごとに1ファイルで作る。
