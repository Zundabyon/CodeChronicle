# 改変の回廊：Update解説石板 v1

| 項目 | 内容 |
|---|---|
| 日付・対象・結果 | 2026-11-20。第二章「改変の回廊」の15枚。全枚採用 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、派遣依頼の固有仕様。本文正本 `src/world/dungeonLessons.ts` の対象15IDを参照 |
| 入力 | `docs/art/undersea-review-tablets-v1.md`を読み、`public/lessons/undersea-review-read-960x600.png`と`public/lessons/undersea-review-update-960x600.png`をview_imageで目視。石材・発光線・図解配置の参照。imagegenの画像入力には渡していない |
| 制作方法 | 利用可否確認後、組み込み `image_gen.imagegen`。1枚1呼出し、`transparent_background:false`。API/CLI課金経路なし。各原画をmacOS sipsで960×600へ縮小 |
| 成果物 | 下記15PNGと本記録。src・索引は編集しない |
| 実測・登録 | 全15枚960×600、不透明RGB PNG、alphaなし。cropなし、anchor登録対象外。HTML本文とコード登録はClaude担当 |
| 確認 | 全原画と全最終960×600画像を目視。sipsで寸法とalpha検査。`npm run check:art` exit 0 |
| 採否の理由 | 翡翠色の石板、SFC調の細かいピクセル、ミント色の線、短い英字ラベル、本文の操作・更新範囲が判別可能 |
| 次回への反映 | 本教材固有の履歴。共通仕様変更なし |

## 成果物・原画・採否

原画は組み込みツール既定保存先に残している。納品処理は各行について `sips -z 600 960 '<原画>' --out '<保存先>'`。全15枚を独立ファイルとして保存、まとめ画像なし。

| ID | 保存先 | 実測 | 原画パス | 採否 |
|---|---|---|---|---|
| u-required-1 | `public/lessons/u-required-1-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-1f0cfef6-cd68-42af-85b2-8dba81bcf4d7.png` | 採用 |
| u-detail-1-a | `public/lessons/u-detail-1-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-433f9ca9-9e1c-4e0a-b064-0a95e39371e8.png` | 採用 |
| u-detail-1-b | `public/lessons/u-detail-1-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-995ddfbc-acfb-43ce-b156-cfaa97cf8b1f.png` | 採用 |
| u-required-2 | `public/lessons/u-required-2-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-f3ae203f-361f-4db7-bce2-f40f95d13bff.png` | 採用 |
| u-detail-2-a | `public/lessons/u-detail-2-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-83ea1e47-8a5b-4a92-8b64-8d601d5cce0a.png` | 採用 |
| u-detail-2-b | `public/lessons/u-detail-2-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-2475d627-b169-487d-8b67-250a2558f8c1.png` | 採用 |
| u-required-3 | `public/lessons/u-required-3-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-03b5587b-5421-467f-bc4d-585ddf416bf2.png` | 採用 |
| u-detail-3-a | `public/lessons/u-detail-3-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-79a415e8-480e-4665-ad8f-9e3ee3171508.png` | 採用 |
| u-detail-3-b | `public/lessons/u-detail-3-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-ce23fccc-f211-4e88-9aca-82e5e4d100a2.png` | 採用 |
| u-required-4 | `public/lessons/u-required-4-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-b756fe09-da5e-42ac-b600-0540da7bae0a.png` | 採用 |
| u-detail-4-a | `public/lessons/u-detail-4-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-e29a7aa4-22c1-4c18-b105-1b1dea0e994c.png` | 採用 |
| u-detail-4-b | `public/lessons/u-detail-4-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-2ba614ee-2d11-48bb-a6e7-fe21497582b0.png` | 採用 |
| u-required-5 | `public/lessons/u-required-5-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-3fe4c5b8-08e1-49b4-8ac3-a52ef3577a05.png` | 採用 |
| u-detail-5-a | `public/lessons/u-detail-5-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-ca090e72-2bf2-4942-8a47-bbe201a28efa.png` | 採用 |
| u-detail-5-b | `public/lessons/u-detail-5-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-2f44-7f63-b48f-6d1498d08389/exec-92fac83f-e03f-4869-bf71-0739d2b46659.png` | 採用 |

