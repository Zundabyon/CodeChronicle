# 第二章：消えた名簿 — 四つの幕と七つの役割

第二章の現行仕様（2026-11-14時点の実装）。物語は[物語・進行](production/narrative.md)、構成を決めた経緯は[幕構成の相談記録](production/chapter-two-acts-handoff.md)。数値は実装から数えたもので、変更時はこの資料も直す。

到達目標は「名簿や掲示板への要求から、担当アクションと、画面表示・DB変更の有無を判断できる」。自力で掲示板を実装できることの認定ではない。通常の Laravel `Route::resource` を基準とし、`apiResource` が create/edit を登録しない違いは「APIを旅する学者」の会話で補足する。

## 進行（quest `village-ledger`）

第一章クリア後、記録係オルから開始。step順は [definitions.ts](../src/quests/definitions.ts) と [chapterTwoLessons.ts](../src/quests/chapterTwoLessons.ts)。

1. `visit-village`：村でオルに話すと襲撃の場面（`chapterTwoAttack`）。
2. `find-copy`：忘却の遺跡の宝箱 `dungeon:19,5` で名簿の控えを見つける。
3. 第一幕 Read：読解の書庫の封印 → `collect-r`（祭壇） → `battle-r`（ノゾミ戦）。
4. 第二幕 Create：創生の工房 → `collect-c` → `battle-c`（ツクネ戦）。
5. 第三幕 Update：改変の回廊 → `collect-u` → `battle-u`（ヌリエ戦）。
6. 第四幕 Delete：忘却の墓所 → `collect-d` → `battle-d`（ケシ戦）。
7. 終幕：`battle-graphius`（グラフィウス戦） → `return-names`（オルに話して名簿を復元）。報酬70G・エーテル1。

幕の順は R→C→U→D（旧構成のR→U→C→Dから変更）。step IDは旧構成から維持し、並びだけを変えた。戦闘stepは祭壇stepの直後に `actBattles`（[chapterScenes.ts](../src/quests/chapterScenes.ts)）から差し込む。戦いは村でオルに話しかけると始まる。

`ledger-delete-transfer`（認可と対象照合）は第二章の進行から外した。問題自体はカタログに残る。

## ダンジョン

| 幕 | ダンジョン | 地域・平原の入口 | 主なアクション | 盤面（幅×高さ） | 実習問題 |
| --- | --- | --- | --- | --- | --- |
| 第一幕 R | 読解の書庫 | 鏡の湖 49,20 | index / show | 47×114 | 11（3+2+2+2+2） |
| 第二幕 C | 創生の工房 | 深緑の森 32,55 | create / store | 45×114 | 11（3+2+2+2+2） |
| 第三幕 U | 改変の回廊 | 石鳴り山脈 90,30 | edit / update | 49×114 | 11（3+2+2+2+2） |
| 第四幕 D | 忘却の墓所 | 陽炎の砂漠 100,66 | destroy | 43×114 | 10（3+2+2+2+1） |

実習問題は4ダンジョン計43問。忘却の墓所の第5室は `ledger-delete-transfer` を外したため1問（`resource-delete-transfer`）。

- 盤面はCodex設計のv2（[設計](production/chapter-two-dungeons-v2-design.md)、[配置JSON](production/chapter-two-dungeons-v2-layout.json)）を [memoryDungeonLayouts.ts](../src/world/memoryDungeonLayouts.ts) へ写したもの。各ダンジョン5部屋・5封印扉・祭壇。
- 各部屋の封印（`memory-<key>-trial-<n>`）で、その部屋の問題をすべて正解すると北の扉が開く。一部正解では開かない。開閉はセーブ済みの章の進行から決まる（[memoryGates.ts](../src/quests/memoryGates.ts)）。旧座標が閉じた扉の先にある場合は、到達できる側へ戻す。
- 第5室は応用の関門（`checkpoint`）。導入で答えを誘導しない。
- 各部屋で「目的と動き → コードの判断 → 操作前後の表」を示す（`study`、[QuestStudyPanel.tsx](../src/quests/QuestStudyPanel.tsx)）。

### 解説

本文は [dungeonLessons.ts](../src/world/dungeonLessons.ts)、配置は各レイアウトの `explanations`。各ダンジョン15件、計60件。

