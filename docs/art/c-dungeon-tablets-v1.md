# 創生の工房：解説の石板15枚 v1

| 項目 | 内容 |
|---|---|
| 日付・対象・結果 | 2026-11-20。第二章Createの15枚を画像単体で採用 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/backgrounds.md`、imagegen Skill、今回の派遣依頼 |
| 入力 | `src/world/dungeonLessons.ts` の対象15件のtitle/linesを2026-11-20に読んだ。`docs/art/undersea-review-tablets-v1.md` を参照し、`public/lessons/undersea-review-read-960x600.png` をview_imageで目視した。海底画像は生成への画像入力には渡していない |
| 制作方法 | 組み込み `image_gen.imagegen`。新規は1場面1呼び出し、`transparent_background:false`。再生成と局所編集も同じ組み込みツール。API/CLI課金経路への切替なし。生成サイズはプロンプト指定、納品寸法は `sips -z 600 960 <原画> --out <納品先>` |
| 成果物 | 下表の15PNGと本記録のみ。原画は組み込み出力先に保持 |
| 実測・登録 | 全枚960×600、不透明PNG、alphaなし。cropなし。図解専用画像のためマップanchorなし。src登録は担当外 |
| 確認 | 原画と960×600納品画像の全15枚を目視。sipsの実測とcheck:artを実施。実ゲームへの組み込み・PC/スマホ表示確認はClaude担当 |
| 採否の理由 | 琥珀の石材、可愛い精細なJRPGピクセル表現、英字の可読性、本文の操作と題材の一致。誤解を招く初稿は再生成または編集 |
| 次回への反映 | 今回の個別教材の履歴。共通規則は変更していない |

## 成果物・最終原画・採否

| ID | 納品パス | 実測 | 最終原画 | 採否 |
|---|---|---|---|---|
| c-required-1 | `public/lessons/c-required-1-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-7f50a9d2-6924-4002-bfc6-77aeb8431063.png` | 採用 |
| c-detail-1-a | `public/lessons/c-detail-1-a-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-2e1c22bb-492b-4cb8-bc97-72267f37a02f.png` | 採用 |
| c-detail-1-b | `public/lessons/c-detail-1-b-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-34b1bb75-5a93-41ac-b0a6-9e6d3e13ef9d.png` | 採用 |
| c-required-2 | `public/lessons/c-required-2-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-9ce17ac4-426d-4b59-b817-6b9e8c3073d8.png` | 採用 |
| c-detail-2-a | `public/lessons/c-detail-2-a-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-f78b5a04-d724-4990-bb93-22b7918f40b2.png` | 採用 |
| c-detail-2-b | `public/lessons/c-detail-2-b-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-a8de4e7d-9c02-4f02-b2b3-fc17dd0ae503.png` | 採用 |
| c-required-3 | `public/lessons/c-required-3-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-e333935a-dbe4-4c56-8348-ba1afdf9595c.png` | 採用 |
| c-detail-3-a | `public/lessons/c-detail-3-a-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-62fa1976-287e-4d0c-9ed0-eb162d2ad7cf.png` | 採用 |
| c-detail-3-b | `public/lessons/c-detail-3-b-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-109b2061-a3be-4121-9c81-da04a3344820.png` | 採用 |
| c-required-4 | `public/lessons/c-required-4-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-53ea161e-0ba6-4ea2-a98b-bb705e11bcda.png` | 採用 |
| c-detail-4-a | `public/lessons/c-detail-4-a-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-b673e9f9-0ceb-4d7b-a139-6e042b3feef9.png` | 採用 |
| c-detail-4-b | `public/lessons/c-detail-4-b-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-70bd457b-d785-4fa2-a5fe-4ddaa9163f9a.png` | 採用 |
| c-required-5 | `public/lessons/c-required-5-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-41e7e698-afa9-4147-973a-cc75012a9ecc.png` | 採用 |
| c-detail-5-a | `public/lessons/c-detail-5-a-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-41864574-f0cb-4fd1-9fde-23f2386dca9f.png` | 採用 |
| c-detail-5-b | `public/lessons/c-detail-5-b-960x600.png` | 960×600 / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-6ab492c9-2f39-4a97-871e-642d6095d6d3.png` | 採用 |

## 実際に使用したプロンプト

