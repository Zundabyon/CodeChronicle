# Quest design

Quest definitions live in `src/quests/definitions.ts`. Each definition owns its stable ID, NPC binding, ordered steps, event conditions, dialogue, objective text and reward. It is a TypeScript data catalogue; it does not require a database.

`engine.ts` is a pure transition function. It receives the current save and a typed event and returns a new save plus scene data. It never renders, accesses storage, or changes React state. A completion transition updates quest state and rewards together; re-sending an event to a completed quest has no effect.

`useQuests.ts` adapts NPC conversations and scene playback to that engine. The application publishes book-reading, question-answering and chest-examination events without knowing which quests consume them. NPC conversation/report events also identify the selected quest, so reporting one quest cannot finish another.

`QuestJournal.tsx` and the world objective use the same catalogue and state. Adding a quest with existing step types means adding a definition, rather than adding flags or NPC/quest IDs to `App.tsx`. New kinds of gameplay conditions belong in the typed event model and engine, with their own verification.

## Save format

Version 2 stores only stable quest and step IDs:

```json
{
  "version": 2,
  "quests": {
    "library-signboard": { "step": "practice-route" },
    "village-ledger": { "step": "complete" }
  }
}
```

An absent quest is not started. `complete` means the completion reward has already been applied. Loading or migrating a completed quest never awards anything.

`persistence.ts` validates IDs and migrates the version 1 scholar flags and chapter stage/counter into this format. Existing side-quest progress and all chapter checkpoints, including the final conversation awaiting completion, are retained. Legacy fields are never written by the new application. Keep published quest and step IDs stable when editing content.

## Boundaries

Chapter one continues to use its existing story progression. This refactor unifies the optional library quest and chapter two; it does not change chapter one's story or the storage backend.

## Chapter-two learning and saved review

Chapter two has 51 choice exercises across four memory dungeons and a seven-action board exercise. Each seal NPC can own multiple sequential question steps. A memory door opens only when progress has moved beyond the final question belonging to its NPC; the door is also checked by movement and path finding. Springs and optional conversations do not advance quest events.

Optional resource review uses an independently validated reviewStep on the existing quest progress. It never calls the adventure completion transition, so it cannot grant duplicate gold, items or fragments. Old completed adventures may review new content without resetting their completion. See chapter-two-learning.md for the lesson structure and file responsibilities.
