# 海底の古道：ふり返りの石板 v1

| 項目 | 内容 |
|---|---|
| 日付・対象・結果 | 2026-11-20。第三章序幕の任意解説用6枚。画像単体の採否・検証は下記 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/backgrounds.md`、今回の派遣依頼（960×600、不透明、短い英字コード語） |
| 入力 | `public/maps/lesson-tablet-64.png` を石の質感、`public/maps/props/memory-door-v2.png` を石材・シアンの色味の目視参照に使用。両画像はview_imageで確認したが、imagegenへの画像入力には渡していない |
| 制作方法 | 組み込み `image_gen.imagegen`、1場面につき1呼び出し、`transparent_background:false`。API/CLI課金経路への切替なし。生成サイズの直接パラメータは存在しないためプロンプトで指定し、納品寸法へmacOS sipsで縮小 |
| 成果物 | `public/lessons/undersea-review-<id>-960x600.png`。個別の保存先と原画は下記 |
| 実測・登録 | 画像単体を納品。srcへの登録・HTML本文・石板パネルとギャラリー表示はClaude担当 |
| 確認 | 原画と最終縮小画像を目視。寸法・alphaはsipsとPNGヘッダで検証。検査結果は下記 |
| 採否の理由 | 青灰色の石板、海底の小装飾、シアンの図解、短いコード語の可読性を基準に判定 |
| 次回への反映 | 本教材固有の制作記録として残す。共通仕様の改定なし |

## 実際に使用した最終プロンプト

各呼び出しのプロンプトは、次の共通部分と各対象の個別部分を改行で連結した文字列。

### 共通部分

```text
Use case: scientific-educational. Create ONE standalone landscape educational illustration for CodeChronicle, target 960x600 pixels (8:5), opaque PNG. Fine, cute 16-bit SFC-era JRPG pixel art with crisp pixel clusters, textured blue-grey ancient stone tablet occupying almost entire frame, small edge cracks, sparse seaweed and bubbles, dark deep teal underwater background. Top-left light, glowing cyan diagram etched across stone. Keep diagram highly legible, generous spacing, large monospaced code labels. No title, Japanese, fake writing, decorative runes, logos, watermark, outer UI frame, or extraneous text. Only exact short English code labels specified below; no body prose. Villager tables use headers id / name / address, three rows of tiny face icons, short names Ada, Ben, Cid and house icons for addresses; IDs 1 2 3. Depict anonymous original villagers, no existing characters. This must be one coherent diagram on ONE tablet, not a collage of separate artworks.
```

### basics-ui

```text
Subject: UI components and local state. One large screen silhouette contains an upper parent component box and two smaller child component boxes below. A clear downward arrow from parent to left child labeled props. A separate upward arrow from right child back to parent labeled emit. Inside left child a tiny glowing meter labeled useState, inside right child a tiny meter labeled ref. Show the meter changing and a curved arrow leading to a refreshed miniature villager-list screen with bright sparkle, communicating state change redraws screen. Make the hierarchy and arrow directions unambiguous. Exact labels only: props, emit, useState, ref. No table words needed in this diagram.
```

### basics-server

```text
Subject: Laravel request entry and MVC. A large envelope at far left labeled GET /villagers flows via right-pointing cyan arrow to a signpost labeled Route, then to a friendly reception-clerk icon labeled Controller. Controller has an arrow to an upper-right librarian/bookshelf icon labeled Model containing a small three-row villager table, Model returns data with a distinct return arrow to Controller. Controller then points to a lower-right villager-list display labeled View. View is a completed screen. Ensure flow is request to Route to Controller, Controller obtains table data from Model then renders View. Exact main text: GET /villagers, Route, Controller, Model, View. Table labels id, name, address and Ada, Ben, Cid permitted.
```

### read

```text
Subject: Read with two clearly separated horizontal paths on the same stone surface. Upper path: envelope labeled GET /villagers points to a complete glowing three-row villager table labeled index, eye icon indicates reading. Lower path: envelope labeled GET /villagers/3 points to a second copy of same three-row table; only row ID 3 is brightly highlighted and a magnifying glass is over row 3, label show. Both tables MUST retain all three rows: IDs 1 Ada, 2 Ben, 3 Cid. No extra or removed rows. Eye symbols, not pencils. Exact labels GET /villagers, index, GET /villagers/3, show, id, name, address, Ada, Ben, Cid.
```

### create

```text
Subject: Create. Upper-left: a blank form paper with empty outlined fields labeled create, adjacent three-row table remains unchanged. Lower main path: a filled form paper labeled POST moves right through a glowing checkpoint gate labeled validate, then via arrow labeled store into a villager table that now has a fourth row glowing green at bottom (ID 4, Dee). An incomplete form with visibly empty fields bounces back left from the gate along a red arrow with red X; it must not reach the table. Use sparse text, large diagram elements. Exact labels create, POST, validate, store, id, name, address, Ada, Ben, Cid, Dee. Numeric IDs permitted. Convey opening form alone does not add a row; only valid submitted paper adds row.
```

### update

```text
Subject: Update. Left a filled form labeled edit shows existing values ID 3 Cid with a house icon. Arrow right labeled PATCH /villagers/3 leads to a large three-row villager table labeled update. A paintbrush is repainting only row ID 3 in green; rows 1 Ada and 2 Ben remain cyan and unchanged; row 3 name now Dee. Keep all three rows. Bottom-right a SMALL warning vignette has a red X above an erroneous three-row table with ALL three rows painted same red color, conveying accidental update without condition. Main example much larger than warning. Exact text only edit, PATCH /villagers/3, update, id, name, address, Ada, Ben, Cid, Dee. Numbers permitted. No words BAD or GOOD.
```

### delete

```text
Subject: Delete. Left a record receipt with ID 3 Cid and house icon is visually compared by a magnifying glass and dotted matching line to row ID 3 in a three-row villager table at center. Scissors or eraser precisely remove ONLY row ID 3, label destroy. A clear rightward arrow points to resulting table containing ONLY IDs 1 Ada and 2 Ben, each with a green check. No ID 3 in result. Detached ID 3 row breaks into grey ash below, no return arrow. Lower-right SMALL warning vignette: red X above an entirely emptied table, conveying accidental delete all. Main example larger than warning. Exact words destroy, id, name, address, Ada, Ben, Cid. Numeric IDs allowed. No extra prose.
```


## 成果物・原画・採否

6枚とも独立した不透明PNG。原画は組み込みツールの保存先に保持し、納品用に `sips -z 600 960 <原画> --out <保存先>` を使用。cropなし、alpha追加なし。ワールド用anchorの登録対象外。

| ID | 保存先 | 実測 | 原画パス | 判定 |
|---|---|---|---|---|
| basics-ui | `public/lessons/undersea-review-basics-ui-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f92b-14e1-7d33-b7da-1636007bd989/exec-763d50af-5166-4b1a-93c6-041302ddd950.png` | 採用 |
| basics-server | `public/lessons/undersea-review-basics-server-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f92b-14e1-7d33-b7da-1636007bd989/exec-f03aca63-fcc9-43d6-9fac-514d8f255758.png` | 採用 |
| read | `public/lessons/undersea-review-read-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f92b-14e1-7d33-b7da-1636007bd989/exec-31ee33d2-9520-4d13-b640-268357d9155a.png` | 採用 |
| create | `public/lessons/undersea-review-create-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f92b-14e1-7d33-b7da-1636007bd989/exec-c778d6c8-aa07-40b3-9425-6de9d839286a.png` | 採用 |
| update | `public/lessons/undersea-review-update-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f92b-14e1-7d33-b7da-1636007bd989/exec-fee414a3-9f59-40f6-bd0e-3964b0e1d9d6.png` | 採用 |
| delete | `public/lessons/undersea-review-delete-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f92b-14e1-7d33-b7da-1636007bd989/exec-74047971-ca4d-45c7-9b67-b462bf03412e.png` | 採用 |

## 目視確認

2026-11-20、生成時に表示された原画6枚と、view_imageで納品解像度960×600の6枚を確認。

| 対象 | 確認結果 |
|---|---|
| basics-ui | propsの下向き・emitの上向き、useState/refメーター、画面更新の矢印と発光を確認。4つのコード語は読める |
| basics-server | GET /villagers → Route → Controller、Modelとの往復、Viewへの出力が読める。コード語の綴り正常 |
| read | index側は3行全体、show側はID 3に虫眼鏡と発光。両側とも3行のままで削除・追加なし。GETパスの綴り正常 |
| create | create側は空フォームと3行の表。POST → validate → storeの先だけ4行目が増える。不備フォームは赤い矢印で門から戻る。コード語の綴り正常 |
| update | edit側はID 3 Cidの既存値、PATCH /villagers/3の先はID 3のみDeeに変化。赤い×の悪い例は全行を同じ赤で着色。コード語の綴り正常 |
| delete | 控えのID 3と表の行を照合し、destroyではさみと灰の演出。結果はID 1/2だけで緑チェック。赤い×の悪い例は空表。コード語の綴り正常 |

日本語混入、読めない偽文字、綴り崩れ、ロゴ、透かしは6枚とも目視では認めなかった。人物名・数字・家アイコンは名簿の例示として使用。単体画像として採用し、修正できなかった文字上の問題はなし。

## 検査と未実行範囲

- `sips -g pixelWidth -g pixelHeight -g hasAlpha public/lessons/*.png`：6枚すべて960×600、hasAlpha:no。
- `npm run check:art`：exit 0、PASS（212 PNG headers、84 asset references、14 terrain sets、10 warnings、0 errors）。
- 10警告は既存のcactus/church/desert/ruins原画寸法、mountain/fieldBoundary/tree拡大、cactus/ruinsGate比率、ruinsGate当たり判定に関するもの。新規6枚の警告・エラーなし。
- 実ゲームのPC/スマホ表示、HTML本文との整合、ギャラリー実表示は未確認。srcの所有者であるClaude担当へ引き渡す。
- `npm run build` は未実行。今回許可された書込先がpublic/lessonsと指定docsのみであり、ビルド出力を生成する工程は組み込み担当へ残す。



