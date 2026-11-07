# CodeChronicleをCloudflareへ運ぶ教科書

5分ずつ進める、公開先のお引っ越し。

React + Vite / GitHub Pages → Workers Static Assets

2026年11月3日版 · CodeChronicleの現在の構成に合わせた実習書

世界も、問題も、冒険の記録も。何をどこへ運ぶのかを理解してから、一歩ずつ公開する。

この教科書の到達点は「Cloudflareでゲームを公開し、セーブの引き継ぎと次回の更新まで自分で確認できること」です。実際の公開操作は読者が実習で行います。教科書作成の時点では、公開先やDNSを変更していません。

## 00 冒険の地図と、この本の使い方

### まず、何ができるようになる？

- 今のゲームが、どこで動き、どこに保存しているかを説明できる。
- Cloudflare向けのファイルを作り、手動で公開できる。
- 画像・フォント・ゲーム・セーブを確認し、問題があれば戻せる。
- GitHubへのpushから自動公開する流れを作れる。

### 休憩時間で進める順番

01〜04は地図を読む時間。05〜08はローカル実習。09〜11は最初の公開と動作確認。12〜15は更新・URL・切り替え・復旧。16〜20は運用と次の学習です。

1節につき5分を目安に読み、作業が終わらなければ次の休憩へ。アカウント作成やDNS反映は5分で終わらないこともあります。待ち時間は作業時間と分けて考えます。

### 実習の前提

- MacのターミナルでCodeChronicleのフォルダを開ける。
- GitHubとCloudflareのアカウントがある。独自ドメインは最初は不要。
- Node.js 22系とnpmを用意する。既存のGitHub ActionsもNode 22を使用中。
- 変更中のファイルを把握する。既存の作業を消すコマンドは使わない。

コード枠のコマンドは1行ずつ実行します。`npm`は道具・依存関係の管理、`npx`はプロジェクトの道具を呼び出すための入口です。`Ctrl + C`はローカルサーバーの停止に使います。

**今日のセーブポイント**：この本のゴールを一文で言えたら、準備完了。

## 01 現在地：CodeChronicleは何で動いている？

### ブラウザがゲーム本体を動かしている

現在のCodeChronicleはReactとTypeScriptで書かれ、Viteで公開用ファイルへ変換されるアプリです。GitHub Pagesは完成したHTML・CSS・JavaScript・画像を配っています。

```text
開発する場所                 公開用に変換       配る場所
src/ + public/  ── Vite ──>  dist/  ──>  GitHub Pages
                                              ↓
                                  ブラウザでゲームが動く
                                              ↓
                                  そのブラウザにセーブ
```

`src/`にはゲームの処理や問題の定義、`public/`には地図・キャラクター・背景・フォントなどがあります。`dist/`はその材料から作る配布物です。編集するのは材料側。`dist/`を手で直しても、次のビルドで作り直されます。

### 今は、サーバーのDBに問題や冒険を置いていない

問題はソースに定義され、ビルドしたJavaScriptに含まれます。冒険はブラウザのlocalStorageへ保存されます。学習問題にLaravelやPHPのコードが出てきても、公開サーバーでLaravelが動いているわけではありません。

そのため最初の移管は「完成したゲームを配る場所の変更」で進められます。PHPサーバーやDBを同時に引っ越す作業はありません。

**手を動かす**：`package.json`の`build`、`src/`、`public/`を開き、材料と配布物の違いを確認する。

**小問**：Cloudflareへ`src/App.tsx`だけを置けば動く？ → 動かない。アプリ全体をビルドしてできる`dist/`を配る。

## 02 行き先：WorkersとPages、どちらにする？

### この本はWorkers Static Assetsを使う

Cloudflare公式は、新しい静的サイトやSPAの公開先にWorkers Static Assetsを推奨しています。Pagesも引き続き利用できます。この本では、現在のゲームを静的ファイルとして配り、将来APIを足す道筋も作りやすいWorkersを選びます。[S1]

| 名前 | 今回どう関わる？ |
| --- | --- |
| Workers Static Assets | `dist/`を配る。今回の本編の行き先 |
| Workersのサーバー処理 | 将来APIを作るときに追加する処理 |
| Pages | 別の公開サービス。補講Aで設定を比較 |
| D1 | 将来、問題などをSQLで管理する候補 |
| R2 | 将来、大きな画像や音声を置く候補 |

「Workers」という名前でも、最初からサーバー側のプログラムを書く必要はありません。今回は静的ファイルを指定するだけの構成です。[S1]

```text
今回：ブラウザ ──> Workers Static Assets ──> distのゲーム

将来：ブラウザ ──> Worker API ──> D1など
```

