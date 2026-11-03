# CRUDダンジョンの敵：新規ドット絵 v1

再利用する手順は[マップ用画像](../production/uses/map-sprites.md)と[攻撃・戦闘表現](../production/uses/combat-art.md)。以下はこの敵アトラスの制作履歴。

Built-in image_genで透明な一枚のアトラスとして生成。生成後の画像加工は行わず、SVGのviewBoxでキャラクターごとの表示範囲を指定して使用する。

- 画像：public/sprites/memory-dungeon-enemies-v1.png（1086×1448、RGBA、12種類）
- 座標：src/world/memoryEnemyArt.ts
- 戦闘・遭遇：src/EnemySprite.tsx
- マップ：src/WorldScene.tsx → WorldChipのatlas描画
- 既存の敵画像は残し、第二章のmemory-*の敵だけ専用デザインへ切り替える。

## 生成プロンプト

Use case: stylized-concept.
Asset type: ONE production-ready transparent pixel-art sprite atlas for an original Japanese educational RPG, Code Chronicle. This is one sprite-sheet asset consumed as a 3-column by 4-row texture atlas.
Create exactly twelve different charming monsters, each occupying exactly one cell of an evenly divided THREE COLUMNS by FOUR ROWS grid. Canvas portrait aspect ratio 3:4. Every cell is square, same size. Align the centers precisely to cell centers at x=1/6, 1/2, 5/6 and y=1/8,3/8,5/8,7/8 of the whole canvas. Each sprite fits completely inside the inner 75% of its cell, leaving transparent margins. No borders, text, labels, shadows outside sprites, UI, ground planes, scenery or extra creatures.
Style: authentic cute but mischievous 1990s 16-bit SNES JRPG monster pixel art, strong readable silhouettes, crisp square pixel clusters, restrained 12-20 colors per creature, dark plum outlines, hand-dithered highlights, no smooth vector curves, no painterly blur, no modern glossy 3D. Entire figures visible. All generally face right in a front three-quarter battle pose. Clear eyes and expressive faces. Original designs, do not copy existing game characters. Each row has a consistent dungeon theme, but all three creatures are visibly different shapes.
Exact cell order:
ROW 1, CREATE / amber and copper workshop, warm emerald accents:
column 1 an impish wooden filing-chest MIMIC with brass hinges, sharp teeth, a blank registration scroll hanging from its mouth, tiny quill antenna.
column 2 a smoke SHADOW made of two overlapping parchment forms, two offset little faces, copper seal and duplicate floating cards.
column 3 an amber jelly SLIME containing an unsealed luminous memory gem, tiny ink bubbles and a loose quill. Rounded droplet silhouette.
ROW 2, READ / blue archive, pale gold details:
column 1 a blue GHOST emerging from a haunted open book, visible page wings, small gold reading lens.
column 2 a blue lantern WISP holding a tiny blank index tag, pointed flame body and lost-looking eyes.
column 3 a sapphire BAT with wide bookmark-shaped wings, pale page edges and one prominent bright eye. Distinctly horizontal silhouette.
ROW 3, UPDATE / jade and teal corridor, ivory and copper details:
column 1 a chunky jade-stone GOLEM with movable rectangular tiles on its chest, one tile visibly shifted, chunky fists.
column 2 a slender teal SHADOW wrapped in crossed-out address tags and correction ribbons, pointed hood and bright eyes.
column 3 a green filing-box MIMIC with a hinge jaw, tiny stacked record cards and an animated copper editing quill.
ROW 4, DELETE / violet crypt, bone and muted crimson accents:
column 1 a cute bone SKELETON in violet scraps, holding a little eraser-shaped scythe, not scary or gory.
column 2 a pale violet hooded GHOST carrying a small scissor charm and a single targeted blank record card.
column 3 a squat violet-stone GOLEM with an eraser-shaped head, a hollow window in its torso and tiny floating erasure-dust pixels.
Background: genuine alpha transparency, including all empty gutters. Do not paint a checkerboard. Hard sprite edges, all non-sprite area fully transparent. This sheet must be directly usable with exact uniform atlas cells.
