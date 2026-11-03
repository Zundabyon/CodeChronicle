# 謎の騎士の会話肖像 v2

再利用する手順は[キャラクターの会話用画像](../production/uses/dialogue-portraits.md)、人物固有の特徴は[騎士の設定](../production/characters/knight.md)を参照する。以下はこの素材を採用した時点の履歴。

2026-11-03。最終指定はツノなし。マップ用の既存PNGは維持し、会話用の32×40簡易SVGを専用の細密な胸像PNGへ差し替えた。兜で顔を隠す特徴、青銀の鎧、紫のマント、金の留め具を共有する。

- 方法：組み込み `image_gen`、`transparent_background:true`。`game-art` と `imagegen` スキルを使用。
- 実際に渡した参照：`public/sprites/knight-generated-original.png`（人物のデザイン）、`public/portraits/faces.png`（既存肖像の絵柄と構図）。生成前に両方を目視。
- 採用画像：`public/portraits/knight-v2.png`、1086×1448 RGBA。原本を再保存・縮小せずコピー。
- 原本：`~/.codex/generated_images/01a15deb-bd58-7393-831e-330ef550345c/exec-85462bbb-093b-4e9f-9eb5-830b6cbea889.png`。
- 描画：`src/MysteriousKnight.tsx`。会話用viewBoxは `[0,78,1086,1352]`、比率を保って既存の112×150px（スマホ72×110px）枠へ表示。マップの位置・サイズ・イベント・当たり判定は維持。
- ツノ追加の試案は最終指定で取り下げ。ツノ付き画像はpublicへ残さず、ゲームから参照しない。
- 検証：ビルド・画像検査通過（既存10警告のみ）。Chromeで騎士登場の会話を開き、マップの旧PNGと新しい肖像PNGの参照・読み込み、PC/スマホの表示を確認。実行時エラーなし。スマホの肖像は72×110pxで表示。

## 採用画像の生成プロンプト

Use case: stylized-concept. Asset type: ONE production dialogue portrait for CodeChronicle, a cute finely detailed SFC-era JRPG. Input image 1 is the identity/design reference: the mysterious knight overworld sprite. Input image 2 is the STYLE and portrait composition reference only: the existing eight character dialogue portraits. Generate a NEW SINGLE chest-up dialogue portrait of the SAME mysterious knight, NOT a sprite sheet and NOT a full-body miniature. Preserve the closed silver blue-steel helmet with central vertical ridge, completely black horizontal visor, fully concealed face (no visible eyes or skin), dark purple scarf and cloak, silver shoulder plates, small gold cloak clasps. Proportions like a JRPG illustrated bust, not chibi. Helmet centered above shoulders, subtle three-quarter turn toward viewer's right, entire helmet and both shoulders visible, crop below the upper chest. Portrait composition roughly 3:4, subject fills the frame with a little clear margin. Match image 2's dense tiny crisp pixel-art clusters, rich multi-step material shading, delicate dither texture and dark blue-grey contour, cool armor highlights lit from upper left, detailed fabric folds, charming serious enigmatic demeanor. Must retain detail when displayed at 112x150 and 72x110 CSS pixels; avoid large chunky square blocks, flat vector shapes, plastic 3D, painterly blur, or simplified icon style. Genuine transparent alpha background; no backdrop, no ground, no text, no border, no watermark. The existing portraits are style reference only, do not copy or include their faces. Create exactly one knight portrait.
