# 読解の書庫：解説の石板 v1

| 項目 | 内容 |
|---|---|
| 日付・対象・結果 | 2026-11-20。第二章Readの15枚を単体画像として採用 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/backgrounds.md`、派遣依頼、`src/world/dungeonLessons.ts` の該当title/lines（同日読取） |
| 入力 | `public/lessons/undersea-review-read-960x600.png` をview_imageで目視参照。`docs/art/undersea-review-tablets-v1.md` を形式参照。画像はimagegenの画像入力には渡していない |
| 制作方法 | 組み込み `image_gen.imagegen`、1場面1呼出し、`transparent_background:false`。API/CLI課金経路なし。プロンプトで8:5と納品寸法を要求、原画をsipsで960×600へ縮小 |
| 成果物 | 下表の15PNG。各枚独立1場面、不透明。原画はツール保存先に保持 |
| 実測・登録 | 全15枚960×600、RGB、alphaなし。cropなし。anchor登録対象外。src登録とHTML本文はClaude担当 |
| 確認 | 全原画と納品サイズ15枚をview_imageで目視。文字・操作・題材・元DB保持を確認。sipsとcheck:art結果は末尾 |
| 採否の理由 | 青い石板の材質、シアン線、SFC時代JRPGの描写、短い英字と図の対応が基準。海底装飾なし |
| 次回への反映 | 固有制作記録として保持。共通仕様変更なし |

## 最終プロンプト

各枚は次の共通部分＋個別部分＋末尾指定を、この順に連結した文字列を使用した。末尾指定なしの枚は共通＋個別のみ。英字ラベルの長いコードパスは本文との対応に必要なため使用した。

### 共通部分

```text
Use case: scientific-educational. Create ONE standalone landscape diagram illustration for CodeChronicle, target 960x600 pixels, 8:5 aspect ratio, opaque PNG. Fine cute SFC-era 16-bit JRPG pixel art matching the viewed undersea tablet series: large weathered blue-grey stone slab filling almost entire canvas, chipped edges and fine pixel texture, dark sapphire library background, tiny book and blue crystal edge ornaments, top-left lighting, luminous cyan etched diagram with large very legible monospaced labels and generous spacing. No seaweed or bubbles. Not a collage, no UI frame. Only the exact English labels requested, numerals, punctuation and check/cross symbols; no Japanese, decorative runes, pseudo writing, title, prose, logos, watermark. Fantasy books only. Depict reading as eye/magnifier; never mutate database in correct examples. Wrong examples red X, correct examples green check. Keep all words perfectly spelled. 
```

### r-required-1

```text
Two horizontal paths. Top: envelope GET /villagers -> eye labeled index -> villager list containing Rio, Dan, Yuna, Sora, Fumi with tiny house address icons, no numeric IDs. Bottom: envelope GET /villagers/{villager} -> magnifier labeled show -> ONE anonymous villager card with face and house icon, NO name or number on that card. Connect unchanged source list with subtle cyan lines to both read views. Never suggest a specific villager ID match. Exact labels: GET /villagers, index, GET /villagers/{villager}, show, Rio, Dan, Yuna, Sora, Fumi.
```

### r-detail-1-a

```text
Books example. Upper path GET /books -> index -> list of three books: IDs 2 Dragon Lore, 5 Potion Guide, 8 Rune Atlas. Lower path GET /books/5 -> show -> single detailed book card 5 Potion Guide. Eye symbols and a small locked source shelf holding the same three books, reading leaves them intact. Exact labels only GET /books, index, GET /books/5, show, Dragon Lore, Potion Guide, Rune Atlas, 2,5,8. REVISION: all books MUST be closed with pictorial covers. In the detail card show ONLY a large closed Potion Guide book with ID 5 and flask icon. NO open pages, NO printed page lines or scribbles. Only the two requested paths and intact source shelf. No red-cross extra vignettes.
```

### r-detail-1-b

```text
Misconception comparison, two columns red crosses left green checks right, three paired rows. Row1: red create empty form contrasted green index complete book list. Row2 red store arrow adding a book contrasted green index eye reading unchanged list. Row3 red GET /books/5 pointing whole list contrasted green GET /books/5 -> show pointing SINGLE book Potion Guide 5. Forms have blank lines no fake text. Exact labels create, store, index, GET /books/5, show, Potion Guide, 5. Main lesson read pair index/list and show/single.
```

### r-required-2

```text
Generic records diagram without names, numbers or invented conditions. Locked source DB cylinder with four horizontal colored record strips. Arrow where passes through funnel selecting the two BLUE strips; other two gold strips remain in SOURCE. Split result path: get -> tray with BOTH blue strips; first -> tray with ONE blue strip. Source DB still has all four strips, green check. Use small eye icons. Exact labels DB, where, get, first. No delete tool or deletion. All books have purely pictorial covers, closed books or BLANK pages with icons only. No page writing.
```

### r-detail-2-a

```text
Books filtering example. Large source DB shelf contains exactly THREE books, Dragon Lore and Hero Saga grouped by matching purple novel/feather icon, Rune Atlas with gold encyclopedia/globe icon. Arrow where from source through purple feather filter -> get -> two books Dragon Lore and Hero Saga -> view -> screen labeled books.index containing the SAME TWO books. Source shelf still has all three, green check lock. No Japanese genre labels, convey genres only via icons and colors. Exact labels DB, Dragon Lore, Hero Saga, Rune Atlas, where, get, view, books.index. CRITICAL: render ONLY ONE main left-to-right correct flow, no red crosses, NO bottom examples or comparison vignettes. Source shelf three books -> feather filter where -> get tray two purple books -> view -> books.index monitor two purple books. Small green check lock on intact source only.
```

### r-detail-2-b

```text
Misconceptions vs corrections, six clearly separated cells, two columns red X left green check right and three rows. No arrows in cell headings. Top left: where/get label over DB cylinder with only two blue rows remaining (wrong disappearance of gold row); top right: where/get label over DB cylinder retaining two blue rows AND one gold row, adjacent result tray with two blue rows. Middle left: get label directly above tray ONE blue row and first label directly above tray TWO blue rows (wrong); middle right: get label directly above TWO blue rows, first label directly above ONE blue row (correct). These middle trays are side by side, absolutely NO ARROW between get and first. Bottom left: view label at eye points to DB with FOUR rows (wrong insertion); bottom right: view label at eye points ONLY to MONITOR containing two blue rows, plus a SEPARATE LOCKED DB cylinder containing original THREE rows beside monitor, absolutely NO arrow from view to this DB. Exact text only where, get, first, view, DB. Do not write headings with arrows. Abstract row strips no names or numbers. Decorative books closed, pictorial covers only.
```

### r-required-3

```text
Primary key and retrieval diagram with abstract records avoiding any villager identity mapping. Source three-row table header id, name; each row has a DISTINCT tiny key shape icon instead of numeric ID, and SAME anonymous face silhouette icon in name column (conveys duplicate names allowed). Left find points with matching key symbol to ONE highlighted row. Below all points to a bundle of all three rows; count points to number 3 only. Right URL placeholder {villager} points through show to ONE existing row card, no character name or numeric villager ID. Exact labels id, name, find, all, count, 3, {villager}, show. All book pages BLANK or pictorial icon only, no writing. Follow only this scene specification, do not copy other diagrams or add extra examples.
```

### r-detail-3-a

```text
Model binding book example left-to-right. Envelope GET /books/5 -> route placeholder {book} -> source shelf with books 2 Dragon Lore, 5 Potion Guide, 8 Rune Atlas, magnifier selects ONLY book 5 -> model card $book showing Potion Guide 5 -> show. A parallel bottom arrow Book::findOrFail(5) also reaches same model card, meaning equivalent retrieval. Source unchanged green check. Exact labels GET /books/5, {book}, $book, show, Book::findOrFail(5), Dragon Lore, Potion Guide, Rune Atlas, 2,5,8. All book pages BLANK or pictorial icon only, no writing. Follow only this scene specification, do not copy other diagrams or add extra examples.
```

### r-detail-3-b

```text
At top ONLY large query GET /books/5. Absolutely NO source bookshelf, NO source collection at top. Below two columns: left column THREE red X wrong outputs of show: top wrong output ONE closed Dragon Lore book with numeric ID 2; middle wrong output bundle of EXACTLY THREE different closed book icons (dragon, potion, star); bottom wrong output empty outlined record card. Each wrong output labelled show. Right column LARGE green check correct output ONE closed Potion Guide book with numeric ID 5 and flask cover. Small separate strip along bottom: count -> 3 green check beside miniature group of EXACTLY THREE book silhouettes. No other book copies. Exact labels GET /books/5, show, Dragon Lore, Potion Guide, count, 2,5,3. All covers pictorial only, no page writing. Clear readable labels and red/green paired comparison.
```

### r-required-4

```text
Missing record handling using abstract unnamed records and no specific lookup number. Top path find -> null -> decision diamond if; safe branch ends at empty magnifier icon with green check. Unsafe branch from null toward card field name has red X and blocked arrow. Bottom path findOrFail -> lightning exception symbol -> 404 stone door, no path reaching view. Locked source DB has same three strips and is untouched. No fallback row or new row. Exact labels find, null, if, name, findOrFail, 404, DB. All books closed or pages purely blank/icons. No pseudo writing. Do not add any unrequested examples.
```

### r-detail-4-a

```text
Missing BOOK id=99 example. Source books shelf contains only 2 Dragon Lore, 5 Potion Guide, 8 Rune Atlas. Two clear paths: Book::find(99) -> null -> if -> empty magnifier with green check. Lower Book::findOrFail(99) -> lightning exception -> 404 door. Faint view monitor beyond exception has RED blocked arrow, means view is not reached. Source books remain unchanged; NO book 99 created. Exact labels Book::find(99), null, if, Book::findOrFail(99), 404, view, Dragon Lore, Potion Guide, Rune Atlas, 2,5,8. All books closed or pages purely blank/icons. No pseudo writing. Do not add any unrequested examples.
```

### r-detail-4-b

```text
Missing-record misconceptions in three paired rows, red X on left green check on right. Common query find(99). Row1 wrong empty-name book card (blank name line) versus correct null. Row2 wrong adding a new book 99 to DB shelf versus correct null with locked unchanged shelf. Row3 wrong returning first book Dragon Lore 2 versus correct null. Existing source shelf uses books 2 Dragon Lore and 5 Potion Guide; correct shelf stays these two. No new correct record. Exact labels find(99), null, DB, Dragon Lore, Potion Guide, 2,5,99. Use repeated null large and readable. All books closed or pages purely blank/icons. No pseudo writing. Do not add any unrequested examples.
```

### r-required-5

```text
Read decision flow using fantasy books. At top eye at fork, left GET /books -> index -> three books 2 Dragon Lore, 5 Potion Guide, 8 Rune Atlas; right GET /books/5 -> show -> one book 5 Potion Guide. Along bottom locked DB source shelf has same three books with a clear loop through eye returning to identical shelf, green checks showing repeat reads leave rows and values unchanged. Exact labels GET /books, index, GET /books/5, show, DB, Dragon Lore, Potion Guide, Rune Atlas, 2,5,8. All books closed or pages purely blank/icons. No pseudo writing. Do not add any unrequested examples.
```

### r-detail-5-a

```text
One continuous horizontal journey, two stages on single tablet. GET /books -> index -> list 2 Dragon Lore, 5 Potion Guide, 8 Rune Atlas. Cursor hand selects row 5 (bright outline), arrow GET /books/5 -> show -> detailed card 5 Potion Guide same book icon and cover. Lower locked source shelf retains same three books and green check. Keep text compact yet readable, no PATCH DELETE or mutations anywhere. Exact labels GET /books, index, GET /books/5, show, Dragon Lore, Potion Guide, Rune Atlas, DB, 2,5,8. All books closed or pages purely blank/icons. No pseudo writing. Do not add any unrequested examples.
```

### r-detail-5-b

```text
Three misconception/correct pairs red cross left green check right. Row1 wrong GET /books/create -> empty form, correct GET /books/5 -> show -> single book icon. Row2 wrong PATCH -> paintbrush changing book, correct GET -> eye reading same book. Row3 wrong where -> get erases nonmatching source book, correct where -> get returns two matching blue book icons while original DB shelf keeps three books (two blue one gold). No character names or book titles needed. Repeated read arrows loop to same intact shelf. Exact labels GET /books/create, GET /books/5, show, PATCH, GET, where, get, DB. All books closed or pages purely blank/icons. No pseudo writing. Do not add any unrequested examples.
```

## 成果物・原画・採否

| ID | 保存先 | 実寸・alpha | 原画 | 採否 |
|---|---|---|---|---|
| r-required-1 | `public/lessons/r-required-1-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-2ce7fdc3-023f-4cc8-9a96-e3a2467fd9cd.png` | 採用 |
| r-detail-1-a | `public/lessons/r-detail-1-a-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-8b0b578b-ef5d-49fa-90fc-4d1649cd311c.png` | 採用 |
| r-detail-1-b | `public/lessons/r-detail-1-b-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-36f5d57a-380e-4b0f-b4f5-7e0fad30cec0.png` | 採用 |
| r-required-2 | `public/lessons/r-required-2-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-180319c5-aa12-4d23-b390-d97c23aded3d.png` | 採用 |
| r-detail-2-a | `public/lessons/r-detail-2-a-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-96aa846b-ca58-431f-8503-89dcc8a6f56a.png` | 採用 |
| r-detail-2-b | `public/lessons/r-detail-2-b-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-aebe13a2-da48-4f98-98e7-70d7b6851020.png` | 採用 |
| r-required-3 | `public/lessons/r-required-3-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-423f5ba4-b0a4-4748-b1ed-f52ce9bb510d.png` | 採用 |
| r-detail-3-a | `public/lessons/r-detail-3-a-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-6030e227-a4ee-461a-9521-792b3e9e133b.png` | 採用 |
| r-detail-3-b | `public/lessons/r-detail-3-b-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-8cadf87b-8d81-4924-be1b-15e64a542e5e.png` | 採用 |
| r-required-4 | `public/lessons/r-required-4-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-1f1a4122-26b8-4e0c-b117-43b36578a2dc.png` | 採用 |
| r-detail-4-a | `public/lessons/r-detail-4-a-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-cd7b6ef3-d8fd-4bb8-b3b7-3b902e0d2633.png` | 採用 |
| r-detail-4-b | `public/lessons/r-detail-4-b-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-52a1b5c2-834f-4324-bd29-a62cd3c668cd.png` | 採用 |
| r-required-5 | `public/lessons/r-required-5-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-9a6cd9a9-1dd4-4307-9a3e-ad850ae725aa.png` | 採用 |
| r-detail-5-a | `public/lessons/r-detail-5-a-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-213b61e3-83cc-463d-8efc-4f617d5cccb3.png` | 採用 |
| r-detail-5-b | `public/lessons/r-detail-5-b-960x600.png` | 960×600 / RGB / なし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-4c7d6d61-7e3c-49a9-a8b9-d47d10ad0fe6.png` | 採用 |

