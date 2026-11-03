# 記憶ダンジョン小物 v2

再利用する手順は[環境素材](../production/uses/environment-art.md)と[状態差分](../production/uses/state-variants.md)。以下は採用した素材と実際の生成指示の履歴。

2026-11-02。泉と封印扉の描き込みを既存の `props-atlas-v2.png` に合わせて更新。

## 見直した設定と設計意図

旧SVGは泉48×40px、扉32×48pxで、少数の平坦な色面のみ。既存の小物は井戸322×351pxなど、石目・苔・木目を描いた細密なラスタだった。この違いを、SVGの拡大ではなく新しい透過PNGの生成で揃えた。

- 組み込み `image_gen` を使用。CLI/APIへの切替なし。`transparent_background: true`。
- 既存アトラスを目視したうえで、SFC時代のRPGの細かいドット表現、斜め上からの視点、石/木の多段階の陰影、青灰色の輪郭を指定。画像生成ツールに存在しない quality/size 設定は追加していない。
- 泉と閉扉は新規生成。開扉は閉扉PNGを参照編集し、石枠・敷居・視点・キャンバス寸法を保持するよう指定した。
- 元PNGを縮小・加工せず保存。既存のatlas rendererで透明な余白を切り取り、`preserveAspectRatio` と pixelated 描画で表示する。
- 泉の論理サイズ1.6×1.4マス、扉1×1.45マス、anchor(0.5,1)、衝突範囲、回復と開錠のイベントは保持。
- 開/閉扉は同じcropを使用。開扉中央のalpha=0を確認。元画像には低alphaの生成残滓があるため、主要輪郭を含むcropを手動計測した。
- 旧SVGは元資料として保存。今後の細密小物は論理サイズと画像ピクセル数を独立管理し、数十pxの簡易図形で代用しない。

## 保存先と切り出し

|用途|public内パス|PNG原寸|crop [x,y,w,h]|
|---|---|---|---|
|泉|maps/props/memory-spring-v2.png|1346×1168|76,60,1196,1056|
|閉扉|maps/props/memory-door-v2.png|1041×1511|58,70,926,1336|
|開扉|maps/props/memory-door-open-v2.png|1041×1511|58,70,926,1336|

実装: `src/world/memoryPropArt.ts`、利用: `src/world/catalog.ts`。既存の `npm run check:art` が参照の存在、PNG原寸、crop範囲を検証する。

## プロンプト

### 泉 / 新規生成

Use case: stylized-concept. Asset type: ONE production transparent game prop sprite for a cute detailed SFC-era top-down RPG, matching finely textured wood crates, stone wells and potion shelves. Primary request: a magical healing fountain, a low circular grey limestone basin with turquoise blue water and a small central carved stone pedestal, three delicate crystal-clear cascading streams, a few tiny cyan sparkle pixels. Front-facing three-quarter top-down RPG orthographic view, not isometric diamond. Tight centered composition, entire object visible. Basin wide and squat, overall subject aspect ratio about 1.15:1. Hand-crafted dense pixel-art clusters, crisp tiny stair-step edges, individual stone blocks, subtle chips and moss, rich restrained 16-bit palette with 5-7 shaded tones per material, dark blue-grey outlines and warm stone highlights. Readable at 90px wide while retaining detailed stone and water texture. Match classic late 16-bit JRPG environmental sprites; no flat vector blocks or giant chunky pixels. Actual transparent alpha background, isolated object, no ground patch, no scene, no text, no border, no other props, no checkerboard drawn into image.

### 閉扉 / 新規生成

Use case: stylized-concept. Asset type: ONE transparent game prop sprite for a cute detailed SFC-era top-down RPG. Subject: CLOSED magical memory-seal doorway, a tall narrow rounded stone arch with weathered violet-grey individual masonry blocks and a chunky threshold; two warmly shaded aged walnut wood door leaves meeting at center, fine brass corner fittings and a luminous small cyan diamond seal between them. Doorway subject approximately 0.69 width to 1 height. Front-facing three-quarter top-down JRPG orthographic environmental sprite; straight front view of arch with slight visible stone top faces. Isolated entire object centered with ample transparent margin. Dense finely textured pixel-art clusters, tiny crisp stair-step edges, 5-7 shaded tones per material, dark blue-grey contour, warm wood grain, small cracks and subtle moss; high-detail late 16-bit RPG sprite consistent with textured stone wells and wooden crates. Readable at 64px wide, not giant chunky square blocks, no vector look, no smoothing. NO surrounding wall, ground patch, perspective room, labels, text, checkerboard or decorative background. Actual transparent alpha everywhere outside the arch.

### 開扉 / 閉扉PNG参照編集

Use case: precise-object-edit. Asset type: OPEN state of this exact production RPG doorway sprite. Edit target: attached closed doorway sprite. Change ONLY door state: remove the two closed wooden leaves from the opening so it is clearly passable; leave the entire opening genuinely transparent, with at most narrow wood edges recessed behind the pillars. The cyan lock is gone, and the carved diamond in the keystone has a subtle mint highlight indicating unlocked. Preserve the exact outer stone arch, masonry blocks, moss, perspective, outline silhouette, threshold stones, texture density, original canvas dimensions and pixel locations. Keep frame and threshold at the identical position, scale, width and height as original; do not widen or move them. This is a state change between matching sprites in a game. Retain detailed crisp SFC pixel art. Actual transparent alpha background outside object AND through opening, no black fill, no new ground, no scene, no text, no checkerboard.

## 生成元

組み込みツール出力の原本ディレクトリ: `~/.codex/generated_images/01a199d2-1ba7-7df2-b5d0-83c60f573464/`。

- 泉: `exec-d1e9ee69-c328-40fa-8fda-2df5b2dd44cf.png`
- 閉扉: `exec-49238945-1a7b-4e34-b6ad-389545e2cddd.png`
- 開扉: `exec-33925553-3255-4337-84e5-c8d56f570f8c.png`

プロジェクトは上表のpublicコピーを参照し、この生成元ディレクトリには依存しない。
