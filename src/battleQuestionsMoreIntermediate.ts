import type { Difficulty, Question } from './content';

// 正解位置を0→1→2→3の順に回し、バッチ内で偏らないようにする。
let ordinal = 0;
const choice = (
  id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string,
  options: [string, string, string, string], answer: number, explanation: string,
  extra: Partial<Question> = {},
): Question => {
  const slot = ordinal++ % 4;
  const shuffled: [string, string, string, string] = [...options];
  [shuffled[answer], shuffled[slot]] = [shuffled[slot], shuffled[answer]];
  return { id, difficulty, topic, kind: 'choice', prompt, options: shuffled, answer: slot, reveal: shuffled[slot], explanation, ...extra };
};

// moreQuestions の中級（CLI以外）1問ごとに、同じ難易度・track・inertia・形式で別の論点を問う通常戦用の問題。
export const battleQuestionsMoreIntermediate: Question[] = [
  // React
  choice('bmi2-r-i-1', 'intermediate', 'frontend', 'カード全体のクリックで詳細を開く。中の削除ボタンを押したとき、カードのonClickまで動かないようにするには？', ['ボタンのハンドラでevent.stopPropagation()を呼ぶ', 'ボタンのハンドラでevent.preventDefault()を呼ぶ', 'ボタンのハンドラでfalseを返す', 'カードのkeyを削除する'], 0, 'stopPropagation()はクリックが親要素へ伝わるのを止めます。preventDefault()はフォーム送信などブラウザ既定の動作を止めるもので、親への伝播は止めません。Reactではfalseを返しても伝播は止まりません。', { track: 'react', code: '<div onClick={openDetail}>\n  <button onClick={(event) => { /* ? */ onDelete(post.id); }}>削除</button>\n</div>' }),
  choice('bmi2-r-i-2', 'intermediate', 'frontend', 'pageが変わるたびに投稿を取得し直したい。useEffectの依存配列に入れるものは？', ['[page]', '[]', '[posts]', '依存配列を省略する'], 0, '依存配列に入れた値が変わったときだけ処理が再実行されます。[]は最初の表示時だけ、省略は毎回の描画後に実行します。[posts]は取得結果のsetPostsで新しい配列になるたびに再取得が起きます。', { track: 'react', code: 'useEffect(() => {\n  fetchPosts(page).then(setPosts);\n}, /* ? */);' }),
  choice('bmi2-r-i-3', 'intermediate', 'frontend', '削除ボタンを押したときだけonDelete(post.id)を呼びたい。正しい指定は？', ['onClick={() => onDelete(post.id)}', 'onClick={onDelete(post.id)}', 'onClick="onDelete(post.id)"', 'onClick={onDelete}(post.id)'], 0, 'アロー関数で包むと、クリック時に引数付きで呼べます。onClick={onDelete(post.id)}は描画の時点で関数を実行し、その戻り値を渡してしまいます。文字列ではハンドラになりません。', { track: 'react' }),
  choice('bmi2-r-i-4', 'intermediate', 'frontend', 'postsが空配列のとき、このTSXは画面に何を表示する？', ['0という文字', '何も表示しない', 'PostListが空のまま表示される', 'falseという文字'], 0, '&&は左側が偽の値ならその値をそのまま返します。posts.lengthが0なら0が返り、Reactは数値の0を文字として描画します。posts.length > 0のように真偽値にすると何も表示しません。', { track: 'react', code: '{posts.length && <PostList posts={posts} />}' }),
  choice('bmi2-r-i-5', 'intermediate', 'frontend', 'titleが"旧題"のとき、このハンドラを実行した。console.logに出る値は？', ['"旧題"', '"新題"', 'undefined', 'エラーになる'], 0, 'setterは次の描画のstateを予約するだけで、実行中のハンドラ内のtitleは変わりません。新しい値は次の描画で読めます。直後に使いたいなら変数に入れた値を使います。', { track: 'react', code: 'function rename() {\n  setTitle("新題");\n  console.log(title);\n}' }),

  // Vue
  choice('bmi2-v-i-1', 'intermediate', 'frontend', '検索欄でEnterキーを離したときだけsearchを呼ぶ記法は？', ['@keyup.enter="search"', '@keyup.prevent="search"', '@enter="search"', '@keyup.stop="search"'], 0, '.enterはキー修飾子で、Enterキーのときだけハンドラを呼びます。.preventと.stopは既定動作や伝播を止める修飾子でキーを絞りません。enterという名前のDOMイベントはありません。', { track: 'vue' }),
  choice('bmi2-v-i-2', 'intermediate', 'frontend', '頻繁に開閉する絞り込みパネル。要素を残したまま表示だけ切り替えたい。適するディレクティブは？', ['v-show', 'v-if', 'v-for', 'v-once'], 0, 'v-showは要素を残してdisplayだけ切り替えるので、頻繁な切り替えに向きます。v-ifは条件ごとに要素を作り直します。v-onceは一度だけ描画し、以後は更新しません。', { track: 'vue' }),
  choice('bmi2-v-i-3', 'intermediate', 'frontend', '親が<TitleInput v-model="title" />と書く。defineModelを使わずpropsとemitで実装するとき、子が値の変更を伝えるイベント名は？', ["emit('update:modelValue', value)", "emit('input', value)", "emit('change', value)", 'props.modelValue = value'], 0, 'Vue 3のコンポーネントのv-modelは、modelValueのpropsとupdate:modelValueイベントの組み合わせです。inputはVue 2の慣習で、changeも既定では使われません。propsへの代入は親の値を変えません。', { track: 'vue' }),
  choice('bmi2-v-i-4', 'intermediate', 'frontend', '「1ページの表示件数」の入力値を数値として受け取りたい。v-modelの修飾子は？', ['v-model.number', 'v-model.trim', 'v-model.lazy', 'v-model.int'], 0, '.numberはparseFloatで数値に変換できる入力を数値として保存します。.trimは空白の除去、.lazyはchangeで同期する修飾子です。.intという修飾子はありません。', { track: 'vue' }),
  choice('bmi2-v-i-5', 'intermediate', 'frontend', 'props.postIdが変わるたびに投稿を読み込み直したい。適切な書き方は？', ['watch(() => props.postId, load)', 'watch(props.postId, load)', 'computed(() => load(props.postId))', 'onMounted(load)'], 0, 'propsの一つのプロパティはゲッター関数で監視します。props.postIdをそのまま渡すと、その時点の数値を渡すだけで監視できません。computedは値を導くためのもので通信などの副作用には使いません。onMountedは最初の一回だけです。', { track: 'vue' }),

  // Laravel
  choice('bmi2-l-i-1', 'intermediate', 'laravel', '投稿一覧を作成日時の新しい順に全件取得したい。適切な呼び出しは？', ['Post::latest()->get()', 'Post::oldest()->get()', 'Post::latest()->first()', 'Post::get()'], 0, 'latest()は既定でcreated_atの降順に並べ、get()で該当する全件を取得します。oldest()は古い順、first()は最初の1件だけです。並び順を指定しないget()では新しい順が保証されません。'),
  choice('bmi2-l-i-2', 'intermediate', 'laravel', 'Route::resourceで登録済み。投稿を更新したあと、その投稿の詳細ページへ移動させるには？', ["redirect()->route('posts.show', $post)", "redirect()->route('posts.index')", "redirect()->route('posts.edit', $post)", "redirect()->route('posts.update', $post)"], 0, 'resourceルートの詳細表示はposts.showという名前になります。posts.indexは一覧、posts.editは編集フォームです。posts.updateはPUT/PATCHの送信先で、リダイレクト先として開くページではありません。'),
  choice('bmi2-l-i-3', 'intermediate', 'laravel', 'Laravel既定のミドルウェア構成（空文字をnullに変換するConvertEmptyStringsToNullが有効）。投稿の本文は空で送ってもよいが、入力されたら文字列であってほしい。適切な規則は？', ["'body' => ['nullable', 'string']", "'body' => ['required', 'string']", "'body' => ['string']", "'body' => ['nullable', 'integer']"], 0, 'Laravelは既定で空文字をnullに変換するため、空を許すにはnullableが必要です。stringだけではnullが失敗し、requiredは空を許しません。integerは文字列の本文に合いません。'),
  choice('bmi2-l-i-4', 'intermediate', 'laravel', 'この定義で登録されるルートは？', ['GET /posts と GET /posts/{post} だけ', 'GET /posts だけ', 'indexとshow以外のすべて', 'resourceの全ルート'], 0, 'only()は指定したアクションのルートだけを登録します。indexはGET /posts、showはGET /posts/{post}です。指定したものを除くのはexcept()です。', { code: "Route::resource('posts', PostController::class)->only(['index', 'show']);" }),
  choice('bmi2-l-i-5', 'intermediate', 'laravel', 'GET /posts?page=2 でこのコードを実行した。返る投稿は？', ['11〜20件目', '1〜10件目', '2件目だけ', '全件'], 0, 'paginateはリクエストのpageパラメータを読み、そのページ分だけを取得します。1ページ10件なので2ページ目は11〜20件目です。', { code: 'return Post::orderBy(\'id\')->paginate(10);' }),
  choice('bmi2-l-i-6', 'intermediate', 'laravel', '投稿のcategory_idが、categoriesテーブルに実在するIDか確かめたい。適切な規則は？', ["['required', 'exists:categories,id']", "['required', 'unique:categories,id']", "['required', 'integer']", "['required', 'in:categories']"], 0, 'existsは指定したテーブルの列に値があることを確認します。uniqueは逆に「まだない」ことを求めます。integerは形式だけで実在は確かめず、in:categoriesは文字列"categories"との一致を見る規則です。'),

  // Inertia
  choice('bmi2-i-i-1', 'intermediate', 'connection', '既存の投稿7のtitleをuseFormで部分更新して送るには？', ["form.patch('/posts/7')", "form.post('/posts')", "form.get('/posts/7')", "form.delete('/posts/7')"], 0, 'useFormにはpatchがあり、既存リソースの部分更新を送れます。POST /postsは新規作成、GETは取得、DELETEは削除の要求です。', { inertia: true }),
  choice('bmi2-i-i-2', 'intermediate', 'connection', '入力が初期値から変わったときだけ「未保存の変更があります」と表示したい。useFormで参照するのは？', ['form.isDirty', 'form.processing', 'form.hasErrors', 'form.wasSuccessful'], 0, 'isDirtyはフォームの値が初期値から変わっているかを表します。processingは送信中、hasErrorsは検証エラーの有無、wasSuccessfulは直前の送信の成功を表します。', { inertia: true }),
  choice('bmi2-i-i-3', 'intermediate', 'connection', 'InertiaのLinkで投稿7の削除要求を送るには？', ['<Link href="/posts/7" method="delete">', '<Link href="/posts/7">', '<Link href="/posts/7" method="post">', '<a href="/posts/7" method="delete">'], 0, 'Linkのmethodにdeleteを指定するとDELETE要求になり、GET以外ではbutton要素として描画されます。method省略はGET、postは別の要求です。普通のa要素はmethod属性を解釈しません。', { inertia: true }),
  choice('bmi2-i-i-4', 'intermediate', 'connection', '画像付き投稿のアップロード中に進捗率を表示したい。useFormで参照するのは？', ['form.progress.percentage', 'form.processing', 'form.recentlySuccessful', 'form.errors.image'], 0, 'ファイル送信中はprogressに進捗が入り、percentageで割合を表示できます。processingは送信中かどうかの真偽値だけで割合は分かりません。', { inertia: true }),
  choice('bmi2-i-i-5', 'intermediate', 'connection', 'titleの入力を直し始めたら、titleの検証エラーだけを消したい。適切な呼び出しは？', ["form.clearErrors('title')", "form.reset('title')", 'form.cancel()', 'form.errors = {}'], 0, "clearErrors('title')は指定した項目のエラーだけを消します。reset('title')は入力値を初期値へ戻すもので、入力中の値まで消えます。cancel()は送信の中止です。", { inertia: true }),

  // API
  choice('bmi2-api-i-1', 'intermediate', 'connection', 'fetchで送った投稿が検証に失敗したとき、リダイレクトではなく422のJSONを受け取りたい。追加するヘッダーは？', ["Accept: 'application/json'", "Content-Type: 'text/html'", "Cache-Control: 'no-cache'", "Accept: 'text/html'"], 0, 'LaravelはリクエストがJSONを求めているとき、検証エラーを422のJSONで返します。fetchは自動でそう伝えないため、Acceptでapplication/jsonを指定します。Content-Typeは送る本文の形式を表すヘッダーです。', { inertia: false }),
  choice('bmi2-api-i-2', 'intermediate', 'connection', 'Laravelが422で検証エラーを返した。titleの最初のエラー文を読む式は？', ['body.errors.title[0]', 'body.title', 'body.message.title', 'response.errors.title'], 0, 'Laravelの検証エラーJSONは、messageと、項目名ごとのエラー文の配列を持つerrorsを返します。titleの文は配列なので[0]で読みます。responseはjson()で読む前の応答なのでerrorsを持ちません。', { inertia: false, code: 'const body = await response.json();' }),
  choice('bmi2-api-i-3', 'intermediate', 'connection', 'fetchのGETで投稿を検索語で絞り込みたい。検索語を送る場所は？', ["URLのクエリ（/api/posts?q=...）", 'bodyにJSONで入れる', 'Content-Typeヘッダーに入れる', "methodを'SEARCH'にする"], 0, 'GETの条件はURLのクエリで送ります。fetchはGETにbodyを指定するとエラーになります。Content-Typeは本文の形式を伝えるヘッダーで、条件の入れ物ではありません。', { inertia: false }),
  choice('bmi2-api-i-4', 'intermediate', 'connection', 'このコードでdata.titleがundefinedになった。原因は？', ['response.json()の結果をawaitしていない', 'Content-Typeを指定していない', 'GETで取得している', 'JSON.stringifyを使っていない'], 0, 'response.json()はPromiseを返すので、awaitして中身を受け取ります。Promiseにはtitleがないためundefinedになります。JSON.stringifyは送信時の変換で、受信には使いません。', { inertia: false, code: "const response = await fetch('/api/posts/7');\nconst data = response.json();\nconsole.log(data.title);" }),
  choice('bmi2-api-i-5', 'intermediate', 'connection', 'APIトークンで認証する投稿APIへ送るとき、トークンを入れる一般的なヘッダーは？', ['Authorization: `Bearer ${token}`', 'Accept: token', 'Content-Type: token', 'URLの末尾に#tokenを付ける'], 0, 'トークン認証ではAuthorizationヘッダーにBearerとトークンを入れます。Acceptは受け取る形式、Content-Typeは本文の形式を伝えるヘッダーです。#以降はサーバへ送られません。', { inertia: false }),
];

