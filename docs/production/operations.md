# 制作・運用

制作の入口は[全体索引](index.md)。手順はSkill、規約は各ジャンル、実行設定はコード、過去の事実は制作記録に置く。すべてのジャンルに独立Skillを乱立させない。

## エージェントの基本分担

ユーザー指定の基本分担は、画像生成・生成画像の編集をChatGPTまたはCodex、壁打ち・設計相談・コーディングをClaudeとする。個別の依頼で担当が明示された場合は、その指定を優先する。

Claudeは画像が必要になったら、用途、共通仕様、対象固有の特徴、参照画像、寸法・透過・構図、保存先と受け入れ条件をまとめ、ChatGPTまたはCodexへ渡せる生成依頼を準備する。画像を受け取った後のコードへの組み込みと実表示の検証は基本的にClaudeが担当する。生成担当は依頼範囲の画像制作と生成記録を返す。

ユーザーの依頼により、担当間の依頼・質問・成果物返却は[agent-coordination Skill](../../.agents/skills/agent-coordination/SKILL.md)に従ってOrcaのorchestrationで行う。Claudeが必要時にCodex担当を起動し、返却後に組み込む。同じ作業範囲の内部連絡をユーザーの手動伝言待ちにしない。生成ツールの有無は担当の環境で確認し、不足時は未対応工程を明示する。常駐監視や既存全チャットへの自動転送は設定していない。

| 作業 | 入口・管理元 |
|---|---|
| 全要素の追加・変更先を探す | [project-guide Skill](../../.agents/skills/project-guide/SKILL.md) |
| ClaudeとCodexの依頼・質問・成果物返却 | [agent-coordination Skill](../../.agents/skills/agent-coordination/SKILL.md) → Orca orchestration |
| 画像の生成・組み込み・確認 | [game-art Skill](../../.agents/skills/game-art/SKILL.md) → 利用可能なimagegen |
| 問題の制作・追加・品質確認 | [question-author Skill](../../.agents/skills/question-author/SKILL.md) |
| 独立したコードレビュー | [code-review Skill](../../.agents/skills/code-review/SKILL.md)、[reviewer定義](../../.codex/agents/code_reviewer.toml) |
| 作問担当 | [question_author定義](../../.codex/agents/question_author.toml) |
| 検証・ビルド | [package.json](../../package.json)、[tests](../../tests)、[画像検査](../../scripts/check-art-assets.mjs) |
| 公開 | [Cloudflare CI/CD](../../.github/workflows/deploy-cloudflare.yml)、[設定・運用](../learning/cloudflare-cicd.md)、[既存Pages workflow](../../.github/workflows/deploy-pages.yml) |
| Cloudflare移管の学習 | [HTML教科書：静的公開＋Worker API・D1](../learning/cloudflare-deployment-textbook.html)、[静的公開編の原稿](../learning/cloudflare-migration-textbook.md) |
| 試験用の問題読取API | [Worker](../../worker/index.ts)、[試験用設定](../../wrangler.staging.jsonc)、[実装・検証記録](../learning/cloudflare-api-progress.md) |
| 登壇用の成果物 | [output](../../output)、[構造図の既存資料](../architecture/codechronicle-architecture.html) |

## 作業の完了条件

1. 対象の共通仕様・固有情報・実装の正本と変更範囲を特定する。
2. 作成/登録し、必要な検証を行う。レビューだけの依頼で修正や公開を行わない。
3. [履歴ひな形](templates/record.md)で採用・不採用・未対応と検証結果を記録する。生成物はプロジェクト内へ保存し、原画や過去記録を勝手に削除しない。

複数エージェントには所有ファイルと参照する共通仕様を渡す。実装者とレビュワーを分け、同じ対象版で独立評価→相互検証→統合。自己レビューだけを別担当レビューと報告しない。

対応状況：Skillと既存の各検証経路は利用可能。今回の分類・規約をアプリが自動読込する仕組み、毎回自動でレビューを起動するhook、全ジャンルの自動生成パイプラインは実装していない。

規約・索引だけの変更は `node scripts/production-inventory.mjs --write` と `--check`、Skill/エージェントの構文、参照先を確認する。ゲームのテスト・画像生成は実行コードや素材を変えた場合に対象に合わせて行う。ファイル台帳は既存JSONを更新し、第二の台帳を作らない。構造図HTMLは過去の登壇資料として維持し、最新の規約の管理元にはしない。