- 必須の解説：各部屋1件（各ダンジョン5件、計20件）。部屋の入口の床（enter）にあり、未読ならその床へ進めず解説が開く。最後の画面を閉じると既読になって通れる。
- 任意の解説：各ダンジョン10件、計40件。脇道の「解説の石板」（interact）。
- 既読は `readBooks` に `lesson:<id>` で保存。新しいセーブ項目は持たない。学習設定の「ダンジョンで読んだ解説」から読み直せる。

### 帰還点と泉

- 部屋の帰還点：各部屋の扉近く。その部屋の扉が開いていれば村へ戻る。
- 入口の「奥への帰還点」：開いている扉の数Nから、部屋 min(N+1, 5) の入口（必須の解説の手前）へ飛ぶ。解放済みの部屋を自由に選ぶ移動はない（導線の解説を飛ばさせないため）。
- 行き先は扉の開閉から決め、セーブ項目を持たない。
- 第3室の西に無料の回復泉。HP/MP全快、所持金・進行は変わらない。

### 人物と敵

- 道案内の学者（全体像）、名簿を学ぶ冒険者（操作ごとの取り違え）、APIを旅する学者（通常resourceとの違い）。会話は任意。
- 敵は各ダンジョン3種×4体＝12体、計48体。第3室には置かない。任意の戦闘で、出題はそのダンジョンのCRUD操作から（[memoryBattleQuestion.ts](../src/quests/memoryBattleQuestion.ts)）。戦闘を避けても章は進められ、戦闘の正解で封印は開かない。

## レンジャー戦・グラフィウス戦

定義は [rangerBattles.ts](../src/quests/rangerBattles.ts)、問題は [rangerBattleQuestions.ts](../src/rangerBattleQuestions.ts)、戦闘処理は [App.tsx](../src/App.tsx)。

| 戦い | 相手 | 題材（名簿以外の村の記録） | 問題の候補 | 1回の出題 |
| --- | --- | --- | --- | --- |
| `battle-r` | ノゾミ・ブルー | 灯り当番表 | 10（`ranger-r-1`〜`10`） | 5 |
| `battle-c` | ツクネ・アンバー | 宿の予約帳 | 10（`ranger-c-1`〜`10`） | 5 |
| `battle-u` | ヌリエ・ジェイド | 倉庫の在庫表 | 10（`ranger-u-1`〜`10`） | 5 |
| `battle-d` | ケシ・パープル | 貸し出し記録 | 10（`ranger-d-1`〜`10`） | 5 |
| `battle-graphius` | 記録卿グラフィウス | 村の掲示板 | 12（`graphius-1`〜`12`） | 7 |

戦闘問題は計52問。

- 挑戦のたびに候補から出題数だけをランダムに選ぶ（Fisher-Yatesで並べ替えて先頭を取る `drawSet`）。
- 敵のHPは出題数。正解1問で1ダメージ。不正解では主人公がダメージを受け、そのダンジョンの石板の一行ヒントを表示し、同じ問いに再挑戦する。
- 主人公のHPが0になってもゲームオーバーにしない。HPを全快し、新しく選び直した問題で戦いの最初から挑み直す。退却はできない。
- 再挑戦の回答は学習記録に残さず、最初の回答だけを残す。
- 戦いの前に、題材の表を会話で一度見せる。グラフィウス戦は、どの幕でも使っていない掲示板で七役割と「データは変わらない」の判断を混ぜる。
- 祭壇で得る術（4種）は未実装。

## 村の状態

石灯の村（[mountainVillage.ts](../src/world/mountainVillage.ts)）の見た目と会話は、章の進行が越えた幕の区切り（`visit-village`・`battle-r/c/u/d`・`battle-graphius`）の数で決まる（`chapterTwoAct`／`chapterTwoPhase`、[definitions.ts](../src/quests/definitions.ts)）。見た目は [WorldScene.tsx](../src/WorldScene.tsx) の `villageScars`・`roofFires`。

| 状態 | 進行 | 村の見た目 |
| --- | --- | --- |
| 1 | 襲撃後〜第一幕 | 燃える廃墟。家は焼け跡版、屋根に炎6か所、地面の炎14・瓦礫・荷車2・倒れた村人7・消えた灯り3・紙片4 |
| 2 | 第二幕 | くすぶる廃墟。屋根の炎2、地面の炎2・瓦礫・荷車・倒れた村人2・紙片2 |
| 3 | 第三幕 | 灰と瓦礫、荷車、翡翠の絵の具4（焼け跡版の家） |
| 4 | 第四幕 | 家は元に戻り、瓦礫1つだけ |
| 5以上 | 終幕・完了後 | 元通り |

