# 会話用キャスト立ち絵 v1

## 制作結果

- 日付: 2026-11-14
- 結果: 採用候補
- 対象: 主人公、女将ハンナ、村長エルド、記録係オルの会話用全身立ち絵
- 用途: 裏会議・会話表示。各人物に `normal` / `propose` / `down` / `surprised` の4ポーズ

## 使った仕様と参照

- 共通美術基準: `docs/art-direction.md`
- 会話用画像仕様: `docs/production/uses/dialogue-portraits.md`
- 主人公固有設定: `docs/production/characters/hero.md`
- 人物同定: `public/portraits/standing.png`、`public/portraits/faces.png`
  - 主人公: 上段左
  - 村長エルド: 上段2番目の白髪白髭の老人
  - ハンナ: 下段右の三角巾の女性
- 画風・構図・ポーズ: `public/portraits/backstage/standing-user-{normal,propose,down,surprised}.png`

人物同定用の既存アトラスと、構図・暗いグラデーション背景・全身比率・ポーズ用の裏会議立ち絵を分けて参照した。既存アトラスは変更していない。

## 制作方法と最終指示

組み込みの ImageGen を使用した。各人物の `normal` を人物同定用アトラスと裏会議立ち絵から生成し、残り3ポーズはその人物の `normal` を同一性・衣装・描画密度・配置の基準として追加参照した。生成原画は1086×1448px（3:4）で、macOS `sips` により384×512pxへ比率を変えず縮小した。

共通指示は、細密な16-bit時代JRPG風ピクセルアート、単独の全身、頭から足先まで欠けなく中央配置、暗い紺から暖色系茶への控えめなグラデーション背景、左上光源、柔らかな接地影、文字・透かし・追加人物・暴力表現なし。各ポーズは `normal`、人差し指を立てて発言する `propose`、肩と頭を落とす `down`、目を見開いてのけぞる `surprised` とした。

人物固有指示:

- 主人公: 青黒い髪、青いチュニックとマント、金の装飾、茶色のベルトとブーツ、鞘に収めた剣。
- ハンナ: 茶髪、白い三角巾、緑の服、白いエプロン、赤茶の肩掛け、温かい母親的な表情。
- 村長エルド: 後ろで結った白髪、豊かな白髭、緑と金の縁取りを持つ茶色のローブ、肩掛け袋、木の杖。眼鏡と帳面は持たせない。
- 記録係オル: 村長より細い顔と短い整えた白髭、丸眼鏡、やや前屈みの姿勢、簡素な茶色のローブ、閉じた革の帳面、木の杖。村長と別人に見えることを必須とした。

## 成果物

保存先はすべて `public/portraits/cast/`。16枚とも384×512px、RGB PNG。

- `standing-hero-normal.png`
- `standing-hero-propose.png`
- `standing-hero-down.png`
- `standing-hero-surprised.png`
- `standing-hanna-normal.png`
- `standing-hanna-propose.png`
- `standing-hanna-down.png`
- `standing-hanna-surprised.png`
- `standing-mayor-normal.png`
- `standing-mayor-propose.png`
- `standing-mayor-down.png`
- `standing-mayor-surprised.png`
- `standing-ol-normal.png`
- `standing-ol-propose.png`
- `standing-ol-down.png`
- `standing-ol-surprised.png`

## 目視確認

- 主人公: 上段左の既存人物と同じ青黒髪、青装束、金装飾、茶革装備、剣を維持。4枚で顔・衣装・足元位置がそろい、各ポーズが判別できる。
- ハンナ: 下段右の既存人物と同じ三角巾、緑衣、白エプロン、赤茶の肩掛けを維持。母親的な雰囲気と4ポーズの差が読める。
- 村長エルド: 上段2番目の既存人物と同じ後ろで結った白髪、豊かな白髭、茶色のローブ、杖を維持。全ポーズで杖と足先が収まる。
- 記録係オル: 白髪白髭と茶色のローブで村の老人として統一しつつ、細身の顔、短い髭、丸眼鏡、帳面、前屈みの姿勢で村長と明確に区別できる。全ポーズで眼鏡・帳面・杖が読める。
- 全体: 暗いグラデーション背景、全身構図、精細なピクセルアート密度が既存の裏会議立ち絵と整合する。文字・追加人物・暴力表現はない。人物ごとの4枚は同じキャンバス寸法で、足元は下端から概ね同じ余白にそろっている。

## 検証と未対応

- PNG実寸と形式は `file` および `scripts/check-art-assets.mjs` で確認する。
- 既存アトラスと16枚を原寸で目視確認した。
- `src/` への登録、実画面への組み込み、PC/スマホ表示確認は本作業の範囲外で未実施。
- commit、pushは実施していない。
