# 第三章「海底の古道」環境素材 v2

制作日: 2026-11-24。Task: task_b9cceaf1351a。結果: 素材8枚を採用候補として納品。

## 対象・使った仕様

明るい青緑の海底から、黒に近い緑・濁った青・錆の茶を使う、暗く湿った古い地下道へ変更。細かく可愛いSFC時代のRPGの画風を維持し、流血・内臓を使わず、苔・カビ・泥・ぬめり・水滴と朽ちた小物で不気味さを表した。

参照仕様（2026-11-24時点）: `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/environment-art.md`、`docs/production/templates/record.md`。前版記録: `docs/art/chapter-three-undersea-v1.md`。

目視した既存画像: `public/maps/undersea-floor-64.png`、`undersea-wall-64.png`、`undersea-deco-a-64.png`、`undersea-deco-b-64.png`（すべて public/maps/）。役割は旧版の色・密度・用途の把握。生成入力へ画像は渡していない。

## 制作方法・版

着手時に組み込み `image_gen.imagegen` の利用可否を確認し、利用可能だったため、1素材につき1回、合計8回の個別生成を実行。原画は各1枚1ファイル。API/CLI課金経路は使用していない。床・壁は `transparent_background:false`、小物6枚は `true`。原画は保持し、`sips -z 64 64` で納品寸法に変換した。描き足しや背景の自動除去はしていない。

床・壁は同名でv1を差し替え。旧版の原画パスはv1記録に保持されている。既存deco-a/bは変更していない。

## 成果物・実測

|納品ファイル|版|実寸|alphaチャンネル|alpha範囲|原画|
|---|---|---|---|---|---|
| `public/maps/undersea-floor-64.png` | v2・同名差し替え | 64×64 | なし | 255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-845485e3-8fa6-470b-ace2-5984b49ef73f.png` |
| `public/maps/undersea-wall-64.png` | v2・同名差し替え | 64×64 | なし | 255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-161f8ae1-b41a-4fe4-87a9-12f2b290529d.png` |
| `public/maps/undersea-drip-64.png` | v1・新規 | 64×64 | あり | 0〜255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-79a5ee23-8fa2-48c4-8979-3b06055c649e.png` |
| `public/maps/undersea-bones-64.png` | v1・新規 | 64×64 | あり | 0〜255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-740705fc-baf7-4a1f-aa75-5fbf36292c3a.png` |
| `public/maps/undersea-wreck-64.png` | v1・新規 | 64×64 | あり | 0〜255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-ae891cb8-ee21-4992-ab4c-0d234a6d79a1.png` |
| `public/maps/undersea-books-64.png` | v1・新規 | 64×64 | あり | 0〜255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-5692ac93-ad02-4eb4-9542-1ffe577da0c7.png` |
| `public/maps/undersea-eyes-64.png` | v1・新規 | 64×64 | あり | 0〜255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-95e64873-c17f-4bba-a88e-d0a17db0bbe1.png` |
| `public/maps/undersea-chains-64.png` | v1・新規 | 64×64 | あり | 0〜255 | `/Users/ogasawarayuki/.codex/generated_images/01a20bd1-5c8a-77e0-aca6-06bf4e3c8bfa/exec-900b2ac9-324d-463a-a8a7-bbafc3df1745.png` |

全画素alphaはNSBitmapImageRepで実測。cropなし、原画全域を正方形に縮小。anchor・登録・配置コードは本依頼の編集範囲外のため変更していない。

## 確認・採否

- 納品実寸8枚を個別に目視。床は濡れて黒ずんだ石と泥、壁は苔と湿った岩の起伏が読める。泥水の滴と小さな水たまり、古骨と頭蓋、朽ちた船材、傷んだ本、暗い影と三組の小さな目、錆びた鎖をそれぞれ確認した。
- 床・壁を各3×3に敷き詰めた確認画像を目視。目立つ直線の明暗境界・隙間・タイル枠は見られない。単一タイル固有の模様の反復は残る。
- 小物6枚を灰色背景に重ねて目視。不透明な矩形背景、チェック柄、床タイルや地面の焼き込みは見られない。dripの水たまり自体は指定された小物の一部。eyesは影の塊の内部が暗く不透明で、その外側が透過する。
- 文字・偽文字・ロゴ・透かし・流血・内臓は見られない。本のページは短い材質の線で、文字列として並ぶ模様はない。小物のシルエットは画面内に収まっている。
- `npm run check:art`: PASS、291 PNG headers、89 asset references、14 terrain sets、既存警告10、エラー0。
- `npm run build`: PASS。500kB超のバンドル警告あり。
- 検査用一時画像: `/private/tmp/undersea-v2-review.png`。実測結果: `/private/tmp/undersea-v2-audit.json`。これらは納品素材ではない。
- 共有作業場所で他担当の変更があるため、検査件数はその時点の作業ツリーに対する結果。既存の他担当変更には触れていない。

8枚を採用候補として返却。ゲーム内での配置・PC/スマホの実画面・到達性は組み込み担当の確認が必要。暗い影の目と水滴は小さいため、ゲームの床上でも読み取れるか実画面で確認する。srcおよびdocs/production/records.mdは編集していない。commit/pushなし。

## 最終プロンプト

以下はそれぞれ実際に渡した全文。参照画像入力はなし。

### floor

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. Wet blackened ancient cobblestone FLOOR texture, small irregular stones separated by muddy slime, sparse shallow dark puddles. Entire square opaque and filled edge-to-edge with floor material. Perfectly seamless repeating tile wrapping both axes, uniform edge brightness, no vignette, no central motif, no objects, no raised wall. Make subtle stone detail readable in darkness.
```