- 炎・倒れた村人・瓦礫・荷車・灯りは通れない。紙片と絵の具は踏める。倒れた村人を調べると幕1・2で一言話す。
- レンジャーは戦闘stepの間は広場（13,13）、それより前の同じ幕では村はずれ（20,12）に立つ（`villageFoeVisible`）。グラフィウスは終幕の戦闘stepに広場に立つ。
- フミ（`fumiTalk`、8段階）とオル・リオ・ダン・ユナ（`villagerTalk`、各7段階）の台詞が幕ごとに変わる。完了後は平時の台詞ではなく完了後の台詞。

## セーブ

- 保存形式は version 3（[saveValidation.ts](../src/saveValidation.ts)）。幕の順を変えたため、version 1・2（またはquestsを持たない無版のセーブ）で第二章が途中なら、第二章だけを `visit-village` に戻す。レベル・所持品・第一章の記録は残す。完了済みの第二章はそのまま。移行対応は作らない。
- 復元は [persistence.ts](../src/quests/persistence.ts)。存在するstep IDだけを受け入れる。
- 復習：学習設定の第二章欄「7つの役割を復習する」。ダンジョンの実習43問を `quests['village-ledger'].reviewStep` に独立保存して解き直す（[review.ts](../src/quests/review.ts)）。本編の進行・扉・欠片・報酬は変えない。戦闘問題は含まない。

## ファイル

- [definitions.ts](../src/quests/definitions.ts)：章のstep、幕の判定、村の会話と敵の表示。
- [chapterScenes.ts](../src/quests/chapterScenes.ts)：台本（冒頭・襲撃・戦闘前後・結末・村の会話）と戦闘step。
- [chapterTwoLessons.ts](../src/quests/chapterTwoLessons.ts)：ダンジョンの実習step・祭壇・操作前後の表。
- [resourceQuestions.ts](../src/resourceQuestions.ts)、[chapterTwoQuestions.ts](../src/chapterTwoQuestions.ts)：ダンジョンの問題。基本4問は beginnerQuestions.ts。
- [rangerBattles.ts](../src/quests/rangerBattles.ts)、[rangerBattleQuestions.ts](../src/rangerBattleQuestions.ts)：レンジャー戦・グラフィウス戦。
- [memoryDungeons.ts](../src/world/memoryDungeons.ts)、[memoryDungeonLayouts.ts](../src/world/memoryDungeonLayouts.ts)、[memoryDungeonMaps.ts](../src/world/memoryDungeonMaps.ts)：ダンジョンの情報・v2盤面・マップ化。
- [dungeonLessons.ts](../src/world/dungeonLessons.ts)：解説の本文。
- [memoryGates.ts](../src/quests/memoryGates.ts)：扉の開閉、帰還点の行き先、旧座標の復帰。
- [WorldScene.tsx](../src/WorldScene.tsx)、[mountainVillage.ts](../src/world/mountainVillage.ts)：村の状態と配置。
- [persistence.ts](../src/quests/persistence.ts)、[saveValidation.ts](../src/saveValidation.ts)、[review.ts](../src/quests/review.ts)：保存と復習。
- 画像は[第二章の画像の入口](art/chapter-two-assets-v1.md)。

## 検証

- `npm test`：特に [quests](../tests/quests.test.mjs)、[memory-gates](../tests/memory-gates.test.mjs)、[memory-dungeons](../tests/memory-dungeons.test.mjs)、[dungeon-lessons](../tests/dungeon-lessons.test.mjs)、[save-validation](../tests/save-validation.test.mjs)、[quest-review](../tests/quest-review.test.mjs)、[resource-curriculum](../tests/resource-curriculum.test.mjs)。
- `npm run test:e2e`：[chapter-two-acts](../tests/e2e/chapter-two-acts.test.mjs) で幕の通し・戦闘・村の状態を確認。
- `npm run build`、画像は `npm run check:art`。

PHP実行、実DB接続、学習者による効果測定は含めない。練習正解や欠片取得だけで学習効果が実証されたとは扱わない。

技術確認に使用した公式資料：
- https://laravel.com/framework/docs/13.x/controllers#actions-handled-by-resource-controllers
- https://laravel.com/framework/docs/13.x/controllers#api-resource-routes
- https://laravel.com/framework/docs/13.x/eloquent
- https://laravel.com/framework/docs/13.x/validation
- https://laravel.com/framework/docs/13.x/authorization
