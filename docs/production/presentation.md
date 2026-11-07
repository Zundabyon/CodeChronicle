# 画面・表現・操作

対象はタイトル・画面構成・共通UI・文字・背景・音楽/効果音・案内・キーボード・タッチ。共通化するのは読みやすさ、焦点移動、操作結果などの契約であり、画面ごとの役割を無視して同じレイアウトへ揃えない。

| 管理するもの | 現在の管理元 |
|---|---|
| タイトルの構成・文字・背景 | [TitleScreen.tsx](../../src/TitleScreen.tsx)、[titleScreen.css](../../src/titleScreen.css)、[制作記録](../art/title-journey-v1.md) |
| 全体の基礎表示 | [base.css](../../src/base.css)、[style.css](../../src/style.css)、各機能CSS |
| マップ画面・地図・案内 | [WorldScene.tsx](../../src/WorldScene.tsx)、[TravelMap.tsx](../../src/TravelMap.tsx)、[ControlsGuide.tsx](../../src/ControlsGuide.tsx) |
| キー操作 | [keyboardNavigation.ts](../../src/keyboardNavigation.ts)、[keyboardShortcuts.ts](../../src/keyboardShortcuts.ts)、各利用先 |
| 消音・音量の保存 | [audioPreferences.ts](../../src/audioPreferences.ts) |
| 音の再生 | [App.tsx](../../src/App.tsx)のbeep/AudioContextと利用箇所 |

背景は[背景仕様](uses/backgrounds.md)。ランタンや紋様の控えめな発光は[オブジェクトの動き](uses/object-motion.md)を利用し、停止操作と端末のモーション軽減に対応する。画像内にボタンやタイトル文字を焼き込まず、操作と文字はUIへ置く。PCタイトルは通常の開始操作がほぼ1画面に収まる構成、スマホは読みやすさ優先で縦スクロールを許容する。短いウィンドウや拡大表示で操作を隠すための固定overflowは禁止。ダイアログは名称、閉じる手段、Escape、フォーカス復帰を確認する。

## 音の制作と登録

用途（探索/BGM/戦闘/決定/正答/誤答など）、場面、テンポや感情、繰り返し、停止条件、音量、権利・出典を固有設定にする。SUNOなどの制作方法・プロンプトは履歴へ残す。ユーザー操作前の自動再生を前提にせず、消音・音量・再生失敗時もゲームが続くことを確認する。

対応状況：現在の音はAppの発振による効果音・場面別の短い旋律ループと音量設定が実装済み。音声ファイルを使う汎用BGMトラック登録・場面ごとのトラック切替・音素材の自動読込は未実装。音楽を生成したこととゲームで再生できることは別。画像・書体の正本は[美術基準](../art-direction.md)と各素材の登録先、フォントのライセンスは実ファイルとともに保持。

検証は実画面のPC/スマホ、キーボード、音のオンオフ、モーション軽減、[audio-preferences](../../tests/audio-preferences.test.mjs)、[title-screen E2E](../../tests/e2e/title-screen.test.mjs)。確認済みと未確認の環境を履歴に分ける。