## 各枚の最終プロンプト

各最終呼出しは「対応する共通部分」「改行」「Subject: 」「個別部分」をそのまま連結。文字列は以下に保存する。

### 共通部分A

```text
Use case: scientific-educational. Generate ONE standalone opaque PNG, landscape 960x600 (8:5). CodeChronicle fine cute SFC-era JRPG pixel art. Large weathered JADE-GREEN ancient stone tablet fills almost whole image, chipped carved stone edges, subtle emerald crystal corner ornaments, dark jade corridor background. No seaweed, bubbles, underwater decor. Crisp small pixel clusters and stepped material shading, light from upper left. Luminous mint-cyan lines etched into stone form a beautifully clear instructional diagram with generous spacing. Match the series of blue-grey undersea stone tablets but use JADE GREEN. No title, prose, Japanese, fake letters, decorative runes, watermark, logo, or outer UI frame. Only the EXACT English code labels listed in subject and numeric IDs/values are allowed. Use large readable monospaced pixel lettering. One coherent diagram etched on ONE stone, not a collage of artworks. Table cells have clear borders and all rows remain readable. Villager names only Rio, Dan, Yuna, Sora, Fumi; addresses only house icons. Books use fantasy titles. Red X means incorrect, green check means correct. Do not invent villagers update answers or specific changed villagers values.
```

### 共通部分B

```text
Use case: scientific-educational. Generate ONE standalone opaque PNG, landscape 960x600 (8:5). CodeChronicle fine cute SFC-era JRPG pixel art. Large weathered JADE-GREEN ancient stone tablet fills almost whole image, chipped carved stone edges, subtle emerald crystal corner ornaments, dark jade corridor background. No seaweed, bubbles, underwater decor. Crisp small pixel clusters and stepped material shading, light from upper left. Luminous mint-cyan lines etched into stone form a beautifully clear instructional diagram with generous spacing. Match the series of blue-grey undersea stone tablets but use JADE GREEN. No title, prose, Japanese, fake letters, decorative runes, watermark, logo, or outer UI frame. Only the EXACT English code labels listed in subject and numeric IDs/values are allowed. Use large readable monospaced pixel lettering. One coherent diagram etched on ONE stone, not a collage of artworks. Table cells have clear borders and all rows remain readable. Books use fantasy titles. Red X means incorrect, green check means correct. No villagers, names, houses, or unrelated tables whatsoever.
```

### u-required-1（共通部分A）

```text
Simple two-part diagram ONLY. Upper main path: a villagers table with exactly 3 rows, headers id/name/address, rows 1 Rio,2 Dan,3 Yuna with house icons. Arrow labeled GET /villagers/{villager}/edit points to prefilled edit form, id1 name Rio address same red-roof house. Eye icon on arrow. Lower area contains ONLY a closed locked DB chest, plus exactly THREE tiny villager icons, communicating no database write and no row count change. NO additional tables or labels at bottom. No update arrow. Exact text only id,name,address,Rio,Dan,Yuna,edit,DB,GET /villagers/{villager}/edit. Names and addresses must not change.
```

### u-detail-1-a（共通部分A）

```text
Book 5 edit form: left small books table id/title with rows 3 Potion Guide, 5 Dragon Lore, 7 Rune Atlas. Arrow labeled GET /books/5/edit to large prefilled form labeled edit, id 5, title Dragon Lore. Pencil poised over title field, not yet sent. Original table row 5 Dragon Lore remains cyan unchanged, closed lock on DB. No save arrow. Exact labels books, id, title, Potion Guide, Dragon Lore, Rune Atlas, GET /books/5/edit, edit, DB.
```

### u-detail-1-b（共通部分A）

```text
Four paired comparison lanes, red X incorrect at left versus green check correct at right. Lane1 create shows blank form vs edit shows prefilled book5 Dragon Lore form. Lane2 GET /books/5 and show eye vs GET /books/5/edit and edit pencil form. Lane3 PATCH with form-opening icon crossed vs GET with form-opening icon checked. Lane4 store with new row plus icon crossed vs update with existing row pencil checked. Exact text only create, edit, GET /books/5, show, GET /books/5/edit, PATCH, GET, store, update, Dragon Lore. Do not imply these methods intrinsically invalid; X lanes mean wrong choice for existing-record editing.
```

