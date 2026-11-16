# 記憶ダンジョン・テーマ別タイル v1

## 日付・対象・結果

- 2026-11-16
- Create / Read / Update / Delete の4ダンジョン向け床・壁・小物、計16点
- 結果: 採用候補。画像制作のみで、`src/` への登録・実画面への組み込みは未対応

## 使った仕様

- `.agents/skills/game-art/SKILL.md`
- `docs/art-direction.md`
- `docs/production/uses/environment-art.md`
- `docs/production/templates/record.md`
- 既存表示側の確認: `src/world/catalog.ts`、`src/world/memoryPropArt.ts`
- 参照素材: `public/maps/grass-64.png`、`water-64.png`、`mountain-64.png`、`lesson-tablet-64.png`、`chest-64.png`、`rubble-64.png`、`public/maps/props/memory-door-v2.png`、`memory-spring-v2.png`

## 入力・最終指示

組み込み `image_gen` へ各成果物を1枚ずつ、計16回生成依頼した。全画像に「CodeChronicleの既存素材に合う、細密な16-bit / SFC時代JRPG風ピクセルアート」「左上光源」「文字・記号・人物なし」「64×64縮小時にも判読可能」を指定した。

| id | 床 | 壁 | 小物A | 小物B |
| --- | --- | --- | --- | --- |
| forest | 苔むした敷石、草、細い根。全面テクスチャ、四辺反復 | 苔・根に覆われた石壁。上面と暗い前面、連続する左右端 | 年輪と苔のある切り株 | 3本の茸と苔の小群 |
| lake | 青い石板、薄い水膜、波紋とシアン反射。歩ける床 | 濡れた青灰石壁と水晶。上面と暗い前面 | 湖色の水晶柱 | 青白い螺旋の貝 |
| mountain | 灰茶の岩盤、地層、微細な鉱物片。平坦な床 | 花崗岩と堆積岩の崖壁。広い上面と暗い崖面 | 灰茶の層状岩 | 琥珀色鉱石の露頭 |
| desert | 風紋のある暖色砂、赤茶の砂礫、埋もれた石 | 侵食した砂岩と赤茶岩。日なたの上面と暗い前面 | 白化した肋骨の小群 | 欠けた短い砂岩柱 |

床は不透明・正方形・四辺を継ぎ目なく反復できる全面画像とした。壁も不透明・正方形・四辺反復を指定し、単独の岩や柱ではなく連続障害物として生成した。小物は「単一のまとまり、中央配置、下端接地、床パッチなし、真正の透過背景」を個別に指定した。

## 制作方法

- ツール: Codex組み込み `image_gen`
- 生成原画: 各画像 1254×1254px
- 仕上げ: macOS `sips` で64×64pxへ縮小
- 床・壁: RGB、不透明
- 小物: RGBA、透過背景を維持
- 生成原画は Codex の既定生成先に保持し、最終版だけをプロジェクトへ複製した

## 成果物・実測

全ファイルをPNGヘッダで検査し、16点すべて **64×64px** であることを確認した。

- `public/maps/dungeon-forest-floor-64.png`
- `public/maps/dungeon-forest-wall-64.png`
- `public/maps/dungeon-forest-deco-a-64.png`
- `public/maps/dungeon-forest-deco-b-64.png`
- `public/maps/dungeon-lake-floor-64.png`
- `public/maps/dungeon-lake-wall-64.png`
- `public/maps/dungeon-lake-deco-a-64.png`
- `public/maps/dungeon-lake-deco-b-64.png`
- `public/maps/dungeon-mountain-floor-64.png`
- `public/maps/dungeon-mountain-wall-64.png`
- `public/maps/dungeon-mountain-deco-a-64.png`
- `public/maps/dungeon-mountain-deco-b-64.png`
- `public/maps/dungeon-desert-floor-64.png`
- `public/maps/dungeon-desert-wall-64.png`
- `public/maps/dungeon-desert-deco-a-64.png`
- `public/maps/dungeon-desert-deco-b-64.png`

## 確認

- 床・壁をテーマごとに3×3へ敷き詰め、原寸192×192pxで目視確認した。
- 床4種: 四辺に色・形の断絶なし。反復時も歩行面として連続して見える。
- 壁4種: 左右の岩肌は連続し、上下反復では各64px段の上面と前面が規則的につながる。境界に空白や色抜けなし。
- 壁は床より明暗差と高さ表現が強く、通行不能物として判別できる。
- 小物8種: 透明背景、輪郭の欠けなし、下端接地、文字なし。64×64原寸でテーマと種類を判別できる。
- 既存の扉・泉・石板と同じ左上光源、暗い接地影、細密なピクセル密度を維持した。

## 採否と未対応

床・壁の反復、テーマ差、障害物の可読性、小物の透過とシルエットが受け入れ条件を満たすため採用候補とした。今回は画像制作だけが許可範囲のため、`catalog.ts` への登録、マップ配置、PC/スマホの実画面確認、`npm run check:art` とビルドは統合担当へ残す。
