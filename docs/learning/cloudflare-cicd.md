# pushからCloudflareへの自動反映

公開先：[CodeChronicle](https://codechronicle-staging.metappi-dev.workers.dev/)。対象は`wrangler.staging.jsonc`の既存WorkerとD1。

## 一度だけ設定

1. [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)で対象アカウントに限定したトークンを作る。権限はWorkers Scriptsの編集、D1の編集、Account Settingsの読み取り。
2. [GitHub Actions secrets](https://github.com/Zundabyon/CodeChronicle/settings/secrets/actions)に`CLOUDFLARE_API_TOKEN`として登録する。トークンをコードやチャットへ貼らない。
3. [Actions](https://github.com/Zundabyon/CodeChronicle/actions)から「Cloudflare CI/CD」のRun workflowを実行するか、mainへpushする。

ローカルの`wrangler login`はGitHubの実行環境へ引き継がれないため、CI用の認証が別に必要。[Cloudflare公式手順](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)も参照。

## 普段の使い方

変更をcommitしmainへpushすると、テスト・Worker型チェック・タイトルのブラウザ検証・stagingビルドが実行される。成功した場合だけ、D1マイグレーション → 問題集投入 → Workerと静的ファイルの公開 → 公開JS/CSSと問題IDの照合が進む。PRは検証のみで、公開DBへ接続しない。手動実行もmain以外では公開しない。

D1の投入が失敗すればサイト公開へ進まない。問題集は内容から版を決め、過去の版を保持する既存のSQLを使用する。同じ版の再投入で複製や公開時刻の更新をしない。マイグレーションは適用済みなら再適用しない。将来のスキーマ変更は旧版サイトとの互換性を保つ必要がある。公開後の照合失敗はActionsを失敗にするが、自動ロールバックは行わない。

自動公開の結果は[Actions](https://github.com/Zundabyon/CodeChronicle/actions)の「Cloudflare CI/CD」で確認する。GitHub Pagesのworkflowとは別。サイトを手動で照合する場合は`npm run build:staging`の後に`npm run check:deployed`。再ビルドした版と公開版が異なると照合は失敗する。

タイトルの動きが見えない場合は「背景の動き：入」を確認。端末のモーション軽減設定中は停止する。現在の演出はランタンと門の紋様の発光で、全景や人物を動かすものではない。共通部品は`npm run dev:motion`で確認できる。
