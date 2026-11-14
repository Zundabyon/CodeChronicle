# 第二章イベント絵・立ち絵アトラス v1 制作記録

## 日付・対象・結果

2026-11-14。第二章のイベント絵1枚と立ち絵アトラス1枚を、組み込み `image_gen.imagegen` で生成し、候補として採用した。API/CLI経路へは切り替えていない。`src/` への登録、ゲーム内表示、commit、pushは行っていない。

当初は個別透過立ち絵6枚の依頼だったが、制作中にClaudeから既存 `public/portraits/standing.png` と同形式の4×2アトラスへ変更指示を受けた。したがって個別 `standing-*.png` は作成していない。

## 使った仕様と参照

- 共通仕様: `docs/art-direction.md`、`.agents/skills/game-art/SKILL.md`
- 固有設定: `docs/production/chapter-two-art-request.md`
- 既存制作記録: `docs/art/chapter-two-assets-v1.md`
- イベント絵の形式・画風: `public/prologue/ancient-and-fall.png`
- 立ち絵の形式・頭身・背景・配置: `public/portraits/standing.png`
- 第二章人物の顔・衣装・持ち物・記号: `docs/art/chapter-two-assets-v1-preview.png`（同プレビューがまとめる `chapter-two-faces-v1.png`、各 `*-right.png`、`fumi-64.png` の人物同定情報）

生成前に `ancient-and-fall.png`、`standing.png`、`chapter-two-faces-v1.png`、グラフィウスと悪レンジャー4人の戦闘画像、`fumi-64.png` を目視した。生成入力には、立ち絵アトラスで `standing.png` と `chapter-two-assets-v1-preview.png`、イベント絵で `ancient-and-fall.png`、同プレビュー、`standing.png` を渡した。

## 最終生成指示

### 立ち絵アトラス

1536×1024、4×2、各384×512。`standing.png` と同じ暗い紺〜茶のグラデーション背景、全身、共通の足元、頭身、細密なSFC時代JRPG風ドット絵、左上光源を指定した。セル順は上段がグラフィウス通常／ノゾミ／ツクネ／ヌリエ、下段がケシ通常／フミ／グラフィウス戦闘姿勢／ケシためらい。人物ごとに確定済みの髪、配色、服、胸の絵記号、持ち物、表情を列挙し、セル越境、足切れ、文字、数字、ロゴ、区切り線、紫主体のグラフィウスを禁止した。

### イベント絵

2172×724、2×2、各1086×362。`ancient-and-fall.png` と同じ4コマ配置、描き込み密度、シネマティックなSFC時代JRPG風ドット絵を指定した。左上は夕暮れの石灯の村と帳簿から紙を裂くグラフィウス、右上は燃える村でフミを守る青いマントの主人公、左下は色煙を背負う悪レンジャー4人、右下は記録の広間で対峙する主人公とグラフィウス。各コマの人物特徴と持ち物を列挙し、中央線越境、読める文字、流血、負傷、死体、接触暴力、余分な人物・コマを禁止した。

## 成果物と実測

| 成果物 | 保存先 | 実寸 | 色形式・alpha | 区切り |
| --- | --- | --- | --- | --- |
| イベント絵 | `public/prologue/chapter-two-attack.png` | 2172×724 | 8-bit RGB、alphaなし（全面背景のため意図どおり） | 縦 x=1086、横 y=362。各1086×362 |
| 立ち絵アトラス | `public/portraits/chapter-two-standing-v1.png` | 1536×1024 | 8-bit RGB、alphaなし（既存同様の暗い背景のため意図どおり） | x=384/768/1152、y=512。各384×512 |

組み込みツールの原出力はそれぞれ `/Users/ogasawarayuki/.codex/generated_images/01a1d4ba-9a16-7f43-9a14-446a4cdb128c/exec-58c68740-2d34-4ad7-a666-80cd04c271cf.png` と `/Users/ogasawarayuki/.codex/generated_images/01a1d4ba-9a16-7f43-9a14-446a4cdb128c/exec-bee4fa37-9e74-4c9a-9280-fbce6b69d464.png`。

## 確認と採否

- PNGヘッダで指定実寸とRGB形式を確認した。今回の2枚はいずれも背景付きが仕様であり、透過を要求しないためalphaなしを合格とした。
- イベント絵は4場面が指定セルに分離し、中央区切り位置が依頼どおり。グラフィウス、主人公、フミ、悪レンジャー4人の識別、帳簿・羽ペン・各レンジャーの持ち物を目視確認した。
- 立ち絵は8セルが指定順で、全員の頭部・持ち物・足元がセル内に収まる。グラフィウスとケシの差分も同一人物として読める。
- 読める文字、ロゴ、流血、負傷、死体は見当たらない。紙面や装飾の微細模様は抽象模様として扱える範囲だった。
- `src/` 登録、PC/スマホ実画面、crop、ゲーム内での会話表示、`npm run check:art`、buildはClaude担当のため未実施。

採用理由は、指定寸法・配置・人物同定・場面内容・非暴力条件を満たし、既存の序章イベント絵と立ち絵アトラスに画風と密度が揃っているため。最終採用と表示上の調整は組み込み後に判断する。

> 2026-11-14 更新：ユーザー指示により、まとめ画像（`chapter-two-faces-v1.png`・`chapter-two-standing-v1.png`・`chapter-two-attack.png`）は1枚ずつに分割した。現在の素材は `public/portraits/chapter-two/face-*.png`・`standing-*.png` と `public/prologue/chapter-two/attack-{sky,fire,rangers,final}.png`。新しい素材も1キャラ・1ポーズ・1場面ごとに1ファイルで作る。
