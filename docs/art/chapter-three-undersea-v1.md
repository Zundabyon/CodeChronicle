# 第三章 序幕「海底の古道」素材 v1

制作日: 2026-11-20。Task: task_2cac0e43fe12。

## 対象と制作方法

組み込み `image_gen.imagegen` の存在を着手時に確認し、13回の個別生成で13枚を制作。1画像1ファイルとし、アトラスや複数絵のシートは作成していない。API/CLI画像生成は使用していない。生成原画はそのまま保持し、`sips -z` で納品寸法へ変換した。透過指定は小物2枚・戦闘絵・マップ絵のみ。

参照仕様: `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/chapter-three-plan.md`、`docs/production/uses/{environment-art,dialogue-portraits,map-sprites,combat-art,backgrounds,state-variants}.md`。

## 参照画像の役割

目視した形式・美術参照: `public/maps/dungeon-lake-floor-64.png`、`public/portraits/chapter-two/face-graphius.png`、`public/portraits/chapter-two/standing-graphius.png`、`public/sprites/graphius-right.png`、`public/sprites/graphius-64.png`、`public/prologue/chapter-two/attack-sky.png`。戦闘解像度は `guardian-right.png` と `graphius-right.png` の実寸1254×1254に合わせた。

これら既存の形式参照画像は生成入力へ渡していない。`hero-battle-left.png` と `hero-64.png` を目視し、トンネルイベント生成のみ `hero-battle-left.png` を主人公の同定参照として渡した。

ヘドロの主は normal 原画を先に制作し、目視確認した同じ原画を propose/down/surprised/face/right/map の全6生成へ参照入力した。オリーブ褐色のヘドロ、二つの淡色の目、黒と銅の配線、紙のコード片、木片を共通特徴にしている。

## 保存先と生成原画

|成果物|納品寸法|元の生成原画|
|---|---|---|
| `public/maps/undersea-floor-64.png` | 64×64 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-f43be632-bee4-4369-bcfc-b50c70431bc0.png` |
| `public/maps/undersea-wall-64.png` | 64×64 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-2c9f22d9-4a0d-4a88-be5c-937726d4a330.png` |
| `public/maps/undersea-deco-a-64.png` | 64×64 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-321ec242-e104-41ee-ae85-e90ef5ba5ecc.png` |
| `public/maps/undersea-deco-b-64.png` | 64×64 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-37cd2eba-922f-4881-ac04-95e7d472adb2.png` |
| `public/portraits/chapter-three/standing-hedoro-normal.png` | 384×512 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-beaba244-731c-4fe3-a73d-0278e9c1fea3.png` |
| `public/portraits/chapter-three/standing-hedoro-propose.png` | 384×512 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-08b25ada-00bf-48e9-b4a7-0981711845f8.png` |
| `public/portraits/chapter-three/standing-hedoro-down.png` | 384×512 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-91448e9b-1153-4a90-ac02-25fed1dbebaa.png` |
| `public/portraits/chapter-three/standing-hedoro-surprised.png` | 384×512 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-ac535103-f7d8-4324-8519-e14f0f5a3694.png` |
| `public/portraits/chapter-three/face-hedoro.png` | 384×512 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-22ccbfdf-d008-4c56-b014-3e396b509f5c.png` |
| `public/sprites/hedoro-right.png` | 1254×1254 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-c9289a00-5541-4741-983c-86a3b4a1912f.png` |
| `public/sprites/hedoro-64.png` | 64×64 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-a85bd879-6b34-47e8-89de-127fd3bce05f.png` |
| `public/prologue/chapter-three/undersea-entrance.png` | 1086×362 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-b620f751-78a3-49cd-a440-2e50f3c2c652.png` |
| `public/prologue/chapter-three/undersea-tunnel.png` | 1086×362 | `/Users/ogasawarayuki/.codex/generated_images/01a1f658-b780-78a0-ab19-ce2a0815ff2a/exec-5c1c3950-c365-47ff-af30-02ee5da3f57b.png` |

## 検証

寸法とalphaの実測および目視確認結果は以下に追記する。

`npm run check:art`: PASS、206 PNG、80参照、14地形セット、既存警告10、エラー0。

`npm run build`: PASS。大きなバンドルに関する警告あり。

