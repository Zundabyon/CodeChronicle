# 画面・表現・操作

対象はタイトル・画面構成・共通UI・文字・背景・音楽/効果音・案内・キーボード・タッチ。共通化するのは読みやすさ、焦点移動、操作結果などの契約であり、画面ごとの役割を無視して同じレイアウトへ揃えない。

| 管理するもの | 現在の管理元 |
|---|---|
| タイトルの構成・文字・背景 | [TitleScreen.tsx](../../src/TitleScreen.tsx)、[titleScreen.css](../../src/titleScreen.css)、[制作記録](../art/title-journey-v1.md) |
| 全体の基礎表示 | [base.css](../../src/base.css)、[style.css](../../src/style.css)、各機能CSS |
| マップ画面・地図・案内 | [WorldScene.tsx](../../src/WorldScene.tsx)、[TravelMap.tsx](../../src/TravelMap.tsx)、[ControlsGuide.tsx](../../src/ControlsGuide.tsx) |
| キー操作 | [keyboardNavigation.ts](../../src/keyboardNavigation.ts)、[keyboardShortcuts.ts](../../src/keyboardShortcuts.ts)、各利用先 |
| 消音・音量の保存 | [audioPreferences.ts](../../src/audio/audioPreferences.ts) |
| 音の再生（AudioContext・解錠・消音・マスター出力） | [audioEngine.ts](../../src/audio/audioEngine.ts)、Appからは[useAudio.ts](../../src/audio/useAudio.ts)だけを使う |
| 効果音 | [sfx.ts](../../src/audio/sfx.ts)、[sfxBank.ts](../../src/audio/sfxBank.ts)、[sfxOverrides.ts](../../src/audio/sfxOverrides.ts) |
| BGM | [music.ts](../../src/audio/music.ts)、[bgmBank.ts](../../src/audio/bgmBank.ts)、[bgmOverrides.ts](../../src/audio/bgmOverrides.ts) |
| 作成ツール | [SfxDesigner.tsx](../../src/dev/SfxDesigner.tsx)、[BgmDesigner.tsx](../../src/dev/BgmDesigner.tsx)、共通枠[DesignerShell.tsx](../../src/dev/DesignerShell.tsx) |

背景は[背景仕様](uses/backgrounds.md)。ランタンや紋様の控えめな発光は[オブジェクトの動き](uses/object-motion.md)を利用し、停止操作と端末のモーション軽減に対応する。画像内にボタンやタイトル文字を焼き込まず、操作と文字はUIへ置く。PCタイトルは通常の開始操作がほぼ1画面に収まる構成、スマホは読みやすさ優先で縦スクロールを許容する。短いウィンドウや拡大表示で操作を隠すための固定overflowは禁止。ダイアログは名称、閉じる手段、Escape、フォーカス復帰を確認する。

## 音の制作と登録

用途（探索/BGM/戦闘/決定/正答/誤答など）、場面、テンポや感情、繰り返し、停止条件、音量、権利・出典を固有設定にする。SUNOなどの制作方法・プロンプトは履歴へ残す。ユーザー操作前の自動再生を前提にせず、消音・音量・再生失敗時もゲームが続くことを確認する。

対応状況：効果音（sfxr風の合成）とBGM（矩形波2・三角波1・ノイズ1のチップチューン）をWeb Audio APIで合成して鳴らす。音声ファイルの読込は未実装。音楽を生成したこととゲームで再生できることは別。画像・書体の正本は[美術基準](../art-direction.md)と各素材の登録先、フォントのライセンスは実ファイルとともに保持。

構成：音は `src/audio/` に集約する。`audioEngine.ts` がAudioContextを最初のユーザー操作（pointerdown/keydown）の後にだけ作り、マスター出力→効果音バス（0.5）・BGMバス（0.3、効果音より控えめ）へ分ける。消音中とタブ非表示中はAudioContextを suspend し、再生や合成に失敗してもゲームは続く。Appは `useAudio()` の `sfx(name)`・`playBgm(name)`・`stopBgm()`・`pauseBgm()`・`jingle(name)`・`toggleMute`・`setVolume` だけを使い、発振やタイマーを直接扱わない。消音・音量は `audioPreferences.ts` でlocalStorageへ保存する。

