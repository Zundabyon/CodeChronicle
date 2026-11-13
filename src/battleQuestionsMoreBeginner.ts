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
  choice('bmb2-r-b-8', 'beginner', 'frontend', '入力欄に1文字打つたびに、入力された値をsetTitleでstateへ入れたい。<input>に付けるReactのイベントは？', ['onChange', 'onClick', 'onSubmit', 'onBlur'], 'ReactのonChangeは、入力欄の値が1文字変わるたびに呼ばれます。onClickは入力欄をクリックしたとき、onSubmitはフォームを送信したとき、onBlurは入力欄から離れたときだけ呼ばれます。', { track: 'react' }, 0),
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
  choice('bmb2-l-b-9', 'beginner', 'laravel', 'マイグレーションでbody列を作る。投稿本文には255文字を超える長い文章も入る。適切な指定は？', ["$table->text('body')", "$table->string('body')", "$table->integer('body')", "$table->boolean('body')"], 'textは長い文章を入れる列です。長さを指定しないstringは255文字までの短い文字列向けです。integerは整数、booleanは真偽値で、文章は入りません。', {}, 0),

  // Inertia（i-b-3〜i-b-7に対応）
  choice('bmb2-i-b-3', 'beginner', 'connection', "Inertia::render('Posts/Show', ['post' => $post]) の場合、ページ側で投稿を受け取るpropsの名前は？", ['post', 'Post', '$post', 'Posts/Show'], '配列のキー名が、そのままページのprops名になります。Postはモデル名、$postはPHPの変数名、Posts/Showはページコンポーネント名です。', { inertia: true }, 1),
  choice('bmb2-i-b-4', 'beginner', 'connection', 'LaravelからInertia::renderでページへ渡したpropsの値について、正しいのは？', ['ブラウザへ送られるので、利用者も中身を見られる', 'サーバの中だけで使われ、ブラウザには届かない', '画面に表示した項目だけがブラウザへ送られる', '自動で暗号化され、利用者には読めない'], 'propsはページのHTMLや通信の応答に入ってブラウザへ届くため、開発者ツールで誰でも中身を見られます。画面に表示していない項目も送られるので、見せてはいけない値をpropsに入れないようにします。', { inertia: true }, 2),
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