### 学びを混ぜすぎない

今回はCloudflare Viteプラグインを入れず、既存のViteで`dist/`を作り、Wranglerで公開します。プラグインを使う別方式の記事には`dist/client`などが登場しますが、この本の出力先は`dist/`です。

**小問**：Workersを選んだら、問題は自動でD1へ入る？ → 入らない。保存先の変更は別の設計・実装が必要。

## 03 セーブの引っ越しが、いちばん大切

### URLが変わると、冒険が見えなくなることがある

localStorageはオリジンごとに分かれます。オリジンは「プロトコル・ホスト名・ポート」の組み合わせです。GitHub PagesとCloudflareはホスト名が変わるため、同じブラウザでも保存場所が別になります。[S2]

```text
旧：https://zundabyon.github.io/CodeChronicle/
新：https://実際に発行された名前.workers.dev/

旧URLのセーブ箱 ≠ 新URLのセーブ箱
```

URLのパスが変わるだけなら同一オリジンですが、今回の引っ越しはホスト名が変わります。「続きから」が出ないことだけでは、旧セーブが削除されたとは判断できません。

### 既存の書き出し機能を使う

1. 旧URLを、いつも遊んでいるブラウザ・プロファイルで開く。
2. タイトルの「冒険の管理」から「セーブファイルの書き出し・読み込み」を開く。
3. 「セーブを書き出す」でJSONを保存する。
4. ファイルが空でないことと、保存した場所を確認する。
5. 名前・レベル・現在地をメモし、ファイルを残しておく。

自分のセーブは、自分の端末で書き出します。運営者の手元から、全プレイヤーのlocalStorageを一括回収することはできません。

**重要**：旧URLは、引き継ぎが終わるまで開ける状態で残します。新URLへの自動転送を先に入れると、旧画面から書き出しにくくなります。

**今日のセーブポイント**：JSONを書き出せた。まだ新URLへ読み込まなくて大丈夫。

## 04 移管の順序と、変更するファイル

### 二段階で進める

前半は「試しに新URLで動かす」。後半は「正式なURLを決め、引き継ぎ案内をして切り替える」です。旧サイトを先に停止する必要はありません。

```text
旧サイトを残す
  → セーブを書き出す
  → Cloudflare向けにビルド
  → ローカル確認 → 新URLで公開・確認
  → 正式URL決定 → セーブ引き継ぎ
  → 案内・リンク更新 → 旧公開の運用を整理
```

### 実習で変更するもの

| ファイル | 役割 |
| --- | --- |
| `package.json` | Wranglerを開発用の道具として登録 |
| `package-lock.json` | インストールした道具の詳細を記録 |
| `wrangler.jsonc` | 名前・互換日・公開フォルダを指定 |
| `.gitignore` | ローカル状態や秘密情報をGitから除外 |
| GitHub Pagesのworkflow | 切り替え完了後に旧自動公開を整理 |

この教科書にある設定は実習用の見本です。教科書の作成だけでは、これらの本番設定は書き換えていません。

### 記録しておくもの

旧URL、新しいURL、GitのコミットID、公開日時、確認したブラウザ、問題が出たときに戻す版。まずテキストで十分です。復旧で困るのは「どの版が動いていたのか分からない」状態です。

**小問**：最初にGitHub Pagesを無効化する？ → 旧セーブの取り出しと復旧先を残し、新サイトの確認後に整理する。

## 05 ターミナルで、出発準備

### いま開いている場所を確認する

```bash
cd /Users/ogasawarayuki/CodeChronicle
pwd
git status --short
node --version
npm --version
```

`pwd`は現在地の確認です。`package.json`があるフォルダで作業します。`git status`にファイルが並んでも、すぐ消す必要はありません。別の作業の変更があるなら、今回の変更と区別します。

### 既存の状態でビルドできるか確認する

```bash
npm ci
npm run build -- --base=/
```

`npm ci`はlockファイルに沿って依存関係を入れ直します。`node_modules`は作り直されるので、開発サーバーを止めて実行します。初回ビルドが失敗したら、Cloudflare設定へ進む前に原因を直します。

`npm run build`は、このプロジェクトではTypeScriptのチェックとViteのビルドを行います。最後に`dist/index.html`と`dist/assets/`ができれば、配布物を作れています。

### 読み取る練習

`error`と`warning`は同じではありません。今回の確認ではビルド成功後にJavaScriptの大きさに関する警告が出ました。これは失敗ではありませんが、今後の読み込み速度の改善対象になります。

**終わりの確認**：コマンドが終了コード0で終わり、`dist/index.html`がある。失敗したときは、末尾だけでなく最初に出たエラーを記録する。

