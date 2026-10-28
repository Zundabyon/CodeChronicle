import type { Inventory } from '../items';
import type { StoryLine } from '../story';
import { questDefinitions, questDefinition } from './definitions';
import type { QuestDefinition, QuestEvent, QuestStates, QuestTrigger } from './types';

export type QuestSave = {
  quests: QuestStates;
  completed: boolean;
  readBooks: string[];
  gold: number;
  inventory: Inventory;
};
export const COMPLETE = 'complete';

export function currentQuestStep(def: QuestDefinition, quests: QuestStates) {
  return def.steps.find(step => step.id === quests[def.id]?.step);
}

export function canStartQuest(def: QuestDefinition, save: Pick<QuestSave, 'quests' | 'completed'>) {
  return !save.quests[def.id] && (!def.requiresFirstChapter || save.completed);
}

function matchesTrigger(trigger: QuestTrigger, event: QuestEvent): boolean {
  switch (trigger.type) {
    case 'npc-talked':
    case 'reported':
      return event.type === trigger.type && 'npcId' in event && event.npcId === trigger.npcId;
    case 'book-read':
      return event.type === 'book-read' && event.bookId === trigger.bookId;
    case 'chest-examined':
      return event.type === 'chest-examined' && event.chestId === trigger.chestId;
    case 'question-answered':
      return event.type === 'question-answered'
        && event.questionId === trigger.questionId
        && event.correct === trigger.correct
        && event.source === trigger.source;
  }
}

/** Pure transition: completion and its reward always belong to the same save. */
export function applyQuestEvent<T extends QuestSave>(save: T, event: QuestEvent): {
  save: T;
  scenes: StoryLine[];
  started?: QuestDefinition;
} {
  let next = save;
  let started: QuestDefinition | undefined;
  const scenes: StoryLine[] = [];

  for (const def of questDefinitions) {
    if ((event.type === 'reported' || event.type === 'npc-talked') && event.questId !== def.id) continue;
    let index: number;

    if (event.type === 'accepted') {
      if (event.questId !== def.id || !canStartQuest(def, next)) continue;
      index = 0;
      started = def;
      scenes.push(...(def.opening ?? []));
    } else {
      const step = currentQuestStep(def, next.quests);
      if (!step || !matchesTrigger(step.trigger, event)) continue;
      if (step.requiresReadBook && !next.readBooks.includes(step.requiresReadBook)) continue;
      index = def.steps.indexOf(step) + 1;
      scenes.push(...(step.after ?? []));
    }

    // Reading before accepting counts; an earlier practice answer does not.
    while (index < def.steps.length) {
      const trigger = def.steps[index].trigger;
      if (trigger.type !== 'book-read' || !next.readBooks.includes(trigger.bookId)) break;
      index++;
    }

    const step = def.steps[index]?.id ?? COMPLETE;
    next = { ...next, quests: { ...next.quests, [def.id]: { step } } };
    if (step === COMPLETE) {
      const inventory = { ...next.inventory };
      for (const [id, count] of Object.entries(def.reward.items)) {
        const itemId = id as keyof Inventory;
        inventory[itemId] = (inventory[itemId] ?? 0) + count!;
      }
      next = { ...next, gold: next.gold + def.reward.gold, inventory };
    }
  }
  return { save: next, scenes, started };
}

export function chapterObjective(quests: QuestStates) {
  const chapters = questDefinitions.filter(def => def.category === 'chapter' && quests[def.id]);
  const def = chapters.find(def => quests[def.id].step !== COMPLETE) ?? chapters.at(-1);
  if (!def) return undefined;
  if (quests[def.id].step === COMPLETE) {
    return { title: `${def.title} 完了`, text: def.completionObjective ?? def.completedText };
  }
  const step = currentQuestStep(def, quests);
  return step ? { title: step.title, text: step.description } : undefined;
}

export const hasStartedChapter = (quests: QuestStates) =>
  questDefinitions.some(def => def.category === 'chapter' && !!quests[def.id]);

export { questDefinition };