今回の許可範囲は画像と本記録のみのため、srcの登録・配置・ゲーム実画面での確認は未実施。ゲームへの組み込みとPC/スマホの実表示確認は組み込み担当の作業。制作記録索引も許可範囲外なので変更していない。commit/pushは行っていない。

## 実寸・alphaの最終実測

NSBitmapImageRepで納品PNGを読み、全ピクセルのalpha最小・最大を測定。alphaは0〜255の整数表記。各ファイルの実寸は以下の通りで、要求寸法と一致した。

|ファイル|実寸|alphaチャンネル|alpha範囲|
|---|---|---|---|
| `public/maps/undersea-floor-64.png` | 64×64 | なし | 255（不透明） |
| `public/maps/undersea-wall-64.png` | 64×64 | なし | 255（不透明） |
| `public/maps/undersea-deco-a-64.png` | 64×64 | あり | 0〜255 |
| `public/maps/undersea-deco-b-64.png` | 64×64 | あり | 0〜255 |
| `public/portraits/chapter-three/standing-hedoro-normal.png` | 384×512 | なし | 255（不透明） |
| `public/portraits/chapter-three/standing-hedoro-propose.png` | 384×512 | なし | 255（不透明） |
| `public/portraits/chapter-three/standing-hedoro-down.png` | 384×512 | なし | 255（不透明） |
| `public/portraits/chapter-three/standing-hedoro-surprised.png` | 384×512 | なし | 255（不透明） |
| `public/portraits/chapter-three/face-hedoro.png` | 384×512 | なし | 255（不透明） |
| `public/sprites/hedoro-right.png` | 1254×1254 | あり | 0〜255 |
| `public/sprites/hedoro-64.png` | 64×64 | あり | 0〜255 |
| `public/prologue/chapter-three/undersea-entrance.png` | 1086×362 | なし | 255（不透明） |
| `public/prologue/chapter-three/undersea-tunnel.png` | 1086×362 | なし | 255（不透明） |

## 目視での採用判断

- 床・壁をそれぞれ3×3に敷き詰め、64px実寸の2倍表示で確認した。境界の隙間や直線状の目立つ明暗差は見られず、砂と岩の床、海藻と珊瑚の岩壁として接続している。反復模様自体は存在するが、1枚のタイルによる仕様上の反復である。
- 5枚の会話絵を同じ縮小倍率で横並びに確認。半目の通常、片腕を上げる提案、うなだれる落胆、両目を見開く驚きの差を読み取れる。全身4枚は同じ個体・背景系統・基準線を維持する。胸像は顔を大きく見せて下部を意図的に切っている。
- 戦闘絵は顔・瞳・前側の腕が右向きで、全体の輪郭がキャンバス内に収まる。マップ絵は64pxでも目と配線で同じボスと識別できる。小物2枚と戦闘・マップ絵を灰色背景上で確認し、不透明な矩形背景やチェック柄の焼き込みは見られない。
- 入口は地下書庫の棚と暖色灯から、青い光の古い石段へ視線が通る。トンネルは海中の魚影、石造の乾いた通路、青髪・青マントの主人公が見える。イベント2枚は1086×362の納品実寸で目視済み。

検査用の一時画像: `/private/tmp/undersea-tiles-3x3.png`（左:床、右:壁）、`/private/tmp/undersea-portraits.png`（normal/propose/down/surprised/face）、`/private/tmp/undersea-sprites.png`（戦闘・マップ・小物）。これらは納品素材ではなく確認用合成画像。全ピクセル検査の一時出力は `/private/tmp/undersea-audit.json`。

納品画像13枚を採用候補として引き渡す。実装前素材のため、ゲーム内の到達性、当たり判定、会話切替、PC/スマホ表示の最終合格を意味しない。`git diff --check` もPASS。

## 最終プロンプト

### floor

```text
Use case: stylized-concept. Create ONE standalone seamless square game terrain texture, wet rock and sandy floor in an ancient undersea tunnel. Fine detailed SFC-era Japanese RPG pixel art, top-down slight oblique compatible with a 64x64 map tile. Small blue-grey worn rocks among muted grey sand, subtle wet teal highlights from upper left, restrained contrast for walkable floor. Edge-to-edge texture, perfectly wrapping left-right and top-bottom, no borders, no central motif, no water surface, no text, no grid, no scene, no transparency. Deliver a single image, intended final size 64x64. Save output artifact.
```

