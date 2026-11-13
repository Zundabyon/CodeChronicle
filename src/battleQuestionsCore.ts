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
  choice('bc2-l-b-2', 'beginner', 'laravel', '指定した投稿が見つからないとき、コントローラの処理をそこで止めて「見つからない」（404）の応答を返したい。呼ぶ関数は？', ["redirect('/posts')", 'abort(404)', 'response()->json([])', 'dd($post)'], 1, 'abort(404)はその場で処理を止め、404 Not Foundの応答を返します。redirectは別のURLへの移動、response()->json([])は空のデータを成功として返し、ddは値を表示して止めるデバッグ用の関数です。'),
  choice('bc2-l-b-3', 'beginner', 'laravel', 'コントローラで $request->validate([...]) を呼んだ次の行に保存処理がある。入力が検証に失敗したら、どうなる？', ['検証は失敗するが、そのまま次の行で保存される', '失敗した項目だけ空にして保存される', 'validate()の行で止まり、保存せずにエラーを返す', 'ブラウザが入力を自動で直してから保存される'], 2, 'validate()は失敗すると例外を投げるので、次の行の保存処理は実行されません。Laravelはエラーを返し、画面からのフォーム送信なら元の画面へ戻してエラーを渡し、APIなら422のJSONを返します。値を空にしたり、ブラウザが直したりはしません。'),

  // Laravel 中級（l-i-1〜3に対応）
  choice('bc2-l-i-1', 'intermediate', 'laravel', 'Post::create($data) で配列から一括保存するとき、代入を許す列を指定するモデルのプロパティは？', ['$hidden', '$casts', '$table', '$fillable'], 3, '$fillableに書いた列だけが一括代入されます。意図しない列が書き換えられるのを防ぐためです。$hiddenはJSONに出さない列、$castsは型変換、$tableはテーブル名の指定です。'),
  choice('bc2-l-i-2', 'intermediate', 'laravel', "マイグレーションで、未入力（NULL）を許すsubtitle列にする書き方は？", ["$table->string('subtitle')->nullable()", "$table->string('subtitle')->unique()", "$table->string('subtitle')->index()", "$table->string('subtitle')"], 0, '列は既定でNULLを許さないので、許す場合はnullable()を付けます。unique()は重複の禁止、index()は検索用の索引で、どちらもNULL可にはしません。'),
  choice('bc2-l-i-3', 'intermediate', 'laravel', 'このルートのURLを、名前から作る式は？', ["url('posts.index')", "route('posts.index')", "view('posts.index')", "redirect('posts.index')"], 1, 'route()はルート名からURL（/posts）を作ります。url()は渡した文字列をそのままパスとして扱うので「/posts.index」になります。viewはテンプレートの描画、redirectは移動の応答です。', { code: "Route::get('/posts', [PostController::class, 'index'])->name('posts.index');" }),

  // Laravel 上級（l-a-1〜3に対応）
  choice('bc2-l-a-1', 'advanced', 'laravel', 'ログイン済みでも、同じ人が短時間に大量の投稿を送るのを防ぎたい。ルートに付けるミドルウェアは？', ['auth', 'guest', 'throttle', 'signed'], 2, 'throttleは一定時間あたりのリクエスト回数を制限します。authはログインの確認だけで回数は制限しません。guestは未ログイン専用、signedは署名付きURLの検証です。'),
  choice('bc2-l-a-2', 'advanced', 'laravel', 'UserモデルをJSONで返すとき、passwordを出力から除くモデルのプロパティは？', ['$guarded', '$fillable', '$casts', '$hidden'], 3, '$hiddenに書いた属性は配列やJSONへの変換から除かれます。$guardedと$fillableは一括代入の制御で、出力には影響しません。$castsは型変換です。'),
  choice('bc2-l-a-3', 'advanced', 'laravel', 'ログイン中のユーザー自身の投稿だけを取得し、他人の投稿のIDなら404にしたい。適切な取得は？', ['$request->user()->posts()->findOrFail($id)', 'Post::findOrFail($id)', "Post::where('id', $id)->first()", 'Post::all()->find($id)'], 0, 'リレーション経由で探すとuser_idの条件が付き、他人の投稿は見つからずに404になります。Post::findOrFailは他人の投稿も返し、firstは見つからないとnullで404になりません。allは全件を読み込みます。'),

  // Inertia 初級（i-b-1〜2に対応）
  choice('bc2-i-b-1', 'beginner', 'connection', 'Inertiaのページがpropsで受け取る投稿一覧は、どうやってブラウザへ届く？', ['ブラウザがデータベースへ直接つないで読む', 'Laravelのコントローラが取得し、応答に含めて送る', 'ページのファイルに投稿が書き込まれて配られる', 'ブラウザが前回の表示を保存しておき、そのまま使う'], 1, 'Inertiaでは、Laravelのコントローラがデータベースから投稿を取得し、Inertia::renderのpropsとして応答に含めます。ブラウザはデータベースへ直接つながりません。ページのファイルは画面の作り方だけを持ち、投稿のデータは訪問のたびにLaravelから受け取ります。', { inertia: true }),
  choice('bc2-i-b-2', 'beginner', 'connection', 'Inertiaで、全ページ共通のヘッダーをページごとに書き写さずにまとめる方法は？', ['各ページへ同じヘッダーを書き写す', 'マイグレーションにヘッダーを書く', 'レイアウトの部品でページを包む', 'CSSファイルにHTMLを書く'], 2, '共通のヘッダーなどはレイアウトの部品にまとめ、各ページをそれで包みます。マイグレーションはDBの構造、CSSは見た目を扱い、HTMLの部品を共有する場所ではありません。', { inertia: true }),

  // Inertia 中級（i-i-1〜2に対応）
  choice('bc2-i-i-1', 'intermediate', 'connection', 'ログイン中のユーザー名を、全ページの応答に毎回含めたい。Laravel側で書く場所は？', ['各コントローラのInertia::renderすべて', '.envファイル', 'マイグレーション', 'HandleInertiaRequestsのshare()'], 3, 'HandleInertiaRequestsミドルウェアのshare()で返した値は、すべてのページのpropsに含まれます。各renderへ書き足すと漏れが起きやすく、.envやマイグレーションは応答のデータを作る場所ではありません。', { inertia: true }),
  choice('bc2-i-i-2', 'intermediate', 'connection', 'Inertiaの訪問で、ブラウザ履歴に新しい項目を増やさず今の項目を置き換えるオプションは？', ['replace: true', 'preserveState: true', 'preserveScroll: true', "only: ['posts']"], 0, 'replace: trueは履歴を置き換えるので、戻るボタンで直前の状態に戻りません。preserveStateは部品の状態、preserveScrollはスクロール位置を保ち、onlyは再取得するpropsを絞ります。', { inertia: true }),

  // Inertia 上級（i-a-1〜2に対応）
  choice('bc2-i-a-1', 'advanced', 'connection', 'Inertia 2以降。重い集計statsを最初の表示では計算せず、部分再読み込みで求められたときだけ計算したい。propsの書き方は？', ["'stats' => fn () => $this->stats()", "'stats' => Inertia::optional(fn () => $this->stats())", "'stats' => $this->stats()", "'stats' => Inertia::always($this->stats())"], 1, 'Inertia::optionalは通常の訪問では含まれず、onlyで指定されたときだけ評価されます。クロージャだけでは、最初の訪問では評価されて含まれます。値を直接渡すと常に計算され、alwaysは部分再読み込みでも常に含めます。', { inertia: true }),
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

