# 忘却の墓所：解説の石板 v1

| 項目 | 内容 |
|---|---|
| 日付・対象・結果 | 2026-11-20。第二章Deleteの解説15枚、全15枚を画像単体として採用 |
| 使った仕様 | `.agents/skills/game-art/SKILL.md`、`docs/art-direction.md`、`docs/production/uses/backgrounds.md`、派遣依頼。当日の正本 `src/world/dungeonLessons.ts` 忘却の墓所15ID |
| 入力 | `public/lessons/undersea-review-read-960x600.png` を目視、`docs/art/undersea-review-tablets-v1.md` を読解。海底版は目視参照のみ。d-detail-3-a最終編集のみ下記原画を生成ツールへ入力 |
| 制作方法 | 組み込み `image_gen.imagegen`、1画像1呼び出し、`transparent_background:false`。19回新規生成＋1回編集。API/CLI課金経路への切替なし。サイズ専用パラメータなし、プロンプトで指定 |
| 成果物 | 下表15PNGと本記録。src・制作索引は編集しない |
| 実測・登録 | 全15枚960×600 / RGB / alphaなし。`sips -z 600 960 <原画> --out <納品>` で整形。cropなし、anchor対象外。原画はツール保存先に保持 |
| 確認 | 原画全枚と最終960×600全枚を目視。sips、check:artで検証 |
| 採否の理由 | 紫灰色の石面、精細なピクセル、発光図解、可読なコード、Read/Deleteと削除範囲の本文一致 |
| 次回への反映 | 本教材固有の履歴。共通仕様変更なし |

## 最終プロンプト

新規生成は共通部分＋改行＋個別部分を連結。d-detail-3-aは生成後に下記編集を適用。

### 共通部分

```text
Use case: scientific-educational. Create ONE standalone landscape educational diagram illustration for CodeChronicle, target 960x600 pixels 8:5, opaque PNG. Fine cute SFC-era 16-bit JRPG pixel art, crisp detailed pixel clusters, ancient purple-grey stone tablet filling frame, chipped corners and subtle carved edging, dark violet crypt background, tiny amethyst corner crystals. Top-left light, luminous lavender and pale cyan diagram etched on the stone. Same series as an ancient educational stone tablet, NOT modern flat infographic. Large legible monospaced exact code words, generous spacing. No Japanese, fake writing, decorative runes, body prose, title, logo, watermark, UI frame, seaweed or bubbles. One coherent diagram on ONE stone, not a montage. Use ONLY exact labels listed in subject plus numerical IDs and mathematical symbols. Never add villager examples or concrete villager IDs unless explicitly specified; no puzzle solutions. Book names only fantasy titles. Red X for misconceptions, green check for correct alternative. No restoration arrow for deleted records.
```

### d-required-1

```text
Diagram of two separate operations, arranged upper/lower. Upper: GET /villagers/{villager} envelope -> show eye -> an anonymous record card and database cylinder both unchanged, green check. Lower: DELETE /villagers/{villager} envelope -> destroy scissors -> just one anonymous row of a generic blank-lined table dissolves to ash, other blank rows stay. At left of DELETE path a magnifier compares the target card to the selected row BEFORE scissors. No concrete names or IDs, generic blank rows. Exact labels: GET /villagers/{villager}, show, DELETE /villagers/{villager}, destroy.
```

### d-detail-1-a

```text
books example two rows ID 12 Dragon Lore and ID 13 Dragon Lore, two distinct books same title. Upper path GET /books/12 -> show eye and matching receipt magnifier; both rows remain. Downward sequence arrow to separate lower DELETE /books/12 -> destroy scissors removing only ID12; final row only 13 Dragon Lore. Make the two requests visually separate, chronology clear. Exact labels books, id, Dragon Lore, GET /books/12, show, DELETE /books/12, destroy.
```

### d-detail-1-b

