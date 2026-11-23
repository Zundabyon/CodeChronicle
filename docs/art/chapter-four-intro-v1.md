# 第四章 導入「王都の関所」画像 v1

制作日: 2026-11-23（JST）。Task: task_39f84007e71b。結果: 画像10枚を素材として採用し、組み込み担当へ引き渡す。

## 対象・使用仕様

道化師エヌコイールイーチの顔、会話立ち絵4種、戦闘絵、マップ絵、王都の地形2種、城門行列のイベント絵。依頼の固有設定を使用し、人物の魔物化や暴力描写は追加していない。

参照仕様（制作日時点）: `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/dialogue-portraits.md`、`map-sprites.md`、`combat-art.md`、`environment-art.md`、`backgrounds.md`、前例 `docs/art/chapter-three-undersea-v1.md`、ひな形 `docs/production/templates/record.md`。

## 制作方法

着手時に組み込み `image_gen.imagegen` が使用可能であることを確認。組み込みツールを12回使用し、1回につき1枚を生成した（採用10枚、不採用初稿2枚）。API/CLI課金経路は使用していない。ツールの実指定項目は prompt、参照がある生成の referenced_image_paths、transparent_background のみ。寸法はプロンプトで構図として指示し、生成後にローカルの sharp で指定寸法へ機械的に変換した。画面内の人物や物品をコードで描き足していない。

透過6枚は原画のalphaを保持。微弱な透明ノイズで人物の縮尺が変わらないよう、alpha 16以上の外接矩形を基準に等比縮小・透過キャンバスへ配置。立ち絵4枚は可視全高461px、最上部20px、足元481pxの共通枠に揃えた。戦闘絵は上下約6%の余白、下端1179px（全高1254pxの94%）、マップ絵は可視全高56px、下端60px。顔・地形・イベントは指定寸法へ縮小してRGBで保存。原画は元パスへ保持した。

## 参照画像と役割

目視のみ（生成入力へは渡していない）: `public/portraits/chapter-two/standing-graphius.png`、`face-graphius.png`（衣装の格・細部・肖像の画風）、`public/sprites/hedoro-right.png`、`hedoro-64.png`（向き・余白・形式）、`public/maps/dungeon-lake-floor-64.png`（地形の密度）。

実際の生成入力:
- normal は新規生成。既存キャラクターを模倣せず、紫・金・菱形・二股帽子・白塗り・名札の紐・鍵束・巻物でオリジナルの同定特徴を確定。
- propose/down/surprised/face/right/map は下表 normal の原画を個体同定参照として入力。
- gate の初稿は normal 原画を同定参照、`public/prologue/chapter-three/undersea-entrance.png` を画風参照として入力。海底の場面設定は使用しないと明記。
- gate の最終修正は gate 初稿のみを編集対象として入力し、手配書の文字風の線を除去。

## 保存先・原画・採否