// 誤答の選択肢の文字列と完全一致させる。選択肢を変えたらここも直す。
export const battleQuestionsMoreIntermediateReasons: Record<string, Record<string, string>> = {
  'bmi2-r-i-1': {
    'ボタンのハンドラでevent.preventDefault()を呼ぶ': 'preventDefault()はフォーム送信など既定の動作を止めるだけです。クリックは親へ伝わるので、カードのonClickも動きます。',
    'ボタンのハンドラでfalseを返す': '昔のHTMLのonclick属性の書き方との混同です。Reactのハンドラでfalseを返しても、伝播も既定動作も止まりません。',
    'カードのkeyを削除する': 'keyは一覧の項目を見分けるための値で、イベントの伝わり方には関係しません。',
  },
  'bmi2-r-i-2': {
    '[]': '空の依存配列では最初の表示時に1回だけ実行されます。pageが変わっても再取得しません。',
    '[posts]': 'setPostsで新しい配列が入るたびにpostsが変わるため、取得が繰り返し起きます。再取得のきっかけにしたいのはpageです。',
    '依存配列を省略する': '省略すると描画のたびに実行されます。取得のたびに再描画が起き、通信が止まらなくなります。',
  },
  'bmi2-r-i-3': {
    'onClick={onDelete(post.id)}': 'これは描画の時点でonDeleteを実行し、その戻り値を渡してしまいます。押したときに呼ぶには関数で包みます。',
    'onClick="onDelete(post.id)"': 'HTMLの属性の書き方との混同です。Reactでは文字列ではなく、関数を波括弧で渡します。',
    'onClick={onDelete}(post.id)': 'JSXとして正しい書き方ではありません。引数を付けたいならアロー関数の中で呼びます。',
  },
  'bmi2-r-i-4': {
    '何も表示しない': 'falseやnullなら何も表示されません。しかし&&は左側の0をそのまま返し、Reactは数値の0を描画します。',
    'PostListが空のまま表示される': '左側の0は偽の値なので、&&の右側にあるPostListは評価されません。',
    'falseという文字': '&&はfalseに変換せず、左側の値（0）を返します。それにReactはfalseを文字として描画しません。',
  },
  'bmi2-r-i-5': {
    '"新題"': 'setterはすぐにはtitleを書き換えません。新しい値は次の描画で読めます。',
    'undefined': 'titleは消えておらず、この描画の時点の値である"旧題"のままです。',
    'エラーになる': 'setterの直後にstateを読んでもエラーにはならず、古い値が読めるだけです。',
  },
  'bmi2-v-i-1': {
    '@keyup.prevent="search"': '.preventは既定動作を止める修飾子で、キーの種類を絞りません。どのキーでもsearchが呼ばれます。',
    '@enter="search"': 'enterという名前のDOMイベントはありません。Enterキーで絞るには、keyupにキー修飾子.enterを付けます。',
    '@keyup.stop="search"': '.stopはイベントの伝播を止める修飾子です。押されたキーは区別しません。',
  },
  'bmi2-v-i-2': {
    'v-if': 'v-ifは条件が変わるたびに要素を作り直します。要素を残したまま頻繁に切り替える用途にはv-showが向きます。',
    'v-for': 'v-forは配列を繰り返し描画するディレクティブです。表示と非表示の切り替えには使いません。',
    'v-once': 'v-onceは一度だけ描画し、それ以降は更新しません。開閉の切り替えができなくなります。',
  },
  'bmi2-v-i-3': {
    "emit('input', value)": 'Vue 2の慣習との混同です。Vue 3のコンポーネントのv-modelはupdate:modelValueを待っています。',
    "emit('change', value)": 'changeは既定のv-modelが受け取るイベント名ではないので、親のtitleは更新されません。',
    'props.modelValue = value': 'propsは読み取り専用の入力で、子が代入しても親の値は変わりません。親へはイベントで伝えます。',
  },
  'bmi2-v-i-4': {
    'v-model.trim': '.trimは前後の空白を除くだけです。値は文字列のままになります。',
    'v-model.lazy': '.lazyは同期のタイミングをchangeイベントに遅らせる修飾子です。数値には変換しません。',
    'v-model.int': '.intという修飾子はVueにありません。数値への変換は.numberで行います。',
  },
  'bmi2-v-i-5': {
    'watch(props.postId, load)': 'これはその時点の数値を渡すだけなので、Vueは変化を追えません。propsの一つのプロパティはゲッター関数で監視します。',
    'computed(() => load(props.postId))': 'computedは値を導くためのものです。通信のような副作用を入れるとタイミングを制御できません。',
    'onMounted(load)': 'onMountedはマウント時に1回だけ動きます。後でpostIdが変わっても読み込み直しません。',
  },
  'bmi2-l-i-1': {
    'Post::oldest()->get()': 'oldest()はcreated_atの昇順、つまり古い順です。新しい順にはlatest()を使います。',
    'Post::latest()->first()': 'first()は最新の1件しか返しません。一覧には全件を返すget()を使います。',
    'Post::get()': 'orderByを付けないと並び順が保証されません。新しい順にするには順序の指定が必要です。',
  },
  'bmi2-l-i-2': {
    "redirect()->route('posts.index')": 'posts.indexは一覧ページです。更新した投稿の詳細へは戻りません。',
    "redirect()->route('posts.edit', $post)": 'posts.editは編集フォームです。保存後に詳細を見せる行き先ではありません。',
    "redirect()->route('posts.update', $post)": 'posts.updateはPUT/PATCHで送る保存先です。リダイレクトはGETで開くので、表示するページになりません。',
  },
  'bmi2-l-i-3': {
    "'body' => ['required', 'string']": 'requiredは空の入力を許しません。本文を空のまま送ると検証に失敗します。',
    "'body' => ['string']": '空文字は既定でnullに変換されます。nullableがないとnullがstringの検証に失敗します。',
    "'body' => ['nullable', 'integer']": '空は許せますが、integerは整数を求めます。文字列の本文は失敗します。',
  },
  'bmi2-l-i-4': {
    'GET /posts だけ': 'onlyにはshowも入っているので、GET /posts/{post}も登録されます。',
    'indexとshow以外のすべて': 'それはexcept()の動作です。only()は指定したアクションだけを登録します。',
    'resourceの全ルート': 'only()を付けると、指定したindexとshow以外は登録されません。',
  },
  'bmi2-l-i-5': {
    '1〜10件目': 'それは1ページ目です。paginateはpage=2を読み取り、2ページ目を返します。',
    '2件目だけ': 'pageは何件目かではなくページ番号です。1ページ10件なので2ページ目は11〜20件目です。',
    '全件': 'paginateは1ページ分だけ取得します。全件を返すのはget()などです。',
  },
  'bmi2-l-i-6': {
    "['required', 'unique:categories,id']": 'uniqueは「まだ存在しない」ことを求める規則で、目的と逆です。実在するIDは失敗します。',
    "['required', 'integer']": 'integerは形式だけを確かめます。categoriesテーブルに存在するかは見ません。',
    "['required', 'in:categories']": 'inは列挙した文字列との一致を見る規則です。テーブルの中身は調べません。',
  },
  'bmi2-i-i-1': {
    "form.post('/posts')": 'POST /postsは新しい投稿の作成です。投稿7は更新されず、別の投稿が増えます。',
    "form.get('/posts/7')": 'GETは取得の要求で、保存処理には届きません。',
    "form.delete('/posts/7')": 'DELETEは投稿7を削除する要求です。titleは更新されません。',
  },
  'bmi2-i-i-2': {
    'form.processing': 'processingは送信中かどうかを表します。入力が変わったかは分かりません。',
    'form.hasErrors': 'hasErrorsは検証エラーの有無です。未保存の変更があるかとは別の情報です。',
    'form.wasSuccessful': 'wasSuccessfulは直前の送信が成功したかを表します。入力の変化は追いません。',
  },
  'bmi2-i-i-3': {
    '<Link href="/posts/7">': 'methodを省略するとGETで移動するだけで、削除は要求されません。',
    '<Link href="/posts/7" method="post">': 'methodがpostなのでPOST要求になります。resourceルートの削除はDELETEで受け付けます。',
    '<a href="/posts/7" method="delete">': '普通のa要素はmethod属性を解釈しません。ブラウザはGETで移動するだけです。',
  },
  'bmi2-i-i-4': {
    'form.processing': 'processingは送信中かどうかの真偽値です。何パーセント進んだかは分かりません。',
    'form.recentlySuccessful': 'recentlySuccessfulは送信が成功した直後を示す値です。アップロードの進み具合ではありません。',
    'form.errors.image': 'errors.imageは画像の検証エラー文です。進捗の情報は入りません。',
  },
  'bmi2-i-i-5': {
    "form.reset('title')": 'reset()は入力値を初期値に戻します。エラーを消すためのものではなく、入力中のtitleまで失われます。',
    'form.cancel()': 'cancel()は送信中の要求を中止します。表示中のエラーは消えません。',
    'form.errors = {}': 'errorsを丸ごと置き換えるとtitle以外のエラーも消えます。消し方としてもclearErrorsを使うのが基本です。',
  },
  'bmi2-api-i-1': {
    "Content-Type: 'text/html'": 'Content-Typeは送る本文の形式を伝えるヘッダーです。応答をJSONにしてほしいという指定にはなりません。',
    "Cache-Control: 'no-cache'": 'キャッシュの扱いを指定するヘッダーです。検証エラーの返し方は変わりません。',
    "Accept: 'text/html'": 'HTMLを求めると、Laravelは通常の画面向けにリダイレクトで応答します。',
  },
  'bmi2-api-i-2': {
    'body.title': 'エラー文はerrorsの下に項目名ごとに入ります。最上位にtitleはありません。',
    'body.message.title': 'messageは全体の要約の文字列です。項目ごとのエラーを持つオブジェクトではありません。',
    'response.errors.title': 'responseはjson()で読む前の応答オブジェクトで、errorsを持ちません。読み取ったbodyを使います。',
  },
  'bmi2-api-i-3': {
    'bodyにJSONで入れる': 'fetchはGETにbodyを付けるとエラーにします。GETの条件はURLのクエリで送ります。',
    'Content-Typeヘッダーに入れる': 'Content-Typeは本文の形式を表すヘッダーです。検索語を入れる場所ではありません。',
    "methodを'SEARCH'にする": '一般的なAPIで、検索のためにHTTPメソッドを変えることはありません。取得はGETのまま、条件はクエリで送ります。',
  },
  'bmi2-api-i-4': {
    'Content-Typeを指定していない': 'Content-Typeは本文を送るときのヘッダーです。この取得でundefinedになる原因ではありません。',
    'GETで取得している': '1件の取得にGETを使うのは正しい方法です。問題はjson()のPromiseをawaitしていないことです。',
    'JSON.stringifyを使っていない': 'JSON.stringifyは送信時にオブジェクトを文字列へ変換するものです。受信したデータを読むときは使いません。',
  },
  'bmi2-api-i-5': {
    'Accept: token': 'Acceptは受け取りたい応答の形式を伝えるヘッダーです。認証には使われません。',
    'Content-Type: token': 'Content-Typeは本文の形式を伝えるヘッダーです。トークンを入れてもサーバーは認証に使いません。',
    'URLの末尾に#tokenを付ける': '#以降のフラグメントはサーバーへ送られません。トークンがサーバーに届きません。',
  },
};
