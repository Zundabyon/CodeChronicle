# Cloudflare読取APIの実装記録

## 最初の段階：実習API

2026-11-03。ローカルD1に投入した実習用の問題を、Workerの読取APIから取得する段階。

| 項目 | 内容 |
| --- | --- |
| 目的 | `lab-v1`の問題をHTTPで取り出す。既存ゲームへの接続とは分ける |
| 分類・仕様 | 制作・運用、問題データ。project-guide、共通ルール、code-reviewを適用 |
| 実装の正本 | [Worker](../../worker/index.ts)、[試験用設定](../../wrangler.staging.jsonc)、[型チェック](../../tsconfig.worker.json) |
| データの正本 | [初期schema](../../migrations/0001_init_catalog.sql)、[実習用seed](../../seed.lab.sql) |
| 検証先 | [APIテスト](../../tests/worker-catalog.test.mjs)、`npm run check:worker`、ローカルWrangler |
| 互換性 | ゲームの問題import・採点・セーブ形式・公開済みIDは変更していない |
| 未対応 | 全問題の移行、ゲーム側の取得口、セーブ検証のDB対応、認証、クラウドセーブ、本番切替 |

`GET /api/catalog`は最新の公開版、`GET /api/catalog?version=lab-v1`は指定した公開版を返す。公開済みの問題内容は、その版を使う間は変更しない運用を前提とする。

公開問題に正解・解説も含める自己学習用の方式。APIに管理用の書き込み経路は設けない。投入前の問題形式・正答・クエスト参照の検証と、クライアント側の応答検証は、全問題の移行時に接続する。現在のAPIではJSONオブジェクトとDB上の問題IDの一致を確認しているが、問題の教材品質を検証済みとは扱わない。

## ローカルで開く

```bash
npm run check:worker
npx wrangler dev --config wrangler.staging.jsonc
```

ターミナルに表示されたURLへ`/api/catalog?version=lab-v1`を付けて開く。`--remote`は使用しない。JSONに`catalogVersion: "lab-v1"`と問題ID`cc-lab-1`があることを確認する。

型は`npx wrangler types --config wrangler.staging.jsonc`から生成した[worker-configuration.d.ts](../../worker-configuration.d.ts)。設定・Wranglerの版を変えたら再生成する。現在のReactビルドとは別にWorkerの型チェックを行う。

## 結果

型チェック・SQLiteを使ったAPIテスト6件が成功。既存テストも含む`npm test`は80件成功。

Wrangler 4.156.2のローカルDB・ASSETSバインディングを使って、指定カタログの取得が200となり、`lab-v1`・`cc-lab-1`の実データが返ることを確認した。未登録版は404、POSTは405、未知APIは404、静的ゲームの`/`は200となった。確認用サーバーは停止済み。

2名の独立レビュワーが同じ固定スナップショットを確認し、双方の結果を相互検証した。対象版はbase `7e908ef815db0d64b90d6b063995c343713c933b`に対する今回のAPI追加範囲で、WorkerのSHA-256は`cdf9920220b5c2a0ab4c438f9e1191fa2d44d97c97d555d5c7d125a7d0809174`。確定指摘0件、不一致なし。実WranglerのHTTP確認は実装担当によるもので、レビュワー自身が実行した型チェック・APIテストとは分けて扱う。

ローカルで読取APIを実習できる段階として採用。Cloudflare上のDB変更・公開は行っていない。ゲーム接続・全問題の移行・教材品質・認証・本番運用まで検証済みとするものではない。


## 第二段階：ゲームの問題をD1から取得する

2026-11-03。Cloudflareの試験用URLで実習APIとタイトルの表示をユーザーが確認した後、ゲームの出題を接続した。制作の正本はGit原稿、配信先はD1。以下はローカル検証済みの実装であり、この段階のリモート投入・再デプロイはまだ実行していない。

- [書き出し処理](../../scripts/export-question-catalog.mjs)は既存253問を検証し、[投入SQL](../../seed.game.sql)と[取得する版](../../src/catalogRelease.ts)を同時生成する。4択202問、CLI21問、穴埋め選択15問、穴埋め入力15問。ボスの動的問題は既存処理を維持する。
- `npm run build:staging`だけがAPIを使う。通常の`npm run build`とGitHub Pagesの公開手順は従来の原稿内蔵方式を保つ。
- [起動口](../../src/QuestionBootstrap.tsx)が15秒を上限に取得し、[形式・互換性検証](../../src/questionCatalog.ts)に成功してからAppを開始する。失敗時は再試行を表示し、セーブを読み直して保存する処理もまだ開始しない。
- 通常戦、本の確認問題、封印、第二章の復習、復習の部屋、学習記録は取得した同じ問題集を参照する。既存の採点、ボス生成、冒険セーブのversion 2とIDは維持する。
- 問題版は原稿内容から計算した固定版。全ID・分類・形式がビルド時の契約に一致することを必須とし、DBだけでのID追加・削除・分類変更は受理しない。原稿を修正し、書き出し→DB投入→対応する画面ビルドの順で更新する。問題IDを削除してよいという意味ではなく、過去セーブの互換性検討は引き続き必要。
- SQLは問題revisionを追加し、古い版を残す。同じファイルの再実行で問題や版が増えたり公開日時が更新されたりしない。版の内容をその場で書き換えない。Git原稿の全問を内蔵する検証用情報もビルドに残るため、JS軽量化を完了したものではない。

