# CodeChronicle 問題作成

作問ルールは [question-author Skill](../.agents/skills/question-author/SKILL.md) に集約しています。
形式・採点・出題条件・登録先の詳細は [参照資料](../.agents/skills/question-author/references/question-formats.md) を確認してください。

## 使い方

- 直接依頼: `$question-author React初級の4択を8問追加して`
- 担当を分ける: `question_authorにReact初級の4択を8問追加して`

[専用エージェント](../.codex/agents/question_author.toml)も同じSkillを読みます。
Skillやエージェントが既存セッションで認識されない場合は、プロジェクトを新しいセッションで開き直してください。
これは作業用の手順であり、ゲーム内で問題を自動生成する機能ではありません。