### wall

```text
Create ONE standalone seamless square game terrain texture, ancient undersea tunnel rock wall with small dark teal seaweed and sparse muted coral encrusted onto blue-grey rugged stone blocks. Detailed SFC Japanese RPG pixel art, subtle upper-left illumination, chunky stone relief viewed slightly from above, designed to read clearly at 64x64 pixels. Entire square is solid wall material, seamlessly wrapping all four edges, no top cap, no floor, no border, no central object, no text, no grid. Opaque image. One tile only.
```

### deco-a

```text
Use case: stylized-concept. ONE single map prop asset on genuinely transparent background: a small pile of two waterlogged broken ship planks tangled with one rusty old anchor, for an ancient undersea passage. Fine detailed SFC-era Japanese RPG pixel art, slightly overhead three-quarter map view, upper-left light, aged brown timber and muted iron teal patina. Compact centered silhouette with generous clear margins, all objects intact inside canvas, no ground tile, no scenery, no frame, no lettering. Intended final size 64x64. One cohesive prop cluster, not a sheet.
```

### deco-b

```text
Use case: stylized-concept. ONE single map prop asset on genuinely transparent background: two small bioluminescent pearlescent seashells with a short rising trail of four round bubbles. Fine detailed SFC-era Japanese RPG pixel art, slightly overhead three-quarter map view, upper-left light and subtle cyan shell glow. Compact centered silhouette with clear margins, readable after reduction to 64x64, all bubbles within canvas. No ground, no scenery, no text, no frame, no sprite sheet, no checkerboard drawn into image. One cohesive small prop cluster.
```

### normal

```text
Use case: stylized-concept. Create ONE full-body dialogue illustration of the comic boss Hedoro, lord of sludge, Spaghetti. Detailed crisp pixel art for a beautiful SFC-era Japanese fantasy RPG, matching the density and stepped highlights of the supplied portrait style. A huge squat mound of olive-brown wet sludge accumulated for centuries, tangled old black and copper wires like spaghetti, torn cream paper scraps with tiny illegible code-like marks, broken wood and harmless old junk stuck throughout. Exactly two large pale oval eyes with tired half-closed eyelids, tiny pupils, one small downturned grumpy mouth; cute sulky territorial minor villain, not frightening. Two short sludge arm lobes, no human body, no clothing. Full mound visible centered on opaque dark navy-to-muted charcoal gradient backdrop, tiny contact shadow. Upper-left light. Normal pose: broad mound sitting stubbornly with both arm lobes resting at sides. Portrait canvas 3:4, intended final 384x512. Plenty of margin, bottom sits at 94% height. No title, no labels, no panels, no border, no gore.
```

### propose

```text
Use case: identity-preserve. Edit the attached Hedoro boss reference into ONE full-body dialogue pose variant, propose pose. Preserve exactly this olive-brown broad sludge mound, two half-lidded eyes, tangled black/copper wires, paper-code scraps and junk, same pixel art density, same full-body scale and baseline, same 3:4 canvas and opaque dark gradient backdrop. Change only expression and pose: the mound raises its right sludge arm lobe with an index-like tip as if offering a smug idea, other arm rests, mouth has a small self-satisfied smirk. Entire raised lobe stays inside frame. No added eyes, no human legs or clothing, no panels, no text. Intended 384x512.
```

### down

```text
Use case: identity-preserve. Edit attached Hedoro boss into ONE full-body dialogue pose variant, down / dejected. Preserve identical character: broad olive-brown sludge mound, exactly two pale tired eyes, copper and black wire tangles, cream code-paper scraps and same main junk landmarks; same detailed pixel art, same full-body scale/baseline on same opaque navy-charcoal gradient 3:4 canvas. Change only pose and expression: shoulders/arm lobes droop, eyes look downward, tiny wobbly unhappy mouth, mound slumps slightly inward in comic disappointment. No tears of blood, no injuries, no gore, no text, no panels. Keep all silhouette inside canvas. Final intended 384x512.
```

### surprised

