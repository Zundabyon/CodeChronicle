# 教材・学習

対象は問題、選択肢、入力、採点、難易度、解説、本、出題分布、復習、学習記録。教材の品質規則は [question-author Skill](../../.agents/skills/question-author/SKILL.md)、形式・フィールド・登録先は[その参照資料](../../.agents/skills/question-author/references/question-formats.md)を唯一の管理元とする。

| 管理するもの | 現在の管理元 |
|---|---|
| 問題型・問題配列・分類 | [content.ts](../../src/content.ts)とそこから読み込むQuestionsファイル |
| Cloudflare試験用の配信・起動 | [questionCatalog.ts](../../src/questionCatalog.ts)、[QuestionBootstrap.tsx](../../src/QuestionBootstrap.tsx)、[書き出し処理](../../scripts/export-question-catalog.mjs)。[移行記録と実行手順](../learning/cloudflare-api-progress.md) |
| 通常戦の出題・採点 | [questionSelection.ts](../../src/questionSelection.ts) |
| ボスCLIの採点 | [bossBattle.ts](../../src/bossBattle.ts)と[App.tsx](../../src/App.tsx)の利用経路 |
| 本・練習問題の対応 | [library.ts](../../src/library.ts)、[bookQuestions.ts](../../src/bookQuestions.ts)、[BookPractice.tsx](../../src/BookPractice.tsx) |
| 記録・復習・セッション | [learningRecords.ts](../../src/learningRecords.ts)、[reviewSchedule.ts](../../src/reviewSchedule.ts)、[LearningSession.tsx](../../src/LearningSession.tsx) |
| 第二章の教材 | [chapter-two-learning.md](../chapter-two-learning.md)、[chapterTwoLessons.ts](../../src/quests/chapterTwoLessons.ts) |

固有定義は各問題の学習目標、形式、前提、正答、誤答の理由、解説、難易度、対応トラック。問題と人物の関係は出題側やクエストからIDで参照し、騎士用・主人公用の別採点ルールを作らない。

入力・4択・CLIの採点差を「共通化」のために消さない。入力は短い識別子を中心にし、自然な別解を実際の採点経路で確認する。定義ファイルを増やすだけでは出題登録されない。

対応状況：現在の形式・topic・track範囲は定義で追加可能。新しい出題形式・採点方式・独立カテゴリは型と表示の実装が必要。教材追加にはSkill指定の検証、関連する [world](../../tests/world.test.mjs)、[resource-curriculum](../../tests/resource-curriculum.test.mjs)、[library-progress](../../tests/library-progress.test.mjs)、実際の問題表示を用いる。履歴には学習目標、別解の確認、参考にした公式情報と対象バージョンを残す。
