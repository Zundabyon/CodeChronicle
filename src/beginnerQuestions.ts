import type { Question } from './content';

// Short, code-free fundamentals shared by every frontend/connection route.
// Each item asks one thing; rotate answer slots so memorizing A is not enough.
let ordinal=0;
const choice=(id:string,prompt:string,answer:string,others:[string,string,string],explanation:string):Question=>{
  const slot=ordinal++%4;
  const options:[string,string,string,string]=[answer,...others];
  [options[0],options[slot]]=[options[slot],options[0]];
  return {id:`basics-${id}`,difficulty:'beginner',topic:'laravel',kind:'choice',prompt,options,answer:slot,reveal:answer,explanation};
};
export const beginnerQuestions:Question[]=[
  choice('mvc-name','MVCは、アプリの仕事をどの三つに分ける考え方？','Model・View・Controller',['Map・Value・Code','Menu・Video・Color','Memory・Version・Cache'],'MVCはModel（モデル）、View（ビュー）、Controller（コントローラ）の頭文字です。'),
  choice('mvc-m','MVCのMは、どの言葉の頭文字？','Model（モデル）',['Menu（メニュー）','Mouse（マウス）','Message（メッセージ）'],'MはModel。アプリのデータや、そのデータを扱う処理を担当します。'),
  choice('mvc-v','MVCのVは、どの言葉の頭文字？','View（ビュー）',['Value（値）','Version（版）','Voice（声）'],'VはView。利用者に見せる表示を担当します。'),
  choice('mvc-c','MVCのCは、どの言葉の頭文字？','Controller（コントローラ）',['Color（色）','Cache（キャッシュ）','Column（列）'],'CはController。リクエストに応じて必要な処理を呼び出します。'),
  choice('mvc-model-notes','掲示板で、投稿データの取得や保存を担当するのはMVCのどれ？','Model',['View','ブラウザの戻るボタン','CSS'],'データの取得や保存はModelの担当です。表示の担当とは分けて考えます。'),
  choice('mvc-view-list','取得した投稿のタイトルを、画面の一覧として見せる担当は？','View',['Model','データベースの接続設定','マイグレーション'],'Viewはデータをどのように見せるかを担当します。'),
  choice('mvc-controller-request','「投稿一覧を見たい」というリクエストに応じ、必要な処理を呼ぶ担当は？','Controller',['文字の色','画像ファイル','フォント'],'Controllerはリクエストを受け、データの取得などを呼び出して応答を組み立てます。'),
  choice('mvc-separation','MVCで仕事を分けると、どんな利点がある？','直したい処理の場所を見つけやすい',['すべてのファイルが不要になる','データがなくても必ず動く','エラーが絶対に起きなくなる'],'表示・データ・リクエストの処理を分けると、変更する担当を考えやすくなります。'),
  choice('mvc-view-color','投稿一覧の見た目だけ変えたい。MVCでは、まずどの担当を見る？','View',['Model','データベースのバックアップ','サーバの電源'],'見た目を扱うのはViewです。データそのものを変える必要があるとは限りません。'),
  choice('mvc-model-not-db','Modelとデータベースの関係で、正しい説明は？','Modelはデータベースのデータを扱う窓口になれる',['Modelはデータベースそのものと必ず同じ物','Modelは文字の色だけを決める','ModelはURLの文字列だけを保存する'],'LaravelのEloquentモデルは、データベースのテーブルにあるデータを取得・保存するために使えます。'),
  choice('mvc-view-not-save','「画面に表示する」と「データを保存する」は、MVCではどう考える？','異なる担当の仕事として分ける',['どちらも必ずCSSだけで行う','画面に表示したら自動で保存される','データを保存したら必ず画面も消える'],'表示はView、データの保存などはModelの役割として整理できます。'),
  choice('mvc-library','図書館アプリで「本の情報を取り出す」担当をMVCに当てはめると？','Model',['本の文字色だけ','Viewの余白だけ','ブラウザのタブ名だけ'],'本の情報というデータを扱うので、Modelの担当として考えられます。'),
  choice('crud-name','CRUDは、データに対するいくつの基本操作をまとめた名前？','四つ',['二つ','三つ','五つ'],'CRUDは作成・取得・更新・削除の四つの基本操作です。'),
  choice('crud-c','CRUDのC（Create）は何をする操作？','新しく作る',['読む','書き換える','消す'],'Createは作成。新しいデータを追加する操作です。'),
  choice('crud-r','CRUDのR（Read）は何をする操作？','データを読み取る',['新しく作る','書き換える','消す'],'Readは取得・読み取り。保存されている情報を見るための操作です。'),
  choice('crud-u','CRUDのU（Update）は何をする操作？','既存のデータを更新する',['新しく作る','読むだけ','消す'],'Updateは更新。すでにあるデータの内容を変更します。'),
  choice('crud-d','CRUDのD（Delete）は何をする操作？','データを削除する',['新しく作る','読む','書き換える'],'Deleteは削除。対象のデータを取り除く操作です。'),
  choice('crud-create-post','掲示板に、新しい投稿を一件登録する。CRUDのどれ？','Create（作成）',['Read（取得）','Update（更新）','Delete（削除）'],'今までなかった投稿を追加するのでCreateです。'),
  choice('crud-read-detail','保存されている投稿の詳細を見る。CRUDのどれ？','Read（取得）',['Create（作成）','Update（更新）','Delete（削除）'],'情報を読み取って見る操作なのでReadです。'),
  choice('crud-update-title','すでにある投稿のタイトルの誤字を直して保存する。CRUDのどれ？','Update（更新）',['Create（作成）','Read（取得）','Delete（削除）'],'同じ投稿の内容を書き換えるのでUpdateです。'),
  choice('crud-delete-note','不要になった投稿を取り除く。CRUDのどれ？','Delete（削除）',['Create（作成）','Read（取得）','Update（更新）'],'対象の投稿を消す操作なのでDeleteです。'),
  choice('crud-read-list','村人名簿の一覧を表示するためにデータを取得する。CRUDのどれ？','Read（取得）',['Create（作成）','Update（更新）','Delete（削除）'],'一覧を表示するための取得もReadです。一件の詳細を見る場合だけではありません。'),
  choice('crud-create-villager','村人名簿に、新しい村人を登録する。CRUDのどれ？','Create（作成）',['Read（取得）','Update（更新）','Delete（削除）'],'名簿に新しいデータを加えるのでCreateです。'),
  choice('crud-update-address','村人名簿に登録済みの住所を、新しい住所に変える。CRUDのどれ？','Update（更新）',['Create（作成）','Read（取得）','Delete（削除）'],'すでにある村人データの住所を変更するのでUpdateです。'),
  choice('crud-delete-book','本の管理アプリから、不要な本の登録データを消す。CRUDのどれ？','Delete（削除）',['Create（作成）','Read（取得）','Update（更新）'],'本の登録データを取り除くのでDeleteです。実物の本を壊すという意味ではありません。'),
  choice('crud-not-create','投稿を読むだけなら、新しい投稿データを作る必要はある？','通常はない',['必ず一件作る','必ず全件消す','必ずタイトルを書き換える'],'読む操作はRead。作成するCreateとは別の操作です。'),
  choice('crud-same-record','CreateとUpdateの違いで正しいのは？','Createは追加、Updateは既存データの変更',['どちらもデータを消すだけ','Createは読むだけ、Updateは追加だけ','どちらも画像の色を変えるだけ'],'新しい一件を増やすのがCreate。同じ一件の内容を変えるのがUpdateです。'),
  choice('crud-no-change','CRUDのうち、データの内容を変えずに読み取る操作は？','Read',['Create','Update','Delete'],'Readは情報の取得です。作成・更新・削除のようなデータの変更とは区別します。'),
  choice('crud-delete-vs-update','「名前を直す」と「名簿から取り除く」は、それぞれどの操作？','UpdateとDelete',['CreateとRead','ReadとCreate','DeleteとUpdate'],'名前の修正はUpdate、データ自体を取り除くのはDeleteです。'),
  choice('crud-form-not-save','新規投稿フォームを開いただけ。投稿データの作成はもう終わっている？','通常は、まだ終わっていない',['必ず作成済みになる','必ず全投稿が削除される','必ず既存投稿が更新される'],'入力する画面を開くことと、入力内容を送信して保存することは別です。'),
  choice('crud-todo-add','やることリストに「やくそうを買う」を追加する操作は？','Create',['Read','Update','Delete'],'新しいやることを追加するのでCreateです。'),
  choice('crud-todo-done','登録済みのやることを「未完了」から「完了」に変える操作は？','Update',['Create','Read','Delete'],'同じデータの完了状態を変更するのでUpdateです。'),
  choice('http-read','Web APIで、本の一覧を取得するときに一般的に使うHTTPメソッドは？','GET',['POST','PATCH','DELETE'],'GETはリソースの取得に使います。CRUDのReadに対応する基本的な例です。'),
  choice('http-create','Web APIで、新しい本の情報を登録するときに一般的に使うHTTPメソッドは？','POST',['GET','PATCH','DELETE'],'新しいデータの登録には、一般的にPOSTを使います。'),
  choice('http-update','Web APIで、登録済みの本のタイトルだけを部分的に更新するとき、一般的に使えるHTTPメソッドは？','PATCH',['GET','DELETE','HEAD'],'PATCHは部分的な変更に使えます。CRUDのUpdateに対応する例です。'),
  choice('http-delete','Web APIで、本の登録データを削除するときに一般的に使うHTTPメソッドは？','DELETE',['GET','PATCH','HEAD'],'DELETEは対象の削除を表すHTTPメソッドです。'),
];