全枚に `sips -z 600 960 <原画> --out public/lessons/<id>-960x600.png` を使用。原画の描き直しは組み込みimagegenで行い、文字の手描き合成や別生成経路は使用していない。

## 目視確認

生成時の原画に加え、納品解像度の全15枚をview_imageで確認した。

| ID | 確認結果 |
|---|---|
| r-required-1 | GET一覧/indexと番号付き/show、Rio・Dan・Yuna・Sora・Fumi、住所の家アイコンを確認。村人と具体的なIDの対応は追加していない。 |
| r-detail-1-a | GET /booksは3冊、/books/5はPotion Guide 5の1冊。元の3冊を保持し、ページの偽文字を除去。 |
| r-detail-1-b | create空フォーム・store保存・番号付きGETの一覧誤認を赤×、index一覧/show詳細を緑チェックで対比。追加のlist/singleは正しい短い英語説明。 |
| r-required-2 | 元DB4行を保持、青い一致行2件をget、1件をfirst。下の誤例は赤×。 |
| r-detail-2-a | 小説2冊を紫の羽根、図鑑1冊を金の地球で区別。where/get/view/books.indexと元DB3冊の保持を確認。 |
| r-detail-2-b | 条件外の削除・get/first逆転・view保存の誤例を赤×。正例はDB3行を保持、get2行/first1行、viewは画面へ接続。 |
| r-required-3 | 主キーは異なる鍵、同じ名前は同じ無名シルエットで抽象化。find1行/all全3行/count3、show既存1行を確認。封印の答えを避けるため村人名と数値IDの対応を描かない。 |
| r-detail-3-a | {book}と$book、GET /books/5で5の本を取得しshowへ。Book::findOrFail(5)も同じ1冊へ接続、元3冊を保持。 |
| r-detail-3-b | showで先頭2・全件・空カードを返す誤例が赤×。正例はPotion Guide 5、countは3冊の数字3。 |
| r-required-4 | find→null→if、安全な不在処理とnameへの危険な参照の赤×。findOrFail→例外記号→404。 |
| r-detail-4-a | id99なし、Book::find(99)→null→if。findOrFail(99)→例外→404、viewの手前で遮断。 |
| r-detail-4-b | 空名99・99自動追加・先頭2への代用を赤×。いずれの正例もnull、DB変更なし。 |
| r-required-5 | 番号なしGET/index3冊と番号付きGET/show1冊、読み返しても同じDBの3冊。 |
| r-detail-5-a | index一覧で5を選択→GET /books/5→show。書名と値を維持、PATCH/DELETEなし。 |
| r-detail-5-b | createフォーム・PATCH変更・検索を削除と捉える誤例を赤×。GET詳細と元DB3冊を保つ検索結果2冊を緑チェック。 |