```text
Use case: identity-preserve. Edit attached Hedoro boss into ONE full-body dialogue variant, surprised. Keep exact same olive-brown sludge mound individual with tangled black/copper wiring, cream paper-code scraps, wood and junk landmarks, exactly two eyes. Same detailed crisp SFC fantasy pixel art, same 3:4 canvas, full-body framing and scale, same opaque dark navy-charcoal gradient and baseline. Change only pose/expression: both pale eyes opened wide, tiny round O mouth, two sludge arm lobes lifted in startled comic reaction, a few wire tips spring upward but stay in frame. Cute, harmless, no gore, no extra eyes, no human body, no text, no panels. Final intended 384x512.
```

### face

```text
Use case: identity-preserve. Use attached Hedoro full-body illustration as identity reference; create ONE close upper-body dialogue portrait, intended 384x512, 3:4 portrait. Enlarge upper half of this exact olive-brown sludge boss so both large half-lidded pale eyes, tiny downturned sulky mouth and tangled black/copper wires/paper-code scraps fill the frame. Preserve exactly two eyes, no human head, same crisp densely shaded SFC-era RPG pixel-art, upper-left highlights. Entire crest and eye area visible, lower torso intentionally cropped at bottom like a bust, head centered. Solid deep navy background, opaque. No text, no border, no gore, no panels.
```

### right

```text
Use case: identity-preserve. Attached Hedoro is identity reference. Create ONE battle sprite of this exact comic sludge boss, full body on genuinely TRANSPARENT background, square canvas intended 1254x1254. Broad huge olive-brown sludge mound with same wood scraps, cream code-paper scraps and tangled copper/black old wires. Exactly two tired pale eyes and tiny sulky mouth. Three-quarter SIDE view explicitly FACING RIGHT: facial plane, pupils, mouth and raised leading sludge arm all turn toward the RIGHT edge, rear of mound to left. Clear readable combat silhouette, all wires and body inside with 5% clear margin. Beautiful detailed SFC-era JRPG pixel-art, upper-left light, no scenery, no floor plane, no opaque background, no text, no panels, no gore.
```

### map

```text
Use case: identity-preserve. Attached full-body Hedoro boss is identity reference. Create ONE map sprite intended for exactly 64x64 final pixels, on genuinely transparent background. Slightly overhead SFC Japanese RPG map view, crisp pixel art with deliberately simplified large readable pixel clusters. Same squat broad olive-brown sludge mound blocking a path, same two huge half-lidded pale eyes and downturned sulky mouth; a few copper and black tangled wires, two cream code-paper scraps and one wood plank. Wide mound nearly fills 56x48 logical pixels, centered with clear margin, all body and wires inside frame. Left-upper light, no ground tile, no scenery, no panels, no text, no gore. Recognizable comic boss matching reference, not a human.
```

### entrance

```text
Use case: illustration-story. ONE panoramic event illustration, exact composition 3:1 landscape intended final 1086x362. Beautiful richly detailed SFC-era Japanese fantasy RPG pixel art with crisp stepped shading, matching CodeChronicle chapter-two story art. Deep in the basement archives of an old stone village record house: shelves of dusty ledgers and rolled scrolls flank a newly revealed ancient stone staircase descending through an open arched passage beneath the sea. Warm amber archive lanterns on left contrast with mysterious cyan-blue light rising from the deep stairs on right-center, wet worn steps and faint seaweed near the dark threshold. The stair mouth is the clear focal point; communicate discovery and a long journey ahead. No characters required, no ocean flooding into room, no villains, no modern technology, no readable text, no labels, no border, no panels. Opaque full-bleed scene.
```

### tunnel

```text
Use case: illustration-story. ONE panoramic event illustration, 3:1 landscape composition intended final 1086x362. Rich detailed SFC-era Japanese fantasy RPG pixel art, crisp stepped shading matching CodeChronicle. An ancient stone tunnel passing UNDER the sea, with dry walkable worn rock and sand floor and ribbed stone arches. Between arches glass-like translucent blue sea walls reveal sunbeams, shoals of fish silhouettes, seaweed and distant seabed; water stays outside the magical glass-like tunnel. Hero from supplied identity reference is small in frame, seen three-quarter from behind walking deeper along tunnel toward bright distant vanishing point on right. Preserve his spiky blue hair, blue cape/tunic with gold trim, white trousers, brown boots and sheathed sword. Wonder, quiet danger, long path ahead. Upper-left cyan illumination and sparse amber stone lamps. No other characters, no boss, no readable text, no panels, no borders. Full-bleed opaque scene.
```