新規生成では共通部分と `Subject: ` に続く個別部分を連結。Aは前半の生成、Bは余分な書名装飾の誘発を減らした後半・再生成に使用した。下記の「編集」は記載された原画をreferenced_image_pathsに渡した別呼び出しで、transparent_background:falseを指定した。これは最終採用品に至る入力履歴であり、参照画像の内容と編集指示を合わせて記録する。

### 共通A

```text
Use case: scientific-educational. ONE standalone 960x600 landscape opaque PNG educational illustration for CodeChronicle. Fine cute SFC-era JRPG pixel art, crisp small pixel clusters and detailed shading. Ancient warm brown stone tablet fills frame, cracked edges, amber crystals and workshop hammer ornaments at corners, dark amber background, glowing golden diagram on stone, top-left light. Same series as blue-grey underwater lesson tablets, but amber and no seaweed/bubbles. Large highly legible monospaced exact English code labels, sparse text. No title, prose, Japanese, pseudo-writing, decorative runes, logo, watermark, UI frame. One coherent diagram, not a collection of separate pictures. Only text expressly specified in Subject. Green checks and red crosses for correctness. No concrete villagers data or IDs unless requested. Book examples use Dragon Lore, Potion Guide, Rune Atlas only. 
```

### 共通B

```text
Use case: scientific-educational. ONE standalone 960x600 landscape opaque PNG educational illustration for CodeChronicle. Fine cute SFC-era JRPG pixel art, crisp small pixel clusters and detailed shading. Ancient warm brown stone tablet fills frame, cracked edges, amber crystals and workshop hammer ornaments at corners, dark amber background, glowing golden diagram on stone, top-left light. Same series as blue-grey underwater lesson tablets, but amber and no seaweed/bubbles. Large highly legible monospaced exact English code labels, sparse text. No title, prose, Japanese, pseudo-writing, decorative runes, logo, watermark, UI frame. One coherent diagram, not a collection of separate pictures. Only text expressly specified in Subject. Green checks and red crosses for correctness. No concrete villagers data or IDs unless requested. 
```

### c-required-1

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Exactly two paths. Upper GET /villagers/create -> create blank form -> villagers table with EXACTLY TWO plain empty row bands. Lower POST /villagers -> store -> villagers table with EXACTLY THREE row bands: two plain bands at top matching original, ONE extra bright green band bottom. Do not use headers as rows. Upper and lower table must have different row counts: TWO versus THREE. Input form lower has abstract filled bars, not letters. No books, book symbols, names, IDs or table values. Exact text only GET /villagers/create, create, villagers, POST /villagers, store.
```

### c-detail-1-a

新規生成：共通A ＋ 次の個別部分。

```text
Subject: Book registration sequence left to right then down: GET /books/create to create blank form with title and author empty fields; filled form title Dragon Lore and author Sora -> POST /books -> store containing validate gate then save disk -> books shelf with existing Potion Guide and newly added Dragon Lore glowing green. Do not append IDs to URLs. Text only GET /books/create, create, title, author, Dragon Lore, Sora, POST /books, store, validate, save, books, Potion Guide.
```

### c-detail-1-b

新規生成：共通A ＋ 次の個別部分。

```text
Subject: Misconceptions versus correct forms, three spacious horizontal comparisons each with red X left and green check right. Top wrong create blank form magically adding book row vs correct create blank form then store save adds book. Middle wrong edit used for blank new form vs correct create blank form; edit shown with existing Potion Guide filled form. Bottom wrong GET /books list eye with save disk vs correct GET /books eye only and separate Book::create([...]) adding one row. Keep text short exact only create, store, save, edit, GET /books, Book::create([...]), Potion Guide. No wrong-to-right ambiguous arrows.
```

### c-required-2

新規生成：共通A ＋ 次の個別部分。

```text
Subject: Sequential store pipeline: input envelope -> validate checkpoint -> new Villager() empty local model card -> same card with filled abstract fields -> save disk -> database abstract table with one glowing added row -> redirect screen. Keep all existing rows intact. No villager values, names, IDs. redirect screen visibly separate from save disk. Exact text only store, validate, new Villager(), save, redirect.
```

最終局所編集。入力原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-cb4a779d-e0f2-4f54-a5d0-689604a4770a.png`。

```text
Edit ONLY lower-left corner decoration: remove the stack of three books and their titles Dragon Lore, Potion Guide, Rune Atlas; replace with matching bare amber stone and one small amber crystal. Do not alter pipeline, table, row count, any other label or icon. This lesson is about villagers. No added text.
```