### u-required-2（共通部分A）

```text
Left PUT and PATCH envelopes both point to same selected record tagged id, generic numeric symbol 5. Main diagram books table BEFORE and AFTER, each exactly three rows: 3 Potion Guide, 5 Dragon Lore, 7 Rune Atlas. Highlight ONLY title cell row5 in after as Star Atlas, all other title cells and author pictograms unchanged. Flow through retrieve icon then title pencil then save into DB. Exact labels PUT, PATCH, id, title, author, books, Potion Guide, Dragon Lore, Rune Atlas, Star Atlas, save, DB. Use small consistent author portraits/icons without names. Clearly unchanged row count.
```

### u-detail-2-a（共通部分A）

```text
PATCH /books/5 flows through validate gate with green check, then findOrFail(5) magnifying glass selecting row5 book. A local book card title changes Dragon Lore to Star Atlas, fixed author portrait unchanged. save arrow writes into books table with 3 rows id3 Potion Guide,id5 Star Atlas,id7 Rune Atlas, author portraits unchanged. Use title-only highlighted green cell. Exact text PATCH /books/5, validate, findOrFail(5), title, author, save, books, id, Dragon Lore, Star Atlas, Potion Guide, Rune Atlas. Star Atlas is the English fantasy rendering of the Japanese requested star-map title.
```

### u-detail-2-b（共通部分A）

```text
Three red X incorrect request choices in small left lanes: POST /books with extra-row plus, GET /books/5/edit with eye and locked DB, DELETE with disappearing book5. Large right green check PATCH /books/5 sends title change via save to existing book5. Show card title Dragon Lore -> Star Atlas with green changed title and SAME author portrait framed cyan. Small red X beside brush trying to repaint author; green check beside unchanged author. Exact labels POST /books, GET /books/5/edit, DELETE, PATCH /books/5, title, author, Dragon Lore, Star Atlas, save. Clear X choices wrong for saving an existing title.
```

### u-required-3（共通部分B）

```text
Very simple diagram with NO TABLES and NO extra text. Upper half: left DB chest with title Dragon Lore, outward copy arrow to model paper title Dragon Lore, pencil changes local paper into title Star Atlas. Under the changed paper show a smaller locked DB chest still Dragon Lore; no arrow enters this chest. Right bright save arrow carries changed paper into final DB chest title Star Atlas. Bottom only redirect sign -> a screen icon. Nothing else. ONLY exact labels: DB,model,title,Dragon Lore,Star Atlas,save,redirect. Do not print stage/local change/persisted change or any explanatory prose.
```

### u-detail-3-a（共通部分B）

```text
Two comparison horizontal lanes, EXACT TEXT ONLY findOrFail(5),title,redirect,DB,save,id,Dragon Lore,Star Atlas,Potion Guide,Rune Atlas. NO phrase missing save or other prose. Top lane: DB table3rows id3 Potion Guide,id5 Dragon Lore,id7 Rune Atlas. findOrFail(5) retrieves book5, local title pencil changes Dragon Lore to Star Atlas. redirect arrow leads to SCREEN ICON ONLY. Beside screen a SEPARATE locked DB table still has same3 original rows and Dragon Lore, no write arrow. RedX beside unwritten Star Atlas local paper. Bottom lane same original table retrieves changed local Star Atlas then save arrow into DB table3rows id3 Potion Guide,id5 Star Atlas,id7 Rune Atlas green check. All other rows unchanged.
```

### u-detail-3-b（共通部分B）

```text
Four concise comparison rows, incorrect red X left versus correct green check right. Row1 local model pencil -> DB instant sparkle crossed, versus model pencil -> save -> DB checked. Row2 redirect -> DB crossed versus redirect -> screen checked. Row3 unsaved paper -> DB missing row crossed versus DB original three rows intact checked. Row4 unsaved paper -> DB extra row crossed versus DB original same three rows checked. Use book icons with colored spines instead of title text. Exact labels only model, save, DB, redirect. Avoid invented textual explanations.
```

### u-required-4（共通部分B）

