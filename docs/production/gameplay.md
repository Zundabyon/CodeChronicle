# ゲームルール

対象は戦闘・能力・成長・魔法/技・アイテム・装備・店・宝箱・報酬。見た目、出題、結果の確定、演出を分ける。

| 管理するもの | 正本 |
|---|---|
| ボスの段階・復旧・勝利条件 | [bossBattle.ts](../../src/bossBattle.ts) |
| 技の選択 | [heroTechniques.ts](../../src/heroTechniques.ts) |
| 道具・装備・価格・効果 | [items.ts](../../src/items.ts) |
| 宝箱のID・中身・一回の受取 | [chests.ts](../../src/chests.ts) |
| 通常戦・成長・報酬の反映と利用 | [App.tsx](../../src/App.tsx) |
| ショップ・持ち物の表示と操作 | [AdventurePanels.tsx](../../src/AdventurePanels.tsx) |

共通仕様：一つの結果に対する経験値・金・道具の反映は一度。復習は通常戦の報酬やHP変化と同一視しない。難易度が何を変えるかは[学習](learning.md)と実装で確認し、敵の強さも変わると推測しない。

固有情報は敵種/個体、能力や報酬、道具ID、効果、価格、装備区分、条件。戦闘画像と動きは[攻撃・戦闘表現](uses/combat-art.md)から参照する。数値バランスの正本をこの説明文へ複製しない。

対応状況：既存効果型の道具は定義で追加可能だが、未知の効果や新戦闘ルールは実装が必要。確認は勝利・敗北・逃走/復習・連打・再読み込み・二度目の宝箱・装備中の売却など変更に関係する経路。検証は [world](../../tests/world.test.mjs)、[chests](../../tests/chests.test.mjs)、[quest-review](../../tests/quest-review.test.mjs)、[冒険E2E](../../tests/e2e/adventure.test.mjs)。変更理由と検証は[変更ひな形](templates/change.md)へ記録する。