### c-detail-2-a

新規生成：共通A ＋ 次の個別部分。

```text
Subject: Book store pipeline using large clear icons: input title Dragon Lore, author Sora -> validate -> new Book() blank local card -> filled model card title Dragon Lore author Sora -> save disk -> books table with Potion Guide retained and Dragon Lore added -> redirect('/books') eye/list. Show assignment as glowing arrows into model fields. Exact text only store, title, author, Dragon Lore, Sora, validate, new Book(), save, books, Potion Guide, redirect('/books').
```

### c-detail-2-b

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Three comparisons each wrong red X left, correct green check right. Row 1: wrong redirect screen -> DB plus sign; right save disk -> DB plus sign -> redirect screen. Row 2: wrong new Dragon Lore card overwrites Potion Guide DB row; right new Dragon Lore local card shown SEPARATELY beside unchanged DB containing ONLY Potion Guide, NO arrow into DB. Row 3: wrong Potion Guide table -> table ONLY Dragon Lore; right Potion Guide table -> table with BOTH Potion Guide and Dragon Lore. Exact text only redirect, save, DB, new, Dragon Lore, Potion Guide. Emphasize new model is local and NOT YET in DB.
```

最終局所編集。入力原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-a5981bf7-342f-45e9-b072-dbb91a7f3ebd.png`。

```text
Edit ONLY the lettering below the new Dragon Lore local card in middle-right panel. Remove the entire phrase LOCAL NOT YET IN DB and replace it with no text at all, leaving blank stone. Keep the dotted enclosure, isolated local card, all other exact labels, every diagram, pixel art, layout and colors unchanged. No new text.
```

### c-required-3

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Validation gate labelled validate and required. Upper empty-field input gets stopped by red X gate and curved arrow back to form; grey new and save icons beyond are unreachable, blocked arrow. Lower filled abstract fields pass green check gate, validated field card returns then new -> save. Small separate person/key icon off pathway labelled auth, visually distinct from validate, no arrow implying validation grants permission. Text only validate, required, new, save, auth. No names, numeric IDs, concrete villagers values. Crucial: successful lower form MUST visibly contain dark solid abstract fill bars inside both fields; failure upper form has one empty field and one filled bar. NO books or book decorations.
```

最終局所編集。入力原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-b7d2ef75-0d1a-4d3f-a95d-b9f8d9515d55.png`。

```text
Edit ONLY vertical glowing connector between upper failed validation gate and lower successful validation gate: remove the complete line and downward arrow connecting those two gates, leaving bare matching amber stone. These are separate alternative cases, never a flow from failure to success. Keep all other arrows, gates, forms, text, pixel art and colors identical.
```

### c-detail-3-a

新規生成：共通A ＋ 次の個別部分。

```text
Subject: Book validation diagram. Left two-field form title blank and author Sora -> validate gate labelled required and string -> red X and return arrow to same form error icon; save beyond gate blocked. Lower success path form title Dragon Lore author Sora plus extra unlabelled grey field -> validate -> returned card contains ONLY title Dragon Lore and author Sora, extra grey field visibly filtered out and left behind. Exact text only title, author, Sora, Dragon Lore, validate, required, string, save.
```

最終局所編集。入力原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-5e3f74fc-c4af-45cf-8d38-e05a65fc9e45.png`。

```text
Edit ONLY the top validation gate green check next to required: change that one check into a red X, because title is empty and required fails. Keep string and all other text, arrows, lower successful path, all diagrams and pixel art unchanged.
```

### c-detail-3-b

新規生成：共通A ＋ 次の個別部分。

```text
Subject: Three spacious comparisons red X wrong left, green check correct right. 1 invalid form with one blank field partially saved WRONG; invalid form stopped entirely before save RIGHT. 2 validated returned card contains two gold ruled fields plus grey extra field WRONG; returned card only two gold ruled fields with grey field excluded RIGHT. 3 validate gate directly implies database added row WRONG; validate then distinct save disk then added row RIGHT. Labels only validate, save, title, author. No values or names.
```

### c-required-4

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Two clear horizontal paths. Top: new empty local model card -> filled local model card (abstract dark bars) -> save disk -> DB table with two existing plain rows and one new green bottom row. A dotted enclosure surrounds ONLY the two local cards, stopping before save. No arrow into DB before save. Bottom: redirect eye/screen -> DB table with ONLY same two plain existing rows, equals symbol beside DB signals unchanged. Small store and POST envelope icons at far bottom left, no DB arrows. Exact text only new, save, DB, redirect, store, POST. No books, names, values, prose or extra labels. Large legible icons, amber stone.
```

