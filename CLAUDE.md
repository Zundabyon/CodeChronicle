# CodeChronicle

## 基本分担

[エージェントの基本分担](docs/production/operations.md#エージェントの基本分担)に従う。壁打ち・設計相談・コーディングは基本的にClaudeが担当し、画像生成・生成画像の編集はChatGPTまたはCodexへ依頼する。画像が必要な場合は生成依頼を準備し、受領後の組み込みと実表示の検証を担当する。個別に指定された担当を優先する。

ユーザーは担当間の自動連携を依頼済み。画像が必要な開発では `/agent-coordination` を読み、OrcaでCodex担当を起動し、質問への回答・成果物の受領・必要な差し戻し・組み込みまで進める。ユーザーに担当間の伝言を都度求めない。既存画像があれば先に再利用を検討する。生成済み第二章17枚の入口は[制作記録](docs/art/chapter-two-assets-v1.md)。独立した画像生成ツールが使えない担当を、生成可能と見なして進めない。

## 物語構成の相談を再開する場合

`art-environments` からの[相談の引き継ぎ](docs/production/chapter-two-acts-handoff.md)を最初に読む。第二章をCRUD別の幕に分けるB案とセーブデータ移行不要がユーザーの方針。未決定案・実装済みの事実・今回の依頼範囲を区別し、このmainの作業場所で続きを扱う。

## 共通の作業手順

このリポジトリのSkillの正本は `.agents/skills/`。`.claude/skills/` の各ディレクトリは正本への相対シンボリックリンクであり、Claude専用のコピーを作らない。既存Skillの修正は正本へ行い、新しいSkillを追加した場合は `.claude/skills/` にもリンクを追加する。

- 制作の分類・仕様・登録先: `/project-guide`
- ClaudeからCodexへの画像依頼・質問・成果物返却: `/agent-coordination`
- ゲーム画像の生成・編集・品質確認: `/game-art`
- 学習問題の作成・追加・改善・レビュー: `/question-author`
- コード変更の独立レビュー・相互検証: `/code-review`

必要なSkillを読み、そこから参照される資料と実行コードに従う。制作ルールをこのファイルへ複製しない。プロジェクトの `/code-review` を使う場合は同名のローカルSkillを選び、Claudeの組み込みエイリアス `/review` と混同しない。

## Claude Codeでの担当と機能

`.claude/agents/code_reviewer.md` と `.claude/agents/question_author.md` はCodex側の同名担当に対応する。担当へ渡す要件・対象版・レビュー段階を明示し、各Skillの手順に従って委譲する。モデルは親から継承し、権限を拡大しない。

Skill本文内のツール・外部Skill（`imagegen`、`app-four-review` など）は実際に利用可能か確認する。画像生成は上記の担当分担に従い、Claude側の代替ツールへ勝手に置き換えない。その他の工程は利用可能な同等機能があれば使用し、なければ実施できない工程と必要な環境を報告する。未生成・未検証の結果を完了扱いにしない。