## 06 画像が消える理由：baseを理解する

### GitHub Pagesと、今回のCloudflareは入口が違う

現在のGitHub Pagesは`/CodeChronicle/`という場所の下にあります。既存workflowも`--base=/CodeChronicle/`でビルドしています。今回のWorkers公開はホスト直下の`/`を入口にします。

```text
GitHub Pages用： /CodeChronicle/assets/...
Cloudflare用：   /assets/...
```

Viteの`base`は、公開先に合うようにファイルへの道筋を調整する指定です。HTML・CSS・importされた画像などの参照に反映されます。[S3]

```bash
# Cloudflare用
npm run build -- --base=/

# 旧GitHub Pages用の指定
npm run build -- --base=/CodeChronicle/
```

両方とも同じ`dist/`を作り直します。最後にどちらでビルドしたかを忘れないよう、公開の直前には公開先に合うビルドをやり直します。

### CodeChronicleで確認する場所

ゲームの画像参照には`import.meta.env.BASE_URL`が使われています。タイトルのローカルフォントも確認対象です。新しい画像を足すときも、GitHub PagesのURLを直接埋め込まないようにします。

**手を動かす**：`dist/index.html`をエディタで開く。`assets/`へのパスが`/CodeChronicle/`のままになっていないか見る。ブラウザではファイルを直接ダブルクリックせず、次節のサーバー経由で確認する。

**小問**：ドメインが同じならbaseも必ず同じ？ → パス以下に置く構成か、ホスト直下かで変わる。

## 07 Wranglerと、公開の設計図

### プロジェクトに道具を入れる

```bash
npm install -D wrangler@4
npx wrangler --version
```

この操作で`package.json`とlockファイルが変わります。グローバルに入れるより、プロジェクトに登録すると他の環境でも同じ道具を使いやすくなります。[S4]

リポジトリ直下に、次の`wrangler.jsonc`を作ります。`name`は自分のアカウントで使う名前を選んでください。同名の既存Workerがあれば更新対象になり得るため、新規実習なら既存と重ならない名前にします。

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "codechronicle",
  "compatibility_date": "2026-11-03",
  "assets": {
    "directory": "./dist"
  }
}
```

`compatibility_date`はWorkerランタイムの動作基準日です。新規作成時点の日付を指定し、後で更新するときは動作確認します。ファイルの公開日や有効期限ではありません。[S1]

`assets.directory`は配るフォルダ。今回は静的配信のみなので`main`は不要です。`nodejs_compat`や空のサーバーファイルも、この最小構成では追加しません。[S1]

### .gitignoreに追記する

```gitignore
.wrangler/
.dev.vars*
.env*
!.env.example
```

秘密の値は`.env.example`にも書きません。Wranglerのログイン情報やAPIトークンを、ソースやチャットへ貼らないようにします。

## 08 まだ公開しない：ローカルで確認する

### 配布物を作り、Cloudflare向けのサーバーで見る

```bash
npm run build -- --base=/
npx wrangler dev
```

ターミナルに出たローカルURLを開きます。通常は`http://localhost:8787`ですが、表示されたURLを優先します。終了は`Ctrl + C`です。外部公開用の`--remote`は、この実習では使いません。[S5]

### サーバーを使い分ける

| コマンド | 何を確かめる？ |
| --- | --- |
| `npm run dev` | 開発中のソース。編集をすぐ反映 |
| `npm run preview` | Viteのビルド結果 |
| `npx wrangler dev` | Wrangler設定で配るビルド結果 |

この本の最小設定では、Wrangler起動中に`src/`を編集してもViteのようにビルドし直されません。変更したらビルドをやり直し、必要ならWranglerを再起動します。

### ゲームで試す

タイトル、はじめから、フィールド移動、会話、戦闘、問題への回答、メニューを確認します。ローカル用のテスト冒険で試せば十分です。音はブラウザの制約があるため、画面を操作してから確認します。

### 公開しない設定確認

```bash
npx wrangler deploy --dry-run
```

`--dry-run`は実際のデプロイを行わず準備を確認する指定です。本番のURL・権限・DNSまで動いた証明にはなりません。成功したら、次はアカウントと公開先を確認します。[S6]

## 09 はじめての公開：workers.devへ

### ここから先はインターネット上に公開される

まずアカウントを確認します。複数アカウントがある場合は、個人用・組織用を取り違えないようにします。

```bash
npx wrangler login
npx wrangler whoami
```

`login`ではブラウザでCloudflareにログインし、許可画面を確認します。`whoami`のアカウント情報を見て、Workerを置く先を決めます。初回はworkers.devのサブドメイン設定を求められることがあります。[S4]

