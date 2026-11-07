import type { Question } from './content';

export type QuestionCatalog = { catalogVersion: string; questions: Question[] };
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.length > 0 && value.every(text);

// Validate at the boundary before any question reaches a battle or a quest door.
export function parseQuestionCatalog(value: unknown): QuestionCatalog {
  if (!object(value) || !text(value.catalogVersion) || !/^[A-Za-z0-9._-]{1,64}$/.test(value.catalogVersion) || !Array.isArray(value.questions) || !value.questions.length) throw new Error('Invalid catalog');
  const ids = new Set<string>();
  for (const q of value.questions) {
    if (!object(q) || !text(q.id) || ids.has(q.id) || !['beginner', 'intermediate', 'advanced'].includes(String(q.difficulty)) || !['frontend', 'laravel', 'connection'].includes(String(q.topic)) || !['choice', 'cli', 'fill-choice', 'fill-input'].includes(String(q.kind)) || !text(q.prompt) || !text(q.reveal) || !text(q.explanation)) throw new Error('Invalid question');
    ids.add(q.id);
    if ((q.track !== undefined && q.track !== 'react' && q.track !== 'vue') || (q.inertia !== undefined && typeof q.inertia !== 'boolean') || (q.filename !== undefined && !text(q.filename)) || (q.code !== undefined && !text(q.code))) throw new Error('Invalid question metadata');
    if (q.kind === 'choice' || q.kind === 'fill-choice') {
      if (!strings(q.options) || q.options.length !== 4 || new Set(q.options).size !== 4 || !Number.isInteger(q.answer) || Number(q.answer) < 0 || Number(q.answer) > 3 || q.accepted !== undefined) throw new Error('Invalid choice question');
    } else if (!strings(q.accepted) || q.options !== undefined || q.answer !== undefined) throw new Error('Invalid input question');
    if (q.kind === 'fill-choice' || q.kind === 'fill-input') {
      if (!text(q.code) || q.code.split('【①】').length !== 2 || q.code.split('①').length !== 2) throw new Error('Invalid code blank');
    }
  }
  return value as QuestionCatalog;
}

// IDs and route/format metadata are also the contract of saves, books and seals.
// Adding/removing IDs requires a matching application release, not a DB-only edit.
export function compatibleCatalog(value: unknown, version: string, expected: Question[]): QuestionCatalog {
  const catalog = parseQuestionCatalog(value);
  if (catalog.catalogVersion !== version || catalog.questions.length !== expected.length) throw new Error('Incompatible catalog');
  const byId = new Map(catalog.questions.map(q => [q.id, q]));
  for (const q of expected) {
    const actual = byId.get(q.id);
    if (!actual || (['kind', 'difficulty', 'topic', 'track', 'inertia'] as const).some(key => actual[key] !== q[key])) throw new Error('Incompatible question');
  }
  return catalog;
}

export async function fetchQuestionCatalog(version: string, expected: Question[], signal: AbortSignal, timeoutMs = 15000): Promise<QuestionCatalog> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  signal.addEventListener('abort', abort, { once: true });
  if (signal.aborted) abort();
  const timer = setTimeout(abort, timeoutMs);
  try {
    const response = await fetch(`/api/catalog?version=${encodeURIComponent(version)}`, { signal: controller.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('Catalog unavailable');
    return compatibleCatalog(await response.json(), version, expected);
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', abort);
  }
}
