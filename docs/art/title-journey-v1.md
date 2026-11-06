# タイトル背景と開始画面

2026-11-03。ユーザーとgrillingで合意した方針：冒険のワクワクを主役に、失われた知識の謎を奥に感じさせる。背景は生成画像とし、PCの開始操作をほぼ1画面へ収める。スマホは読みやすさを優先しスクロールを許容。セーブありは「続きから」を主役にする。

## 画像

- 保存先：`public/title/knowledge-journey-v1.png`。組み込み `image_gen` を使用、`transparent_background:false`。
- 参照画像：`public/maps/house-town-320x256.png`（町の建築と描き込み）、`public/sprites/hero-64.png`（主人公の外見）。両方を目視して実際の生成入力に渡した。
- 原本：`~/.codex/generated_images/01a15deb-bd58-7393-831e-330ef550345c/exec-95230ad4-3e27-4981-bda5-0ea4213afd61.png`。加工せずコピー。
- 左にHTMLのタイトルと操作を重ねる余白を確保。右に主人公・生活のある町・道・知識の門を置き、魔法の光が戻り始める様子を描いた。画像内にUIやタイトル文字を焼き込まない。
- `object-fit:cover`。スマホは右側の町と門が見える位置へ寄せる。テキストの可読性はCSSの暗いグラデーションで調整する。

## 画面構造

`src/TitleScreen.tsx` と `src/titleScreen.css`。背景を縦積みのアート領域から切り離し、画面全体の背面へ配置。セーブの概要・再開・新規を一か所にまとめた。移行・復元は「冒険の管理」のネイティブdialogへ移し、読み込み前の確認とバックアップ処理は既存実装を保持。Escapeで閉じて元のボタンにフォーカスが戻る。

PCはコンテンツ量で自然に収まる構成とし、ページの縦スクロールを強制禁止しない。低いウィンドウ・拡大表示では操作が欠けないようスクロール可能。管理dialogは必要に応じて内部をスクロールする。

## 検証

PC 1280×800・1366×768・1024×600で、新規・保存あり・バックアップありのすべてを1画面内に配置（ページ高はviewport高+2px以内）。旧画面の保存ありは1280×800で1092px、390×844で1069pxだった。スマホは背景の町と門を見せながら縦に読める配置とし、横はみ出しなし。

`tests/e2e/title-screen.test.mjs` で開始ボタンの優先順位・表示範囲、再開、新規開始、管理dialogのEscapeとフォーカス復帰、読み込み前確認と取り消し、バックアップ復元を検証。PC/スマホのスクリーンショットも目視。既存冒険E2E9件、unit74件、画像検査、ビルドも通過。

## ロゴと書体

追加指定により、FF6/SFC風の世界観に合わせてタイトルを太いゴシック体から「しっぽり明朝」800へ変更。英字・副題・説明文は同書体500。画像に文字を生成せず、字間と強弱を実フォントで調整した。

配布元は [Google Fonts公式リポジトリ](https://github.com/google/fonts/tree/main/ofl/shipporimincho)。Google Fonts CSS APIのtext指定で、この固定見出しに必要な文字だけを取得。`public/fonts/shippori-mincho-title-{500,800}.ttf` と `shippori-mincho-OFL.txt` を同梱し、タイトル表示に外部フォント通信を必要としない。見出し文言を変更するときは収録文字も更新する。

リモートmainの章選択機能も保持し、入口を「冒険の管理」内へ集約。新規開始はchapter引数へクリックイベントが渡らないよう明示的に呼び出す。

## 最終プロンプト

Use case: stylized-concept. Asset type: ONE wide landscape title-screen BACKGROUND IMAGE for CodeChronicle, an original cute finely detailed SFC-era JRPG about restoring knowledge stolen from the world by a demon king, by relearning the magic of code. Input image 1 is a visual reference for the game's warm red-roof timber-and-stone village architecture; image 2 is the identity reference for the tiny dark-haired blue-cloaked adventurer. Create an atmospheric panoramic pixel-art illustration with beautiful adventurous anticipation, gentle mystery and hope. Composition is crucial: the LEFT 42 percent is calm dark indigo twilight sky and distant misty landscape with little high contrast detail, reserved for HTML title/menu overlay; put the narrative landscape and strongest detail on the RIGHT 58 percent. On the right lower foreground, a small blue-cloaked adventurer seen from behind stands at the start of a winding stone path. Midground right: a cozy inhabited town with red tiled timber houses and warm amber windows nestled among deep green trees, a bridge and meandering stream. The path leads uphill to an ancient weathered stone knowledge gate in the upper-right middle distance, covered in faint fading geometric inscriptions with a FEW segments beginning to glow cyan-blue, suggesting knowledge and magic returning. Beyond it, layered distant mountains and a subtle ominous distant silhouette in the haze; inviting rather than horror. Tiny erased inscriptions on nearby broken stone tablets reinforce the lost-knowledge theme. No readable writing or literal programming code. Rich carefully clustered small pixel-art detail, hand-crafted crisp stepped edges, multi-tone stone/wood/fabric shading, late 16-bit JRPG environmental art matching the input house. Beautiful twilight palette: inky navy and teal shadows, muted mauve sky, warm gold town lights and restrained cyan magical accents. Cinematic depth, no photorealism, no 3D, no blur, no giant crude pixels, no flat vector art. WIDE 16:9 or wider landscape composition. Full bleed opaque scene. ONE image only. No title, no logos, no typography, no captions, no UI, no border, no watermark. Do not copy any existing game's characters or landmarks.