全15枚について、日本語混入・読めない偽文字・コード語の綴り崩れ・透かしは目視では認めなかった。装飾の本は閉じた本か絵柄のみ。フォーム/一覧内の横線は空欄・行の図形表現で、文章の疑似文字として扱っていない。未修正の既知の文字不良はない。主キーの番号そのものの説明、例外を捕まえる場合の条件などはHTML本文と併用する図解であり、本文全体を画像内へ転載していない。

## 不採用・再生成

| 対象 | 不採用原画 | 理由 |
|---|---|---|
| r-detail-1-a | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-3cba3e10-5def-4654-9971-b5923ae597a2.png` | 開いた本のページに装飾的な疑似文字があったため閉じた本へ変更。 |
| r-detail-2-b | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-b1b459ec-851b-471f-b801-e3fe4265a090.png` | 正例の見出しにview→DBが入り保存と誤読できるため再生成。 |
| r-detail-2-a | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-ab0bb651-1bd5-431e-b1c8-de64b0ad4bfc.png` | 本文外の下段比較を省き、正しい一本の流れへ簡略化。 |
| r-detail-3-b | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-2edfe8fc-433c-4681-b838-40768d216d6b.png` | 誤ったshow出力であることを各誤例で明示するため再生成。 |
| r-detail-3-b-second | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-14e9-7d92-9446-31c46dad8329/exec-1466906d-2a12-4d73-abc7-0b86ccda4692.png` | 元棚のID 2/5/8を冊数として描いてしまいcount3と矛盾したため再生成。 |

## 検査・引き継ぎ

- `sips -g pixelWidth -g pixelHeight -g hasAlpha public/lessons/r-*-960x600.png`：15枚すべて960×600、hasAlpha:no。
- `npm run check:art`：exit 0、PASS（実行時点242 PNG headers、84 asset references、14 terrain sets、10 warnings、0 errors）。共有作業場所なのでPNG総数は他担当分も含む実行時の値。
- 10警告は既存原画の命名寸法4件、mountain/fieldBoundary/tree拡大3件、cactus/ruinsGate比率2件、ruinsGate空当たり判定1件。新規15枚の警告・エラーなし。
- src・制作索引は編集していない。PC/スマホ実ゲームとギャラリーへの組み込み、HTML本文との実画面比較はClaude担当へ残す。画像単体の採用判断と統合後の採用判断は別。
- `npm run build` は未実行。書込許可範囲にビルド出力が含まれないため、組み込み担当へ引き継ぐ。

