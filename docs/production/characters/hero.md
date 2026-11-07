# 主人公の固有設定

状態：既存採用物から確認できる特徴。共通仕様は[人物](../characters.md)、[会話画像](../uses/dialogue-portraits.md)、[歩行](../uses/walking.md)、[攻撃](../uses/combat-art.md)から参照し、この人物専用の手順を作らない。

- 固有特徴：青黒い髪、青いチュニック/マント、金色の装飾、茶色のベルト/ブーツ、剣。用途別の採用画像を目視して細部を確認する。
- 性格や物語上の事実：[story.ts](../../../src/story.ts)が正本。外見資料から新しい過去や関係を確定しない。
- 人物同定用の参照：[hero-64.png](../../../public/sprites/hero-64.png)、[会話肖像アトラス](../../../public/portraits/faces.png)、[戦闘待機絵](../../../public/sprites/hero-battle-left.png)。各参照の用途を生成指示に明示する。
- 現在の対応：マップ静止、4方向歩行、会話肖像、戦闘待機、3種攻撃。切り出しと再生は [WorldCharacter.tsx](../../../src/WorldCharacter.tsx)、[characterArt.css](../../../src/characterArt.css)、[heroAttackArt.ts](../../../src/heroAttackArt.ts)、[HeroBattleSprite.tsx](../../../src/HeroBattleSprite.tsx) を参照。
- 制作履歴：[歩行](../../../public/sprites/hero-walk-art.txt)、[攻撃](../../../public/sprites/hero-attack-art.json)、[戦闘素材](../../../public/sprites/battle-art.json)。履歴の「主人公の」という名称は当時の実際の出力対象を指すため残す。次の制作では共通用途仕様にこの固有設定を足す。
