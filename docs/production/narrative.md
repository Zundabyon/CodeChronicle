# 物語・進行

対象は世界設定、章、人物の関係、会話、イベント、クエスト、目的表示、条件付きの解放。物語上の事実と、イベント条件・報酬の実行を分ける。

第二章をCRUD別の幕に分ける相談の続きは[幕構成の引き継ぎ](chapter-two-acts-handoff.md)を参照する。2026-11-12にユーザーと合意した構成案であり、実装済み仕様ではない。

| 管理するもの | 正本 |
|---|---|
| 第一章の出来事・会話・段階 | [story.ts](../../src/story.ts) |
| クエストの定義・NPC・step・会話・報酬 | [definitions.ts](../../src/quests/definitions.ts) |
| 進行条件・遷移・状態反映 | [engine.ts](../../src/quests/engine.ts)、[types.ts](../../src/quests/types.ts)、[useQuests.ts](../../src/quests/useQuests.ts) |
| 第二章の場面・教材と封印 | [chapterScenes.ts](../../src/quests/chapterScenes.ts)、[chapterTwoLessons.ts](../../src/quests/chapterTwoLessons.ts)、[memoryGates.ts](../../src/quests/memoryGates.ts) |
| 会話履歴 | [dialogueLog.ts](../../src/dialogueLog.ts)、[DialogueHistoryPanel.tsx](../../src/DialogueHistoryPanel.tsx) |

共通の追加契約は[既存のクエスト設計](../quests.md)。第一章とクエストエンジンが統一済みとは扱わない。既存step型で表現できるクエストは定義で追加でき、新しい条件型はengineと検証の拡張が必要。

固有設定には章/クエストID、学習目的、登場者、会話、開始・解放・完了条件、報酬、復習可否を持つ。人物の外見は[人物設定](characters.md)を参照する。条件・台詞を別のMarkdownへ二重管理せず、実行データを正本とする。

制作では開始前・途中・完了後・再訪・復習の経路を確認する。何度イベントを送っても報酬は一度だけ。泉・任意会話・復習が本編進行を勝手に進めないようにする。公開済みIDは保存から参照されるため維持。

検証は [story](../../tests/story.test.mjs)、[quests](../../tests/quests.test.mjs)、[quest-review](../../tests/quest-review.test.mjs)、[memory-gates](../../tests/memory-gates.test.mjs)。制作記録には何を確定したか、何を構想として残したかを[ひな形](templates/record.md)で区別する。