### 公開前の3点確認

- 設定の`name`は意図したもの。同名の既存サービスを更新しない。
- 公開するのは`dist/`。リポジトリ全体や教科書PDFは含めない。
- セーブを書き出し済み。旧サイトはまだ残っている。

```bash
npm run build -- --base=/
npx wrangler deploy
```

成功すると公開先URLが表示されます。URLの形を推測せず、実際の出力を記録して開きます。独自ドメインは、この時点では必要ありません。[S5]

### 実習記録

```text
公開先URL：
Worker名／アカウント：
コミットID：
公開日時：
確認したこと：
未確認のこと：
```

**終わりの確認**：Cloudflareのダッシュボードにも、同じ名前のWorkerとデプロイがある。画面が開いただけで移管完了にはせず、次節へ進む。

## 10 「表示された」から「遊べる」へ

### 公開URLでの確認表

| 場所 | 実際に操作すること |
| --- | --- |
| タイトル | 背景、文字、フォント、PCでの収まり |
| フィールド | 移動、地形、人物、小物、マップ切り替え |
| 会話 | 立ち絵、文章、選択、閉じる操作 |
| 戦闘・学習 | 敵、問題、回答、正誤、報酬、復帰 |
| 第二章 | ダンジョン、扉、泉、学習進行の代表経路 |
| 保存 | セーブ後の再読み込みと続きから |
| 音・操作 | クリック後の音、音量設定、キー操作 |
| 端末 | PCとスマホで読める・押せること |

新しいテスト冒険で確認し、本物のセーブを読み込む前に基本動作を確かめます。各項目に「確認済み・未確認・不具合あり」を付け、未確認を成功扱いにしないようにします。

### 開発者ツールを見る

NetworkでCSS・JavaScript・画像・フォントの失敗を確認します。Consoleに赤いエラーが出たら、URLとメッセージを記録します。404なら「要求した場所にファイルがない」が最初の仮説です。

**200でも安心しきらない。** CSSのURLなのに中身がHTMLなら、欲しいファイルを受け取れていません。Statusだけでなく、Responseの中身とContent-Typeも確認します。

**小問**：タイトルが出れば第二章の画像も確認済み？ → 未確認。場面ごとに読み込む素材や処理が違うため、代表的な経路を実際に通る。

## 11 冒険の記録を新URLへ持っていく

### 正式に使うURLで読み込む

後から独自ドメインを付けるなら、正式URLを決めてから本物のセーブを読み込むと移動が一度で済みます。workers.devから独自ドメインへ変える場合も、localStorageの保存場所は変わります。[S2]

1. 旧URLで書き出したJSONを手元に用意する。
2. 新しい正式URLを、保存したいブラウザで開く。
3. 「冒険の管理」から、セーブファイルの読み込みを開く。
4. 「セーブファイルを選ぶ」でJSONを指定する。
5. 表示された名前・レベルを確認する。
6. 合っていれば「このセーブを読み込む」。違えば「取り消す」。
7. 「続きから始める」で、名前・レベル・現在地・進行を確認する。
8. ページを再読み込みし、もう一度続きから再開する。

### 現在のアプリの仕組み

読み込みはファイルを選んだだけでは確定しません。内容を確認してから置き換えます。現在の冒険がある場合は「保護した前の冒険」に残す仕組みがあります。ただし、別ファイルとしての書き出しも残しておきます。

ファイル形式の検証やサイズ制限もあります。現状の上限は2MBです。エラーになったらJSONを書き換えて強行せず、旧URLから再度書き出します。直らなければ、エラー内容とファイルの由来を調べます。

**今日のセーブポイント**：新URLで読み込めた・再開できた・再読み込みしても残った。この3つを確認して初めて、引き継ぎ成功。

## 12 pushしたら公開される仕組みを作る

### 手動公開が成功してから自動化する

Workers Buildsは、GitHubの変更を受け取ってビルド・デプロイを行います。WorkerのSettings → BuildからGitリポジトリを接続します。UIの表記が変わったときは、公式のBuild設定を参照します。[S7]

| 設定項目 | この本の構成で入れる値 |
| --- | --- |
| Repository | CodeChronicleの実際のリポジトリ |
| Production branch | `main` |
| Root directory | リポジトリ直下 |
| Build command | `npm run build -- --base=/` |
| Deploy command | `npx wrangler deploy` |
| 配信対象 | `wrangler.jsonc`の`./dist` |

WorkersではPagesの「出力ディレクトリ欄」と混同せず、設定ファイルから`dist/`を指定します。`package.json`・lock・設定ファイルをGitに含め、ローカルとCloudflareが同じ前提で動くようにします。

