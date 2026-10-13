import type { Difficulty, Question } from './content';

// Each successful repair opens only its own guard. Weapon damage cannot skip repairs.
export const bossGuardHp = 3;
export const bossStages = [
  {
    title: '失われた処理',
    prompt: '守護者がNoteControllerのファイルを消した。ルートは残っている。標準のコントローラを生成して、処理の入口を取り戻そう。',
    code: "Target class [App\\Http\\Controllers\\NoteController] does not exist.\n確認：app/Http/Controllers/NoteController.php がない。",
    reveal: 'php artisan make:controller NoteController',
    explanation: 'make:controller はコントローラの雛形を生成します。ルートを調べるだけでは、消えたファイルは戻りません。実際の開発では、元の処理も復元する必要があります。',
    hints: ['ルートではなく、リクエストを処理するクラスが失われています。Artisanの生成コマンドを使おう。', 'php artisan make:controller 名前 の形です。必要なクラス名は NoteController。'],
    restored: 'NoteControllerの雛形が戻った！ 守護者の第一の防御が崩れた。',
  },
  {
    title: '空になった記録庫',
    prompt: '今度はnotesテーブルがない。テーブル定義のマイグレーションは用意されているが、まだ実行されていない。開発用DBへ適用しよう。',
    code: "SQLSTATE: no such table: notes\nDB接続：正常 / データ：空\ncreate_notes_table：Pending（内容は確認済み）",
    reveal: 'php artisan migrate',
    explanation: 'migrate は未実行のマイグレーションを適用します。migrate:status は確認だけ、make:migration は定義ファイルの生成だけです。fresh や refresh は既存のテーブルを作り直すので、今回の操作とは区別します。',
    hints: ['定義はすでにあります。生成や確認ではなく、未実行の定義をDBへ適用しよう。', 'php artisan migrate を使います。:status を付けると確認だけになってしまいます。'],
    restored: 'notesテーブルが作成された！ 守護者の第二の防御が崩れた。',
  },
  {
    title: '古い設定の封印',
    prompt: '開発環境の.envを直したのに、古いアプリ名が表示される。設定キャッシュが原因と確認できた。他のキャッシュは残して、設定キャッシュだけを消そう。',
    code: '.env の APP_NAME：CodeChronicle\nconfig("app.name")：OldChronicle\nbootstrap/cache/config.php：存在する',
    reveal: 'php artisan config:clear',
    explanation: 'config:clear は設定キャッシュを削除し、新しい設定を読み込めるようにします。cache:clear はアプリのデータキャッシュで、設定キャッシュとは別です。optimize:clear は他のキャッシュも消すため、今回の条件には合いません。',
    hints: ['アプリのデータではなく、設定（config）のキャッシュを解除します。', 'php artisan config:clear の形です。cache:clear とは対象が違います。'],
    restored: '新しい設定が読み込まれた！ 最後の防御を崩し、知識の扉を開こう。',
  },
] as const;

export function bossQuestion(stage: number, difficulty: Difficulty): Question {
  const data = bossStages[stage];
  return { id: `guardian-repair-${stage}-${difficulty}`, difficulty, topic: 'laravel', kind: 'cli',
    prompt: data.prompt, code: data.code, reveal: data.reveal, accepted: [data.reveal], explanation: data.explanation };
}

export function bossQuestionById(id: string): Question | undefined {
  const match = /^guardian-repair-([0-2])-(beginner|intermediate|advanced)$/.exec(id);
  return match ? bossQuestion(Number(match[1]), match[2] as Difficulty) : undefined;
}

export function bossCommandResult(stage: number, input: string): { correct: boolean; reason: string } {
  // Recognize explicit equivalent forms; this never runs shell commands.
  const tokens = input.trim().split(/\s+/).map(token => token.replace(/^(['"])(.*)\1$/, '$2'));
  if (tokens[0] === 'php') tokens.shift();
  if (tokens[0] === './artisan') tokens[0] = 'artisan';
  if (tokens.shift() !== 'artisan') return { correct: false, reason: 'Artisanで操作します。php artisan に続けてコマンドを入力しよう。' };
  const args = tokens.filter(token => token !== '--no-interaction' && token !== '-n');
  const valid = stage === 0 ? args.length === 2 && args[0] === 'make:controller' && args[1] === 'NoteController'
    : stage === 1 ? args[0] === 'migrate' && args.slice(1).every(token => token === '--step')
    : args.length === 1 && args[0] === 'config:clear';
  if (valid) return { correct: true, reason: bossStages[stage].restored };
  const reason = stage === 0 ? '今回はNoteControllerの標準の雛形が必要です。名前・大文字小文字・生成方法を確認しよう。'
    : stage === 1 ? '必要なのは未実行のマイグレーションの適用です。確認だけの操作や、テーブルを作り直す操作とは違います。'
    : '設定キャッシュだけが対象です。データキャッシュの削除や、他のキャッシュも消す操作とは区別しよう。';
  return { correct: false, reason };
}

export function bossStrike(hp: number, stage: number, damage: number): number {
  return Math.max((bossStages.length - stage - 1) * bossGuardHp, hp - damage);
}

export function bossGuardBroken(hp: number, stage: number): boolean {
  return hp <= (bossStages.length - stage - 1) * bossGuardHp;
}
