# 裏会議話者ポートレート v1

## 制作結果

- 日付: 2026-11-14
- 結果: 採用
- 対象: `positive`、`neutral`、`negative`、`user`、`ai`、`metappi`、`maou`
- 用途: おまけ「裏会議」の会話用全身立ち絵（各4ポーズ）と胸像（各1枚）

## 参照と仕様

- 共通仕様: `docs/art-direction.md`、`docs/production/uses/dialogue-portraits.md`
- 台本・役割: `src/quests/backstageMeetings.ts`
- 立ち絵の画風・構図参照: `public/portraits/chapter-two/standing-graphius.png`
- 胸像の画風・構図参照: `public/portraits/chapter-two/face-graphius.png`
- 参照画像は人物同定ではなく、暗いグラデーション背景、左上光源、細密なSFC風ピクセル表現、全身または胸像の画角を揃える目的で使用した。

## 制作方法と指示

組み込みの画像生成ツールを使用した。各キャラクターの `normal` を個別生成し、それを人物同定参照として `propose`、`down`、`surprised` を個別ファイルで生成した。胸像は各 `normal` と既存の胸像参照から生成した。生成原画を縦横比を維持したまま384×512へ縮小した。

共通指示は、暗い紫紺または紺のグラデーション背景、左上光源、細密なSFC時代風ドット絵、単独キャラクター、ロゴ・透かし・UIなし。立ち絵は全身と足元を収め、ポーズを `normal`（通常）、`propose`（挙手・指を立てて提案）、`down`（肩を落として落ち込む）、`surprised`（驚いてのけぞる）として指定した。同一キャラクターの色、衣装、体格、持ち物を維持するよう指定した。

個別指示は以下のとおり。

- `positive`: ひまわり色の丸い妖精、笑顔、拍手、金色のきらめき。
- `neutral`: 眼鏡を掛け、天秤を持つ落ち着いたフクロウ。
- `negative`: 赤ペンとバツ印を持つ、ジト目だが可愛いツッコミ役。
- `user`: ノートと鉛筆を持つ素朴な初心者学習者。
- `ai`: 仕様書を抱え、少し困った表情の独自デザインの小型ロボット。実在企業のロゴ・商標なし。
- `metappi`: 内部描写のない純黒の人型シルエット。胴体中央に白い手書き文字「作者」のみ。
- `maou`: 角とマントの輪郭を持つ、内部描写のない純黒の魔王シルエット。胴体中央に白い手書き文字「まおう」のみ。

## 成果物と実測

保存先は `public/portraits/backstage/`。全35ファイルはPNG、384×512、背景付きRGB。立ち絵28枚は `standing-<id>-<pose>.png`、胸像7枚は `face-<id>.png`。

ファイル一覧:

- `face-ai.png`
- `face-maou.png`
- `face-metappi.png`
- `face-negative.png`
- `face-neutral.png`
- `face-positive.png`
- `face-user.png`
- `standing-ai-down.png`
- `standing-ai-normal.png`
- `standing-ai-propose.png`
- `standing-ai-surprised.png`
- `standing-maou-down.png`
- `standing-maou-normal.png`
- `standing-maou-propose.png`
- `standing-maou-surprised.png`
- `standing-metappi-down.png`
- `standing-metappi-normal.png`
- `standing-metappi-propose.png`
- `standing-metappi-surprised.png`
- `standing-negative-down.png`
- `standing-negative-normal.png`
- `standing-negative-propose.png`
- `standing-negative-surprised.png`
- `standing-neutral-down.png`
- `standing-neutral-normal.png`
- `standing-neutral-propose.png`
- `standing-neutral-surprised.png`
- `standing-positive-down.png`
- `standing-positive-normal.png`
- `standing-positive-propose.png`
- `standing-positive-surprised.png`
- `standing-user-down.png`
- `standing-user-normal.png`
- `standing-user-propose.png`
- `standing-user-surprised.png`

## 確認結果

- 全35ファイルを実寸検査し、すべて384×512であることを確認した。
- 全7枚の胸像と代表的な立ち絵差分を目視し、既存参照と同系統の背景、輪郭、陰影、ピクセル密度であることを確認した。
- `metappi` の全4ポーズと胸像を目視し、黒塗りシルエット、ポーズ差、白文字「作者」が正しく読め、指定外の文字がないことを確認した。
- `maou` の全4ポーズと胸像を目視し、黒塗りシルエット、角とマント、ポーズ差、白文字「まおう」が正しく読め、指定外の文字がないことを確認した。
- 1〜5の通常立ち絵と差分を目視し、同一人物として識別でき、表情とポーズの違いが読めることを確認した。
- 実装登録と実ゲーム表示の確認は今回の担当範囲外（`src/`変更禁止）のため未実施。

## 採用理由

各話者の役割が配色、表情、持ち物、輪郭から区別できる。立ち絵は一キャラクター・一ポーズ・一ファイルを守り、黒シルエット2名は内部描写を加えず、指定文字だけを明瞭に表示できた。