ビルド用の`NODE_VERSION`を22にして、既存環境と合わせます。実際に採用されたNodeの版はビルドログでも確認します。[S8]

### 小さな変更で1往復する

軽微な文章変更をpushし、Buildログ → Deploy成功 → 公開URLで反映、まで確認します。これができれば「手動だけ動く」状態から抜けられます。

プレビューは本番と分けます。現行の公式設定ではPreview commandは`npx wrangler preview`が既定です。実際の画面・導入したWranglerの対応状況を確認し、プレビューで本番deployを実行しないようにします。[S7]

**小問**：ビルド成功＝公開完了？ → 違う。デプロイの成功と公開URLの反映まで確認する。

## 13 独自ドメインは、別の小さな引っ越し

### 最初はworkers.devで十分

独自ドメインは必須ではありません。使うなら、継続して使えるURLを正式な入口として決めます。ドメインの購入先をCloudflareへ移す作業と、公開先をCloudflareへ移す作業は分けて考えられます。

WorkersのCustom Domainには、有効なCloudflare zoneと、そのドメインの管理権限が必要です。`github.io`のように自分が管理していないドメインを、そのままCustom Domainへ持っていくことはできません。[S9]

### 設定の流れ

1. 自分が管理するドメインをCloudflareで有効にする。
2. Worker → Settings → Domains & Routesを開く。
3. Add → Custom Domainから使うホスト名を登録する。
4. 発行されるDNS・証明書の状態と、HTTPSで開けることを確認する。
5. その正式URLでも、10節の確認表を実施する。

Cloudflareが必要なDNSレコードと証明書を設定します。同じホスト名に既存CNAMEがある場合は競合するため、既存サービスの用途を調べてから整理します。用途不明のDNSレコードをまとめて削除しないようにします。[S9]

正式なドメインは`wrangler.jsonc`のトップレベルにも記録し、以後の公開と設定を揃えます。次は追加部分の例です。実際に所有するホスト名へ置き換え、既存の`assets`などは残し、項目間にカンマを付けます。[S9]

```jsonc
"routes": [
  { "pattern": "game.example.com", "custom_domain": true }
]
```

### URLとセーブを一緒に考える

workers.dev、独自ドメイン、wwwあり・なしは、それぞれ保存先が分かれる場合があります。正式な入口を一つ決めて案内します。移動前のURLで最新セーブを書き出し、正式URLへ読み込み直します。[S2]

**今日のセーブポイント**：正式URLが決まり、HTTPSで開ける。独自ドメインを使わないなら、workers.devを正式URLとしてこの節を完了してよい。

## 14 本番切り替え：旧サイトをいつ整理する？

### 切り替え前に満たす条件

- 正式URLで10節のゲーム確認が終わっている。
- セーブの書き出し・読み込み・再開を試している。
- 自動公開を使うなら、pushから反映まで確認済み。
- 正常だったコミットとデプロイを記録している。
- 旧URLの利用者がセーブを取り出す導線を残している。

### 既存workflowの扱い

現在の`.github/workflows/deploy-pages.yml`は、mainへのpushでGitHub Pagesへ公開します。Cloudflareと同時に動かす期間を設けることはできます。ただし、どちらが正式版かを明記します。

旧自動公開を止めるなら、切り替え後にこのworkflowのpushトリガーを外し、必要なら手動実行だけ残す変更を検討します。GitHub Pagesサービスを先に停止すると、旧セーブを書き出す画面も開けなくなる点に注意します。

### 利用者への案内に書くこと

```text
新しい正式URL：実際のURL
旧URLでセーブを書き出す → 新URLで読み込む
旧URLを開ける期間：決めた日付・運用方針
引き継ぎで困ったとき：連絡先・手順の案内
```

READMEや紹介記事のリンクも更新します。旧URLをすぐ自動転送する運用は避け、まずセーブ取り出しの案内を読める状態にします。移行期間をいつまで設けるかは、利用状況を見て決めます。

**小問**：新URLに自分のセーブが移れば全員分完了？ → それぞれの端末にあるため、利用者ごとの引き継ぎが必要。

## 15 失敗したとき、どこまで戻せる？

### まず症状を分ける

画面が真っ白なら配信・JavaScript・パスを調べます。セーブが見えないならURLとブラウザを確認します。全部まとめて「デプロイ失敗」にすると、直す場所を見失います。

### 公開した版を戻す

WorkersのDeploymentsで、正常だった版のメニューからRollbackを選べます。Wranglerにもrollbackコマンドがあります。戻した後は、同じ正式URLで代表的な動作をもう一度確認します。[S10]