```text
Misconceptions vs correct operations. Four horizontal rows each red X wrong pairing on left, green check correct pairing on right. Row1 left GET with scissors crossed out; right GET -> show eye. Row2 left PATCH with scissors crossed out; right PATCH -> update pencil. Row3 left POST /books with scissors crossed out; right POST /books -> store a new book joins shelf. Row4 left DELETE arrow to grey deleted book then return arrow crossed out; right DELETE -> destroy a book dissolves irreversibly into ash with NO return arrow. Exact labels GET, show, PATCH, update, POST /books, store, DELETE, destroy.
```

### d-required-2

```text
Two anonymous record cards with identical blank name fields, distinct key symbols at left, magnifier comparing receipt to one key. Upper green check: exact key targets ONE row for deletion and keeps the other. Lower red X: targeting shared name selects BOTH rows, both lost in ash. No villager names, no concrete IDs, no puzzle answers; anonymous rows and key icons only. Exact labels id, name, delete.
```

### d-detail-2-a

```text
Three books rows 11 Potion Guide, 12 Dragon Lore, 13 Dragon Lore. Three horizontal scenarios: GREEN CHECK id=12 -> delete removes ONLY12 leaves11,13. RED X name=Dragon Lore -> delete removes12 AND13 leaves11. RED X query()->delete() empties all rows. Show before and after miniature tables for EACH scenario with clear IDs, matched arrows, ghost ash rows not inside final table. Exact labels books, id, Potion Guide, Dragon Lore, id=12, name=Dragon Lore, delete, query()->delete().
```

### d-detail-2-b

```text
Three comparison rows, left red X wrong, right green check correct. Top WRONG two cards same name merged into one; CORRECT two cards stay separate, cyan key versus GOLD key visibly DIFFERENT shapes. Middle WRONG scissors point at record7; CORRECT magnifier checks record7 behind GREEN SHIELD, record7 is NOT deleted. Bottom WRONG delete without key erases entire anonymous blank table; CORRECT magnifier compares anonymous cyan key to receipt, table intact awaiting confirmation, NO SCISSORS in bottom-right. Digit7 allowed ONLY in middle row, NEVER bottom row. NO KEEP word, no names, no other numbers. Exact text whitelist: id, name, delete, 7.
```

### d-required-3

```text
Left-to-right flow DELETE /villagers/{villager} envelope with anonymous key -> destroy box holding exactly ONE anonymous record card labelled $villager -> $villager->delete() scissors dissolves ONLY that card -> redirect arrow -> screen showing surviving anonymous blank rows. Above redirect a small crossed-out curved undo arrow with red X so redirect clearly does NOT restore. No concrete villager names or IDs. Exact labels DELETE /villagers/{villager}, destroy, $villager, $villager->delete(), redirect.
```

### d-detail-3-a

```text
ONE connected snake flow, not independent parallel flows. Top-left DELETE /books/12 arrow to top-center destroy(Book $book) holding exactly one card12 Dragon Lore, arrow top-right $book->delete() scissors and ash12. From scissors arrow DOWN directly to bottom-right DB table containing ONLY11 Potion Guide and13 Rune Atlas. Then LEFTWARD arrow labelled redirect('/books') leads bottom-left SCREEN list with SAME ONLY11 Potion Guide and13 Rune Atlas. Thus BOTH database AND final screen already have two rows; redirect only copies the two-row result, NEVER transforms a3-row table into2rows. No3-row table anywhere. Exact labels DELETE /books/12, destroy(Book $book), $book->delete(), redirect('/books'), DB, books, id, Potion Guide, Dragon Lore, Rune Atlas; digits11,12,13. Show direction arrowheads clearly.
```

### d-detail-3-b

