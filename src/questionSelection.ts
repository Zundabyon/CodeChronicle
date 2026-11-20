import type { Difficulty, Question, Track } from './content';

type Learning = { difficulty: Difficulty; track: Track; inertia: boolean; answered: string[] };
export const isChoiceQuestion = (q: Question) => q.kind === 'choice' || q.kind === 'fill-choice';
export const isFillQuestion = (q: Question) => q.kind === 'fill-choice' || q.kind === 'fill-input';
export function inputIsCorrect(q: Question, input: string): boolean {
  const normalize = q.kind === 'cli'
    ? (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ').replace(/^\.\//, '')
    : (s: string) => s.trim();
  return q.accepted?.some(a => normalize(a) === normalize(input)) ?? false;
}
export const RECENT_LIMIT = 8;
export function selectQuestion(questions: Question[], save: Learning, random = Math.random, onlyChoice = false): Question {
  const pool = questions.filter(q => q.difficulty === save.difficulty && (!q.track || q.track === save.track)
    && (q.inertia === undefined || q.inertia === save.inertia) && q.kind !== 'cli' && !/^(ranger|graphius|hedoro)-/.test(q.id) && (!onlyChoice || q.kind === 'choice'));
  if (!pool.length) throw new Error('学習設定に対応する問題がありません。');
  const unseen = pool.filter(q => !save.answered.includes(q.id));
  const candidates = unseen.length ? unseen : pool;
  const recent = new Set(save.answered.slice(-RECENT_LIMIT));
  const fresh = candidates.filter(q => !recent.has(q.id));
  const withoutLast = candidates.filter(q => q.id !== save.answered.at(-1));
  const available = fresh.length ? fresh : withoutLast.length ? withoutLast : candidates;
  const groups = (['choice', 'fill-choice', 'fill-input'] as const)
    .map((kind, i) => ({ weight: i === 0 ? 2 : 1, questions: available.filter(q => q.kind === kind) }))
    .filter(group => group.questions.length);
  let roll = random() * groups.reduce((sum, g) => sum + g.weight, 0);
  const group = groups.find(g => (roll -= g.weight) < 0) ?? groups[groups.length - 1];
  return group.questions[Math.floor(random() * group.questions.length)];
}
// A display copy with the options in a fresh random order; the catalog question stays untouched.
export function shuffleChoices(q: Question, random = Math.random): Question {
  if (!isChoiceQuestion(q) || !q.options || q.answer === undefined) return q;
  const order = q.options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return { ...q, options: order.map(i => q.options![i]) as typeof q.options, answer: order.indexOf(q.answer) };
}
