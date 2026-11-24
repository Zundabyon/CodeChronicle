# 調べられる立て看板 v1 制作記録

| 項目 | 内容 |
|---|---|
| 日付・対象・結果 | 2026-11-24。マップ小物の立て看板2種を制作。画像単体の受け入れ条件を満たす候補として採用。ゲーム内組み込みはClaude担当。 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/environment-art.md`、本Dispatchの固有仕様（同日参照）。 |
| 入力 | `public/maps/lesson-tablet-64.png`・`public/maps/chest-64.png`・`public/maps/undersea-wreck-64.png`を目視し、輪郭・陰影・木材・64pxでの情報量を比較。これら3枚は生成ツールには渡していない。告知版の編集には通常版の生成原画1枚を実際に渡した。最終プロンプトは下記。 |
| 制作方法 | 着手時に組み込み `image_gen.imagegen` が利用可能と確認。通常版を新規生成し、その原画を編集して告知版を生成。両方 `transparent_background: true`。API/CLI課金経路は使っていない。各原画1280×1280をmacOS `sips -z 64 64`で指定寸法へ縮小し、生成alphaを保持。輪郭や素材をコードで描画していない。 |
| 成果物 | `public/maps/signboard-64.png`、`public/maps/signboard-notice-64.png`。原画は下記。1枚1ファイル。 |
| 実測・登録 | 両方64×64、8-bit RGBA、alpha最小0・最大255。通常版：完全透明2132px／半透明1772px／不透明192px、非ゼロalpha bbox `(0,2,61,59)`。告知版：完全透明2082px／半透明1807px／不透明207px、bbox `(3,7,61,64)`（右下exclusive、微小alphaを含む）。全キャンバスを64pxで表示する素材。anchor/crop/catalog登録は変更していない。 |
| 確認 | 原画と最終64pxの両方を目視。二本の脚、横長板、木目、釘、通常版の紙跡、告知版の白紙3枚を確認。文字・偽文字・背景・地面・物体外の接地影がないことを確認。既存3素材と同じ64pxで比較し、茶色の輪郭と段階的な陰影、木材の情報量を確認。`sips`とPNGのIHDR/IDATを標準Pythonで読み実寸とalphaを検査。`npm run check:art`は293 PNG、93参照、14 terrain sets、10既知警告、0エラーでPASS。`npm run build`は成功（大きなJS chunkの警告あり）。 |
| 採否の理由 | 地面を含めず重ねる小物として透過し、木材の傷みと掲示紙の差分が64pxでも識別できる。板面には木目・節・裂け目と古紙の跡のみ、紙面は白紙。内容文は会話欄に任せる。 |
| 未実行の範囲 | 第三章序幕の浜辺・第四章の関所街への登録、調べる操作、PC/スマホ実画面、到達性と通行はClaude担当の組み込み後に検証する。`src/`と`docs/production/records.md`は編集していない。 |
| 次回への反映 | 今回固有の制作記録に留め、共通仕様は変更しない。 |

## 原画

- 通常版：`/Users/ogasawarayuki/.codex/generated_images/01a20dea-3a2c-7e31-9bc1-5f365b505314/exec-886e3b38-0b44-46dd-8284-0bdca7f66740.png`
- 告知版：`/Users/ogasawarayuki/.codex/generated_images/01a20dea-3a2c-7e31-9bc1-5f365b505314/exec-6d559ba0-5b62-4096-a592-6cb921ef6418.png`

## 最終プロンプト：通常版

```text
Use case: stylized-concept. Create ONE standalone game map prop sprite for CodeChronicle, a detailed cute 16-bit SFC-era fantasy RPG. A weathered wooden signboard with TWO upright stake legs and a wide horizontal rectangular board made of 3 planks. Slightly salt-worn coastal wood, warm desaturated brown with subtle gray worn grain, a few tiny dark nail heads and old paper residue patches. Absolutely NO text, no letters, no numbers, no pseudo-writing, no runes, no drawn lines resembling handwriting, no emblems. Board is essentially plain bare wood. Elevated RPG map viewpoint, see narrow top edges and front face, horizontal board edges not isometric diamond. Upper-left light, shaded right/bottom material edges, crisp deliberate pixel clusters and dark brown outline, dimensional detailed wooden texture comparable to small shaded RPG treasure chest sprites. Single centered entire object, board fills about 80% canvas width, two stake feet end near 90% canvas height, generous transparent margin, square canvas. Intended final output 64x64 pixels; make legible at that resolution, pixel-art rather than a realistic rendering. TRUE transparent background, isolated cutout. NO ground, no terrain, no pebbles, no grass, NO cast/drop shadow underneath the object, no background color or checkerboard baked into image. One object only, not a sheet, not a montage.
```

## 最終プロンプト：告知版

入力：通常版の生成原画を `referenced_image_paths` で指定。

```text
Use case: precise-object-edit. Edit this signboard sprite to make its notice-board variant for the SAME fantasy RPG. Keep exactly the same wood signboard, silhouette, two upright stake legs, pixel-art rendering, colors, upper-left light, viewpoint, framing and transparent background. Add THREE overlapping faded parchment paper sheets tacked to the center of the wooden board, aged ivory and pale beige, a few curled/torn corners, small dark nail heads, subtle paper shading; each sheet is entirely BLANK. No text whatsoever, no lettering, no numbers, no fake writing, no scribbles, no horizontal text lines, no runes, no symbols, no portraits or pictures. This is a notice board but all readable content is supplied in game dialogue, never painted into the sprite. Preserve natural wood wear around the papers. True alpha transparency, no floor, no background, no terrain, no cast shadow outside the object. ONE object only. Intended final size 64x64, ensure paper silhouettes remain readable at tiny size.
```