```text
Three horizontal misconception comparisons, RED X left versus GREEN CHECK right. Row1: WRONG redirect brings back a grey ghost book; CORRECT redirect -> list containing ONE solid surviving book and separate ash heap OUTSIDE list, NO digits or text on any book icon in first row. Row2: WRONG DELETE /books/12 cuts BOTH12 Dragon Lore and13 Dragon Lore; CORRECT DELETE /books/12 cuts only12 Dragon Lore to ash,13 Dragon Lore remains solid. Row3: WRONG receipt CYAN key versus request GOLD key (different shapes) red X; CORRECT receipt CYAN key matches request CYAN key with magnifier green check. Text whitelist ONLY redirect, DELETE /books/12, Dragon Lore, id,12,13. Digits12/13 are allowed ONLY in MIDDLE row. No trash-bin icon, use irretrievable ashes. No writing on book icons; IDs appear on separate labels.
```

### d-required-4

```text
Three stacked concepts. Top green check: find eye reads anonymous card from full DB table, all rows retained. Middle green check: magnifier confirms matching key then DELETE envelope -> server box scissors -> DB only selected anonymous row removed, other rows stay. Bottom red X: display screen hides one grey row but connected DB cylinder still visibly retains all original rows. No concrete IDs or names. Exact labels find, DELETE, DB, show.
```

### d-detail-4-a

```text
Read then delete sequence for books. Left Book::find(12) -> eye displays12 Dragon Lore with small calendar icon. Center matching receipt12 Dragon Lore and calendar icon under magnifier, DB table still11 Potion Guide,12 Dragon Lore,13 Rune Atlas (all3 intact). Right lower DELETE /books/12 -> scissors -> final list11 Potion Guide,13 Rune Atlas with green check. Read-only first stage distinct from deletion second stage. Exact labels Book::find(12), Dragon Lore, Potion Guide, Rune Atlas, DB, DELETE /books/12, books, id. ABSOLUTELY NO SENTENCES, captions, assertions or prose anywhere. Text must ONLY be one of: Book::find(12), Dragon Lore, Potion Guide, Rune Atlas, DB, DELETE /books/12, books, id, 11,12,13. Leave free space blank. No wrong/correct caption bars.
```

### d-detail-4-b

```text
Three wrong red X vs correct green check comparisons. Top wrong show eye implies book deleted; correct show eye beside FULL intact DB. Middle wrong screen hides row and implies DB deleted; correct screen hidden row but DB keeps full rows. Bottom wrong scissors remove TWO identical title books then magnifier too late; correct magnifier FIRST compares two distinct key icons, then scissors remove only one book leaving the other. Generic book icons and blank rows, no concrete IDs/names. Exact labels show, DB, id, DELETE. No invented confirmation resource name.
```

### d-required-5

```text
One clear three-stage arrow flow. First magnifier compares anonymous record with receipt and checks its key id. Next findOrFail anonymous key retrieves ONE record, then delete scissors erase just that ONE card to ash. Last table shows all other generic anonymous rows still present, green check beside each; eye checks surviving rows. No invented villager names or IDs and no puzzle answer. Exact labels id, findOrFail, delete.
```

### d-detail-5-a

```text
books before table11 Potion Guide,12 Dragon Lore,13 Rune Atlas. Main green check path findOrFail(12) -> one card12 Dragon Lore -> delete scissors -> result table ONLY11 Potion Guide and13 Rune Atlas. Above before3 small book icons, above result2 icons communicates3 to2 without prose. Separate small lower branch findOrFail(12) aimed at absent12 in table containing11 and13 ->404 stop sign, intact same11 and13 table, NO scissors; green check no deletion on missing. Exact labels books, id, Potion Guide, Dragon Lore, Rune Atlas, findOrFail(12), delete,404.
```

### d-detail-5-b

```text
Result diagnosis in books example generic target key and protected keep keys, no concrete IDs or names. Upper-left red X target red outlined book STILL present in result table -> crossed-out scissors means delete not executed. Upper-right red X green shield protected book missing while target still present -> mismatched keys icon. Lower-left red X entirely empty result table -> delete with no id key condition. Lower-right green check magnifier checks target key and receipt BEFORE scissors; only target removed, protected two books survive. Exact labels delete, id, books. Distinct red target and green protected icons consistent in all four vignettes.
```

