import type { Question } from './content';

// Original teaching examples. Villager is an Eloquent model; snippets are not executed.
export const chapterTwoQuestions: Question[] = [
  {
    "id": "ledger-read-filter",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "この取得結果に含まれる村人は誰？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villagers = Villager::where('address', '東通り')->get();",
    "options": [
      "ユナとミナ",
      "ユナだけ",
      "オルだけ",
      "ユナ・オル・ミナ全員"
    ],
    "answer": 0,
    "reveal": "ユナとミナ",
    "explanation": "where は住所が東通りの行に絞り、get は該当する全行を取得する。first なら最初の1件だけになる。西通りのオルは条件外であり、全員を取得する処理でもない。"
  },
  {
    "id": "ledger-read-id",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "id=2 の1人を取得するコードはどれ？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n",
    "options": [
      "Villager::count()",
      "Villager::find(2)",
      "Villager::all()",
      "Villager::where('address', '東通り')->get()"
    ],
    "answer": 1,
    "reveal": "Villager::find(2)",
    "explanation": "find は主キーで1件を探す。all は全件、住所の where は住所が一致する複数件、count は人数を返す。同じ名前の人がいても、主キーで区別できる。"
  },
  {
    "id": "ledger-read-missing",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "該当する行がない。この分岐で返る文字列は？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villager = Villager::find(99);\nif ($villager === null) {\n    return '見つかりません';\n}\nreturn $villager->name;",
    "options": [
      "ユナ",
      "99番の村人が自動で登録される",
      "見つかりません",
      "空の名前"
    ],
    "answer": 2,
    "reveal": "見つかりません",
    "explanation": "find は見つからないと null を返すため、この分岐に入る。空文字の村人や先頭の村人を返す処理でも、自動作成する処理でもない。存在を確認してから名前を読む。"
  },
  {
    "id": "ledger-read-no-write",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "読み取りだけを実行したあと、DBの名簿はどうなる？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villagers = Villager::where('address', '東通り')->get();",
    "options": [
      "東通りの2行だけ残る",
      "東通りの2行が新しく追加される",
      "3行とも住所が東通りに変わる",
      "3行のまま、各行の内容も変わらない"
    ],
    "answer": 3,
    "reveal": "3行のまま、各行の内容も変わらない",
    "explanation": "where と get は読み取りの条件と取得を行う。条件外の行を削除するには delete、新規行には保存、住所変更には update などの書き込みが必要じゃ。検索結果とDB本体は区別しよう。"
  },
  {
    "id": "ledger-update-target",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "正常に実行できたとき、変更される行と値は？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villager = Villager::findOrFail(2);\n$villager->address = '北通り';\n$villager->save();",
    "options": [
      "id=2 の住所だけが北通りになる",
      "全員の住所が北通りになる",
      "id=2 の名前が北通りになる",
      "北通りの村人が1行追加される"
    ],
    "answer": 0,
    "reveal": "id=2 の住所だけが北通りになる",
    "explanation": "findOrFail(2) で id=2 の既存行を取得し、address を変えて save している。他の行や name は変えず、新規インスタンスも作っていないため追加にならない。"
  },
  {
    "id": "ledger-update-save",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "このコードだけを実行した直後、DBに保存されている id=1 の住所は？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villager = Villager::findOrFail(1);\n$villager->address = '北通り';\n// ここで処理終了。save は呼んでいない。",
    "options": [
      "id=1 の行がなくなる",
      "東通り",
      "北通り",
      "空欄"
    ],
    "answer": 1,
    "reveal": "東通り",
    "explanation": "代入で変わるのは取得したモデルのメモリ上の値。save していないためDBには元の東通りが残る。値の代入は、空欄への更新でも削除でもない。"
  },
  {
    "id": "ledger-update-scope",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "id=2 の住所だけを直したい。条件に合うコードはどれ？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n",
    "options": [
      "Villager::where('address', '東通り')->update(['address' => '北通り'])",
      "Villager::where('id', 2)->delete()",
      "Villager::where('id', 2)->update(['address' => '北通り'])",
      "Villager::query()->update(['address' => '北通り'])"
    ],
    "answer": 2,
    "reveal": "Villager::where('id', 2)->update(['address' => '北通り'])",
    "explanation": "id の条件で対象を1行に絞って update する。条件なしの update は全行、住所の条件ではユナとミナが対象になる。delete は住所修正ではなく行の削除じゃ。"
  },
  {
    "id": "ledger-update-count",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "正常に住所を修正したあと、名簿の行数は？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villager = Villager::findOrFail(2);\n$villager->address = '北通り';\n$villager->save();",
    "options": [
      "2行",
      "4行",
      "0行",
      "3行"
    ],
    "answer": 3,
    "reveal": "3行",
    "explanation": "既存行の更新は値を変えるだけで行数を変えない。2行なら削除、4行なら追加、0行なら全削除などが起きたことになる。行数だけで住所の正しさまでは確認できないので、変更した値も読み直そう。"
  },
  {
    "id": "ledger-create-save",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "3人の名簿に対し、このコードを正常に実行した結果は？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villager = new Villager();\n$villager->name = 'ソラ';\n$villager->address = '南通り';\n$villager->save();\n// id は自動採番、他の必須列はない。",
    "options": [
      "ソラの行が追加され、合計4行になる",
      "id=1 の名前だけがソラになる",
      "全員の住所が南通りになる",
      "保存されず3行のままになる"
    ],
    "answer": 0,
    "reveal": "ソラの行が追加され、合計4行になる",
    "explanation": "new Villager は新規モデルを作り、その save は新しい行を追加する。既存行を取得していないため id=1 の更新ではなく、全行更新でもない。save まで実行した点も確認しよう。"
  },
  {
    "id": "ledger-create-validate",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "Laravel のリクエストで name が空文字。この処理で新しい行は追加される？",
    "code": "// コントローラ内。$request は受け取ったリクエスト。\n$data = $request->validate([\n    'name' => ['required', 'string'],\n    'address' => ['required', 'string'],\n]);\n$villager = new Villager();\n$villager->name = $data['name'];\n$villager->address = $data['address'];\n$villager->save();",
    "options": [
      "既存の全員の名前が空になる",
      "検証で失敗するため、追加されない",
      "空の名前の行が追加される",
      "住所だけの行が追加される"
    ],
    "answer": 1,
    "reveal": "検証で失敗するため、追加されない",
    "explanation": "required は空文字の名前を受理しない。validate が失敗すると後ろの save には進まないため、一部だけの保存も起きない。このコードには既存行を更新する処理もない。"
  },
  {
    "id": "ledger-create-unpersisted",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "この時点でDBにソラの行はある？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n$villager = new Villager();\n$villager->name = 'ソラ';\n$villager->address = '南通り';\n// save はまだ呼んでいない。",
    "options": [
      "name の代入で追加されている",
      "address の代入で追加されている",
      "このコードでは追加されていない",
      "new の時点で追加されている"
    ],
    "answer": 2,
    "reveal": "このコードでは追加されていない",
    "explanation": "new とプロパティへの代入だけではDBへの書き込みは起きない。save して初めて新規行が保存される。オブジェクトを作ることと永続化を分けて考えよう。"
  },
  {
    "id": "ledger-create-vs-schema",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "villagers テーブルはすでにある。ソラの行を1件登録するために必要なのは？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 1  | ユナ | 東通り\n// 2  | オル | 西通り\n// 3  | ミナ | 東通り\n",
    "options": [
      "名前用の列を増やすマイグレーションを作る",
      "既存の全行の名前をソラに update する",
      "villagers テーブルを作り直す",
      "新規モデルに名前と住所を入れて save する"
    ],
    "answer": 3,
    "reveal": "新規モデルに名前と住所を入れて save する",
    "explanation": "テーブルの構造はすでに足りているので、新規モデルの保存で行を追加する。マイグレーションは列などの構造変更、全行 update は既存データの変更。テーブルの作り直しは既存の名簿を失うおそれがある。"
  },
  {
    "id": "ledger-delete-target",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "正しい id=7 を残し、誤登録の id=8 だけを削除するには？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 7  | ソラ | 南通り\n// 8  | ソラ | 南通り\n// 9  | ミナ | 東通り\n// 控えと照合済み。id=8 だけが誤登録。\n",
    "options": [
      "Villager::where('id', 8)->delete()",
      "Villager::where('name', 'ソラ')->delete()",
      "Villager::query()->delete()",
      "Villager::where('id', 7)->delete()"
    ],
    "answer": 0,
    "reveal": "Villager::where('id', 8)->delete()",
    "explanation": "主キー id=8 に絞れば誤登録の1行だけ削除できる。名前で絞ると正しい id=7 も対象になる。条件なしでは全行、id=7 を指定すると残すべき行を消してしまう。"
  },
  {
    "id": "ledger-delete-result",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "この削除が正常に終わったあと、残る id は？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 7  | ソラ | 南通り\n// 8  | ソラ | 南通り\n// 9  | ミナ | 東通り\n// 控えと照合済み。id=8 だけが誤登録。\nVillager::where('id', 8)->delete();\n// SoftDeletes は使っていない。",
    "options": [
      "7・8・9 すべて",
      "7 と 9",
      "8 と 9",
      "9 だけ"
    ],
    "answer": 1,
    "reveal": "7 と 9",
    "explanation": "id=8 だけを条件にしているので、残るのは id=7 と9。8と9なら消す対象の取り違え、9だけなら名前でまとめて消した場合。SoftDeletes を使わない前提なので、8はDBから削除される。"
  },
  {
    "id": "ledger-delete-preview",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "まだ削除はしない。削除予定の id=8 の中身だけを確認する操作は？",
    "code": "// villagers テーブル（id は主キー）\n// id | name | address\n// 7  | ソラ | 南通り\n// 8  | ソラ | 南通り\n// 9  | ミナ | 東通り\n// 控えと照合済み。id=8 だけが誤登録。\n",
    "options": [
      "Villager::where('id', 8)->update(['address' => '北通り'])",
      "Villager::query()->delete()",
      "Villager::find(8)",
      "Villager::where('id', 8)->delete()"
    ],
    "answer": 2,
    "reveal": "Villager::find(8)",
    "explanation": "find(8) は対象を読み取るだけなので削除前の照合に使える。delete は確認前の削除、update は住所の書き換え、条件なしの delete は全行削除になる。読み取りと書き込みを区別しよう。"
  },
  {
    "id": "ledger-delete-transfer",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "choice",
    "filename": "名簿の実習 / Laravel Eloquent",
    "prompt": "掲示板で「自分の投稿1件だけ」を削除する。サーバーで最低限確認したい組み合わせは？",
    "code": "// サインイン済みユーザーの掲示板。\n// 投稿には id と user_id（投稿者ID）がある。\n// 編集者・管理者の特別権限はない。\n// 画面から送られた投稿IDは変更され得る。",
    "options": [
      "投稿IDが存在することだけ",
      "削除ボタンが画面に表示されていたことだけ",
      "リクエストに投稿者IDが入っていることだけ",
      "対象の投稿IDと、ログイン中の利用者がその投稿者であること"
    ],
    "answer": 3,
    "reveal": "対象の投稿IDと、ログイン中の利用者がその投稿者であること",
    "explanation": "存在確認だけでは他人の投稿も消せてしまう。画面の表示や送信値は書き換えられるので、サーバーで対象を特定し、信頼できるログイン情報と投稿の user_id を照合して削除を許可する。"
  }
];
