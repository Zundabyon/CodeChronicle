# 状態・保存

対象は冒険の状態、個人設定、localStorage、セーブ検証、旧版移行、保護バックアップ、復元、書き出し/読み込み。現在の保存はブラウザ側で、DBやCloudflareへ移行済みではない。

| 管理するもの | 正本 |
|---|---|
| 保存データの検証・正規化 | [saveValidation.ts](../../src/saveValidation.ts) |
| クエスト/復習のID検証・旧状態の移行 | [quests/persistence.ts](../../src/quests/persistence.ts) |
| 保存・保護・復元・更新の利用経路 | [App.tsx](../../src/App.tsx) |
| セーブファイルの入出力と確認 | [SaveTransfer.tsx](../../src/SaveTransfer.tsx) |
| 保存表示・再開案内 | [SaveStatus.tsx](../../src/SaveStatus.tsx)、[ResumeSummary.tsx](../../src/ResumeSummary.tsx) |
| 音の個人設定 | [audioPreferences.ts](../../src/audioPreferences.ts) |

制作契約：確認前の読み込みプレビューで現在の冒険を上書きしない。検証失敗・取消・容量不足では既存データを保つ。新規開始やインポート前の保護処理、復元後の再開を維持する。読み込みや移行だけでクエスト報酬・宝箱報酬を再付与しない。

固有情報は保存対象の型・安定ID・初期値・許容値・旧版からの変換と失敗時の動作。保存バージョンやキーの値はコード側を参照し、説明文の値だけを編集しない。個人設定と冒険進行を混ぜない。

対応状況：現在の保存契約内の拡張は検証・初期値・移行・利用先の変更が必要。サーバー保存や端末同期は未対応。確認には [save-validation](../../tests/save-validation.test.mjs)、[quest-review](../../tests/quest-review.test.mjs)、[library-progress](../../tests/library-progress.test.mjs)、[title-screen E2E](../../tests/e2e/title-screen.test.mjs) と失敗・取消・古いセーブの再開を使う。変更履歴は互換性への影響とともに[ひな形](templates/change.md)へ残す。