|成果物|実寸|alpha|生成原画|
|---|---|---|---|
| `public/portraits/chapter-four/standing-clown-normal.png` | 384×512 | あり（0〜255） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-4f93579a-d74e-4ccc-bafb-abf9de9228c8.png` |
| `public/portraits/chapter-four/standing-clown-propose.png` | 384×512 | あり（0〜255） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-3e52e5b6-e258-47b3-b936-e33187da6aad.png` |
| `public/portraits/chapter-four/standing-clown-down.png` | 384×512 | あり（0〜255） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-f8005640-969a-4ece-bcce-d1bcbe3abb86.png` |
| `public/portraits/chapter-four/standing-clown-surprised.png` | 384×512 | あり（0〜255） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-e4536ce8-291e-4ad5-bdbb-010fc926a336.png` |
| `public/portraits/chapter-four/face-clown.png` | 384×512 | なし（不透明） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-ec8ac8e2-241c-4132-8a14-2c24126c3266.png` |
| `public/sprites/clown-right.png` | 1254×1254 | あり（0〜255） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-dd0673b1-e3ea-417c-a582-d486d9011eb6.png` |
| `public/sprites/clown-64.png` | 64×64 | あり（0〜255） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-34c66202-7183-422c-bdce-17c540c84c6b.png` |
| `public/maps/city-cobble-64.png` | 64×64 | なし（不透明） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-64108715-ad04-40e1-be83-04ce961369db.png` |
| `public/maps/city-wall-64.png` | 64×64 | なし（不透明） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-0ec27cbe-21ed-47f5-9cac-08f99659a8f6.png` |
| `public/prologue/chapter-four/gate-queue.png` | 1086×362 | なし（不透明） | `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-f934743b-1458-4261-9e53-8ab5a61248e7.png` |

全10枚を採用。上記は納品時の実測値であり、将来の実装metadataの正本ではない。srcへの登録・crop・anchor定義は組み込み担当の範囲。

不採用初稿:
- 驚き差分: `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-8c9baa0c-757a-4c82-b206-11205f033301.png`。帽子が上端に接しており再生成。最終版は帽子全体を収めた。
- イベント初稿: `/Users/ogasawarayuki/.codex/generated_images/01a20490-b740-76b2-9bad-01ec256b04ef/exec-3b2f34cc-a9e4-4a1e-b544-d7f46dc883d7.png`。手配書の下部に文字風の線があり、最終版で頭部シルエットだけに修正。

## 目視・検証

- 原画と納品画像を目視。顔は白塗りの微笑、金色の目、紫髪、二股帽子を維持し、グラフィウスに合わせた金装飾と精細な陰影を採用。立ち絵4枚を同倍率・灰色背景で並べ、通常、両腕を広げた呼び込み、握り拳と前屈の悔しさ、開いた目と口の驚きを確認。全身絵の帽子・手・名札・靴に欠けは見られない。顔絵は胸元を意図的に下端で切った胸像。
- 透過6枚を灰色背景上で目視。矩形背景・チェック模様・床や場面の焼き込みなし。全ピクセルalphaの最小0・最大255をsharpで実測。顔と地形・イベントはalphaなしのRGB。
- 戦闘絵は鼻・視線・胸・前側の手・靴が右向き。下端と余白をヘドロの形式に合わせ、細身の体を横へ引き伸ばしていない。
- マップ絵は64px実寸と3倍表示で確認。二股帽子・白い顔・紫金・淡色の名札で同じ敵と識別できる。64pxでは衣装の細かい金刺繍や指は潰れるため、詳細表現は会話・戦闘絵が担う。
- 地形2枚を3×3反復し2倍表示で確認。隙間や目立つ色帯はなく、灰褐色の石畳と板混じりの石壁として接続。単一タイル由来の繰り返しはあり、壁の板配置も周期的に見える。数学的な境界画素の一致を保証するものではない。
- イベントを1086×362実寸で確認。疲れた人間の長い行列、閉じた商店と屋台、手配書、門上の道化師と名札が読める。手配書は頭部シルエットのみで、文字・偽文字・UI・流血・魔物化は見られない。
- `npm run check:art`: PASS、285 PNG headers、89 asset references、14 terrain sets、既存警告10、エラー0。
- `npm run build`: PASS。既存の500kB超のバンドル警告あり。
- 許可範囲は画像と本記録のみ。src、`docs/production/records.md`、他担当の変更は編集していない。ゲーム内登録、会話切替、通行・当たり判定、PC/スマホ実画面の検証は未実施で、組み込み担当へ引き継ぐ。commit/pushは未実施。

検査用の一時ファイル（納品物ではない）: `/private/tmp/clown-audit.json`（実寸・alpha・外接矩形）、`/private/tmp/clown-portraits.png`、`/private/tmp/clown-sprites.png`、`/private/tmp/clown-tiles.png`。ローカル変換スクリプト: `/private/tmp/prepare-clown.cjs`。

## 次回への反映

この人物の同定にはnormal原画を継続使用する。帽子を含む余白確保と手配書の偽文字防止は今回の品質確認として記録し、共通仕様や索引は今回変更しない。

## 最終プロンプト

### normal

```text
Use case: stylized-concept. Create ONE full-body standing dialogue character, an ORIGINAL slender tall sinister cheerful court jester named Encoileach, demon king's elite general who steals connections. Beautiful densely shaded crisp pixel art for a refined SFC-era Japanese fantasy RPG, stepped highlights, fine costume detail, upper-left light, consistent prestige with CodeChronicle's black-and-gold archivist lord. Purple and antique gold diamond-pattern jester suit, exactly TWO long split hat tips with small golden bells, white painted long narrow face, dark expressive eyes and fixed smiling mask-like theatrical makeup; no red nose, no existing franchise likeness. Small key ring and narrow rolled ledger at belt. Holds a long looping cord strung with many BLANK ivory rectangular name tags, tosses one blank tag upward with one hand. Normal pose: relaxed upright showman with a welcoming yet unsettling smile, other hand gathering tag string. Full body, both pointed shoes, hat and every tag fully inside with generous 6% margins. Single 3:4 portrait intended final 384x512. Genuinely transparent background, no ground, no scenery, no shadow plane, no text or pseudo-lettering on tags, no panels, no border, no watermark. One character only, never a sheet.
```

### propose

```text
Use case: identity-preserve. Edit this exact Encoileach jester into ONE propose/welcoming full-body standing portrait. Keep identical white mask-like painted smiling face, purple hair, TWO gold-belled purple/gold diamond hat tips, ornate purple and gold diamond suit, ivory ruff, belt keys and narrow rolled ledger, pointed shoes, blank name tags on long cord, same crisp refined SFC JRPG pixel art and upper-left light. Change pose ONLY: BOTH ARMS spread wide sideways, palms up as an unnervingly friendly gate announcer beckoning travelers, long cord of many blank tags looping between hands and one tag tossed upward. Preserve slender tall proportions, same scale and foot baseline as reference, 3:4 intended 384x512, fit ALL hands/hat/tags/shoes fully with clear margin. Actual transparent background, no ground, no backdrop, no drawn checkerboard, no lettering/pseudo-lettering, no border, one character and one pose only.
```

### down

```text
Use case: identity-preserve. Edit this exact Encoileach jester into ONE full-body DOWN/frustrated dialogue pose. Preserve identical slender tall individual, white mask-like makeup, purple hair, two bell-tipped purple/gold diamond hat lobes, intricate diamond suit and ivory ruff, keys and narrow ledger roll at belt, curled shoes, long cord of many BLANK ivory name tags, same refined crisp SFC Japanese RPG pixel art and upper-left lighting. Change ONLY expression and pose: shoulders hunched inward, chin lowered, brows pinched angrily, painted smile visibly strained into a grimace, one fist clenched near chest and other hand holding the slack tag cord; comic bitter frustration after losing his trick, not crying or injured. All of body, shoes, hat, hands and tags fit inside frame with 6% clear margins. Same 3:4 scale/baseline, intended 384x512. Genuinely transparent background, no scenery/ground/shadow plane, no text, no pseudo-writing, no panels, no border. ONE pose.
```

### surprised

```text
Use case: identity-preserve. Edit exact reference Encoileach into ONE SURPRISED full-body dialogue pose. Keep identical tall slender male jester, white painted mask-like face, purple wavy hair, exactly TWO purple/gold diamond long hat points each with gold bell, ivory ruff, ornate diamond purple/gold costume, keys and slim rolled ledger at belt, curled shoes, many blank ivory name tags on long cord. Same crisp richly shaded SFC Japanese fantasy pixel art, upper-left light. Change only pose and expression: eyes opened wide, raised eyebrows, mouth small open O interrupting painted smile, torso recoils slightly, both hands lifted in startled reaction still holding the tag cord. All hat, hands, tags and shoes safely inside 6% margins, portrait 3:4 intended 384x512, same scale and foot baseline. Actual transparent background, no scenery or floor/shadow plane, no text or invented writing, no extra characters or panels. CRITICAL framing correction: make the entire character smaller, occupying only the CENTRAL 80% of canvas HEIGHT, with 10% EMPTY transparent area above the HIGHEST hat tip and 10% below soles. No part of hat may touch or cross top border. Do not enlarge to fill frame. Preserve both complete curved hat lobes.
```

### face

```text
Use case: identity-preserve. Create ONE dialogue FACE/BUST portrait of exact Encoileach in supplied reference. Preserve his slender long white painted face, purple wavy hair, gold eyes, diamond purple cheek makeup, theatrical smiling painted lips, exactly TWO purple-and-antique-gold diamond hat points with golden bells, ivory ruff and ornate purple/gold shoulders. Cheerfully welcoming yet quietly sinister elite general, same finely shaded crisp SFC JRPG pixel illustration as reference and CodeChronicle portraits. 3:4 portrait intended final 384x512, close upper torso with lower chest deliberately cropped at bottom; entire hat including both bells and both shoulders fit inside with 5% margin, face large and legible. Opaque solid dark navy background matching chapter-two face-graphius; upper-left light. No text, no pseudo-writing, no border, no panels, no gore, no red clown nose, one image.
```

### right

```text
Use case: identity-preserve. ONE square battle sprite of EXACT reference Encoileach jester, genuinely transparent background, intended 1254x1254. Preserve slender tall body, white smiling mask-like painted face and gold eyes, purple wavy hair, two purple/gold diamond bell-tipped hat lobes, ornate purple/gold diamond suit and ivory ruff, keyring and slim ledger roll at belt, pointed shoes, long cord of many BLANK ivory tags with one tossed upward. Refined densely shaded crisp SFC Japanese fantasy RPG pixel art, upper-left light. Three-quarter SIDE view explicitly FACING RIGHT: nose, facial plane, eyes, chest, forward hand and front foot all directed toward RIGHT edge, rear of body on LEFT. Welcoming sinister battle-ready showman stance, no weapon. Full silhouette all hands/hat/tags/shoes intact. Match Hedoro-right battle canvas's approx 6% transparent outside margin and feet around 94% height; jester stays naturally tall and slender, don't stretch wide. No scenery, no ground/floor/shadow plane, no rectangular background, no text or pseudo-lettering, no panels, one character only.
```

### map

```text
Use case: identity-preserve. ONE small map sprite of exact reference Encoileach, intended FINAL 64x64 pixels, on genuine transparent background. Slightly overhead three-quarter SFC Japanese RPG map view, crisp deliberate pixel clusters with simplified detail readable at 64px, upper-left light. Same tall slender purple-and-gold diamond jester, exactly TWO curved hat lobes with gold bells, small white painted smiling face framed by purple hair, ivory ruff, keyring and slim ledger roll at waist, pointed shoes. Holding long looping cord of a handful of LARGE BLANK ivory tags, tossing one tag above hand. Front three-quarter map idle stance, full body all hat/hands/shoes/tag cord inside 5% clear margins. Use chibi map proportions with readable larger head but recognizable slender figure. No ground tile, scenery, opaque background, floor shadow, text or pseudo-writing, no sheet, no frame. One character.
```

### cobble

```text
Use case: stylized-concept. Create ONE standalone square seamless terrain tile for the worn cobbled streets of a declining medieval royal commercial city. Intended FINAL 64x64 pixels. Fine detailed SFC-era Japanese RPG pixel art with crisp stepped shadows, density like CodeChronicle dungeon floor tiles. Top-down slight oblique, upper-left light. Small irregular gray to muted brown stone setts, some fine cracks, only a few dry ochre leaves in joints. Muted restrained contrast suitable walkable floor, readable small stone texture at 64px. Edge-to-edge opaque ground material, perfectly wraps left/right and top/bottom, consistent value at every edge, no central motif, no border, no grid, no props or walls, no perspective horizon, no text, no transparency. One tile only, no contact sheet.
```

### wall

```text
Use case: stylized-concept. ONE square opaque seamless RPG WALL terrain tile, intended final 64x64 pixels: timeworn exterior wall in a declining medieval royal commercial city, mostly dull grey and muted brown small stone masonry with a few weathered vertical brown timber planks inset flush among the stones. Detailed crisp SFC Japanese RPG pixel art, stepped shading and fine material density matching CodeChronicle dungeon tiles, subtle upper-left light, slightly overhead relief compatible with map walls. ENTIRE square is solid stone-and-board wall surface from edge to edge, repeatable horizontally AND vertically, no top cap, no ground, no building silhouette, no window/door, no single focal object, no borders, no text or pseudo-writing, no transparency. Constant ambient value across all edges, tile wraps seamlessly, one tile only.
```

### gate

```text
Use case: illustration-story. ONE panoramic story event illustration, exact 3:1 landscape composition intended final 1086x362. Input 1 defines ONLY exact identity of the purple/gold jester Encoileach; input 2 defines ONLY rich crisp SFC Japanese fantasy RPG pixel art style, stepped shading, visual density, NOT underwater setting. Scene: outside a huge worn medieval royal CITY GATE in a declining commercial capital, a very LONG SINGLE-FILE QUEUE of exhausted ordinary human residents winds across cobbled street from left foreground toward gate at right-center. Slumped shoulders, tired patient faces, dusty clothes, sacks and baskets. Closed shuttered merchant shops, abandoned market stalls, cracked grey/brown cobbles, dry leaves; a few aged wanted posters on wall marked ONLY with simple head silhouettes, absolutely NO writing or pseudo-writing. Atop the low gate battlement directly ABOVE arch stands the small but clearly visible slender purple/gold diamond jester from input1, two gold-belled hat tips, white smiling face, ivory ruff, gleefully juggling BLANK ivory name tags one at a time while holding a long tagged cord. He enjoys delaying everyone. Framing must include COMPLETE jester with empty sky above hat, entire city gate and visible line length, dignified medieval fantasy architecture, muted late afternoon upper-left light. Unsettling bureaucratic stagnation, no violence or blood, no monsters or transformations, no magic attacks, no hero needed, no UI/text/lettering/borders/panels/watermarks. Opaque full-bleed scene.
```

### gate 最終修正

```text
Use case: precise-object-edit. Preserve this entire panoramic 3:1 city gate queue illustration exactly: same long tired human queue, same shuttered shops, cobbled street, castle gate, purple/gold jester juggling blank tags on gate, lighting, crisp SFC pixel style, composition. Change ONLY the three paper wanted posters on the far LEFT wall: erase ALL tiny line marks, lettering, scribbles, pseudo-text, emblems and printed marks from the paper below each head silhouette. Each poster must contain ONLY a simple dark head/bust silhouette centered on otherwise COMPLETELY BLANK clean aged parchment, absolutely no horizontal ink strokes anywhere. Keep parchment weathering but zero glyphs or writing. No other changes. Opaque full-bleed image, final intended 1086x362.
```

