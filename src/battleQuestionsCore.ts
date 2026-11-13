import type { Difficulty, Question } from './content';

const choice = (id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string, options: [string, string, string, string], answer: number, explanation: string, extra: Partial<Question> = {}): Question => ({ id, difficulty, topic, kind: 'choice', prompt, options, answer, reveal: options[answer], explanation, ...extra });

// content.ts の questions に直接書かれた4択（r/v/l/i/api）へ1問ずつ対応する、別論点の通常戦用4択。
export const battleQuestionsCore: Question[] = [
  // React 初級（r-b-1〜4に対応）
  choice('bc2-r-b-1', 'beginner', 'frontend', 'TSXで自作のコンポーネントを <PostCard /> のように使いたい。関数名の書き方は？', ['大文字で始める（PostCard）', '小文字で始める（postCard）', '先頭に$を付ける（$PostCard）', '先頭に数字を付ける（1PostCard）'], 0, 'Reactは小文字で始まるタグをHTML要素として扱うため、自作コンポーネント名は大文字で始めます。$や数字始まりは名前の規則ではありません。', { track: 'react' }),
  choice('bc2-r-b-2', 'beginner', 'frontend', '親が <Greeting name="ソラ" /> と書いた。子でnameを受け取る書き方は？', ['function Greeting(name)', 'function Greeting({ name })', 'function Greeting([name])', 'function Greeting(...name)'], 1, 'propsは1つのオブジェクトとして渡るので、{ name } と分割代入して取り出します。(name) と書くとprops全体のオブジェクトが入り、[name] は配列として扱うため値を取り出せません。', { track: 'react' }),
  choice('bc2-r-b-3', 'beginner', 'frontend', 'const [count, setCount] = useState(0) の setCount は何？', ['現在の値', '初期値の0', 'countを更新する関数', '1つ前の値'], 2, 'useStateは「現在の値」と「更新する関数」の組を返します。setCountを呼ぶと値が変わり、画面が描き直されます。初期値は引数の0で、前の値を保持する専用の要素はありません。', { track: 'react' }),
  choice('bc2-r-b-4', 'beginner', 'frontend', 'TSXで要素にCSSのクラス名を付ける属性は？', ['class', 'styleClass', 'cssClass', 'className'], 3, 'JSXではclassがJavaScriptの予約語と重なるため、DOMのプロパティ名に合わせてclassNameと書きます。styleClassやcssClassという属性はありません。', { track: 'react' }),

  // React 中級（r-i-1〜3に対応）
  choice('bc2-r-i-1', 'intermediate', 'frontend', 'ボタンを押してhandleを実行した。console.logに出る値は？（countは0から始まる）', ['0', '5', 'undefined', 'エラーになる'], 0, 'stateはその描画時点の値として固定されます。setCount(5)は次の描画を予約するだけなので、同じ関数内のcountは0のままです。5になるのは次の描画からです。', { track: 'react', code: 'const [count, setCount] = useState(0);\nfunction handle() {\n  setCount(5);\n  console.log(count);\n}' }),
  choice('bc2-r-i-2', 'intermediate', 'frontend', '<PostCard key={post.id} post={post} /> と渡した。PostCardの中で props.key を読むと？', ['post.idの値', 'undefined（keyはpropsとして渡らない）', '配列のindex', '描画が止まるエラー'], 1, 'keyはReactが一覧の項目を見分けるための特別な指定で、子のpropsには含まれません。子でIDが必要なら、別の名前（例: id={post.id}）でも渡します。', { track: 'react' }),
  choice('bc2-r-i-3', 'intermediate', 'frontend', 'この型のstatusに渡せる値は？', ['任意の文字列', "'draft' と 'published' を同時に", "'draft' か 'published' のどちらか", 'trueかfalse'], 2, '| はユニオン型で「どれか1つ」を表します。文字列リテラル型なので、それ以外の文字列は型エラーになります。', { track: 'react', code: "type Props = { status: 'draft' | 'published' };" }),

  // React 上級（r-a-1〜3に対応）
  choice('bc2-r-a-1', 'advanced', 'frontend', 'stateのformは { title, body } を持つ。bodyを残してtitleだけ変える更新は？', ['setForm({ title })', 'form.title = title; setForm(form)', 'setForm(prev => { prev.title = title; return prev; })', 'setForm(prev => ({ ...prev, title }))'], 3, '展開した新しいオブジェクトでtitleだけ上書きすると、bodyを保ったまま更新できます。setForm({ title })はbodyが消え、元のオブジェクトを書き換えて同じ参照を渡すと、Reactは変化なしと判断して再描画しないことがあります。', { track: 'react' }),
  choice('bc2-r-a-2', 'advanced', 'frontend', 'ログイン中のユーザーを、深い階層の多くの部品が使う。propsの受け渡しが何段も続くとき検討するものは？', ['Context（createContextとuseContext）', '各部品で同じuseStateを複製する', 'windowのグローバル変数に入れる', 'useRefで各部品に保持する'], 0, 'Contextを使うと、途中の部品を経由せずに離れた子へ値を届けられます。useStateの複製は値がずれ、グローバル変数やuseRefは変更しても再描画されません。', { track: 'react' }),
  choice('bc2-r-a-3', 'advanced', 'frontend', 'useEffect内でsetIntervalを開始した。部品が画面から消えたときにタイマーを止めるには？', ['依存配列を空の[]にするだけ', 'effectから () => clearInterval(id) を返す', 'useStateの初期値でclearIntervalを呼ぶ', 'onClickでclearIntervalを呼ぶ'], 1, 'effectが返した関数はクリーンアップとして、部品が消えるときや次の実行前に呼ばれます。空の依存配列は開始の回数を制限するだけで、停止はしません。', { track: 'react' }),

  // Vue 初級（v-b-1〜4に対応）
  choice('bc2-v-b-1', 'beginner', 'frontend', '.vueファイルで、画面のHTMLの形を書くブロックは？', ['<script>', '<style>', '<template>', '<head>'], 2, '単一ファイルコンポーネントでは、<template>に画面の構造、<script>に処理、<style>に見た目を書きます。<head>はVueのブロックではありません。', { track: 'vue' }),
  choice('bc2-v-b-2', 'beginner', 'frontend', '<script setup>で、親から受け取るpropsを宣言する関数は？', ['defineEmits', 'ref', 'computed', 'defineProps'], 3, 'definePropsで受け取るpropsを宣言します。defineEmitsは子から親へ送るイベントの宣言、refとcomputedは自分の状態や導出値を作る関数です。', { track: 'vue' }),
  choice('bc2-v-b-3', 'beginner', 'frontend', "titleに '<b>太字</b>' が入っている。{{ title }} で表示するとどうなる？", ['タグも文字のまま表示される', '「太字」が太字で表示される', '何も表示されない', 'エラーになる'], 0, '{{ }} は値をHTMLではなくただの文字として表示します。そのため、タグは解釈されずに文字で見えます。外部の文字列がHTMLとして実行されない、安全な既定の動作です。', { track: 'vue' }),
  choice('bc2-v-b-4', 'beginner', 'frontend', '入力欄でEnterキーを押したときだけsearchを呼ぶ記法は？', ['@click.enter="search"', '@keyup.enter="search"', '@keyup="enter"', ':keyup.enter="search"'], 1, '@keyupにキー修飾子.enterを付けると、Enterキーのときだけ呼ばれます。@clickはクリックのイベント、:はイベントではなく属性を結び付ける記法です。', { track: 'vue' }),

  // Vue 中級（v-i-1〜3に対応）
  choice('bc2-v-i-1', 'intermediate', 'frontend', "script setupで const count = ref(0) と定義した。テンプレートで数を表示する書き方は？", ['{{ count.value }}', '{{ $count }}', '{{ count }}', '{{ ref(count) }}'], 2, 'script setupの最上位にあるrefは、テンプレート内で自動的に中身が取り出されます。そのため{{ count }}と書きます。.valueが必要なのはscript内です。テンプレートで.valueを付けると、数値のvalueを読もうとして何も表示されません。', { track: 'vue' }),
  choice('bc2-v-i-2', 'intermediate', 'frontend', "子のPostCardが emit('remove', post.id) する。親で受け取ってdeletePostを呼ぶ書き方は？", ['<PostCard :remove="deletePost" />', '<PostCard v-model="remove" />', '<PostCard #remove="deletePost" />', '<PostCard @remove="deletePost" />'], 3, '子が発行したイベントは親で@イベント名として受け取ります。emitの第2引数のpost.idはdeletePostの引数に渡ります。:はpropsを渡す記法、#はスロットの記法です。', { track: 'vue' }),
  choice('bc2-v-i-3', 'intermediate', 'frontend', '<li v-for="n in 3">{{ n }}</li> で表示される数は？', ['1, 2, 3', '0, 1, 2', '3だけ', '0, 1, 2, 3'], 0, 'v-forに整数を渡すと、1からその数までを繰り返します。配列の添字のように0から始まるわけではありません。', { track: 'vue' }),

  // Vue 上級（v-a-1〜3に対応）
  choice('bc2-v-a-1', 'advanced', 'frontend', 'computedのgetterの中で行ってよい処理は？', ['fetchで通信を始める', '依存する値から結果を計算して返す', '別のrefへ値を代入する', 'DOMを直接書き換える'], 1, 'computedのgetterは副作用のない計算だけにします。通信や他の状態の変更、DOMの操作は、依存が変わるたびに思わぬ形で起き得るので、watchやイベント処理へ分けます。', { track: 'vue' }),
  choice('bc2-v-a-2', 'advanced', 'frontend', 'Vue 3.4以降。子の入力欄を、親の <TitleInput v-model="title" /> と双方向に結びたい。子での基本の書き方は？', ['propsのtitleへ直接v-modelを付ける', 'ref(props.title)に移して使うだけ', 'const title = defineModel() として v-model="title"', 'watchで親のDOMを書き換える'], 2, 'defineModelは親のv-modelに対応するpropと更新イベントをまとめて扱います。propsを直接書き換えるのは不可で、ref(props.title)は初期値の写しになるので親と同期しません。', { track: 'vue' }),
  choice('bc2-v-a-3', 'advanced', 'frontend', 'const state = reactive({ count: 0 }) から let { count } = state と取り出した。このcountは？', ['refに自動で変換される', '読み取り専用のcomputedになる', '代入するとエラーになる', '反応性を失った、ただの数値'], 3, 'reactiveの反応性はプロパティへのアクセスで追跡されます。分割代入すると値だけがコピーされ、変更が画面へ伝わりません。保ちたい場合はtoRefs(state)を使います。', { track: 'vue' }),

  // Laravel 初級（l-b-1〜3に対応）
  choice('bc2-l-b-1', 'beginner', 'laravel', 'ブラウザで開く画面（セッションを使う）のルートを書く一般的なファイルは？', ['routes/web.php', 'routes/api.php', 'routes/console.php', 'config/app.php'], 0, 'routes/web.phpのルートにはセッションなど画面向けのミドルウェアが付きます。routes/api.phpはセッションを持たないAPI向け、console.phpはArtisanコマンド用、config/app.phpは設定ファイルです。'),
  choice('bc2-l-b-2', 'beginner', 'laravel', 'コントローラでBladeの画面を表示して返す関数は？', ["redirect('posts.index')", "view('posts.index')", "response()->json('posts.index')", 'abort(404)'], 1, "view()はresources/views/posts/index.blade.phpを描画して返します。redirectは別のURLへの移動、jsonはデータの返却、abortはエラー応答です。"),
  choice('bc2-l-b-3', 'beginner', 'laravel', '検証エラーでフォームへ戻ったとき、さっき入力したタイトルを入力欄に残すBladeの関数は？', ["request('title')", "env('title')", "old('title')", "config('title')"], 2, 'old()は直前のリクエストでセッションへ一時保存された入力値を取り出します。戻った後の画面は新しいリクエストなので、request()では前の入力を読めません。envとconfigは設定値用です。'),

  // Laravel 中級（l-i-1〜3に対応）
  choice('bc2-l-i-1', 'intermediate', 'laravel', 'Post::create($data) で配列から一括保存するとき、代入を許す列を指定するモデルのプロパティは？', ['$hidden', '$casts', '$table', '$fillable'], 3, '$fillableに書いた列だけが一括代入されます。意図しない列が書き換えられるのを防ぐためです。$hiddenはJSONに出さない列、$castsは型変換、$tableはテーブル名の指定です。'),
  choice('bc2-l-i-2', 'intermediate', 'laravel', "マイグレーションで、未入力（NULL）を許すsubtitle列にする書き方は？", ["$table->string('subtitle')->nullable()", "$table->string('subtitle')->unique()", "$table->string('subtitle')->index()", "$table->string('subtitle')"], 0, '列は既定でNULLを許さないので、許す場合はnullable()を付けます。unique()は重複の禁止、index()は検索用の索引で、どちらもNULL可にはしません。'),
  choice('bc2-l-i-3', 'intermediate', 'laravel', 'このルートのURLを、名前から作る式は？', ["url('posts.index')", "route('posts.index')", "view('posts.index')", "redirect('posts.index')"], 1, 'route()はルート名からURL（/posts）を作ります。url()は渡した文字列をそのままパスとして扱うので「/posts.index」になります。viewはテンプレートの描画、redirectは移動の応答です。', { code: "Route::get('/posts', [PostController::class, 'index'])->name('posts.index');" }),

  // Laravel 上級（l-a-1〜3に対応）
  choice('bc2-l-a-1', 'advanced', 'laravel', 'ログイン済みでも、同じ人が短時間に大量の投稿を送るのを防ぎたい。ルートに付けるミドルウェアは？', ['auth', 'guest', 'throttle', 'signed'], 2, 'throttleは一定時間あたりのリクエスト回数を制限します。authはログインの確認だけで回数は制限しません。guestは未ログイン専用、signedは署名付きURLの検証です。'),
  choice('bc2-l-a-2', 'advanced', 'laravel', 'UserモデルをJSONで返すとき、passwordを出力から除くモデルのプロパティは？', ['$guarded', '$fillable', '$casts', '$hidden'], 3, '$hiddenに書いた属性は配列やJSONへの変換から除かれます。$guardedと$fillableは一括代入の制御で、出力には影響しません。$castsは型変換です。'),
  choice('bc2-l-a-3', 'advanced', 'laravel', 'ログイン中のユーザー自身の投稿だけを取得し、他人の投稿のIDなら404にしたい。適切な取得は？', ['$request->user()->posts()->findOrFail($id)', 'Post::findOrFail($id)', "Post::where('id', $id)->first()", 'Post::all()->find($id)'], 0, 'リレーション経由で探すとuser_idの条件が付き、他人の投稿は見つからずに404になります。Post::findOrFailは他人の投稿も返し、firstは見つからないとnullで404になりません。allは全件を読み込みます。'),

  // Inertia 初級（i-b-1〜2に対応）
  choice('bc2-i-b-1', 'beginner', 'connection', 'InertiaのLinkで別のページへ移動すると、ブラウザの動きはどうなる？', ['毎回ページ全体を読み込み直す', '全体を読み込み直さず、ページの部品だけ入れ替える', 'URLだけ変わり、画面は変わらない', '新しいタブで開く'], 1, 'InertiaはLinkのクリックを受け取って通信で次のページ名とpropsを受け取り、ページの部品だけを入れ替えます。URLと履歴も更新されます。', { inertia: true }),
  choice('bc2-i-b-2', 'beginner', 'connection', 'Inertiaで、全ページ共通のヘッダーをページごとに書き写さずにまとめる方法は？', ['各ページへ同じヘッダーを書き写す', 'マイグレーションにヘッダーを書く', 'レイアウトの部品でページを包む', 'CSSファイルにHTMLを書く'], 2, '共通のヘッダーなどはレイアウトの部品にまとめ、各ページをそれで包みます。マイグレーションはDBの構造、CSSは見た目を扱い、HTMLの部品を共有する場所ではありません。', { inertia: true }),

  // Inertia 中級（i-i-1〜2に対応）
  choice('bc2-i-i-1', 'intermediate', 'connection', 'ログイン中のユーザー名を、全ページの応答に毎回含めたい。Laravel側で書く場所は？', ['各コントローラのInertia::renderすべて', '.envファイル', 'マイグレーション', 'HandleInertiaRequestsのshare()'], 3, 'HandleInertiaRequestsミドルウェアのshare()で返した値は、すべてのページのpropsに含まれます。各renderへ書き足すと漏れが起きやすく、.envやマイグレーションは応答のデータを作る場所ではありません。', { inertia: true }),
  choice('bc2-i-i-2', 'intermediate', 'connection', 'Inertiaの訪問で、ブラウザ履歴に新しい項目を増やさず今の項目を置き換えるオプションは？', ['replace: true', 'preserveState: true', 'preserveScroll: true', "only: ['posts']"], 0, 'replace: trueは履歴を置き換えるので、戻るボタンで直前の状態に戻りません。preserveStateは部品の状態、preserveScrollはスクロール位置を保ち、onlyは再取得するpropsを絞ります。', { inertia: true }),

  // Inertia 上級（i-a-1〜2に対応）
  choice('bc2-i-a-1', 'advanced', 'connection', 'Inertia 2。重い集計statsを最初の表示では計算せず、部分再読み込みで求められたときだけ計算したい。propsの書き方は？', ["'stats' => fn () => $this->stats()", "'stats' => Inertia::optional(fn () => $this->stats())", "'stats' => $this->stats()", "'stats' => Inertia::always($this->stats())"], 1, 'Inertia::optionalは通常の訪問では含まれず、onlyで指定されたときだけ評価されます。クロージャだけでは、最初の訪問では評価されて含まれます。値を直接渡すと常に計算され、alwaysは部分再読み込みでも常に含めます。', { inertia: true }),
  choice('bc2-i-a-2', 'advanced', 'connection', '1ページに投稿フォームとコメントフォームがあり、どちらにもbody項目がある。エラーの取り違えを防ぐには？', ['両方の欄に同じエラーを表示する', 'preserveScrollを付ける', '送信ごとにerrorBagを指定してエラーを分ける', '検証をフロントだけで行う'], 2, 'errorBagを指定すると、エラーがその名前の下に分けて返るため、同じ項目名でもフォームごとに区別できます。preserveScrollはスクロール位置を保つだけで、フロントだけの検証は迂回できます。', { inertia: true }),

  // API 初級（api-b-1〜2に対応）
  choice('bc2-api-b-1', 'beginner', 'connection', 'JSONで文字列の値を囲む記号は？', ["シングルクォート（'）", 'バッククォート（`）', '囲まない', 'ダブルクォート（"）'], 3, 'JSONの文字列とキーは必ずダブルクォートで囲みます。JavaScriptでは使えるシングルクォートやバッククォートは、JSONでは不正な形式です。', { inertia: false }),
  choice('bc2-api-b-2', 'beginner', 'connection', 'APIがHTTPステータス404を返した。意味は？', ['指定した対象が見つからない', '作成に成功した', 'サーバー内部でエラーが起きた', 'ログインが必要'], 0, '404 Not Foundは、URLやIDに対応するものがないことを表します。作成成功は201、サーバー内部のエラーは500、認証が必要なときは401です。', { inertia: false }),

  // API 中級（api-i-1〜2に対応）
  choice('bc2-api-i-1', 'intermediate', 'connection', 'const res = await fetch(url) の後、res.json() が返すものは？', ['解析済みのオブジェクト（すぐ使える）', '解析結果になるPromise（awaitが必要）', 'JSONの文字列', '同じResponseオブジェクト'], 1, 'json()は本文を読み終えてから解析するため、Promiseを返します。awaitせずに使うと、データではなくPromiseを扱ってしまいます。文字列が欲しい場合はtext()です。', { inertia: false }),
  choice('bc2-api-i-2', 'intermediate', 'connection', 'http://localhost:5173 の画面から http://localhost:8000 のAPIへfetchしたら、ブラウザに止められた。主にサーバー側で設定するものは？', ['Content-Typeをtext/htmlにする', 'マイグレーションを実行する', 'CORSで画面のオリジンを許可する', 'CSSの読み込み順を変える'], 2, 'ポートが違うと別のオリジンになり、APIがCORSで許可しない限り、ブラウザは応答を画面に渡しません。Content-TypeやDB、CSSはこの制限と関係ありません。', { inertia: false }),

  // API 上級（api-a-1〜2に対応）
  choice('bc2-api-a-1', 'advanced', 'connection', '別オリジンの画面から、Cookieによるセッション認証のAPIをfetchで呼ぶ。Cookieを送るためのfetchの指定は？', ["mode: 'no-cors'", "cache: 'no-store'", "headers: { Accept: 'text/html' }", "credentials: 'include'"], 3, "credentials: 'include'で別オリジンにもCookieを送ります。サーバー側もCORSで資格情報の送信を許可する必要があります。no-corsは応答を読めなくし、cacheとAcceptは認証情報の送信に関係しません。", { inertia: false }),
  choice('bc2-api-a-2', 'advanced', 'connection', '「注文する」のPOSTがタイムアウト後に自動で再送され、注文が2件登録された。再送しても安全にする設計は？', ['要求ごとの一意なキーを送り、サーバーで同じ要求かを判定する', 'ボタンを押せなくするだけにする', 'POSTをGETに変える', 'タイムアウトを無くす'], 0, '同じキーの要求をサーバーが2回目以降として処理しなければ、再送しても1件だけになります。ボタンの無効化は自動の再送を防げず、GETは状態を変える操作に適しません。タイムアウトを無くしても通信の途切れは起こり得ます。', { inertia: false }),
];
