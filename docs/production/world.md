# 世界・場所

対象は地形・建物・小物・配置・通行・出入口・町・ダンジョン。環境タグと素材分類は別軸にする。

第二章2-1のRead専用配置案は[読解の書庫のダンジョン設計](chapter-two-act1-dungeon-design.md)を参照する。盤面・座標・到達性検証を含む設計提案であり、実行時の管理元は以下のコード。

| 管理するもの | 現在の管理元 |
|---|---|
| 素材の分類・visual・当たり判定 | [catalog.ts](../../src/world/catalog.ts) |
| マップ型・変換・通行判定 | [maps.ts](../../src/world/maps.ts) |
| 各マップの地形・人物・建物・イベント | [nativeMaps.ts](../../src/world/nativeMaps.ts)、[memoryDungeonMaps.ts](../../src/world/memoryDungeonMaps.ts)、[mountainVillage.ts](../../src/world/mountainVillage.ts)、[caveLayout.ts](../../src/world/caveLayout.ts) |
| ダンジョンの意味・入口・部屋・扉 | [memoryDungeons.ts](../../src/world/memoryDungeons.ts) |
| 小物の切り出し | [propArt.ts](../../src/world/propArt.ts)、[memoryPropArt.ts](../../src/world/memoryPropArt.ts) |
| 装飾と操作先の選択 | [decorations.ts](../../src/world/decorations.ts)、[interactions.ts](../../src/world/interactions.ts) |

共通制作仕様は[環境素材](uses/environment-art.md)と[状態差分](uses/state-variants.md)。固有情報は場所ID、地形、配置、入口と帰還先、環境タグ、物語上の役割。配置の座標・素材フットプリント・表示サイズを一つの値として扱わない。

追加時は管理元に登録し、出入口から全NPC・宝箱・泉・封印へ到達できること、任意戦闘の迂回路、古い保存位置の復元を確認する。装飾が道を塞がないかも見る。

検証は [map-reachability](../../tests/map-reachability.test.mjs)、[memory-dungeons](../../tests/memory-dungeons.test.mjs)、[memory-gates](../../tests/memory-gates.test.mjs)、[street-layout](../../tests/street-layout.test.mjs) と画像検査。対応状況：既存エリア・イベント型は定義で追加可能だが、新エリア型や新しいイベント種別は実装が必要。14地形ジャンルが登録されていても14種類の完成素材があるわけではない。

制作履歴は[記録の索引](records.md)から参照する。現在の実測値は上記TS定義が正本。
