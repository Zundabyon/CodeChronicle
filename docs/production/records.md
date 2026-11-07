# 制作記録の索引

過去の履歴は成果物と結び付いた名前のまま維持する。再利用する規則は用途別仕様へ抽出し、過去の「主人公の歩行」等の記録を一般仕様へ改題して元の対象を失わないようにする。

| 履歴 | 今後使う共通仕様 | 固有設定・実行側の正本 |
|---|---|---|
| [家具・小物アトラス](../../public/maps/props/props-atlas-v2.prompt.txt) | [環境素材](uses/environment-art.md) | [propArt.ts](../../src/world/propArt.ts) |
| [主人公歩行](../../public/sprites/hero-walk-art.txt) | [歩行](uses/walking.md) | [主人公](characters/hero.md)、[WorldCharacter.tsx](../../src/WorldCharacter.tsx)、[characterArt.css](../../src/characterArt.css) |
| [主人公攻撃](../../public/sprites/hero-attack-art.json) | [攻撃・戦闘表現](uses/combat-art.md) | [主人公](characters/hero.md)、[heroAttackArt.ts](../../src/heroAttackArt.ts) |
| [戦闘素材](../../public/sprites/battle-art.json) | [攻撃・戦闘表現](uses/combat-art.md)、[マップ画像](uses/map-sprites.md) | [EnemySprite.tsx](../../src/EnemySprite.tsx)、[PixelSprite.tsx](../../src/PixelSprite.tsx) |
| [騎士マップ](../../public/sprites/knight-art.txt) | [マップ画像](uses/map-sprites.md) | [騎士](characters/knight.md)、[MysteriousKnight.tsx](../../src/MysteriousKnight.tsx) |
| [騎士会話](../art/knight-portrait-v2.md) | [会話用画像](uses/dialogue-portraits.md) | [騎士](characters/knight.md)、[MysteriousKnight.tsx](../../src/MysteriousKnight.tsx) |
| [記憶ダンジョンの敵](../art/memory-enemies-v1.md) | [マップ画像](uses/map-sprites.md)、[攻撃・戦闘表現](uses/combat-art.md) | [memoryEnemyArt.ts](../../src/world/memoryEnemyArt.ts)、[memoryEnemyIdentity.ts](../../src/world/memoryEnemyIdentity.ts) |
| [泉・封印扉](../art/memory-props-v2.md) | [環境素材](uses/environment-art.md)、[状態差分](uses/state-variants.md) | [memoryPropArt.ts](../../src/world/memoryPropArt.ts) |
| [タイトル背景・文字](../art/title-journey-v1.md) | [背景](uses/backgrounds.md)、[画面・音・操作](presentation.md) | [TitleScreen.tsx](../../src/TitleScreen.tsx)、[titleScreen.css](../../src/titleScreen.css) |

画像以外の現行規約・実装・検証先は[ジャンル別の入口](index.md)から辿る。存在しないBGM制作履歴や未確認の過去プロンプトを、完成済みの記録として追加しない。新しい記録は[履歴ひな形](templates/record.md)を使う。

- 2026-11-05：[タイトルの発光とオブジェクトの動き](../art/title-motion-v1.md) — 既存画像を維持した実装・共通部品・確認環境と測定記録。