```bash
# CLIで操作する場合は、対象・版・オプションを先に確認
npx wrangler rollback --help
```

自動公開が有効なら、Git側にも不具合修正または変更の取り消しを反映します。ダッシュボードだけ戻しても、次のpushで再び問題の版が公開されることがあります。

### 戻らないもの

| 対象 | アプリの版を戻すだけで戻る？ |
| --- | --- |
| 配信するゲームの版 | ロールバックの対象 |
| 各ブラウザのlocalStorage | 戻らない |
| 別ドメインの保存データ | 自動で移らない |
| DNSやリンクの案内 | 別途確認が必要 |
| 将来のDB内のデータ | コードとは別の復旧設計が必要 |

古いゲームが新しいセーブ形式を読めるとは限りません。旧セーブを書き出したファイルと、正常版の記録を残す理由はここにあります。将来のDB変更も、コードのロールバックだけで復旧できると考えないようにします。[S10]

## 16 料金・制限と、秘密の置き場所

### 静的配信と、サーバー処理の料金を分ける

Workers Static Assetsの静的ファイルへのリクエストは無料で、回数制限なしと案内されています。一方、Workerの処理を実行する場合は別の利用枠・課金条件があります。「Cloudflareなら何を追加しても無料」とは考えません。[S11]

現在の静的アセット上限はFreeで20,000ファイル、Paidで100,000ファイル、1ファイル最大25MiBです。利用前には最新の制限ページを確認します。[S12]

今回ローカルで作ったCodeChronicleの配布物は110ファイル、合計約71.86MiB、最大の1ファイルが約3.09MiBでした。合計サイズと1ファイルの上限は別物です。既存の登壇PDFは配布対象の外に置かれています。

### 秘密はフロントへ渡さない

ブラウザへ配るJavaScriptは利用者から見えます。Viteの`VITE_`変数は、クライアントコードから参照するとビルドへ含まれます。APIトークンやDB管理用の秘密を入れる場所ではありません。[S13]

今の問題の答えも、配布物から調べられます。学習用ゲームとしての利用と、不正防止が必要な試験サービスでは必要な設計が違います。将来スコアを競うなら、サーバーでの検証を別途検討します。

**運用で見るもの**：公開失敗、ファイルサイズ、読み込み速度、Buildの利用枠、将来追加するAPI・D1・R2の利用量。予算と通知を決めてからサービスを増やします。

## 17 よくあるつまずき帳

| 症状 | 最初に見る場所・次の一手 |
| --- | --- |
| 画像・CSSが404 | NetworkのURL。baseとdist内のパスを照合 |
| CSSが200なのに効かない | ResponseとContent-Type。HTMLが返っていないか |
| 真っ白な画面 | Consoleの最初のエラーとJSの読み込み |
| distがないと言われる | リポジトリ直下か、buildを済ませたか |
| 手元の変更が出ない | 再buildしたか、別URL・別Workerを見ていないか |
| Cloudflareだけbuild失敗 | Node版、lock、未pushのファイル、大小文字 |
| 認証・権限エラー | whoamiのアカウント、対象Worker、接続権限 |
| セーブが見つからない | オリジン、ブラウザ、プロファイル、旧URL |
| JSONを読み込めない | 元の書き出し元、形式、2MB上限、エラー文 |
| 音だけ鳴らない | 画面を操作したか、音量、ブラウザの音制限 |
| 直したのに古い画面 | 公開版・URL・Networkを確認して再読み込み |

### 切り分けの型

```text
どのURLで：
何を操作すると：
期待する動作：
実際の動作：
Console／Networkの結果：
最後に正常だった版：
```

一度に設定をたくさん変えると、何で直ったか分からなくなります。仮説を一つ決めて確かめ、結果を残します。キャッシュ削除やlocalStorage削除は同じ操作ではありません。セーブを消す操作を、表示不良の最初の対処にしないようにします。

**練習**：新URLで「続きから」がないが、旧URLでは遊べる。最初に再デプロイする？ → まず旧URLから書き出し、新URLへ読み込む。配信と保存を分けて考える。

## 18 将来の地図：問題をDBへ移したくなったら

### 今回の移管で、どこまで学べる？

ビルド、静的配信、オリジン、設定ファイル、自動公開、復旧が学べます。ここを先に理解してから、問題のDB化へ進むと変更の影響を追いやすくなります。

```text
第1段階：ゲームをStatic Assetsで配る ← 今回
第2段階：読み取り専用のWorker APIを1本作る
第3段階：D1へ試験用の問題を入れて取得する
第4段階：問題追加・更新、権限、公開状態を設計する
第5段階：ユーザー認証とサーバー保存を検討する
```

