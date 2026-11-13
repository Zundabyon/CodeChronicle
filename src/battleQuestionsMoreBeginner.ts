import type { Difficulty, Question } from './content';

// options[0]を正解として書き、slotで表示位置を指定する（バッチ内で0〜3を均等に分散）。
const choice = (
  id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string,
  options: [string, string, string, string], explanation: string,
  extra: Partial<Question>, slot: number,
): Question => {
  const shuffled: [string, string, string, string] = [...options];
  [shuffled[0], shuffled[slot]] = [shuffled[slot], shuffled[0]];
  return { id, difficulty, topic, kind: 'choice', prompt, options: shuffled, answer: slot, reveal: shuffled[slot], explanation, ...extra };
};

// moreQuestions.tsの初級4択（CLI以外）に1問ずつ対応する通常戦用の追加問題。
export const battleQuestionsMoreBeginner: Question[] = [
  // React（r-b-5〜r-b-9に対応）
  choice('bmb2-r-b-5', 'beginner', 'frontend', '投稿の配列から、ピン留め（pinnedがtrue）の投稿だけを集めた新しい配列を作るメソッドは？', ['filter', 'map', 'find', 'some'], 'filterは条件を満たす要素をすべて残した新しい配列を返します。mapは各要素の変換、findは最初の1件だけ、someは「1件でもあるか」の真偽値を返します。', { track: 'react' }, 1),
  choice('bmb2-r-b-6', 'beginner', 'frontend', '「公開する」チェックボックスのオン・オフをstateのisPublicと同期したい。valueの代わりにisPublicを渡す属性は？', ['checked', 'value', 'selected', 'defaultChecked'], 'チェックボックスのオン・オフはcheckedで指定し、onChangeでe.target.checkedをsetterへ渡します。valueは送信される値、selectedは<option>用、defaultCheckedは最初の表示だけを決めて以後stateと同期しません。', { track: 'react' }, 2),
  choice('bmb2-r-b-7', 'beginner', 'frontend', 'ログイン中（isLoggedInがtrue）のときだけ投稿ボタンを表示するTSXは？', ['{isLoggedIn && <button>投稿</button>}', '{isLoggedIn || <button>投稿</button>}', '<button v-if="isLoggedIn">投稿</button>', '{if (isLoggedIn) <button>投稿</button>}'], '&&は左がtrueのときだけ右の要素を表示します。||は逆にfalseのときに表示します。v-ifはVueの記法で、JSXの波括弧の中にはif文を書けません。', { track: 'react' }, 3),
  choice('bmb2-r-b-8', 'beginner', 'frontend', '削除ボタンをクリックしたときに、remove(post.id)を呼ぶReactの指定は？', ['onClick={() => remove(post.id)}', 'onClick={remove(post.id)}', 'onClick="remove(post.id)"', 'onClick={remove}'], '引数付きで呼ぶときは、クリック時に実行する関数を渡します。onClick={remove(post.id)}は描画のたびにすぐ実行され、文字列は関数ではありません。onClick={remove}ではpost.idではなくイベントが渡されます。', { track: 'react' }, 0),
  choice('bmb2-r-b-9', 'beginner', 'frontend', '投稿の画像をpost.imageUrlのURLで表示するTSXは？', ['<img src={post.imageUrl} />', '<img src="post.imageUrl" />', '<img src="{post.imageUrl}" />', '<img :src="post.imageUrl" />'], '属性に変数の値を渡すときは、引用符を付けずに波括弧で囲みます。引用符で囲むと「post.imageUrl」などの文字そのものがURLになります。:srcはVueの記法です。', { track: 'react' }, 1),

  // Vue（v-b-5〜v-b-9に対応）
  choice('bmb2-v-b-5', 'beginner', 'frontend', 'v-forで投稿を表示するとき、各投稿が何番目か（index）も受け取る書き方は？', ['v-for="(post, index) in posts"', 'v-for="(index, post) in posts"', 'v-if="(post, index) in posts"', 'v-model="(post, index) in posts"'], 'v-forでは1つ目に要素、2つ目に位置の番号を受け取ります。順番を逆にすると、indexという名前の変数に投稿が入ります。v-ifは条件表示、v-modelは入力の同期で、繰り返しには使いません。', { track: 'vue' }, 2),
  choice('bmb2-v-b-6', 'beginner', 'frontend', '投稿本文を複数行で入力する<textarea>を、refのbodyと同期する書き方は？', ['<textarea v-model="body"></textarea>', '<textarea>{{ body }}</textarea>', '<textarea :model="body"></textarea>', '<textarea @model="body"></textarea>'], 'textareaもv-modelで同期します。textareaの中に{{ body }}と書いても補間されません。:modelや@modelはmodelという属性やイベントの指定になり、入力を同期しません。', { track: 'vue' }, 3),
  choice('bmb2-v-b-7', 'beginner', 'frontend', '投稿が0件のときはv-ifで案内を出し、それ以外のときは一覧を出したい。一覧の要素に付けるディレクティブは？', ['v-else', 'v-else-if', 'v-show', 'v-once'], 'v-elseはすぐ前のv-ifが偽のときに表示され、条件式は書きません。v-else-ifは別の条件を書くときに使います。v-showやv-onceはv-ifとの組み合わせを作りません。', { track: 'vue' }, 0),
  choice('bmb2-v-b-8', 'beginner', 'frontend', 'post.pinnedがtrueの投稿カードだけにクラスpinnedを付けるVueの指定は？', [':class="{ pinned: post.pinned }"', ':class="{ post.pinned: pinned }"', 'class="{ pinned: post.pinned }"', '@class="{ pinned: post.pinned }"'], ':classにオブジェクトを渡すと、値がtrueのキーがクラス名として付きます。キーと値を逆にすると成り立ちません。:のないclassは文字列のまま、@はイベントの指定です。', { track: 'vue' }, 1),
  choice('bmb2-v-b-9', 'beginner', 'frontend', '「読み込み中…」の要素を消さずに残したまま、loadingの値に合わせて表示と非表示を切り替えるディレクティブは？', ['v-show', 'v-if', 'v-for', 'v-model'], 'v-showは要素を残し、CSSのdisplayで表示を切り替えます。v-ifは条件が偽のとき要素そのものを描画しません。v-forは繰り返し、v-modelは入力の同期です。', { track: 'vue' }, 2),

  // Laravel（l-b-4〜l-b-9に対応）
  choice('bmb2-l-b-4', 'beginner', 'laravel', 'Laravelに標準で付いている、HTMLにデータを埋め込んで画面を作るテンプレートの仕組みは？', ['Blade', 'Eloquent', 'Artisan', 'Composer'], 'Bladeは.blade.phpファイルに{{ $title }}のように値を埋め込むテンプレートです。Eloquentはデータベース操作、Artisanはコマンドライン、ComposerはPHPのパッケージ管理です。', {}, 3),
  choice('bmb2-l-b-5', 'beginner', 'laravel', '名前を指定しない場合、EloquentのPostモデルが対応するテーブル名は？', ['posts', 'post', 'Posts', 'post_table'], 'Eloquentはモデル名を小文字のスネークケースにし、複数形にしたテーブルを使います。Postならpostsです。単数形や大文字のままにはなりません。', {}, 0),
  choice('bmb2-l-b-6', 'beginner', 'laravel', '新しい投稿を書くための入力フォームを表示する、リソースコントローラのメソッドは？', ['create', 'store', 'edit', 'index'], 'createは新規作成フォームを表示し、送信された内容の保存はstoreが担当します。editは既存の投稿を編集するフォーム、indexは一覧の表示です。', {}, 1),
  choice('bmb2-l-b-7', 'beginner', 'laravel', "Route::get('/posts/{post}', ...) の {post} は何を表す？", ['URLの一部を受け取るルートパラメータ', '投稿の本文をそのまま書く場所', 'CSSのクラス名', 'データベースの名前'], '{post}は/posts/7の「7」のように、URLの変わる部分を受け取ります。受け取った値はコントローラで使えます。本文やクラス名、データベース名を書く場所ではありません。', {}, 2),
  choice('bmb2-l-b-8', 'beginner', 'laravel', '投稿1件を削除する、リソースコントローラのメソッドは？', ['destroy', 'delete', 'remove', 'store'], 'リソースコントローラでは、DELETEリクエストをdestroyメソッドが受けます。HTTPメソッド名のdeleteや、一般的な言葉のremoveは標準のメソッド名ではありません。storeは新規保存です。', {}, 3),
  choice('bmb2-l-b-9', 'beginner', 'laravel', 'マイグレーションで、数千文字にもなる投稿本文を入れるbody列を作る指定は？', ["$table->text('body')", "$table->string('body')", "$table->integer('body')", "$table->boolean('body')"], 'textは長い文章を入れる列です。stringは既定で255文字までの短い文字列向けです。integerは整数、booleanは真偽値で、文章は入りません。', {}, 0),

  // Inertia（i-b-3〜i-b-7に対応）
  choice('bmb2-i-b-3', 'beginner', 'connection', "Inertia::render('Posts/Show', ['post' => $post]) の場合、ページ側で投稿を受け取るpropsの名前は？", ['post', 'Post', '$post', 'Posts/Show'], '配列のキー名が、そのままページのprops名になります。Postはモデル名、$postはPHPの変数名、Posts/Showはページコンポーネント名です。', { inertia: true }, 1),
  choice('bmb2-i-b-4', 'beginner', 'connection', 'ログイン中のユーザー名を、すべてのInertiaページへ共通のpropsとして渡したい。Laravel側で設定する場所は？', ['HandleInertiaRequestsミドルウェアのshare', 'マイグレーション', '各ページのCSS', 'Seeder'], 'HandleInertiaRequestsのshareに書いた値は、すべてのページのpropsに含まれます。マイグレーションはテーブル構造、Seederは初期データの投入で、ページへのデータ渡しではありません。', { inertia: true }, 2),
  choice('bmb2-i-b-5', 'beginner', 'connection', 'Inertiaのページ間の移動に、通常の<a>ではなくLinkを使うと何が変わる？', ['ページ全体を読み込み直さずに移動できる', 'サーバへ問い合わせずに移動できる', 'URLを指定しなくてよくなる', 'データベースが自動で作られる'], 'Linkはクリック時に通信でページのデータを受け取り、ページ全体を読み込み直さずに画面を切り替えます。サーバへの問い合わせはなくならず、移動先のhrefも必要です。', { inertia: true }, 3),
  choice('bmb2-i-b-6', 'beginner', 'connection', 'Inertiaのページで、現在のURLや共通のpropsを読み取るときに使う関数は？', ['usePage', 'useForm', 'useState', 'Link'], 'usePageで現在のページのURLやpropsを読み取れます。useFormはフォームの入力と送信、useStateはReactのstate、Linkは移動用のコンポーネントです。', { inertia: true }, 0),
  choice('bmb2-i-b-7', 'beginner', 'connection', '投稿を保存したあと、一覧へリダイレクトして「投稿しました」を一度だけ表示したい。Laravel側で使う方法は？', ["->with('message', '投稿しました')でセッションへ一時保存する", 'マイグレーションに文言を書く', 'CSSのcontentに文言を書く', 'リダイレクトせずJSONだけを返す'], 'with()でセッションに入れた値は次のリクエストまでだけ残るフラッシュデータです。共通のpropsとして渡せば、一覧ページで一度だけ表示できます。JSONだけを返すと、Inertiaのページ遷移として扱えません。', { inertia: true }, 1),

  // API（api-b-3〜api-b-7に対応）
  choice('bmb2-api-b-3', 'beginner', 'connection', 'fetchの前に書いて、APIの応答が届くまで待つキーワードは？', ['await', 'async', 'static', 'const'], 'awaitを付けると、fetchの結果が届くまで待ってから次の行へ進みます。asyncはawaitを使う関数の前に付ける印で、待つ働きはありません。staticやconstは待機と関係ありません。', { inertia: false }, 2),
  choice('bmb2-api-b-4', 'beginner', 'connection', 'APIで新しい投稿の作成に成功したときに返る、「作成された」を表すHTTPステータスコードは？', ['201', '404', '401', '500'], '201 Createdは新しいリソースの作成成功を表します。404は対象が見つからない、401は認証が必要、500はサーバ内部のエラーです。', { inertia: false }, 3),
  choice('bmb2-api-b-5', 'beginner', 'connection', '存在しない投稿ID 999をGETで取得しようとしたとき、APIが一般的に返すHTTPステータスコードは？', ['404', '201', '204', '401'], '404 Not Foundは、指定した投稿が見つからないことを表します。201は作成成功、204は本文のない成功、401は認証が必要という意味です。', { inertia: false }, 0),
  choice('bmb2-api-b-6', 'beginner', 'connection', 'APIへ送るJSONの本文として、正しい書き方は？', ['{"title": "はじめまして"}', "{'title': 'はじめまして'}", '{title: "はじめまして"}', 'title=はじめまして'], 'JSONではキーも文字列も二重引用符で囲みます。単一引用符や、引用符のないキーはJavaScriptでは書けてもJSONとしては不正です。title=...はフォーム送信の形式です。', { inertia: false }, 1),
  choice('bmb2-api-b-7', 'beginner', 'connection', 'タイトルに「祭り」を含む投稿を検索するAPIリクエストとして、クエリ文字列を使った形は？', ['GET /api/posts?q=祭り', 'GET /api/posts#q=祭り', 'GET /api/posts&q=祭り', 'DELETE /api/posts?q=祭り'], 'クエリ文字列はURLの?の後に書きます。#以降はサーバへ送られず、?のない&はクエリの始まりになりません。DELETEでは検索ではなく削除の要求になります。', { inertia: false }, 2),
];
