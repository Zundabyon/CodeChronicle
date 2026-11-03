# 人物・生物

主人公・NPC・敵種の固有特徴を管理する。外見と役割を分け、一人が会話・マップ・歩行・戦闘の複数用途を持てるように記述する。

## 共通仕様と固有設定

- 用途：[キャラクターの会話用画像](uses/dialogue-portraits.md)、[マップ用画像](uses/map-sprites.md)、[歩行](uses/walking.md)、[攻撃・戦闘表現](uses/combat-art.md)。
- 固有設定：[主人公](characters/hero.md)、[謎の騎士](characters/knight.md)。新しい対象には[人物設定ひな形](templates/character.md)を使う。
- 敵は敵種の特徴・絵柄と、マップに置く個体を分ける。個体の追加は保存互換・出現範囲・出題と報酬も確認する。

| 管理するもの | 現在の登録・実行先 |
|---|---|
| 人物名の型・マップ人物の描画 | [WorldCharacter.tsx](../../src/WorldCharacter.tsx)、[catalog.ts](../../src/world/catalog.ts) |
| 会話肖像・face対応 | [CharacterPortrait.tsx](../../src/CharacterPortrait.tsx)、[PixelSprite.tsx](../../src/PixelSprite.tsx) |
| 騎士の専用分岐 | [MysteriousKnight.tsx](../../src/MysteriousKnight.tsx) |
| 敵の種別・基本データ | [content.ts](../../src/content.ts)、[EnemySprite.tsx](../../src/EnemySprite.tsx) |
| 記憶ダンジョンの絵柄と個体ID | [memoryEnemyArt.ts](../../src/world/memoryEnemyArt.ts)、[memoryEnemyIdentity.ts](../../src/world/memoryEnemyIdentity.ts) |

対応状況：用途別の制作規約は共通化済み。実行側には主人公の方向付き歩行と騎士の専用分岐があり、人物IDと画像を一件登録するだけで全用途へ対応する汎用機構は未実装。歩行がない人物を歩行対応済みとしない。

新しい人物ではマップの表示、会話呼び出し、名前とfaceの対応、固有特徴の一致、足元、物語条件を確認する。敵ではマップ→遭遇→戦闘と討伐個体の保存を確認する。既存の画面E2Eと [world](../../tests/world.test.mjs)、[memory-dungeons](../../tests/memory-dungeons.test.mjs) を対象に合わせて使う。