### 次に実行するコマンド

毎回のローカル起動は、次の1コマンドにまとめた。ビルド・問題版生成→ローカルmigration→全問題投入→Wrangler起動の順で実行し、失敗した段階で停止する。起動済みの場合はCtrl+Cで終了してから実行する。

```bash
npm run dev:staging
```

ローカルDBだけの準備・再投入は`npm run db:local`。`seed.game.sql`を使うため、問題原稿を変更したときは先に`npm run build:staging`を実行する。`dev:staging`ならその順番も含まれる。以下は各段階を学ぶための個別コマンド。

まずローカル。`seed.lab.sql`ではなく`seed.game.sql`を使う。起動中のWranglerはCtrl+Cで止めてからビルドし直す。

```bash
npm run build:staging
npx wrangler d1 execute codechronicle-staging --local --file seed.game.sql --config wrangler.staging.jsonc
npx wrangler dev --config wrangler.staging.jsonc
```

表示されたローカルURLの`/`で冒険を開始し、`/api/catalog?version=game-2d7f9563dcdbb186bf2728ad`で253問を確認する。版は将来の原稿修正で変わるので、常に`src/catalogRelease.ts`または書き出しログの値を使う。現在の本番・試験用サイトとローカルは保存先が別であり、必要な冒険はJSON書き出し・取り込みで引き継ぐ。

ローカル確認後、試験用Cloudflareを更新する。新しい版の問題を先に投入することで、新しい画面が未投入の版を要求する時間を避ける。既存migrationは適用済みなので再作成しない。

```bash
npm run check:worker
npm run build:staging
npx wrangler d1 execute codechronicle-staging --remote --file seed.game.sql --config wrangler.staging.jsonc
npx wrangler deploy --dry-run --config wrangler.staging.jsonc
npx wrangler deploy --config wrangler.staging.jsonc
```

公開先はこれまでと同じ試験用URL。`lab-v1`は実習用の版として残る。以後、試験用ゲームの更新には`build:staging`を使う。通常の`npm run build -- --base=/`ではAPI接続の画面にならない。

### 検証と限界

一時領域の専用ローカルD1へ生成SQL508文を適用し、実WranglerのAPIで253問取得、stagingビルドのタイトル開始まで確認した。ユーザーの既存ローカルDBやリモートDBはこの検証で変更していない。

API失敗・不完全な問題集で元のセーブ文字列が変わらないこと、再試行後にAPIの問題文を表示し、回答・記録・再読込が成立すること、本・封印のAPI問題表示をChromeで検証。既存ブラウザテストには第二章51実習の完走、泉、扉、旧セーブ、タイトルなどの回帰確認を含む。

クラウドセーブ・認証・本番への移管はこの実装に含まない。旧サイトと新サイトのlocalStorageは共有されない。旧セーブのJSON引き継ぎと公開URLでの実動作はユーザー側の次の確認として残る。


修正後の結果：`npm test`84件成功、ブラウザテスト全23件成功（このうちAPI専用2件は学習記録・本・封印の追加確認後にも再実行し成功）、Worker型チェック、通常ビルド、stagingビルド、Wrangler deploy dry-runが成功。500kB超のJSサイズ警告は残るが、ビルドエラーではない。

code-review Skillで2名が独立評価し、初回のP2（穴埋め記号と表示契約の不一致）・P3（学習記録が原稿の問題文を表示）を相互検証後に修正。両者が修正と影響範囲を確認し、未解決の確定指摘・不一致は0件。修正後対象はbase `7e908ef815db0d64b90d6b063995c343713c933b`からの今回接続範囲17ファイル、固定manifest SHA-256 `213432d0390f0f40c2448164ee689cec0476d207fe2705c12424a96d2a73aca5`。レビュー資料は一時領域`/private/tmp/cc-catalog-review-20261103-v2`。レビュワー自身は単体テストとSSRを実施し、Chrome・実Wranglerの確認は実装担当による証跡。リモートのDB投入・新画面の公開は未実施。


起動手順の簡略化：`package.json`に`dev:staging`と`db:local`を登録。全段階を`&&`で連結し、ローカル指定を固定した。npmの登録表示・設定・コマンド順・差分と台帳を確認した。ゲーム本体の変更はなく、既存の試験用公開手順は別に維持する。