最終局所編集。入力原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-23b0-7121-a378-4421cda63fa0/exec-4fd719aa-5eba-4d59-b04a-b0e1116ad9e7.png`。

```text
Edit ONLY the equals sign and red X to the right of the bottom DB table: erase both completely, replacing them with matching bare amber stone texture. Keep the lower DB table with exactly two rows, upper DB table with three rows including green new row, every other arrow, icon, English label and pixel-art detail identical. No new text or symbols.
```

### c-detail-4-a

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Book validation retry loop clearly clockwise: filled form title Dragon Lore, blank author -> validate gate red error -> curved return arrow to form labelled old('title'), title Dragon Lore retained; repaired author Sora then resubmit -> validate green check -> save disk -> books shelf adds Dragon Lore next to existing Potion Guide. Large clear arrows, no saving on failure. Exact text only title, author, Dragon Lore, Sora, validate, old('title'), save, books, Potion Guide.
```

### c-detail-4-b

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Three spacious comparisons, red X wrong left and green check right. 1 new empty local book card magically adds DB row WRONG; new stays local and DB unchanged RIGHT. 2 assigning title Dragon Lore directly adds DB row WRONG; filled card -> save disk -> DB new row RIGHT. 3 store with only redirect screen adds DB row WRONG; redirect screen and unchanged DB RIGHT, invalid form return arrow likewise unchanged DB. Labels only new, title, Dragon Lore, save, DB, store, redirect, validate.
```

### c-required-5

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Top main path create empty form -> filled form -> store containing save disk -> abstract table with SAME columns and one extra glowing bottom ROW. Bottom separate smaller migration diagram hammer adds vertical COLUMN to abstract empty schema grid. Clearly distinguish adding horizontal row from adding vertical column, use contrasting outlines and directional arrows. No concrete values, names or IDs. Exact text only create, store, save, migration.
```

