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
  choice('bmi2-l-i-3', 'intermediate', 'laravel', '投稿の本文は空でもよいが、入力されたら文字列であってほしい。適切な規則は？', ["'body' => ['nullable', 'string']", "'body' => ['required', 'string']", "'body' => ['string']", "'body' => ['nullable', 'integer']"], 0, 'Laravelは既定で空文字をnullに変換するため、空を許すにはnullableが必要です。stringだけではnullが失敗し、requiredは空を許しません。integerは文字列の本文に合いません。'),
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