### d-detail-3-a 最終編集

入力（編集対象、事前目視済み）：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-f061a5bd-5f6f-4926-949d-8fd27c27fb7a.png`。`referenced_image_paths`はこの1枚、`transparent_background:false`。

```text
Edit this purple pixel-art educational tablet. Remove ONLY the unwanted text label 'ash12' in the top-right panel and the word 'SCREEN' in the bottom-left panel, filling their former areas with matching purple stone. Keep the monitor icon. Keep EVERY other element, exact code label, number, table cell, book title, arrow, composition, lighting, crisp pixel art and opaque background unchanged. Do not add ANY new letters or symbols. The final image still has DELETE /books/12 -> destroy(Book $book) -> $book->delete() -> DB containing11 Potion Guide and13 Rune Atlas -> redirect('/books') -> same two-row screen.
```

## 成果物・原画・採否

| ID | 納品パス | 実測 | 原画 | 採否 |
|---|---|---|---|---|
| d-required-1 | `public/lessons/d-required-1-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-c97e6347-5f9b-4536-8001-d2e09ca81ab1.png` | 採用 |
| d-detail-1-a | `public/lessons/d-detail-1-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-7d02c1f8-964e-4e1b-b582-3404f4f198a8.png` | 採用 |
| d-detail-1-b | `public/lessons/d-detail-1-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-117a22db-e735-4dc0-9c78-4db7d5f6845f.png` | 採用 |
| d-required-2 | `public/lessons/d-required-2-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-03945212-1022-4f21-a997-93d615dd68d5.png` | 採用 |
| d-detail-2-a | `public/lessons/d-detail-2-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-e8b675ac-4836-4cde-a574-9381d83d733d.png` | 採用 |
| d-detail-2-b | `public/lessons/d-detail-2-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-c34acb4a-abae-498a-96eb-c9cf8cd2d55b.png` | 採用 |
| d-required-3 | `public/lessons/d-required-3-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-2d64926c-cc97-41c7-842f-9cb0fe2075d8.png` | 採用 |
| d-detail-3-a | `public/lessons/d-detail-3-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-70c1e5b7-f232-40fb-9c54-5851c9453228.png` | 採用 |
| d-detail-3-b | `public/lessons/d-detail-3-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-1444afa0-b54a-47a9-bdf5-11500d7ab18e.png` | 採用 |
| d-required-4 | `public/lessons/d-required-4-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-1c857584-0024-4493-888e-e1b2ee137ecb.png` | 採用 |
| d-detail-4-a | `public/lessons/d-detail-4-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-e5609a9c-f06f-47be-ba42-03e5db1f1ac2.png` | 採用 |
| d-detail-4-b | `public/lessons/d-detail-4-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-5e226933-cf5d-40a9-97f6-12fd18eea5cb.png` | 採用 |
| d-required-5 | `public/lessons/d-required-5-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-61329308-23df-4bd5-bf51-0b9b8432c5e9.png` | 採用 |
| d-detail-5-a | `public/lessons/d-detail-5-a-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-9e157ca9-eacf-41d1-b997-b49d9dc32af7.png` | 採用 |
| d-detail-5-b | `public/lessons/d-detail-5-b-960x600.png` | 960×600 / RGB / alphaなし | `/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-3030c1bf-067c-4b60-89db-10f8b6e029af.png` | 採用 |

## 目視確認

原画・最終納品15枚を全て確認。日本語、読めない偽文字、綴り崩れ、ロゴ、透かしは最終15枚の目視では認めなかった。村人の具体的な正解を追加しないため、名前付きの村人表を避け匿名カード・空欄・鍵を使用。全本文はHTMLで下に併記する前提で主要な仕組みを図示した。

| ID | 確認結果 |
|---|---|
| d-required-1 | GET/showでDB保持、DELETE/destroyで匿名1行だけ削除。 |
| d-detail-1-a | 同題12/13をGET時は保持、DELETE後は13だけ。 |
| d-detail-1-b | GET/show、PATCH/update、POST/storeと不可逆性を赤×・緑チェック比較。 |
| d-required-2 | 主キーなら1行、同名条件なら2行を失う。 |
| d-detail-2-a | id=12は11/13保持、同題条件は11だけ、無条件は空。 |
| d-detail-2-b | 同名でも別主キー、7削除は赤×、7保護は緑チェック。 |
| d-required-3 | URLの1件がdestroyへ渡りdeleteで灰になりredirectでも復元しない。 |
| d-detail-3-a | delete直後DBとredirect先一覧は共に11/13のみ。 |
| d-detail-3-b | redirect復元、同題全削除、キー取り違えの誤解を左右比較。 |
| d-required-4 | findで3件保持、DELETEで1件減少、非表示でもDBは3件。 |
| d-detail-4-a | findと題名・日付アイコン照合でDB3冊保持、DELETE後11/13。 |
| d-detail-4-b | 閲覧だけで削除、非表示でDB削除、先に全削除の誤解を左右比較。 |
| d-required-5 | 照合→findOrFail1件取得→delete→残存行確認。 |
| d-detail-5-a | 12のみ削除し11/13保持。12不在404では無削除。 |
| d-detail-5-b | 対象残存・保持対象欠落・全消去を赤×、事前照合を緑チェック。 |

## 差し戻し・修正

- d-detail-2-b：正しい例の下段にもid=7の削除が入り、保持対象7と矛盾。KEEPの追加文字も含む。 不採用原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-fc34b9fe-7684-4884-b533-3e690c4c6104.png`
- d-detail-4-a：英語の本文説明が2行追加され、短いコード語のみという条件に違反。 不採用原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-8742db03-0343-4e34-9970-71aa81c8e44b.png`
- d-detail-3-b：redirect後の13番アイコンに12の小文字が混入。 不採用原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-ef4ca11d-9b49-4f40-92ad-c2c588f763f1.png`
- d-detail-3-a：下段の削除前表からredirectを経て削除後表へ直結する矢印が、redirect自体が削除するように読めるため再生成。 不採用原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-51802e7c-8f41-4118-b856-05d56b0c087e.png`
- d-detail-3-a：因果関係は修正できたが、指定外ラベルash12とSCREENが混入。編集で2ラベルのみ除去する。 不採用原画：`/Users/ogasawarayuki/.codex/generated_images/01a1f93f-3a52-7642-abe3-fa0f4d40b52e/exec-f061a5bd-5f6f-4926-949d-8fd27c27fb7a.png`

上記は再生成または組み込みimagegen編集で修正済み。旧候補は納品先に残していない。直せず残した文字・本文整合上の問題は今回の目視範囲ではなし。

## 検査と未実行範囲

- `sips -g pixelWidth -g pixelHeight -g hasAlpha public/lessons/d-*-960x600.png`：全15枚960×600、hasAlpha:no。最後のd-detail-3-a差し替え後も個別再測定。
- `npm run check:art`：最終差し替え後exit 0、PASS（227 PNG headers、84 asset references、14 terrain sets、10 warnings、0 errors）。
- 10警告は既存のcactus/church/desert/ruins原画寸法、mountain/fieldBoundary/tree拡大、cactus/ruinsGate比率、ruinsGate当たり判定。今回15枚に警告・エラーなし。
- 実ゲームPC/スマホ、HTML本文と並べた実表示、src画像登録はClaude担当へ引き渡す。単体目視と本文照合は完了したがゲーム内確認済みとは扱わない。
- `npm run build` は未実行。許可された書込先が納品画像と本記録に限られるため、ビルド出力生成は組み込み担当へ残す。