```text
Main green-check path: input paper -> validate gate -> id filter selecting only id5 -> update -> books table exactly three rows 3 Potion Guide,5 Star Atlas,7 Rune Atlas, only row5 title green. Small red-X comparison: update arrow WITHOUT filter recolors all 3 title cells same red Star Atlas. Bottom empty input paper hits validate gate red stop and bounces back, DB original row5 Dragon Lore remains locked. Exact labels validate, id, update, books, title, Potion Guide, Dragon Lore, Star Atlas, Rune Atlas, DB. Clear only valid input passes and id selects one.
```

### u-detail-4-a（共通部分B）

```text
ONE tablet, three scope comparison columns. At top of each column draw the SAME initial three-row books table: id3 Potion Guide,id5 Dragon Lore,id7 Rune Atlas. Below arrows, three output tables. LEFT green check, filter labeled id=5, result titles Potion Guide,Star Atlas,Rune Atlas (only id5 highlighted). MIDDLE red X, label query()->update(), result all3 Star Atlas in RED. RIGHT red X, filter label genre, two same-genre icons select IDs3 and5, result titles Star Atlas,Star Atlas,Rune Atlas (first2 RED). Genre must have RED X since it affects more than desired single book. Bottom blank input paper hits validate redX stop gate; NO ARROW continues beyond gate. ONLY text allowed: id,title,id=5,query()->update(),genre,validate,Potion Guide,Dragon Lore,Rune Atlas,Star Atlas. No explanatory prose.
```

### u-detail-4-b（共通部分B）

```text
Three paired lanes on ONE tablet. NO extra titles or prose. Row1: redX genre symbol selects TWO book icons IDs3,5; greencheck id=5 selects ONLY book5. Row2: redX delete turns table with3 colored book icons IDs3,5,7 into2 icons IDs3,7; greencheck update repaints title cell book5 while keeping3 icons IDs3,5,7. Row3: redX blank title input -> blank DB title cell; greencheck blank title input -> required gate with RED STOP X and return arrow BOUNCING BACK to input. At far right SEPARATE locked DB card Dragon Lore remains unchanged with NO ARROW FROM GATE TO DB. ONLY text genre,id=5,delete,update,title,required,DB,Dragon Lore and digits. No humans, houses, names, extra book titles.
```

### u-required-5（共通部分B）

```text
Main sequential flow edit -> update -> DB. Left prefilled book5 form title Dragon Lore with pencil; middle envelope update points to right books table, row5 title Star Atlas. Below side-by-side before/after tables each exactly 3 rows id3 Potion Guide,id5 Dragon Lore then Star Atlas,id7 Rune Atlas. Large eye/magnifier and TWO green checks: one beside three book icons counting rows, one beside changed title cell row5. Exact words edit, update, DB, books, id, title, Potion Guide, Dragon Lore, Rune Atlas, Star Atlas. No new rows. Avoid specific villagers solutions.
```

### u-detail-5-a（共通部分B）

```text
Book stock update workflow, clear left-to-right arrows in two wide horizontal tiers linked sequentially. GET /books/5/edit -> edit form id5 Dragon Lore stock2 -> pencil changes stock to4 -> PATCH /books/5 -> update -> findOrFail(5) -> save -> final books table. Final table id/title/stock exactly rows 3 Potion Guide 6;5 Dragon Lore 4;7 Rune Atlas 8. Before miniature table same rows except stock5 was2. Only row5 stock cell green, title and other books unchanged. Exact labels GET /books/5/edit, edit, id, title, stock, Dragon Lore, PATCH /books/5, update, findOrFail(5), save, books, Potion Guide, Rune Atlas. Numbers permitted. No title changes in this stock example.
```

### u-detail-5-b（共通部分B）

```text
ONE tablet, only THREE comparison columns with before/after tables. Each starts with exactly same3 rows id3 Potion Guide,id5 Dragon Lore,id7 Rune Atlas. LEFT redX result has4 rows, original3 unchanged and extra id8 Star Atlas, plus sign. MIDDLE redX result still3 rows but ALL titles Star Atlas colored RED. RIGHT green check result exactly3 rows, id3 Potion Guide,id5 Star Atlas,id7 Rune Atlas; ONLY row5 changed green. At lower right two magnifier icons: one around3 book icons with green check, second around id5 Star Atlas cell with green check. ONLY permitted text: id,title,Potion Guide,Dragon Lore,Rune Atlas,Star Atlas and digits. Absolutely NO prose, NO headings, NO Row Count, NO Changed Title, NO sentence at bottom. Leave blank stone in any remaining space.
```

