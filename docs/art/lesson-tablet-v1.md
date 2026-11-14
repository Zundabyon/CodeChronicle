# 解説の石板 v1 制作記録

| 項目 | 内容 |
| --- | --- |
| 日付・対象・結果 | 2026-11-14。`lesson-tablet-64.png`。記憶ダンジョンの脇道に置く解説用小道具として採用。 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/environment-art.md`（2026-11-14参照）。 |
| 入力 | `public/maps/lantern-64.png`（局所光、輪郭、密度）、`public/maps/shelf-64.png`（64px小物の密度、接地）、`public/maps/dungeon-ground.png`（石材色と左上光源。床自体は描画しない）を参照画像として使用。 |
| 制作方法 | 組み込み `image_gen` で透過PNGを1枚生成。生成原画を `sips` で64×64へ縮小し、alphaを維持。 |
| 成果物 | `public/maps/lesson-tablet-64.png`。組み込み生成原画: `/Users/ogasawarayuki/.codex/generated_images/01a1d7c0-9ac5-7182-9a2f-ca306788a5fe/exec-1a382848-92b7-443c-86d2-fff6a013119d.png`。版: v1。 |
| 実測・登録 | 64×64px、RGBA、alphaあり（最小0、最大255）。非透明領域は35×48px、左14px・上7pxから始まる。コード登録・crop・anchor変更は未実施。 |
| 確認 | 原寸目視で、古い石材、左上の明部、右下の暗部、淡い青緑の抽象刻印、透過余白、地面なし、単体構図を確認。`node scripts/check-art-assets.mjs` は126 PNG・63参照・14 terrain sets、既知警告10、エラー0でPASS。ゲーム内表示は統合前のため未実施。 |
| 採否の理由 | 中立的な灰紫の石色で4ダンジョンへ展開可能。64pxでも立て板の輪郭と発光刻印が判別でき、実在の文字・環境固有物・床を含まない。 |
| 次回への反映 | 石板固有の制作記録として保持。共通仕様への追加はなし。 |

## 最終プロンプト

```text
Use case: stylized-concept
Asset type: CodeChronicle 64x64 world-map prop sprite, a readable explanation tablet for a memory dungeon side path
Input images: Image 1 (lantern-64.png) reference for pixel density, dark outline, left-upper lighting and small-prop readability; Image 2 (shelf-64.png) reference for 64px prop scale, material detail and bottom anchoring; Image 3 (dungeon-ground.png) reference only for compatible neutral stone palette and lighting context, do not include the floor
Primary request: Create one standalone ancient upright stone lesson tablet, slightly wider at the base, worn edges and a few restrained cracks. Carve several short abstract rune-like grooves that are explicitly unreadable symbols, not real writing; the grooves emit a very faint cool cyan-blue glow. The stone must be neutral desaturated gray with subtle blue-violet and warm-gray variation so it fits forest workshop, lake library, mountain corridor, and desert tomb dungeons equally.
Style/medium: finely detailed cute 16-bit-era JRPG pixel art, crisp deliberate pixel clusters, matching the references at actual 64x64 display; no antialias blur, no painterly rendering
Composition/framing: single object centered in a square canvas, three-quarter top/front view consistent with the existing map props; fully visible with transparent padding, bottom anchored, compact silhouette, occupy about 44px wide by 54px high within the final 64x64 canvas
Lighting/mood: primary light from upper left; brighter top and upper-left ridges, darker right/lower faces and contact area; the rune glow is local and subtle, never overpowering
Materials/textures: old dense stone, chipped corners, shallow carved grooves, stepped pixel shading
Constraints: genuine transparent background; no ground, no floor tile, no scenery, no vegetation, no pedestal platform extending outside the object, no cast shadow detached from the object; exactly one tablet; no actual letters, numbers, words, logos, watermark, border, frame, UI, or extra object
Avoid: isometric diamond tile, front-on flat icon, gravestone shape, religious symbols, neon glow, saturated environment-specific colors, smooth vector art, large empty margins
```