効果音：`sfx.ts`（`SfxParams`・`playSfx`・WAV書き出し）で合成し、名前と音色の対応は `sfxBank.ts`、App は `sfx('correct')` のように名前で鳴らす。新しい音・調整は作成ツール（ゲーム内のコマンド「▶ デバッグ：効果音さくせい」、単体は `npm run dev:sfx`）で作る→「TSコードをコピー」→`sfxBank.ts` の `bank` に貼る（同名は置き換え、新しい名前はAppの呼び出しも追加）。WAVが要る場合はツールから書き出す。不正解の音は責めない柔らかさにする。

BGM：`music.ts` が曲データ（BPM・1小節の拍・小節数・ループ・曲の音量、4チャンネルの波形・デューティ・音量・音符列）を正規化し、先読みスケジューラ（25msごとに0.15秒先までをAudioContextの時刻で予約）で鳴らす。曲の切り替えは0.3秒のフェード。音符列は `"C5/4 r/2 60/2@.5"`（音名かMIDI番号/16分音符の長さ@音量、`r`は休符）。曲は `bgmBank.ts` の `bank` にあり、すべてオリジナルの8小節ループ（victoryは2小節でループなし）。戦闘系の曲は問題文を読む邪魔にならないよう曲の音量を0.55〜0.6に抑える。

| 場面 | 曲 |
|---|---|
| タイトル・プロローグ・名前入力・クリア | title |
| 町・家・建物の中・教会・復習の部屋・エピローグ・裏会議 | town |
| 山の村 | village（3拍子） |
| 平原 | field |
| 遺跡などのダンジョン | dungeon |
| CRUDの記憶ダンジョン（crudCreate/Read/Update/Delete） | memoryDungeon |
| 通常戦闘・遭遇 | battle |
| ボス（enemy.boss。第一章 遺跡の守護者など） | bossGuardian |
| 悪レンジャー戦 ノゾミ（ranger-read） | rangerNozomi |
| 悪レンジャー戦 ツクネ（ranger-create） | rangerTsukune |
| 悪レンジャー戦 ヌリエ（ranger-update） | rangerNurie |
| 悪レンジャー戦 ケシ（ranger-delete） | rangerKeshi |
| 記録卿グラフィウス戦 | graphius |
| 第三章 序幕ボス ヘドロの主・スパゲッティ | bossHedoro（曲のみ。敵ID決定後に sceneBgm へ追加） |
| 第三章 序幕 海底の古道（地下道） | undersea（曲のみ。マップ追加後に sceneBgm へ追加） |
| 戦闘勝利 | victory を1回鳴らし、終わったら場面の曲へ戻る |

選び方は `bgmBank.ts` の `sceneBgm()`（phase・area・環境・敵）で、[music.test](../../tests/music.test.mjs)が確認する。

BGM作成ツール：ゲーム内はコマンドメニュー「▶ デバッグ：BGMさくせい」（モーダル。開いている間はゲームのキー操作とゲームBGMを止め、Escか「✕ とじる」で閉じると戻る）、単体は `npm run dev:bgm`（[bgm-designer.html](../../scripts/bgm-designer.html)）。対応表から曲を読み込み、テンポ・拍・小節数・ループ・曲の音量、チャンネルごとの波形・デューティ・音量・ミュート/ソロを設定し、編集するチャンネルを選んでピアノロール（1マス=16分音符、太線=小節）をクリックして音符を置く／消す（長さは「置く長さ」、単音チャンネルなので重なる音は詰められる）。Spaceか「▶ 再生」で試聴し、再生位置を表示する（再生中の編集もすぐ反映）。

反映の仕組み：両ツールの「ゲームに反映」はこのブラウザのlocalStorage（効果音 `code-chronicle-sfx-overrides`、BGM `code-chronicle-bgm-overrides`）へ保存し、ゲームはそれを対応表より優先して鳴らす（BGMはツールを閉じて再開するときに読み直す）。「反映を全部もとに戻す」で消す。他の人の環境や本番に残すには「TSコードをコピー」で `sfxBank.ts` / `bgmBank.ts` の `bank` の同名項目を置き換える。「WAV書き出し」はBGMなら1ループ分。

検証は実画面のPC/スマホ、キーボード、音のオンオフ、モーション軽減、[audio-preferences](../../tests/audio-preferences.test.mjs)、[sfx](../../tests/sfx.test.mjs)・[music](../../tests/music.test.mjs)の単体テスト、[backstage-menu E2E](../../tests/e2e/backstage-menu.test.mjs)（両作成ツールの反映）、[title-screen E2E](../../tests/e2e/title-screen.test.mjs)。確認済みと未確認の環境を履歴に分ける。