## 目視確認

全15枚の原画と、縮小保存後の全15枚をview_imageで個別確認した。

| ID | 確認結果 |
|---|---|
| u-required-1 | GETで既存値をeditへ表示。Rio/家アイコンは変更なし。施錠DBと赤×は書込なし、人物3体と緑✓は件数維持。 |
| u-detail-1-a | 5番Dragon Loreの既存値をフォーム表示。DB側もDragon Loreのまま。 |
| u-detail-1-b | create/edit、show/edit、PATCH/GET、store/updateの四組を赤×・緑✓で対比。 |
| u-required-2 | PUT/PATCH、対象id5、title代入、save。3行とauthor肖像は維持しtitleだけ変更。 |
| u-detail-2-a | validate→findOrFail(5)→title変更→save。author同一、結果3冊。 |
| u-detail-2-b | POST・GET edit・DELETEを更新保存の誤選択として赤×。PATCH保存、titleのみ変更、author維持を緑✓。 |
| u-required-3 | DBからmodelへ控えを取得。代入直後の小DBは旧値。save後のみStar Atlas。redirectは画面のみ。 |
| u-detail-3-a | 上段redirect後DBは旧値、下段save後DBのみ新値。両段とも3冊維持。 |
| u-detail-3-b | 代入即DB・redirect保存・未保存で削除・未保存で追加の四誤解を対比。書名は色付き本アイコンへ簡略化。 |
| u-required-4 | validate→id5→updateは1行、条件省略は全行。空入力は検証で返り旧値維持。 |
| u-detail-4-a | id5で1行、条件なしで3行、genreで2行が変化。後二者は赤×。空入力はvalidateの停止印で終了。 |
| u-detail-4-b | genreで複数/idで1行、deleteで減少/updateで同数、空入力の誤保存/required停止を対比。DBは旧値で施錠。 |
| u-required-5 | edit→update→DB、3行とid5の値を別々のチェックで確認。 |
| u-detail-5-a | GET edit→在庫2を4へ→PATCH→findOrFail(5)→save。title/他の在庫6・8/3冊は維持。 |
| u-detail-5-b | 追加で4行、条件なしで全行同値を赤×。3行維持かつid5だけ変更を緑✓、二つの虫眼鏡で検査。 |

全15枚で日本語、偽文字、判読不能な文字崩れ、ロゴ、透かしは目視で認めなかった。長いURLは小さめだが960×600で読める。図の数値・書名は教材用の例であり、villagers表の更新問題の正解となる具体的変更は示していない。「星の地図」は英字限定のためStar Atlasと表現した。u-detail-4-a/5-bのID欄は生成結果でid3/id5/id7というラベルになっているが、各対象IDは一意に読める。修正できなかった文字上・内容上の問題はなし。

初期候補では余分な表・村人表の混入、英文説明文、genreの複数更新への誤った緑チェックがあったため不採用とし、新規生成で修正した。採用画像へのプログラムによる描き足し・文字合成はしていない。

## 検査・未実行範囲

- `sips -g pixelWidth -g pixelHeight -g hasAlpha public/lessons/u-*.png`：15枚すべて960×600、hasAlpha:no。
- `npm run check:art`：exit 0、PASS、272 PNG headers / 84 asset references / 14 terrain sets / 10 warnings / 0 errors。
- 警告10件は既存原画寸法・木/山の拡大・サボテン/門の比率・門の当たり判定。今回の15枚の警告なし。共有作業場所なのでPNG総数は他担当の追加にも依存する。
- ゲーム内PC/スマホの実表示・HTML本文組み込み・ギャラリー表示は未確認、Claudeへ引継ぎ。
- `npm run build`は未実行。今回の書込許可は指定PNGと本記録に限定され、ビルド出力を作成する工程は組み込み担当へ残す。

