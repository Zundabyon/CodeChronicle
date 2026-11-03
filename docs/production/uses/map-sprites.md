# マップ用画像

人物・NPC・敵・生物のワールド表示に使う共通仕様。対象の固有特徴と、既存人物に合う俯瞰・体型・表示密度・足元を組み合わせる。

対象ID、役割、必要な方向、静止/歩行、装備、表示枠と接地点を確認する。[美術基準](../../art-direction.md)の論理マスと原画pxを区別し、全身と持ち物を含め、地面や場面を焼き込まない。透過素材は実alphaを確認する。マップの縮小表示で他の人物から識別できることを採用条件とする。

登録先は [catalog.ts](../../../src/world/catalog.ts)、[WorldCharacter.tsx](../../../src/WorldCharacter.tsx)、[WorldChip.tsx](../../../src/world/WorldChip.tsx)、敵なら [EnemySprite.tsx](../../../src/EnemySprite.tsx) と [memoryEnemyArt.ts](../../../src/world/memoryEnemyArt.ts) など実際の利用経路。配置は[世界](../world.md)側のマップへ置く。素材を置くだけでは出現しない。

対応状況：静止人物・既存敵の描画とatlasは実装あり。任意対象の一括登録機構はなく、人物型や専用分岐の確認が必要。歩行は[別仕様](walking.md)、会話は[会話画像仕様](dialogue-portraits.md)を参照し、一枚用意しただけで全用途対応としない。

採用時は隣の人物との大きさ、足元、表示枠、選択/操作との位置の一致、会話や戦闘で同じ対象と分かることを確認する。crop・anchor・個体配置とIDは[人物](../characters.md)の登録先を正本にし、制作の事実は[履歴](../templates/record.md)に記録する。