D1はSQLで扱うデータベース、R2は画像や音声などのオブジェクト保存先です。D1を作っただけでlocalStorageが移るわけでも、R2を作っただけで既存画像の参照が変わるわけでもありません。[S14][S15]

### 問題DBで考えたいこと

問題ID、形式、難易度、本文、選択肢、正解、誤答理由、解説、公開状態、版。今の採点と入力形式を崩さず、読み込む場所を変える設計から始めます。ネットワークが遅い・失敗する場合の表示も必要です。

### セーブDBは、さらに別の課題

「誰の冒険か」を判断する認証、他人のデータへのアクセス防止、複数端末の競合、旧セーブの取り込み、バックアップを設計します。ブラウザから直接DB管理権限を持たせず、Worker APIで受け付ける構成を検討します。

**次の小さな実習案**：本番と分けた環境で、テスト用の問題を1問だけAPIから取得する。ゲーム全体を一度にDBへ移す前に、通信の成功と失敗を両方試す。

## 19 確認問題：自分の言葉で説明してみる

### 初級：仕組みを確認

1. 今のゲームの実行場所はどこ？ セーブの保存場所はどこ？
2. 公開に使うフォルダは`src/`、`public/`、`dist/`のどれ？
3. `npm run build`と`npx wrangler deploy`の役割の違いは？
4. 新しいドメインでセーブが見えないとき、最初に何を確かめる？

### 中級：コードと設定を判断

5. Cloudflareのホスト直下へ移すのに、baseが`/CodeChronicle/`のまま。どんな不具合が起き得る？
6. `assets.directory`を`.`にすると、何が困る？
7. Wrangler起動中に`src/`を編集したが変わらない。この本の構成では何をする？
8. CSSのHTTPステータスが200。これだけで正常と判断してよい？

### 上級：条件とトレードオフ

9. 正式URLを独自ドメインにする予定。先に全員のセーブをworkers.devへ移す案の負担は？
10. ダッシュボードで古い版へ戻せた。次のpushに備え、何を確認・変更する？
11. 問題の答えを利用者から完全に隠したい。静的配信だけで満たせる？
12. 問題をD1へ移す作業と、公開先移管を同時に行うメリット・デメリットは？

**卒業課題**：初めて見る人に、「旧URLのセーブを残したまま、新URLを試し、失敗時に戻れる手順」を5行で説明する。コマンドだけでなく、確認するタイミングも書く。

## 20 解答と、移管完了の判定

### 確認問題の解答例

1. 実行はブラウザ。セーブはそのオリジンのlocalStorage。
2. `dist/`。材料をビルドした配布物。
3. buildは配布物の作成。deployはCloudflareへの公開。
4. URLのオリジンとブラウザ・プロファイル。旧URLから書き出せるか。
5. 画像やCSSなどを存在しないサブパスへ要求し、404になる可能性。
6. 不要な文書・設定・素材まで配信対象になり得る。公開範囲はdistに限定する。
7. buildをやり直し、必要ならWranglerを再起動する。
8. 不十分。Content-Typeと中身がCSSかを確認する。
9. 独自ドメインへの移動で、もう一度引き継ぎが必要になる。
10. Git側へ修正・取り消しを反映し、自動公開で不具合版が戻らないようにする。
11. 満たせない。配る答えは調べられる。サーバー判定など別の設計が必要。
12. 一度に完成に近づくが、不具合の原因と復旧範囲が増える。段階を分けると確認しやすい。

### 移管完了チェック

- 正式URLで、タイトルから主要な学習・戦闘・第二章を確認した。
- セーブを新URLで読み込み、再開・再読み込み後の保存を確認した。
- 次の更新手順と、正常な版へ戻す手順が分かる。
- 旧URLの引き継ぎ案内と、旧自動公開の方針を決めた。
- READMEなどの入口を更新し、料金・利用量の確認先を把握した。

### 教科書作成時に確認した範囲

2026年11月3日、ルートbaseでのTypeScript＋Viteビルドに成功。配布物は110ファイル、最大約3.09MiB。Cloudflareへのログイン・dry-run・公開・Git接続・DNS変更は未実施です。上のチェック項目は、実習で確認して埋めてください。

## 補講A Pagesを選ぶ場合と、SPAの設定

### Pagesで公開する場合の対応表

| 項目 | Pages Git連携での値 |
| --- | --- |
| 取り込むもの | 既存のCodeChronicleリポジトリ |
| Production branch | `main` |
| Build command | `npm run build -- --base=/` |
| Build output directory | `dist` |
| 公開URL | 実際に発行される`pages.dev`など |

