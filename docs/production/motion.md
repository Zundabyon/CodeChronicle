# 動き・演出

対象は歩行・攻撃・魔法・敵の移動・被弾・回復・レベルアップ・画面遷移。動きの意味、画像フレーム、再生時間、ゲーム結果の確定を分ける。

| 用途 | 共通仕様 | 現在の管理元 |
|---|---|---|
| 歩行画像と向き | [歩行](uses/walking.md) | [WorldCharacter.tsx](../../src/WorldCharacter.tsx)、[characterArt.css](../../src/characterArt.css) |
| 戦闘の待機・攻撃 | [攻撃・戦闘表現](uses/combat-art.md) | [HeroBattleSprite.tsx](../../src/HeroBattleSprite.tsx)、[heroAttackArt.ts](../../src/heroAttackArt.ts)、[heroBattleSprite.css](../../src/heroBattleSprite.css) |
| 敵の移動・縄張り | 配置・NPC・playerとの衝突、到達性、個体IDを維持 | [enemyMovement.ts](../../src/enemyMovement.ts) |
| 戦闘のタイミングと被弾 | 表示時間とダメージ/採点を混同しない | [battleTiming.ts](../../src/battleTiming.ts)、[BattleStage.tsx](../../src/BattleStage.tsx)、[EnemyEffectSprite.tsx](../../src/EnemyEffectSprite.tsx) |
| 小物・背景の発光・揺れ | [オブジェクトの動き](uses/object-motion.md) | [共通部品](../../src/motion/ObjectMotion.tsx)、[確認用画面](../../src/dev/ObjectMotionHarness.tsx) |
| 回復・成長 | 値の更新と演出の再生を別に扱う | [RecoveryCue.tsx](../../src/RecoveryCue.tsx)、[LevelUpCue.tsx](../../src/LevelUpCue.tsx) |

固有情報は対象ID、動作種別、方向、武器、対応フレームと再生仕様。実測crop・anchorや時間は上記の実装を正本として参照する。全キャラへ同じフレーム数を強制しない。

静止絵の回転・上下移動だけで本物の歩行や攻撃フレームがあると扱わない。読み込み失敗時の待機表示、モーション軽減、連打や演出終了後の結果二重反映を確認する。動きだけの変更で採点や報酬を変えない。

対応状況：人型の主人公歩行・3種攻撃は専用実装あり。任意の人物・四足・飛行へそのまま差し替えられる共通アニメーション登録は未対応。素材と実装の両方が必要。検証は対象画面の実再生、[map-reachability](../../tests/map-reachability.test.mjs)、[memory-gates](../../tests/memory-gates.test.mjs)、[冒険E2E](../../tests/e2e/adventure.test.mjs)。過去の生成仕様は[記録](records.md)へ分離する。