### c-detail-5-a

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Book creation four stages clockwise on one tablet: GET /books/create -> create blank title field form; filled title Dragon Lore author Sora -> POST /books -> store with validate then new then save; redirect -> books table with title column already present, existing Potion Guide retained, Dragon Lore new green row. Unchanged column count highlighted with matching brackets. Exact labels only GET /books/create, create, title, author, Dragon Lore, Sora, POST /books, store, validate, new, save, redirect, books, Potion Guide.
```

### c-detail-5-b

新規生成：共通B ＋ 次の個別部分。

```text
Subject: Four concise wrong-versus-right comparisons on one stone, left red X right green check. 1 store before create WRONG vs create form then store RIGHT. 2 migration adds a vertical column to add a book WRONG vs save appends horizontal row RIGHT. 3 rebuilding books table erases existing Potion Guide WRONG vs append Dragon Lore keeps Potion Guide RIGHT. 4 update changes Potion Guide into Dragon Lore WRONG vs Potion Guide retained with Dragon Lore additional row RIGHT. Keep grids simple readable. Exact labels only store, create, migration, save, books, update, Potion Guide, Dragon Lore.
```

## 全枚の目視結果

生成表示の原画に加え、view_imageで960×600納品画像を全枚確認。最後に更新したrequired-2/3も再度納品サイズで目視した。

| 対象 | 確認結果 |
|---|---|
| c-required-1 | GET側は空フォームと2行、POST/store側は入力済みフォームと3行。村人の具体名・ID・住所を描かず、封印の答えとなる値を追加していない。 |
| c-detail-1-a | booksの空フォームからPOST、store内validate/save、本棚へ。Potion Guideを残してDragon Loreが追加される。URLにIDなし。 |
| c-detail-1-b | 赤×と緑チェックの3段。resource createはフォーム、store/saveは保存、editは既存のPotion Guide、GET /booksは目の図。Book::create([...])を別枠で示した。 |
| c-required-2 | store内で入力→validate→new Villager()→代入→save→表の追加→redirectを確認。村人カードに固有値なし。題材を混ぜる装飾本は最終編集で除去。 |
| c-detail-2-a | title/authorの検証、new Book()、代入、save、一覧とredirectの順。既存Potion Guideと新規Dragon Loreが両方残る。 |
| c-detail-2-b | redirectだけで追加する誤り、newで既存を上書きする誤り、追加で古い行が消える誤りを比較。正例のnewカードはDB外の点線内で、DBにはPotion Guideだけ。 |
| c-required-3 | 空欄の失敗は赤×で戻りnew/saveは灰色。入力済みの成功は検証済みカード→new/save。authは独立。失敗から成功へつながる誤解を招く縦線は除去。 |
| c-detail-3-a | title空欄はrequired赤×、保存不可でフォームへ戻る。成功時はtitle/authorだけ返り、余分な灰色欄は除外。stringのチェックはauthorの文字列例を含む規則の図示。 |
| c-detail-3-b | 失敗時の保存なし、ルール対象の2項目だけ、validateとsaveは別の3比較。全段に赤×と緑チェック。 |
| c-required-4 | 点線内のローカル作成・代入とsaveを分離。save側DBは2行＋緑1行、redirectだけのDBは2行。誤解を招く等号＋赤×は除去。 |
| c-detail-4-a | 検証失敗で戻りold('title')でDragon Loreを保持、authorをSoraに修正し再検証→save→本が増える。 |
| c-detail-4-b | newだけ・代入だけ・redirectだけの追加を赤×で表示。正例はsaveだけに追加記号。検証失敗の戻り先でもDBに追加記号なし。 |
| c-required-5 | create→入力→store/saveで行追加。列追加のmigrationは下段で別表示。列と行は縦横の光で区別。 |
| c-detail-5-a | GET/create→入力→POST/store→validate/new/save→redirect→新規本の順。既存title列とPotion Guideが維持される。 |
| c-detail-5-b | 逆順、列追加、表再作成、既存更新の4取り違えを赤×と正例の緑チェックで比較。正例はPotion Guideを残しDragon Loreを追加。 |

全15枚で、日本語、読めない偽文字、文字崩れ、ロゴ、透かしは目視で認めなかった。名前のある本はファンタジー風の書名、著者はSora。村人の具体的な正解データは足していない。取り違えの5枚は赤×と緑チェックで比較。技術語・パス以外の説明文が出た2-bの候補は局所編集して除去した。

図解は本文の全行を文字として再掲せず、仕組みの理解に必要な対比を抽出している。4-aの保存ラベルは画像上では `Save` と先頭大文字だが、保存アイコンのラベルとして読めるため採用した。4-bとrequired-4のstoreに店の小アイコンを生成したが、コード語storeと保存処理の関係は本文と図の矢印で示している。未修正の可読性不良・日本語混入はない。

## 再生成・不採用候補

- required-1初稿は追加前後の行数差が曖昧だったため、2行→3行を明示して再生成。
- required-3初稿は成功フォームも空欄に見えたため入力済みバーを指定して再生成し、失敗例と成功例をつなぐ縦線を局所編集で除去。
- detail-2-b初稿はnewのカードとDBの区別が曖昧だったため再生成。再生成時に出た短文を局所編集で除去。
- detail-3-a初稿はrequired失敗でも緑チェックが付いたため、そのチェックを赤×に修正。
- required-4初稿はローカルと保存の境界が曖昧で装飾本もあったため再生成。再生成で出た等号＋赤×を除去。
- required-2は村人の題材に関係しない装飾本を局所編集で除去。

不採用原画は組み込み保存先に残り、納品先には採用版のみを保存。

## 検査・未実行範囲

- `sips -g pixelWidth -g pixelHeight -g hasAlpha public/lessons/c-*-960x600.png`：15枚すべて960×600、hasAlpha:no。
- `npm run check:art`：最終画像更新後exit 0、PASS。257 PNG headers、84 asset references、14 terrain sets、10 warnings、0 errors。並行作業中の共有ディレクトリなので全体PNG件数は実行時点の値。
- 10警告は既存cactus/church/desert/ruins原画寸法、mountain/fieldBoundary/tree拡大、cactus/ruinsGate比率、ruinsGate当たり判定。今回15枚の警告・エラーなし。
- src/、索引、他担当のファイルは編集していない。HTML本文、石板の登録とギャラリー、PC/スマホ実表示はClaudeへ引き継ぐ。
- `npm run build` は未実行。許可された書込先以外へのビルド出力を避け、統合担当の工程へ残す。

