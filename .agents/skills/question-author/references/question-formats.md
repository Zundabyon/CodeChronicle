# 問題形式・採点・登録先

この資料はquestion-author Skillの一部です。コードの参照先はリポジトリルートからの相対パスです。

## 読む場所・登録先

- `src/content.ts`: Question型、基本問題、最終的なquestions配列。
- `src/moreQuestions.ts`: 追加の4択とCLI。
- `src/beginnerQuestions.ts`: コードなしの共通知識。既存の内容を踏まえて使う。
- `src/fillQuestions.ts`: コード穴埋め。
- `src/questionSelection.ts`: 通常戦の抽選・入力採点。
- `src/bossBattle.ts`、`src/App.tsx`: ボスCLIと復習の採点・表示。
- `src/bookQuestions.ts`: 問題そのものではなく本との対応。関連づけが必要な依頼で使う。
- `tests/world.test.mjs`、`tests/expansion-integration.test.mjs`、`tests/quests.test.mjs`: 形式、分布、既存参照の検証。

新しいファイルへ分ける場合は、型だけのimportを使い、content.tsのquestionsへimportと展開を追加する。
ファイルを作るだけでは出題されない。idは全体で一意、既存IDは保持する。

## 共通フィールドと学習設定

必須: `id`, `difficulty`, `topic`, `kind`, `prompt`, `reveal`, `explanation`。
difficultyは `beginner | intermediate | advanced`。
topicは `frontend | laravel | connection` のみ。
trackは `react | vue`。省略すると両トラックで対象になる。
inertiaはtrueでInertia環境、falseでAPI環境、省略すると両環境で対象になる。
React固有・Vue固有の問題には対応するtrackを設定する。接続方式固有の問題にはinertiaを設定する。
PHPは現在独立topicではない。PHP専用の表示や出題カテゴリを追加する依頼は、別途型・フィルタ・表示の変更範囲を整理する。

通常戦では難易度・track・inertiaで絞り、CLIを除外する。基本の形式比率は4択:穴埋め選択:穴埋め入力 = 2:1:1。
未回答を優先し、全問回答後は直前の問題を避ける。形式別の問題数の比率がそのまま抽選比率になるわけではない。

## 形式ごとの契約

| kind | 必要な追加フィールド | 採点・表示 |
| --- | --- | --- |
| choice | options（異なる4項目）、answer（0〜3） | 選んだindexとanswerが一致。revealはoptions[answer]と一致 |
| fill-choice | code、filename、options、answer | 穴埋めを4択で回答。revealは空欄に挿入するコードでoptions[answer]と一致 |
| fill-input | code、filename、accepted（空でない配列） | 前後の空白のみ除去してacceptedと一致。reveal自体も正解として受理されること |
| cli | accepted（空でない配列）、必要ならcode | 一般の入力判定とボス専用判定を区別。通常戦の抽選対象外 |

### 4択

一つの設問で一つの判断を問う。選択肢の重複と複数正解を防ぐ。
正解位置はバッチ内で分散し、answerを動かしたらrevealも確認する。
誤答には同じ分野で起きやすい取り違えを使う。解説で主要な取り違えも説明する。

### コード穴埋め（選択・入力）

codeは10〜25行、空欄記号 `【①】` はちょうど一か所。filenameは実際の言語・内容に合う名前にする。
revealを埋めたコード全体が、設問の条件を満たすことを確認する。未定義変数や欠けたimportを偶然の難所にしない。
入力式は大文字小文字、内部の空白、引用符を自動で同一視しない。
意味の等しい別解があり得る場合はacceptedに明示するか、設問で書式を合理的に限定する。
部分的な正規化の実装を勝手に広げて対処しない。選択式の誤答を入れたコードも、別の正解にならないか確認する。

### CLI

実コマンドは実行せず文字列として採点する。
通常のinputIsCorrectは前後の空白除去・小文字化・連続空白の圧縮・先頭の./除去を行う。引数の大文字小文字を学習目標にする問題にはこの判定が適さないことに注意。
ボスとその復習はbossCommandResultが別途判定する。現在はコントローラ生成、未実行マイグレーション適用、設定キャッシュ削除の3段階に固定されている。
専用判定はphp artisan / artisan / ./artisan、単純な引用符、--no-interaction / -n、migrateの--stepを許容する。一般CLIと同じ正規化ではない。
migrate:status、migrate:fresh、optimize:clearなど結果や影響範囲が違う操作を同じ正解にしない。
CLIを配列へ追加するだけでは通常戦には出ない。新しいCLIの出題経路・ボス段階追加が必要なら、データ追加で完了したとせず別の実装範囲として報告する。

## テストの既存制約

既存テストにはfillQuestions総数30、経路別6、beginnerQuestions総数36などの固定値があります。これは現時点の期待値であり、作問上限ではありません。追加で変わる期待値と分布を根拠付きで更新し、重複・正解・別解・学習設定ごとの到達性の検証を維持してください。