// 誤答の選択肢の文字列と完全一致で結び付ける（wrongChoiceReasons.tsと同じ形式）。
export const battleQuestionsMoreBeginnerReasons: Record<string, Record<string, string>> = {
  'bmb2-r-b-5': { 'map': 'mapは各要素を別の値へ変換し、要素の数は変わりません。条件に合う投稿だけを残すにはfilterを使います。', 'find': 'findは条件に合う最初の1件だけを返し、配列にはなりません。ピン留めの投稿をすべて集めるにはfilterです。', 'some': 'someは条件に合う要素が1件でもあるかをtrue/falseで返すだけです。投稿を集めた配列は作りません。' },
  'bmb2-r-b-6': { 'value': 'チェックボックスのvalueは、送信時に使う値です。オン・オフの状態はcheckedで指定します。', 'selected': 'selectedは<select>の中の<option>で選択を表す属性です。チェックボックスのオン・オフにはcheckedを使います。', 'defaultChecked': 'defaultCheckedは最初の表示だけを決め、その後はstateと同期しません。常にisPublicと合わせるにはcheckedです。' },
  'bmb2-r-b-7': { '{isLoggedIn || <button>投稿</button>}': '||は左がfalseのときに右を表示するため、ログインしていないときにボタンが出ます。trueのときだけ表示するには&&です。', '<button v-if="isLoggedIn">投稿</button>': 'v-ifはVueのテンプレートの記法で、ReactのJSXでは条件表示として働きません。JSXでは{isLoggedIn && ...}のように式で書きます。', '{if (isLoggedIn) <button>投稿</button>}': 'JSXの波括弧の中には式しか書けず、if文はそのまま書けません。条件表示には&&や三項演算子を使います。' },
  'bmb2-r-b-8': { 'onClick': 'onClickは入力欄をクリックしたときに呼ばれます。文字を打っても呼ばれないので、入力した値をstateへ入れられません。', 'onSubmit': 'onSubmitは<form>を送信したときのイベントです。1文字打つたびには呼ばれません。', 'onBlur': 'onBlurは入力欄から離れたときに1回呼ばれるだけです。打つたびに値を入れるにはonChangeです。' },
  'bmb2-r-b-9': { '<img src="post.imageUrl" />': '引用符で囲むと「post.imageUrl」という文字そのものがURLになります。変数の値を渡すには波括弧を使います。', '<img src="{post.imageUrl}" />': '引用符の中の波括弧は式にならず、ただの文字として扱われます。src={post.imageUrl}と引用符なしで書きます。', '<img :src="post.imageUrl" />': ':srcはVueの属性バインドの記法です。ReactのJSXでは波括弧で値を渡します。' },
  'bmb2-v-b-5': { 'v-for="(index, post) in posts"': 'v-forは1つ目に要素、2つ目に番号を受け取ります。この順番では、indexという名前の変数に投稿が入ってしまいます。', 'v-if="(post, index) in posts"': 'v-ifは条件によって表示するかどうかを決めるもので、配列を繰り返しません。繰り返しにはv-forを使います。', 'v-model="(post, index) in posts"': 'v-modelは入力欄と値を同期するためのもので、繰り返し表示には使えません。繰り返しはv-forです。' },
  'bmb2-v-b-6': { '<textarea>{{ body }}</textarea>': 'textareaの中に書いた{{ body }}は補間されず、入力とも同期しません。Vueではtextareaにもv-modelを使います。', '<textarea :model="body"></textarea>': ':modelはmodelという属性に値を渡すだけで、入力した内容はbodyへ戻りません。双方向の同期にはv-modelです。', '<textarea @model="body"></textarea>': '@はイベントを受け取る記法で、modelというイベントは入力の同期を行いません。v-modelを使います。' },
  'bmb2-v-b-7': { 'v-else-if': 'v-else-ifは別の条件式を書くときに使います。「それ以外すべて」を表すには条件のいらないv-elseです。', 'v-show': 'v-showは自分の条件で表示を切り替えるだけで、直前のv-ifと組み合わせて「それ以外」を表しません。', 'v-once': 'v-onceは一度だけ描画し、その後は更新しない指定です。条件による出し分けとは関係ありません。' },
  'bmb2-v-b-8': { ':class="{ post.pinned: pinned }"': 'オブジェクトのキーがクラス名、値が付けるかどうかの条件です。キーと値が逆なうえ、post.pinnedはキーとして書けません。', 'class="{ pinned: post.pinned }"': ':のないclassはデータと結び付かず、書いた文字がそのままクラス名になります。条件で付けるには:classを使います。', '@class="{ pinned: post.pinned }"': '@はイベントを受け取る記法で、クラスを付ける指定ではありません。クラスの結び付けは:classです。' },
  'bmb2-v-b-9': { 'v-if': 'v-ifは条件が偽のとき要素そのものを描画しません。要素を残したまま表示を切り替えるのはv-showです。', 'v-for': 'v-forは配列などを繰り返し表示するためのもので、表示・非表示の切り替えには使いません。', 'v-model': 'v-modelは入力欄と値を同期するためのもので、要素の表示・非表示は切り替えません。' },
  'bmb2-l-b-4': { 'Eloquent': 'EloquentはデータベースのデータをモデルとしてあつかうORMです。HTMLを作るテンプレートはBladeです。', 'Artisan': 'Artisanはphp artisanで使うコマンドラインの道具です。画面のテンプレートではありません。', 'Composer': 'ComposerはPHPのパッケージを管理する道具です。HTMLに値を埋め込む仕組みはBladeです。' },
  'bmb2-l-b-5': { 'post': 'Eloquentはモデル名を複数形にしたテーブル名を使うため、単数形のpostにはなりません。', 'Posts': 'テーブル名はモデル名をスネークケースの小文字にした複数形です。大文字を含むPostsにはなりません。', 'post_table': 'Eloquentは名前の後ろに_tableを付けません。Postモデルの既定はpostsです。' },
  'bmb2-l-b-6': { 'store': 'storeはフォームから送られた内容を保存する処理です。入力フォームを表示するのはcreateです。', 'edit': 'editは既存の投稿を編集するフォームを表示します。新しい投稿を書くフォームはcreateです。', 'index': 'indexは投稿の一覧を表示する処理です。新規作成のフォームではありません。' },
  'bmb2-l-b-7': { '投稿の本文をそのまま書く場所': '{post}はURLの変わる部分を受け取る印です。投稿本文を書き込む場所ではありません。', 'CSSのクラス名': 'ルート定義の{post}は見た目とは関係なく、URLの一部を受け取るためのものです。', 'データベースの名前': 'データベース名は.envなどの設定で決めます。{post}は/posts/7の「7」のようなURLの値を受け取ります。' },
  'bmb2-l-b-8': { 'delete': 'DELETEはHTTPメソッドの名前で、リソースコントローラのメソッド名はdestroyです。', 'remove': 'removeは一般的な言葉ですが、リソースコントローラの標準のメソッド名ではありません。削除はdestroyです。', 'store': 'storeは新しい投稿を保存する処理です。削除はdestroyが担当します。' },
  'bmb2-l-b-9': { "$table->string('body')": '長さを指定しないstringは255文字までの短い文字列向けの列です。それより長い本文にはtextを使います。', "$table->integer('body')": 'integerは整数を入れる列で、文章は入りません。', "$table->boolean('body')": 'booleanはtrue/falseを入れる列で、文章は入りません。' },
  'bmb2-i-b-3': { 'Post': 'Postはモデルのクラス名です。ページのprops名は配列のキー名であるpostになります。', '$post': '$postはPHP側の変数名です。ページ側では配列のキー名postでpropsとして受け取ります。', 'Posts/Show': "'Posts/Show'は表示するページコンポーネントの名前で、props名ではありません。" },
  'bmb2-i-b-4': { 'サーバの中だけで使われ、ブラウザには届かない': 'propsはページを表示するためにブラウザへ送られます。サーバの中だけに留まる値ではありません。', '画面に表示した項目だけがブラウザへ送られる': '画面に使っていない項目も、propsに入れればすべてブラウザへ送られます。', '自動で暗号化され、利用者には読めない': 'propsは暗号化されず、開発者ツールで中身を読めます。見せてはいけない値は入れないようにします。' },
  'bmb2-i-b-5': { 'サーバへ問い合わせずに移動できる': 'Linkでもクリック時にサーバへ問い合わせ、次のページのデータを受け取ります。変わるのはページ全体を読み込み直さない点です。', 'URLを指定しなくてよくなる': 'Linkでも移動先はhrefで指定する必要があります。', 'データベースが自動で作られる': 'Linkはページ間の移動のためのもので、データベースとは関係ありません。' },
  'bmb2-i-b-6': { 'useForm': 'useFormはフォームの入力値や送信を扱うための関数です。現在のURLやpropsを読むのはusePageです。', 'useState': 'useStateはReactのstateを作る関数で、Inertiaのページ情報は返しません。', 'Link': 'Linkはページ間を移動するためのコンポーネントで、現在のページ情報を読み取る関数ではありません。' },
  'bmb2-i-b-7': { 'マイグレーションに文言を書く': 'マイグレーションはテーブル構造の定義で、一度だけ表示するメッセージを渡す仕組みではありません。', 'CSSのcontentに文言を書く': 'CSSに書いた文言は常に表示され、保存の結果に応じて一度だけ出すことはできません。', 'リダイレクトせずJSONだけを返す': 'InertiaのページリクエストへJSONだけを返すと、ページ遷移として扱えません。リダイレクトとフラッシュデータを使います。' },
  'bmb2-api-b-3': { 'async': 'asyncはawaitを使う関数の前に付ける印で、それ自体は応答を待ちません。待つのはawaitです。', 'static': 'staticはクラスの静的メンバーを表す語で、非同期の待機とは関係ありません。', 'const': 'constは変数を宣言する語です。const response = await fetch(...)のように、待つにはawaitが必要です。' },
  'bmb2-api-b-4': { '404': '404は指定したものが見つからないことを表し、作成の成功ではありません。', '401': '401は認証が必要、またはログイン情報が正しくないことを表します。作成成功は201です。', '500': '500はサーバ内部でエラーが起きたことを表します。作成に成功したときは201です。' },
  'bmb2-api-b-5': { '201': '201は新しいリソースを作成できたときの成功です。存在しない投稿の取得には404が返ります。', '204': '204は本文のない成功を表します。投稿が見つからない場合は成功ではなく404です。', '401': '401は認証が必要なことを表します。ログインしていても、投稿が存在しなければ404です。' },
  'bmb2-api-b-6': { "{'title': 'はじめまして'}": 'JSONでは単一引用符を使えず、キーも文字列も二重引用符で囲みます。', '{title: "はじめまして"}': 'JavaScriptのオブジェクトではキーの引用符を省けますが、JSONではキーも二重引用符で囲む必要があります。', 'title=はじめまして': 'これはフォーム送信などで使うURLエンコード形式で、JSONではありません。' },
  'bmb2-api-b-7': { 'GET /api/posts#q=祭り': '#以降はページ内の位置を表す部分で、サーバへは送られません。検索条件は?の後に書きます。', 'GET /api/posts&q=祭り': 'クエリ文字列は?で始まります。&は2つ目以降の条件をつなぐ記号です。', 'DELETE /api/posts?q=祭り': 'DELETEは削除の要求です。投稿を検索して取得するにはGETを使います。' },
};