### wall

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. Damp rough old rock WALL texture encrusted with dark moss and mold, thin vertical trickles of seeping dirty water, rust-brown damp mineral stains. Entire square opaque filled edge-to-edge with stone wall. Perfectly seamless repeating tile wrapping both axes, uniform edge brightness, no vignette, no cap or floor, no isolated central object.
```

### drip

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. One isolated prop: thin dirty water drips descending from above with four suspended droplets and a small shallow muddy puddle below. Only the drips and puddle, no ceiling, no floor tile, no ground patch. Compact silhouette, 5% transparent margins; real transparent background.
```

### bones

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. One isolated compact little heap of old yellow-gray bones and one small skull, slightly moss-stained and damp. Eerie but cute, harmless old remains, no blood, no flesh, no gore. No ground patch, no floor, real transparent background, all bones inside frame with 5% margin.
```

### wreck

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. One isolated compact cluster of decayed broken ship timbers: three splintered brown planks, small rusty nail heads and damp dark moss. No ship scene, no anchor, no ground patch or floor. Real transparent background, entire silhouette inside with 5% margin.
```

### books

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. One isolated compact heap of three waterlogged rotting old books, swollen ragged unmarked pages, dark moldy brown covers, muddy desaturated blue-green damp stains. No writing anywhere on covers or pages. No shelf, floor or ground patch. Real transparent background, 5% clear margin.
```

### eyes

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. One isolated low irregular mass of almost-black green shadow with three pairs of tiny dim pale-yellow glowing eyes peering out, eerie but cute. Eyes small and readable, no mouths, no defined monsters, no scenery or floor. Real transparent background around the shadow silhouette, all inside 5% clear margin.
```

### chains

```text
Use case: stylized-concept. ONE single asset, never a sprite sheet. Finely detailed cute SFC-era Japanese RPG pixel art, crisp small pixel clusters, intended final 64x64 map asset. Slightly overhead map view, dim upper-left light. Oppressive damp ancient underground tunnel, near-black moss green, muddy desaturated blue and rusty brown, restrained highlights; no bright cyan, coral, ocean scenery, lettering, pseudo-text, border, watermark, blood or gore. One isolated rusty brown iron wall chain prop, two unequal dangling strands with clearly articulated small corroded oval links hanging from a tiny iron mounting loop. No wall slab or ground or scenery. Real transparent background, full silhouette visible inside 5% clear margin.
```

## 次回への反映

今回の暗色・湿潤表現は海底の古道固有の方向性として残す。共通仕様の変更は行わない。

