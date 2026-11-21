# 新しい敵スプライト v1

| 項目 | 内容 |
|---|---|
| 日付・対象・結果 | 2026-11-21。デッドロックインプ、メモリリーククラゲ、キャッシュガラス。マップ・遭遇・戦闘用の静止素材として採用候補を制作 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/map-sprites.md`、`docs/production/uses/combat-art.md`、依頼内の3体の固有設定。当日作業ツリーを参照 |
| 入力 | 既存の `public/sprites/wolf-right.png`、`golem-right.png`、`mimic-right.png`、`slime-right.png` を目視参照。これらは生成ツールに入力画像として渡していない。右向き、精細な段階陰影、暗い輪郭、余白と足元を確認し文章で指定 |
| 制作方法 | 組み込み `image_gen.imagegen` が利用可能であることを着手時に確認。1体ごとに個別生成、全呼び出しで `transparent_background: true`。API/CLI経路は使用しない。qualityやモデルの指定はしていない |
| 成果物 | `public/sprites/imp-right.png`、`public/sprites/jelly-right.png`、`public/sprites/raven-right.png`。生成PNGを加工せずコピー。クラゲのみ組み込みツールで構図を再編集した第2候補を採用 |
| 実測・登録 | 全3枚が1254×1254、8bit RGBA PNG。alpha 0〜255を実デコードして確認。コード登録・crop/anchor変更はClaude担当。本作業ではsrcを編集していない |
| 確認 | 既存4体と新規3体を目視。右向き、1体のみ、全身と持ち物、背景・地面・落ち影・文字の焼き込みなし、見える輪郭の欠けなしを確認。インプの鍵と鎖、クラゲの傘と滴、カラスの嘴と羽に異なるシルエットがある |
| 採否の理由 | インプとカラスは初稿採用。クラゲ初稿は右側の余白が狭く、構図修正版を採用。既存の密なピクセル階調と素材感に合わせた。クラゲの内部は透ける表現を持つが、背景透明性と体内部の視覚表現は別条件 |
| 次回への反映 | 3体固有の制作履歴として保持。共通規則は変更しない |

## 原画と版

原画ディレクトリ：`/Users/ogasawarayuki/.codex/generated_images/01a1fbe6-2776-7c90-b4cc-acca9ea61a2d/`。元出力はそのまま保持。

| 対象 | 原画ファイル | 採否 |
|---|---|---|
| インプ v1 | `exec-3b11f81f-2e1f-41c6-9a09-53923cc8fbd1.png` | 採用 |
| クラゲ v1 | `exec-4c2e3e78-15d2-4d55-ae45-b33b6506e7fc.png` | 余白不足で不採用 |
| クラゲ v2 | `exec-ef7d8731-94fe-4670-89c2-e1437893b148.png` | 採用。v1のみを編集対象画像として渡した |
| カラス v1 | `exec-6dec72e1-56e3-41be-8c00-ab3bfe094f39.png` | 採用 |

## 最終プロンプト

以下は実際に送信した全文。初回生成は画像添付なし。

### インプ v1

```text
Use case: stylized-concept. Asset type: one original CodeChronicle JRPG enemy sprite for map and battle. Style: finely detailed cute Super Famicom era Japanese RPG pixel art, strong dark stepped pixel outlines, dense crisp pixel clusters, rich 4-6 step material shading, upper-left highlights and lower-right self-shading, comparable to a detailed silver wolf, segmented stone golem, wooden gold-trimmed mimic, and glossy pink slime series. Slightly elevated three-quarter view, whole creature faces SCREEN RIGHT, face and front at right, rear at left. One creature only, isolated on true alpha transparency, no background, ground, floor, cast shadow, platform, lettering, watermark, border, other characters, or cropped appendages. Square PNG, request 1254x1254 pixels. Fill roughly 88-94% of canvas width with complete silhouette and 5-9% bottom transparent margin; keep upper margin. Broad readable silhouette even reduced to 64px. Original creature design, no resemblance to famous game monsters. Subject: Deadlock Imp, small mischievous red-purple devil with two little horns, pointed ears, small bat wings, two feet. Rusty iron chains wind around its torso and wrists, held by conspicuous iron padlocks. Each of its two hands clearly holds a separate bunch of old keys; crossed chained arms reach toward each other's keys, comically unable to unlock itself. A curved tail at the left rear ends in a small locked padlock. Red-purple skin and iron grey/rust palette, impish crooked grin, right-facing profile readable. Full body, keys, wings, tail and feet intact.
```

### クラゲ v1（修正元）

```text
Use case: stylized-concept. Asset type: one original CodeChronicle JRPG enemy sprite for map and battle. Style: finely detailed cute Super Famicom era Japanese RPG pixel art, strong dark stepped pixel outlines, dense crisp pixel clusters, rich 4-6 step material shading, upper-left highlights and lower-right self-shading, comparable to a detailed silver wolf, segmented stone golem, wooden gold-trimmed mimic, and glossy pink slime series. Slightly elevated three-quarter view, whole creature faces SCREEN RIGHT, face and front at right, rear at left. One creature only, isolated on true alpha transparency, no background, ground, floor, cast shadow, platform, lettering, watermark, border, other characters, or cropped appendages. Square PNG, request 1254x1254 pixels. Fill roughly 88-94% of canvas width with complete silhouette and 5-9% bottom transparent margin; keep upper margin. Broad readable silhouette even reduced to 64px. Original creature design, no resemblance to famous game monsters. Subject: Memory Leak Jellyfish, a semi-transparent pale water-blue jellyfish with rounded umbrella bell, viewed in three-quarter profile looking toward screen RIGHT. Sleepy half-closed eyes and small mouth located on the right/front side of the bell, gently protruding rim at right, trailing tentacles sweep toward lower-left. Inside the translucent bell are many small luminous square memory blocks, visibly accumulating. Several short curling tentacles with glowing cyan teardrops visibly dripping off their tips; contain all drops close to the tentacles in the silhouette, no puddle. Soft icy cyan, turquoise and periwinkle shading, sharply pixelated glassy highlights, dark blue outline for readability. One umbrella and tentacles, adorable sleepy expression, distinct jellyfish silhouette. Lowest tentacle tips or drops around 91% canvas height, whole subject contained.
```

### クラゲ v2（最終編集）

入力：上記クラゲv1の原画パスを `referenced_image_paths` で指定。

```text
Use case: precise-object-edit. Edit this jellyfish sprite only for framing: preserve the creature identity, pixel art, colors, sleepy face on screen RIGHT, memory blocks and glowing dripping tentacles exactly. Shrink the complete existing subject to 88 percent of its current size and center it on the same 1254x1254 square transparent canvas, with all meaningful colored pixels inside x=65..1188 and y=65..1165. Keep its lower tentacle tips at about 92 percent of image height. Provide transparent alpha everywhere outside the creature and remove isolated stray colored specks. Do not crop or clip any contour; no shadow, background, text, ground, or added objects.
```

### カラス v1

```text
Use case: stylized-concept. Asset type: one original CodeChronicle JRPG enemy sprite for map and battle. Style: finely detailed cute Super Famicom era Japanese RPG pixel art, strong dark stepped pixel outlines, dense crisp pixel clusters, rich 4-6 step material shading, upper-left highlights and lower-right self-shading, comparable to a detailed silver wolf, segmented stone golem, wooden gold-trimmed mimic, and glossy pink slime series. Slightly elevated three-quarter view, whole creature faces SCREEN RIGHT, face and front at right, rear at left. One creature only, isolated on true alpha transparency, no background, ground, floor, cast shadow, platform, lettering, watermark, border, other characters, or cropped appendages. Square PNG, request 1254x1254 pixels. Fill roughly 88-94% of canvas width with complete silhouette and 5-9% bottom transparent margin; keep upper margin. Broad readable silhouette even reduced to 64px. Original creature design, no resemblance to famous game monsters. Subject: Cache Raven, one small stocky black raven standing on two clawed feet, facing SCREEN RIGHT, clear beak profile to the right and short tail toward left. Folded wings with layered crisp black charcoal feathers and indigo blue highlights. Around its neck hang several old tarnished gold coins and glass marbles on cord loops, visibly hoarded trinkets; in its beak it holds one faded weathered coin, no readable markings. Sharp clever eye with a slightly endearing cheeky expression. Antique dull gold and teal glass contrast with black feathers. Keep feet aligned at about 91% canvas height; comfortable transparent padding on all sides, intact beak, coin, claws and tail, no backdrop or ground shadow.
```

## 検証と未実行の範囲

- alpha ≥ 128の主要輪郭の実測矩形（端点を含む）は、インプ `[13,33,1242,1222]`、クラゲ `[127,140,1153,1115]`、カラス `[32,85,1217,1209]`。主要輪郭はいずれも画像端に接しない。ごく低いalphaの画素は原画の余白にも存在し、alpha > 0だけの矩形では輪郭を正確に表せない（既存4枚にも同様の低alpha画素がある）。
- 保存後の `npm run check:art`：PASS、275 PNG headers、87 asset references、14 terrain sets、既知の警告10件、エラー0件。警告は既存の大原画寸法・配置差などで、新規3枚の警告はない。
- 保存前には並行作業中のsrcが新規3枚を参照していたため、未保存の3ファイルについて欠落エラーがあった。保存後の再実行で解消した。
- 機械検査のPASSと美観の評価は別。全PNGのalphaチャンネルをデコードし透明画素が存在することを確認した。
- ゲーム実画面、64pxでの並列表示、PC/スマホの統合表示、通行、アニメーション、`npm run build` は本担当では未実行。書き込み先を指定4ファイルに限定した素材制作依頼のため、統合側で最終確認する。
- `src/` と `docs/production/records.md` は変更していない。コミット・公開は行っていない。