// 誤答の選択肢文字列と完全一致で対応させる（wrongChoiceReasons.ts と同じ形式）。
export const battleQuestionsCoreReasons: Record<string, Record<string, string>> = {
  'bc2-r-b-1': { '小文字で始める（postCard）': '小文字で始まるタグは、ReactがdivなどのHTML要素として扱います。自作のコンポーネントとしては描画されません。', '先頭に$を付ける（$PostCard）': '$を付ける決まりはありません。Reactが部品と見分ける基準は、先頭が大文字かどうかです。', '先頭に数字を付ける（1PostCard）': 'JavaScriptの名前は数字で始められません。部品名は大文字で始めます。' },
  'bc2-r-b-2': { 'function Greeting(name)': 'この書き方ではnameにpropsオブジェクト全体が入ります。中のnameを取り出すには { name } と書きます。', 'function Greeting([name])': 'propsは配列ではなくオブジェクトなので、配列の分割代入では値を取り出せません。', 'function Greeting(...name)': '残余引数にすると、propsを配列にまとめるだけです。name属性の値そのものにはなりません。' },
  'bc2-r-b-3': { '現在の値': '現在の値は1番目のcountです。2番目のsetCountは、値を更新する関数です。', '初期値の0': '初期値はuseStateに渡した引数です。setCountは値ではなく、更新に使う関数です。', '1つ前の値': 'useStateは前の値を別に返しません。前の値が必要なら setCount(prev => …) の引数で受け取ります。' },
  'bc2-r-b-4': { 'class': 'HTMLではclassですが、JSXではJavaScriptの予約語と重なるため、classNameと書きます。', 'styleClass': 'styleClassという属性はありません。CSSのクラス名はclassNameで指定します。', 'cssClass': 'cssClassという属性はありません。ReactではclassNameを使います。' },
  'bc2-r-i-1': { '5': 'setCountは次の描画を予約するだけです。同じ関数内のcountは、この描画時点の0のままです。', 'undefined': 'countは初期値の0を持っています。setCountを呼んでも、その場でundefinedにはなりません。', 'エラーになる': 'setCountの直後にcountを読んでも、エラーにはなりません。古い値の0が読めるだけです。' },
  'bc2-r-i-2': { 'post.idの値': 'keyはReactが一覧の項目を見分けるための特別な指定で、子のpropsには渡りません。', '配列のindex': 'keyは配列のindexに置き換えられて渡るわけではありません。props.keyはundefinedです。', '描画が止まるエラー': 'props.keyを読んでも描画は止まりません。値がundefinedになるだけです。' },
  'bc2-r-i-3': { '任意の文字列': "'draft'と'published'は文字列リテラル型です。それ以外の文字列は型エラーになります。", "'draft' と 'published' を同時に": 'ユニオン型の | は「どれか1つ」を表します。二つの値を同時に持つ意味ではありません。', 'trueかfalse': '真偽値ではなく、二つの文字列のどちらかを受け取る型です。' },
  'bc2-r-a-1': { 'setForm({ title })': '新しいオブジェクトにtitleしかないため、bodyが消えます。...prevで残りの値を引き継ぎます。', 'form.title = title; setForm(form)': '元のオブジェクトを直接書き換えて同じ参照を渡すと、Reactが変化に気付かず、再描画されないことがあります。', 'setForm(prev => { prev.title = title; return prev; })': '関数型の更新でも、prevを書き換えて同じ参照を返すと、変化として扱われません。' },
  'bc2-r-a-2': { '各部品で同じuseStateを複製する': 'stateを複製すると、部品ごとに値が別々になってずれます。共有する値は1か所で持ちます。', 'windowのグローバル変数に入れる': 'グローバル変数を変えてもReactは再描画しないため、表示が更新されません。', 'useRefで各部品に保持する': 'useRefは値を変えても再描画されず、部品ごとに別の値になります。共有には向きません。' },
  'bc2-r-a-3': { '依存配列を空の[]にするだけ': '空の依存配列は、effectの実行回数を制限するだけです。開始したタイマーは止まりません。', 'useStateの初期値でclearIntervalを呼ぶ': '初期値は最初の描画で使われるだけなので、部品が消えるときには呼ばれません。', 'onClickでclearIntervalを呼ぶ': 'クリックされなければタイマーが残ります。部品が消えるときの後片付けはeffectが返す関数で行います。' },
  'bc2-v-b-1': { '<script>': '<script>には処理を書きます。画面のHTMLの形は<template>に書きます。', '<style>': '<style>は見た目のCSSを書くブロックです。画面の構造は書きません。', '<head>': '<head>は.vueファイルのブロックではありません。画面の形は<template>に書きます。' },
  'bc2-v-b-2': { 'defineEmits': 'defineEmitsは、子から親へ送るイベントを宣言する関数です。受け取るpropsにはdefinePropsを使います。', 'ref': 'refは部品自身のリアクティブな値を作る関数です。親からの入力は宣言できません。', 'computed': 'computedは他の値から導く値を作る関数です。propsの宣言にはdefinePropsを使います。' },
  'bc2-v-b-3': { '「太字」が太字で表示される': '{{ }} は値をHTMLとして解釈しないため、タグは効きません。', '何も表示されない': '値は表示されます。タグを含めた文字列が、そのまま文字として見えます。', 'エラーになる': 'タグを含む文字列でもエラーにはなりません。安全な文字として表示されます。' },
  'bc2-v-b-4': { '@click.enter="search"': '@clickはクリックのイベントです。キーの入力を受け取るには@keyupを使います。', '@keyup="enter"': 'この書き方では、どのキーでもenterという名前の処理を呼ぼうとします。Enterだけに絞るには.enter修飾子を付けます。', ':keyup.enter="search"': ':は属性を結び付ける記法です。イベントの処理には@を使います。' },
  'bc2-v-i-1': { '{{ count.value }}': 'テンプレートではrefの中身が自動で取り出されます。.valueを付けると、数値のvalueを読んでしまい表示されません。', '{{ $count }}': '$countという変数は定義されていません。script setupで定義した名前のままcountと書きます。', '{{ ref(count) }}': 'refは値を作る関数で、テンプレートで表示のために呼ぶものではありません。' },
  'bc2-v-i-2': { '<PostCard :remove="deletePost" />': ':はpropsを渡す記法です。子のemitしたイベントは@removeで受け取ります。', '<PostCard v-model="remove" />': 'v-modelは値の双方向の同期に使います。removeイベントの処理には結び付きません。', '<PostCard #remove="deletePost" />': '#はスロットの記法です。イベントの受け取りには使いません。' },
  'bc2-v-i-3': { '0, 1, 2': '整数を渡したv-forは、0ではなく1から数えます。', '3だけ': 'v-forは1から3まで繰り返すので、3つの要素が表示されます。', '0, 1, 2, 3': '0は含まれません。1から指定した数までの3回の繰り返しです。' },
  'bc2-v-a-1': { 'fetchで通信を始める': 'getterは依存が変わるたびに評価されるため、通信のような副作用には向きません。watchで行います。', '別のrefへ値を代入する': 'getterで他の状態を変えると、更新の流れが追いにくくなります。値を計算して返すだけにします。', 'DOMを直接書き換える': 'DOMの操作は副作用です。computedではなくテンプレートやライフサイクルで扱います。' },
  'bc2-v-a-2': { 'propsのtitleへ直接v-modelを付ける': 'propsは読み取り専用なので、子から直接書き換えられません。', 'ref(props.title)に移して使うだけ': '初期値を写すだけになり、変更が親へ伝わらず、親の変更も反映されません。', 'watchで親のDOMを書き換える': '子が親のDOMを直接操作すると、データの流れが崩れます。v-modelの値として親へ伝えます。' },
  'bc2-v-a-3': { 'refに自動で変換される': '分割代入では自動でrefになりません。refとして取り出すにはtoRefs(state)を使います。', '読み取り専用のcomputedになる': '分割代入の結果は、ただの値のコピーです。computedにはなりません。', '代入するとエラーになる': 'letで受けた普通の変数なので、代入してもエラーにはなりません。ただし画面には反映されません。' },
  'bc2-l-b-1': { 'routes/api.php': 'api.phpはセッションを持たないAPI向けのルートです。画面のルートはweb.phpに書きます。', 'routes/console.php': 'console.phpはArtisanコマンドを定義するファイルです。ブラウザのルートは書きません。', 'config/app.php': 'config/app.phpはアプリの設定ファイルで、URLと処理の対応は書きません。' },
  'bc2-l-b-2': { "redirect('/posts')": 'redirectは別のURLへ移動させる応答です。「見つからない」ことを表す404にはなりません。', 'response()->json([])': '空の配列を成功（200）として返すだけで、見つからないことは伝わりません。', 'dd($post)': 'ddは値を表示して処理を止めるデバッグ用の関数です。404の応答を返すためのものではありません。' },
  'bc2-l-b-3': { '検証は失敗するが、そのまま次の行で保存される': 'validate()は失敗すると例外を投げて処理を止めるため、次の行の保存までは進みません。', '失敗した項目だけ空にして保存される': 'Laravelが値を空にして保存を続けることはありません。保存せずにエラーを返します。', 'ブラウザが入力を自動で直してから保存される': '入力を直すのは利用者です。Laravelはエラーを返し、どこを直すべきかを伝えます。' },
  'bc2-l-i-1': { '$hidden': '$hiddenはJSONへの出力から除く列の指定で、一括代入は許可しません。', '$casts': '$castsは値の型変換の指定です。代入できる列を決めるものではありません。', '$table': '$tableはモデルが使うテーブル名の指定です。一括代入の許可には$fillableを使います。' },
  'bc2-l-i-2': { "$table->string('subtitle')->unique()": 'unique()は重複を禁止する制約で、NULLを許す指定ではありません。', "$table->string('subtitle')->index()": 'index()は検索を速くする索引の追加です。NULLを許すかどうかは変わりません。', "$table->string('subtitle')": '修飾がない列はNULLを許しません。未入力を許すにはnullable()を付けます。' },
  'bc2-l-i-3': { "url('posts.index')": 'url()は渡した文字列をパスとして扱うため、/posts.index になります。名前からURLを作るのはroute()です。', "view('posts.index')": 'viewはテンプレートを描画する関数で、ルートのURLは作りません。', "redirect('posts.index')": 'redirectは移動の応答を返します。しかも引数はパスとして扱われ、名前からは解決されません。' },
  'bc2-l-a-1': { 'auth': 'authはログイン済みかどうかを確認するだけです。リクエストの回数は制限しません。', 'guest': 'guestは未ログインの人だけを通すミドルウェアで、送信の回数とは関係ありません。', 'signed': 'signedは署名付きURLが改ざんされていないかを確認します。連続送信は防げません。' },
  'bc2-l-a-2': { '$guarded': '$guardedは一括代入を禁止する列の指定です。JSONへの出力は変わりません。', '$fillable': '$fillableは一括代入を許す列の指定で、出力から隠す働きはありません。', '$casts': '$castsは型変換の指定です。passwordを出力から除くには$hiddenを使います。' },
  'bc2-l-a-3': { 'Post::findOrFail($id)': '持ち主を確認しないため、他人の投稿のIDでも取得できてしまいます。', "Post::where('id', $id)->first()": '持ち主の条件がなく、見つからないときもnullを返すだけで404にはなりません。', 'Post::all()->find($id)': '全件を読み込んでから探すので無駄が大きく、持ち主の確認もありません。' },
  'bc2-i-b-1': { 'ブラウザがデータベースへ直接つないで読む': 'ブラウザはデータベースへ直接つながりません。Laravelが取得した結果をpropsとして受け取ります。', 'ページのファイルに投稿が書き込まれて配られる': 'ページのファイルは画面の作り方だけを持ちます。投稿のデータは訪問のたびにLaravelの応答で届きます。', 'ブラウザが前回の表示を保存しておき、そのまま使う': 'propsは訪問のたびにLaravelから受け取ります。前回の表示を使い回すのではありません。' },
  'bc2-i-b-2': { '各ページへ同じヘッダーを書き写す': '書き写すと、修正のたびにすべてのページを直す必要があります。共通部分はレイアウトにまとめます。', 'マイグレーションにヘッダーを書く': 'マイグレーションはDBの構造を管理するもので、画面の部品は書きません。', 'CSSファイルにHTMLを書く': 'CSSは見た目の指定です。HTMLの部品は共有できません。' },
  'bc2-i-i-1': { '各コントローラのInertia::renderすべて': '書けば動きますが、全ページに書き足す必要があり漏れが出ます。共通の値はshare()にまとめます。', '.envファイル': '.envは環境設定の値を置く場所です。リクエストごとのユーザー名は入れられません。', 'マイグレーション': 'マイグレーションはDBの構造の変更で、応答のpropsは作りません。' },
  'bc2-i-i-2': { 'preserveState: true': 'preserveStateはページの部品の状態を保つ指定です。履歴の項目は増えます。', 'preserveScroll: true': 'preserveScrollはスクロール位置を保つだけで、履歴の扱いは変わりません。', "only: ['posts']": 'onlyは再取得するpropsを絞る指定で、履歴を置き換えるものではありません。' },
  'bc2-i-a-1': { "'stats' => fn () => $this->stats()": 'クロージャにすると評価は遅らせられますが、最初の訪問では評価されて含まれます。', "'stats' => $this->stats()": '値を直接渡すと、毎回の訪問で必ず計算されます。', "'stats' => Inertia::always($this->stats())": 'alwaysは部分再読み込みでも常に含める指定で、目的とは逆です。' },
  'bc2-i-a-2': { '両方の欄に同じエラーを表示する': 'どちらのフォームのエラーか分からなくなり、取り違えが起きたままです。', 'preserveScrollを付ける': 'preserveScrollはスクロール位置を保つだけで、エラーは分けられません。', '検証をフロントだけで行う': 'フロントの検証は迂回できるので、サーバーの検証は必要です。エラーの区別にもなりません。' },
  'bc2-api-b-1': { "シングルクォート（'）": 'JavaScriptでは使えますが、JSONの文字列には使えません。ダブルクォートで囲みます。', 'バッククォート（`）': 'バッククォートはJavaScriptのテンプレートリテラルの記号で、JSONでは不正です。', '囲まない': 'JSONの文字列は囲まないと解析できません。囲まずに書けるのは数値や真偽値です。' },
  'bc2-api-b-2': { '作成に成功した': '作成に成功したときは、201 Createdなどを返します。', 'サーバー内部でエラーが起きた': 'サーバー内部のエラーは500番台です。404は対象が見つからないことを表します。', 'ログインが必要': 'ログインが必要なときは401です。404とは意味が違います。' },
  'bc2-api-i-1': { '解析済みのオブジェクト（すぐ使える）': 'json()は本文を読み終えるのを待つため、Promiseを返します。awaitしてからデータとして使います。', 'JSONの文字列': 'json()は文字列ではなく、解析した結果を返します。文字列が欲しいならtext()です。', '同じResponseオブジェクト': 'json()はResponseそのものではなく、本文を解析した結果になるPromiseを返します。' },
  'bc2-api-i-2': { 'Content-Typeをtext/htmlにする': '形式を変えても、別のオリジンへのアクセス制限は解けません。', 'マイグレーションを実行する': 'DBの構造とは関係なく、ブラウザがオリジンの違いで止めています。', 'CSSの読み込み順を変える': 'CSSは見た目の指定で、通信の許可には関係しません。' },
  'bc2-api-a-1': { "mode: 'no-cors'": 'no-corsにすると応答の中身を読めなくなるため、APIの結果を使えません。', "cache: 'no-store'": 'cacheはキャッシュの扱いを決める指定です。Cookieを送るかどうかは変わりません。', "headers: { Accept: 'text/html' }": 'Acceptは受け取りたい形式を伝えるヘッダーで、Cookieの送信とは関係ありません。' },
  'bc2-api-a-2': { 'ボタンを押せなくするだけにする': '人の連打は防げますが、通信の自動再送は防げません。', 'POSTをGETに変える': 'GETはデータを読むための操作です。注文のように状態を変える処理には使いません。', 'タイムアウトを無くす': '通信が途中で切れることは防げないため、再送による二重登録の対策になりません。' },
};