ダッシュボードのWorkers & Pagesから、Pages側のGitリポジトリ取り込みを選びます。既存アプリなので、新しいReactプロジェクトを作り直す必要はありません。PagesとWorkersは設定画面・CLIが異なります。本編の`wrangler deploy`をPagesの公開コマンドとして混ぜないようにします。[S16]

### SPAのフォールバックは、いつ必要？

現在のCodeChronicleはReactの状態で画面を切り替え、`/field`などのURLルートを使っていません。本編の最小設定は、存在しないパスに404を返す構成です。

将来、URLルーターを導入し、`/field`を直接開いてもアプリを起動したい場合は、Workersの`assets`に次を追加する選択肢があります。`directory`は残します。[S17]

```jsonc
"assets": {
  "directory": "./dist",
  "not_found_handling": "single-page-application"
}
```

存在しない画像やCSSにもHTMLが返ることがあるため、200という数字だけで判断しないこと。APIを追加したら、静的配信とAPIのルーティングを別途設計します。とりあえず`run_worker_first`を有効にする方法は、処理回数や料金も変わるので採用しません。[S11][S17]

## 補講B 一枚で見返す、実習用コマンド帳

### 準備と設定

```bash
# リポジトリ直下で実行
npm ci
npm run build -- --base=/
npm install -D wrangler@4
npx wrangler --version
```

07節の`wrangler.jsonc`と`.gitignore`を設定する。設定ファイルはリポジトリ直下、公開対象は`dist/`。

### ローカル確認

```bash
npm run build -- --base=/
npx wrangler dev
# ブラウザで確認。終了は Ctrl + C
npx wrangler deploy --dry-run
```

### 認証と公開

```bash
npx wrangler login
npx wrangler whoami
npm run build -- --base=/
npx wrangler deploy
```

### 更新のたびに考えること

手動なら、変更 → build → ローカル確認 → deploy → 公開URLで確認。Git連携なら、変更 → 確認 → push → Build／Deployログ → 公開URLで確認。

このページだけで初回公開を済ませず、03節のセーブ保護と09節の公開先確認を先に行います。トラブル時は、17節のつまずき帳へ戻ります。

## 参考資料 1 公式ドキュメント

確認日：2026年11月3日。サービスの仕様・料金・UIは変わるため、実施時にもリンク先を確認してください。本文の[S番号]に対応しています。

- [S1 Workers Best Practices：静的サイトの選び方・互換日](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/)
- [S2 MDN：localStorageとオリジン](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [S3 Vite：Public Base Path](https://vite.dev/guide/build.html#public-base-path)
- [S4 Wrangler：コマンド一覧](https://developers.cloudflare.com/workers/wrangler/commands/) / [login・whoami](https://developers.cloudflare.com/workers/wrangler/commands/general/)
- [S5 Workers Static Assets：Get Started](https://developers.cloudflare.com/workers/static-assets/get-started/)
- [S6 Wrangler：Workersコマンドのdeploy等](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
- [S7 Workers Builds：設定](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [S8 Workers Builds：ビルド環境](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/)
- [S9 Workers：Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

コマンドのオプションを確認するときは、インストールした版の`npx wrangler --help`や各サブコマンドの`--help`も使います。別方式のテンプレートから設定を持ってくる際は、出力フォルダ・Viteプラグインの有無・WorkersかPagesかを照合します。

## 参考資料 2 次に読む資料と、コードの入口

- [S10 Workers：Rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)
- [S11 Static Assets：料金と制約](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
- [S12 Workers：Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [S13 Vite：環境変数](https://vite.dev/guide/env-and-mode.html)
- [S14 D1：概要](https://developers.cloudflare.com/d1/)
- [S15 R2：概要](https://developers.cloudflare.com/r2/)
- [S16 Pages：Reactの公開](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [S17 Workers Static Assets：配信とルーティング](https://developers.cloudflare.com/workers/static-assets/)

### この教科書で確認したプロジェクト側の入口

- `package.json`：開発・ビルド・テストのコマンド。
- `vite.config.ts`：現在のVite設定。
- `.github/workflows/deploy-pages.yml`：旧GitHub Pagesの公開。
- `src/App.tsx`：ゲーム進行と保存・読み込みの接続。
- `src/SaveTransfer.tsx`：JSONの書き出し・確認付き読み込み。
- `src/saveValidation.ts`：読み込みデータの検証。
- `src/titleScreen.css`：タイトルのローカルフォント。
- `docs/production/index.md`：制作ルール・用途・固有設定の案内。

教材の原稿はこのMarkdown、配布版は`output/pdf/CodeChronicle-Cloudflare-Migration-Textbook.pdf`です。ゲームの公開設定へ転記する内容と、学習用の説明は分けて管理しています。
