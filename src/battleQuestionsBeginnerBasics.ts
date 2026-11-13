import type { Question } from './content';

// Companion set for beginnerQuestions: one new code-free fundamental per original item.
// Same helper shape; answer slots rotate so memorizing A is not enough.
let ordinal=0;
const choice=(id:string,prompt:string,answer:string,others:[string,string,string],explanation:string):Question=>{
  const slot=ordinal++%4;
  const options:[string,string,string,string]=[answer,...others];
  [options[0],options[slot]]=[options[slot],options[0]];
  return {id:`bb2-${id}`,difficulty:'beginner',topic:'laravel',kind:'choice',prompt,options,answer:slot,reveal:answer,explanation};
};
export const battleQuestionsBeginnerBasics:Question[]=[
  choice('mvc-flow','投稿一覧のリクエストを受けてから画面を返すまで、MVCの典型的な流れは？','Controllerが受け、Modelでデータを取り、Viewで表示する',['Viewが受け、Controllerでデータを保存し、Modelで表示する','Modelが受け、Viewでデータを取り、Controllerで表示する','Viewが先に表示し、そのあとModelがリクエストを受ける'],'リクエストを受けるのはController、データを扱うのはModel、見せるのはViewです。受付・データ・表示の順番を担当と結びつけて考えます。'),
  choice('model-folder','Laravelで、make:modelで作ったModelのクラスが置かれる標準のフォルダは？','app/Models',['resources/views','app/Http/Controllers','database/migrations'],'Modelは標準でapp/Modelsに置かれます。resources/viewsは画面のテンプレート、app/Http/Controllersはコントローラ、database/migrationsはテーブル定義の置き場所です。'),
  choice('blade-extension','LaravelのBladeテンプレート（View）のファイル名の末尾として正しいのは？','.blade.php',['.php.blade','.view.php','.tsx'],'Bladeのファイルは.blade.phpで終わります。順序を逆にした.php.bladeや.view.phpはBladeとして扱われません。.tsxはReactなどで使うファイルです。'),
  choice('controller-folder','Laravelで、コントローラのクラスが置かれる標準のフォルダは？','app/Http/Controllers',['app/Models','resources/views','routes'],'コントローラは標準でapp/Http/Controllersに置かれます。routesはURLと処理の対応を書く場所で、コントローラ本体を置く場所ではありません。'),
  choice('model-table-name','LaravelのPostモデルが、特に指定しない場合に対応するテーブル名は？','posts',['post','Posts','post_table'],'Eloquentは、クラス名を小文字のスネークケースにした複数形をテーブル名として使います。Postならpostsです。単数形や大文字始まりにはなりません。'),
  choice('view-receives-data','Controllerが取得した投稿一覧をViewへ渡すのはなぜ？','Viewがそのデータを使って画面を作るため',['Viewがデータベースへ保存するため','Viewがリクエストを受け付けるため','ViewがURLの行き先を決めるため'],'Viewは受け取ったデータを表示する担当です。保存はModel、リクエストの受付はController、URLの行き先はルートの仕事です。'),
  choice('controller-response','Controllerのメソッドが最後に行う仕事として一般的なのは？','画面やリダイレクトなどの応答を返す',['テーブルに新しい列を定義する','ボタンの色を決める','Artisanコマンドを新しく作る'],'Controllerはリクエストを処理し、最後に応答を返します。列の定義はマイグレーション、見た目はViewの仕事です。'),
  choice('model-reuse','同じ投稿データを一覧画面と詳細画面の両方で使う。データの扱いをModelにまとめる利点は？','データの扱い方を一か所で管理し、複数の画面で使い回せる',['画面を一つしか作れなくなる','Viewが不要になる','データベースを使わずに済む'],'データの取得や保存の決まりをModelに集めると、どの画面からも同じ扱い方で使えます。表示は引き続きViewが担当し、データの保存先も必要です。'),
  choice('model-new-field','投稿データそのものに「カテゴリ」という項目を持たせたい。MVCでデータの形を扱う担当は？','Model',['View','Controller','ルート'],'保存するデータの形はModel（とその背後のテーブル）の担当です。Viewは見せ方、Controllerはリクエストの処理、ルートはURLの行き先を扱います。'),
  choice('model-is-table','Laravelで、一つのEloquentモデルクラスは主に何に対応する？','データベースの一つのテーブル',['データベース全体','一つの画面','一つのURL'],'Eloquentでは、各モデルが一つのテーブルに対応し、そのテーブルのデータを扱います。画面やURLとは対応づけられていません。'),
  choice('view-content','Viewに書くのが適切なものは？','見出しやボタンの並び方',['投稿を保存する処理','どのURLで受け付けるかの設定','テーブルの列の定義'],'Viewは利用者に見せる表示を書きます。保存処理はModel、URLの設定はルート、列の定義はマイグレーションの役割です。'),
  choice('library-controller','図書館アプリで「貸出ボタンが押された」というリクエストを受け付ける担当は？','Controller',['Model','View','マイグレーション'],'リクエストを受け、必要な処理を呼び出すのはControllerです。Modelは貸出データを扱い、Viewは結果を表示します。'),
  choice('crud-full-words','CRUDの四つの頭文字が表す英単語の組み合わせは？','Create・Read・Update・Delete',['Copy・Run・Undo・Delete','Create・Return・Upload・Download','Cache・Read・Update・Deploy'],'CRUDはCreate（作成）・Read（読み取り）・Update（更新）・Delete（削除）です。似た頭文字の別の単語と区別します。'),
  choice('create-count','Createの操作が成功すると、保存されているデータの件数は一般的にどうなる？','1件増える',['1件減る','変わらない','0件になる'],'Createは新しいデータを追加するので件数が増えます。減るのはDelete、件数が変わらないのはReadやUpdateです。'),
  choice('read-search','次のうち、CRUDのRead（読み取り）にあたるものは？','キーワードで検索して該当する本を表示する',['新しい本を登録する','本のタイトルを直す','本の登録データを消す'],'検索して結果を表示するのも、保存済みのデータを読み取るのでReadです。登録はCreate、修正はUpdate、削除はDeleteです。'),
  choice('update-target','投稿のタイトルを更新する。どの投稿を変えるかを区別するのに一般的に使うのは？','id（投稿ごとに異なる番号）',['タイトルの文字数','画面の表示順','ボタンの色'],'Updateでは変更する1件を確実に指定します。idは投稿ごとに異なるので区別に使えます。文字数や表示順は他の投稿と重なったり変わったりします。'),
  choice('read-after-delete','投稿を削除（Delete）した後、同じ投稿を取得しようとするとどうなる？','通常は見つからない',['削除前と同じ内容が取得できる','新しい投稿として作り直される','別の投稿の内容に置き換わる'],'Deleteでデータを取り除くと、通常はもう取得できません。削除は作成や別データへの置き換えを自動で行いません。'),
  choice('crud-comment','掲示板の投稿に、新しいコメントを1件つけて保存する。コメントのデータにとってCRUDのどれ？','Create（作成）',['Read（取得）','Update（更新）','Delete（削除）'],'今までなかったコメントのデータを1件増やすのでCreateです。どのデータを主語にして考えるかを決めると判断しやすくなります。'),
  choice('crud-count','投稿の件数を数えて「全10件」と表示する。CRUDのどれ？','Read（取得）',['Create（作成）','Update（更新）','Delete（削除）'],'件数を数えるのは保存済みデータを読み取る操作なのでReadです。データは増えも減りも変わりもしません。'),
  choice('crud-avatar','プロフィール画像を、別の画像に差し替えて保存する。CRUDのどれ？','Update（更新）',['Create（作成）','Read（取得）','Delete（削除）'],'同じ利用者のプロフィールの内容を変えるのでUpdateです。利用者が増えたり消えたりするわけではありません。'),
  choice('crud-withdraw','退会した利用者のアカウントデータを取り除く。CRUDのどれ？','Delete（削除）',['Create（作成）','Read（取得）','Update（更新）'],'アカウントのデータそのものを取り除くのでDeleteです。'),
  choice('crud-login-lookup','ログイン時に、入力されたメールアドレスの利用者データを探して照合する。CRUDのどれ？','Read（取得）',['Create（作成）','Update（更新）','Delete（削除）'],'保存済みの利用者データを探して読むのでReadです。ログインの画面でも、利用者を新しく作るわけではありません。'),
  choice('crud-order','ショッピングサイトで注文を確定し、新しい注文データを保存する。CRUDのどれ？','Create（作成）',['Read（取得）','Update（更新）','Delete（削除）'],'それまでなかった注文データを1件追加するのでCreateです。'),
  choice('crud-stock','商品の在庫数を10から9に減らして保存する。CRUDのどれ？','Update（更新）',['Create（作成）','Read（取得）','Delete（削除）'],'数が減っても、商品データ自体は残ったまま在庫数の値を変えるのでUpdateです。データを取り除くDeleteとは区別します。'),
  choice('crud-reservation','予約をキャンセルし、予約のデータそのものを取り除く。CRUDのどれ？','Delete（削除）',['Create（作成）','Read（取得）','Update（更新）'],'予約データを取り除くのでDeleteです。データを残して「キャンセル済み」に変える作りなら、それはUpdateになります。'),
  choice('crud-bug-duplicate','投稿一覧を表示するたびに、投稿が1件ずつ増えてしまう不具合。誤って行われている可能性が高い操作は？','Create',['Read','Update','Delete'],'一覧の表示は本来Readだけで済みます。件数が増えるのはデータを追加するCreateが紛れ込んでいるためと考えられます。'),
  choice('read-vs-delete','ReadとDeleteの違いで正しいのは？','Readはデータを残したまま見る、Deleteはデータを取り除く',['どちらもデータを取り除く','Readはデータを追加し、Deleteは読み取る','どちらもデータの内容を書き換える'],'Readはデータを変えずに読み取り、Deleteは対象のデータを取り除きます。'),
  choice('crud-shrinks','CRUDのうち、成功すると保存データの件数が減る操作は？','Delete',['Create','Read','Update'],'Deleteはデータを取り除くので件数が減ります。Createは増え、ReadとUpdateは件数を変えません。'),
  choice('crud-create-and-read','「新しい村人を名簿に加える」と「村人の一覧を見る」は、それぞれどの操作？','CreateとRead',['ReadとCreate','UpdateとRead','CreateとUpdate'],'新しいデータを加えるのはCreate、一覧を見るのはReadです。順番を入れ替えた組み合わせに注意します。'),
  choice('crud-edit-form','編集フォームを開くと、今のタイトルが入力欄に入っていた。このとき主に行われたのは？','Read（既存データの取得）',['Create（作成）','Update（更新）','Delete（削除）'],'今のタイトルを表示するため、既存のデータを読み取っています。内容を書き換えるUpdateは、フォームを送信して保存するときです。'),
  choice('todo-clear-done','やることリストで、完了した項目をリストから完全に取り除く操作は？','Delete',['Create','Read','Update'],'項目そのものを取り除くのでDeleteです。完了状態に変えるだけならUpdateです。'),
  choice('todo-deadline','登録済みのやることの期限を、明日から来週に変更する操作は？','Update',['Create','Read','Delete'],'既存のやることの期限という値を書き換えるのでUpdateです。新しいやることが増えるわけではありません。'),
  choice('http-get-safe','GETリクエストで本の一覧を取得したとき、サーバに保存されている本のデータは一般的にどうなる？','変更されない',['1件増える','すべて削除される','最初の1件が更新される'],'GETは取得のためのメソッドで、保存データを変えない使い方が前提です。データを変える操作にはPOST・PATCH・DELETEなどを使います。'),
  choice('http-201','Web APIで、新しいデータが作成されたことを表すHTTPステータスコードは？','201 Created',['404 Not Found','500 Internal Server Error','301 Moved Permanently'],'201 Createdは作成の成功を表します。404は対象が見つからない、500はサーバ内部のエラー、301は移動を表します。'),
  choice('http-put','Web APIで、登録済みの本の情報を丸ごと置き換えて更新するときに一般的に使うHTTPメソッドは？','PUT',['POST','GET','DELETE'],'PUTは対象を送った内容で置き換えるときに使います。一部だけの変更ならPATCHも使えます。POSTは新規作成、GETは取得、DELETEは削除です。'),
  choice('http-404','Web APIで、存在しない本のURL（例: /api/books/999）を取得しようとしたとき、一般的に返るHTTPステータスコードは？','404 Not Found',['200 OK','201 Created','302 Found'],'404は対象が見つからないことを表します。200は成功、201は作成成功、302は別のURLへの一時的な移動です。'),
];
