import type { Difficulty, Question } from './content';

const choice = (
  id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string,
  options: [string, string, string, string], answer: number, explanation: string,
  extra: Partial<Question> = {},
): Question => {
  const slot = [...id].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 7) % 4;
  const shuffled: [string, string, string, string] = [...options];
  [shuffled[answer], shuffled[slot]] = [shuffled[slot], shuffled[answer]];
  return { id, difficulty, topic, kind: 'choice', prompt, options: shuffled, answer: slot, reveal: shuffled[slot], explanation, ...extra };
};

const cli = (
  id: string, difficulty: Difficulty, prompt: string, accepted: string[], explanation: string,
): Question => ({ id, difficulty, topic: 'laravel', kind: 'cli', prompt, accepted, reveal: accepted[0], explanation });

// 掲示板を作る順番に沿う追加問題。frontend と connection は選んだルートだけが出題される。
export const moreQuestions: Question[] = [
  // React: 表示 → 入力 → 更新
  choice('r-b-5', 'beginner', 'frontend', '投稿の配列から投稿カードを並べるときに使う配列メソッドは？', ['map', 'find', 'includes', 'join'], 0, 'mapで各投稿をReact要素へ変換できます。', { track: 'react' }),
  choice('r-b-6', 'beginner', 'frontend', '投稿タイトルを入力する欄をstateと同期する組み合わせは？', ['valueとonChange', 'keyとclassName', 'refとRoute', 'srcとalt'], 0, 'valueにstateを渡し、onChangeでsetterを呼ぶ制御された入力にします。', { track: 'react' }),
  choice('r-b-7', 'beginner', 'frontend', '投稿が0件のときだけ「まだ投稿がありません」を表示したい。適切な条件は？', ['posts.length === 0', 'posts.length > 0', 'posts === nullだけ', 'title.length > 0'], 0, '配列の長さが0なら、空の一覧用の案内を表示できます。', { track: 'react' }),

  choice('r-i-4', 'intermediate', 'frontend', '投稿フォームを画面内で処理し、ブラウザの通常送信を止めるには？', ['イベントのpreventDefault()を呼ぶ', '配列を直接変更する', 'keyを消す', 'propsを再代入する'], 0, 'submitイベントのpreventDefault()で通常のページ遷移を抑えられます。', { track: 'react', code: 'function handleSubmit(event: React.FormEvent<HTMLFormElement>) { /* ? */ }' }),
  choice('r-i-5', 'intermediate', 'frontend', '投稿一覧のkeyとして適切な値は？', ['post.id', '配列のindexを常に使う', 'Math.random()の結果', '全行で同じ文字列'], 0, '投稿が並び替わっても変わらないIDをkeyにします。', { track: 'react', code: 'posts.map(post => <PostCard key={/* ? */} post={post} />)' }),
  choice('r-i-6', 'intermediate', 'frontend', '子の投稿カードから親の削除処理を呼びたい。親から渡すものは？', ['削除用の関数をpropsで渡す', '子から親のstateへ直接代入する', 'DOMを直接消す', 'keyを削除する'], 0, '親が削除関数を渡せば、子はクリック時に投稿IDを伝えられます。', { track: 'react' }),

  choice('r-a-4', 'advanced', 'frontend', '削除後に投稿ID 7 だけを除いた新しいstateを作る式は？', ['setPosts(prev => prev.filter(post => post.id !== 7))', 'posts.splice(7, 1)', 'posts[7] = undefined', 'props.posts.pop()'], 0, 'filterで新しい配列を作り、IDが7以外の投稿だけを残します。', { track: 'react' }),
  choice('r-a-5', 'advanced', 'frontend', '検索語から絞り込み一覧を作る設計として適切なのは？', ['postsとqueryから表示一覧を計算する', '同じ投稿を別のstateにも常に複製する', '検索ごとにDOMを直接消す', 'queryをpropsへ代入する'], 0, '元の投稿と検索語から導ける一覧は、描画時に計算できます。', { track: 'react' }),
  choice('r-a-6', 'advanced', 'frontend', '編集中の投稿だけtitleを更新した新しい配列を作る式は？', ['posts.map(p => p.id === id ? { ...p, title } : p)', 'posts.find(p => p.id === id).title = title', 'posts.push({ id, title })', 'posts.forEach(p => p.title = title)'], 0, 'mapとオブジェクトの展開で対象だけ新しい値にし、他の投稿を残します。', { track: 'react' }),

  // Vue: 表示 → 入力 → 更新
  choice('v-b-5', 'beginner', 'frontend', '投稿の配列をテンプレートで繰り返し表示するディレクティブは？', ['v-for', 'v-if', 'v-model', 'v-show'], 0, 'v-forで配列の各投稿を繰り返し描画します。', { track: 'vue' }),
  choice('v-b-6', 'beginner', 'frontend', '投稿タイトルの入力欄をリアクティブな値と同期する記法は？', ['v-model', 'v-for', 'v-once', ':key'], 0, 'v-modelはフォーム入力と状態の同期に使えます。', { track: 'vue' }),
  choice('v-b-7', 'beginner', 'frontend', '投稿が0件のときだけ案内を表示するディレクティブは？', ['v-if', 'v-for', 'v-html', 'v-bind'], 0, 'v-ifで条件に応じて要素を表示できます。', { track: 'vue' }),

  choice('v-i-4', 'intermediate', 'frontend', '投稿フォームの通常送信を止めてsaveを呼ぶ記法は？', ['@submit.prevent="save"', '@click="save"だけ', ':submit="save"', 'v-for="save"'], 0, '.prevent修飾子で通常送信を止め、saveを呼びます。', { track: 'vue' }),
  choice('v-i-5', 'intermediate', 'frontend', '投稿カードをv-forで表示するとき、安定した識別子は？', [':key="post.id"', ':key="Math.random()"', ':key="posts.length"', ':key="index"を常に使う'], 0, '投稿ごとに固有で安定したIDをkeyにします。', { track: 'vue' }),
  choice('v-i-6', 'intermediate', 'frontend', '子の投稿カードから親に削除を知らせる方法は？', ['イベントをemitして投稿IDを渡す', 'propsの配列を直接削除する', '親のDOMを直接消す', 'v-modelを外す'], 0, '子は削除イベントをemitし、親が一覧の状態を更新します。', { track: 'vue' }),

  choice('v-a-4', 'advanced', 'frontend', 'postsとqueryから検索結果を表示したい。導出値に適切なのは？', ['computed', '同じ配列を別のrefへ常に複製', 'document.querySelector', 'マイグレーション'], 0, 'computedは依存する状態が変わると検索結果を再計算します。', { track: 'vue' }),
  choice('v-a-5', 'advanced', 'frontend', '投稿削除の通信が成功した後、一覧からその投稿を除く式は？', ['posts.value = posts.value.filter(p => p.id !== id)', 'props.posts.splice(id, 1)', 'document.body.innerHTML = ""', 'posts = null'], 0, '新しい配列をrefの.valueへ代入すると一覧へ反映されます。', { track: 'vue', code: 'const posts = ref<Post[]>([]);' }),
  choice('v-a-6', 'advanced', 'frontend', '親から受けた投稿のtitleを編集する子コンポーネント。保存時の基本的な流れは？', ['編集結果をemitし、親が状態を更新する', 'props.titleへ直接代入する', '型をanyにして代入する', '表示文字だけDOMで書き換える'], 0, 'propsは入力として扱い、変更結果を親へイベントで伝えます。', { track: 'vue' }),

  // Laravel: MVC と掲示板の CRUD
  choice('l-b-4', 'beginner', 'laravel', 'MVCのViewが主に担当するのは？', ['利用者に見せる画面', 'データベース接続設定だけ', 'URLの名前付けだけ', 'サーバの起動だけ'], 0, 'Viewは表示を担当します。このゲームでは選んだReactまたはVueのページが画面を作ります。'),
  choice('l-b-5', 'beginner', 'laravel', '掲示板のPostモデルが表すものは？', ['投稿のデータとその操作', 'ボタンの色', 'ブラウザのタブ', '通信速度'], 0, 'Eloquentモデルは投稿などのデータを扱う入口です。'),
  choice('l-b-6', 'beginner', 'laravel', '新しい投稿を登録する処理の名前として、リソースコントローラで一般的なのは？', ['store', 'index', 'edit', 'show'], 0, 'storeは新しいリソースを保存する処理です。'),
  choice('l-b-7', 'beginner', 'laravel', '投稿を削除するリクエストに使うHTTPメソッドは通常どれ？', ['DELETE', 'GET', 'HEAD', 'OPTIONS'], 0, '削除操作には通常DELETEを使います。'),

  choice('l-i-4', 'intermediate', 'laravel', '投稿の一覧を返すリソースコントローラのメソッドは？', ['index', 'store', 'destroy', 'update'], 0, 'indexはリソースの一覧表示に対応します。'),
  choice('l-i-5', 'intermediate', 'laravel', '既存の投稿を更新するリソースコントローラのメソッドは？', ['update', 'create', 'index', 'show'], 0, 'updateは既存リソースの変更を保存します。'),
  choice('l-i-6', 'intermediate', 'laravel', '投稿タイトルを必須にしたい。適切なバリデーション規則は？', ["'title' => ['required', 'string']", "'title' => ['nullable']", "'title' => ['sometimes']", "'title' => ['array']"], 0, 'requiredで入力を必須とし、stringで文字列であることを確認します。'),
  choice('l-i-7', 'intermediate', 'laravel', 'この定義で追加されるルートの組み合わせは？', ['投稿の一覧・作成・表示・更新・削除など', 'GETの一覧だけ', 'DELETEだけ', 'ログイン専用ルートだけ'], 0, 'resourceルートはCRUDに必要な一連のルートを登録します。', { code: "Route::resource('posts', PostController::class);" }),

  choice('l-a-4', 'advanced', 'laravel', '投稿とコメントを一覧で表示する際、各投稿ごとの追加クエリを減らす方法は？', ["Post::with('comments')->get()", 'Post::all()の各行でcommentsを取得する', 'CSSを圧縮する', 'フォーム入力を消す'], 0, 'withで関連を先読みすると、投稿ごとの追加クエリを抑えられます。'),
  choice('l-a-5', 'advanced', 'laravel', '投稿者本人だけ編集できるルールを整理するのに適した仕組みは？', ['Policy', 'Migration', 'Seeder', 'ViewのCSS'], 0, 'Policyはモデルに関する認可ルールをまとめられます。'),
  choice('l-a-6', 'advanced', 'laravel', '投稿と監査記録を必ず両方保存したい。片方が失敗したら全体を戻すには？', ['DB::transaction', 'Post::all', 'Route::get', 'view()'], 0, 'トランザクション内の処理が失敗すると、まとめてロールバックできます。'),
  choice('l-a-7', 'advanced', 'laravel', '検証済みの投稿内容だけ保存する際に取り出す値として適切なのは？', ['$request->validated()', '$request->all()を無条件で渡す', '$_GETを直接保存', '画面のDOMを読む'], 0, 'Form Requestのvalidated()で検証済みデータを取得できます。'),

  // Inertiaを選んだ場合の接続
  choice('i-b-3', 'beginner', 'connection', '投稿一覧ページをLaravelから開くときに返すものは？', ["Inertia::render('Posts/Index', ['posts' => $posts])", 'JSONだけをechoする', 'CSSファイル名だけを返す', 'Artisanコマンドを表示する'], 0, 'ページ名とpropsをInertiaレスポンスとして返します。', { inertia: true }),
  choice('i-b-4', 'beginner', 'connection', 'InertiaのページでLaravelから渡された投稿一覧を受け取る場所は？', ['ページのprops', 'マイグレーション', 'CSSの変数', 'ブラウザのCookieだけ'], 0, 'コントローラが渡した投稿一覧はページのpropsで受け取れます。', { inertia: true }),
  choice('i-b-5', 'beginner', 'connection', 'Inertia内のページへ移動するリンクに使うコンポーネントは？', ['Link', 'Migration', 'Seeder', 'Controller'], 0, 'InertiaのLinkを使ってページ間を移動できます。', { inertia: true }),

  choice('i-i-3', 'intermediate', 'connection', '投稿フォームをInertiaのuseFormで送信するときの操作は？', ["form.post('/posts')", "form.get('/posts')で保存", 'propsを直接変更する', 'HTMLを直接書き換える'], 0, '新規投稿の送信にはuseFormのpostを使えます。', { inertia: true }),
  choice('i-i-4', 'intermediate', 'connection', '投稿フォームの検証エラーを入力欄の下に表示したい。参照するものは？', ['form.errors.title', 'form.processingだけ', 'post.idだけ', 'window.locationだけ'], 0, 'useFormのerrorsに、入力名ごとの検証エラーが入ります。', { inertia: true }),
  choice('i-i-5', 'intermediate', 'connection', '投稿削除をInertiaで送るときのメソッドは？', ["router.delete('/posts/7')", "router.get('/posts/7')", "router.post('/posts/7')で取得", 'LinkでCSSを削除'], 0, 'Inertia routerのdeleteで削除リクエストを送れます。', { inertia: true }),

  choice('i-a-3', 'advanced', 'connection', 'Inertiaの検証失敗後、フォームのエラーを返すLaravelの一般的な流れは？', ['リダイレクトしてエラーをセッション経由で渡す', '必ずAPI用JSON 422だけを返す', '入力を無条件で保存する', '画面の型をanyにする'], 0, 'Inertiaの通常のフォーム処理では、Laravelのリダイレクトとエラー共有を利用します。', { inertia: true }),
  choice('i-a-4', 'advanced', 'connection', '一覧へ戻るとき、スクロール位置を保ちたい。Inertia訪問の設定は？', ['preserveScroll: true', 'forceScroll: true', 'scroll: null', 'reloadPage: false'], 0, 'preserveScrollでページ訪問後のスクロール位置を維持できます。', { inertia: true }),
  choice('i-a-5', 'advanced', 'connection', '同じ投稿一覧ページでpostsだけを再取得したい。部分的な再読み込みの指定は？', ["router.reload({ only: ['posts'] })", "router.reload({ all: true })", 'postsをDOMから読み取る', '全propsを手動でnullにする'], 0, 'onlyで更新が必要なpropsを指定できます。', { inertia: true }),

  // APIを選んだ場合の接続
  choice('api-b-3', 'beginner', 'connection', '投稿一覧をAPIから取得するfetchの基本形は？', ["fetch('/api/posts')", "fetch('/api/posts', { method: 'DELETE' })", "fetch('/api/posts', { method: 'POST' })", "fetch('/api/posts', { method: 'PATCH' })"], 0, 'fetchは省略時にGETを使うため、一覧の取得に対応します。', { inertia: false }),
  choice('api-b-4', 'beginner', 'connection', '新しい投稿をAPIへ登録するHTTPメソッドは通常どれ？', ['POST', 'GET', 'HEAD', 'OPTIONS'], 0, '新規作成には通常POSTを使います。', { inertia: false }),
  choice('api-b-5', 'beginner', 'connection', '投稿削除に成功した後、画面で行うことは？', ['一覧から対象を除くか再取得する', '失敗と表示する', '入力欄を必ず消すだけ', 'ルート定義を削除する'], 0, 'サーバの結果に合わせて表示中の投稿一覧を更新します。', { inertia: false }),

  choice('api-i-3', 'intermediate', 'connection', 'JSON本文をPOSTする際のContent-Typeは？', ['application/json', 'text/css', 'image/png', 'text/html'], 0, 'JSONを送るときはContent-Typeで本文の形式を伝えます。', { inertia: false }),
  choice('api-i-4', 'intermediate', 'connection', 'fetchでHTTP 422が返ったとき、成功かどうかの判定に使うものは？', ['response.ok', 'response.jsonだけ', 'response.urlだけ', '画面のCSS'], 0, 'fetchはHTTPエラーだけではrejectされないため、okで成功範囲か確かめます。', { inertia: false }),
  choice('api-i-5', 'intermediate', 'connection', '投稿のtitleだけを部分更新するときに適したHTTPメソッドは？', ['PATCH', 'GET', 'HEAD', 'OPTIONS'], 0, 'PATCHはリソースの一部を変更するリクエストに使います。', { inertia: false }),

  choice('api-a-3', 'advanced', 'connection', 'APIが422と入力項目ごとのエラーを返した。画面で行う処理は？', ['該当する入力欄の近くにエラーを表示する', '成功として投稿を追加する', 'エラーを無視して再送する', 'CSSを削除する'], 0, 'サーバ側の検証結果を、修正できる場所に示します。', { inertia: false }),
  choice('api-a-4', 'advanced', 'connection', 'APIが403を返した。意味として適切なのは？', ['認証済みでもその操作を許可されていない', '必ず未認証である', '投稿が必ず0件である', 'JSONの構文が必ず壊れている'], 0, '403はリクエストした操作へのアクセスが拒否されたことを表します。', { inertia: false }),
  choice('api-a-5', 'advanced', 'connection', '検索語を素早く変えたとき、古い検索結果の上書きを防ぐ方法は？', ['前のリクエストをAbortControllerで中止する', '古いレスポンスを常に最後に表示する', '全投稿を直接DOMに追加する', 'GETをDELETEへ変更する'], 0, '新しい検索時に前のリクエストを中止すると、古い結果の反映を避けやすくなります。', { inertia: false }),

  // 石版のボス戦だけで出すCLI問題
  cli('l-b-cli-4', 'beginner', 'Postモデルを作成するArtisanコマンドを入力せよ。', ['php artisan make:model Post', 'artisan make:model Post'], 'make:modelでEloquentモデルを作成します。'),
  cli('l-b-cli-5', 'beginner', 'Postモデルと、そのテーブル用マイグレーションを同時に作るコマンドを入力せよ。', ['php artisan make:model Post -m', 'artisan make:model Post -m', 'php artisan make:model Post --migration', 'artisan make:model Post --migration'], '-m（--migration）でモデルとマイグレーションを一緒に作れます。'),
  cli('l-b-cli-6', 'beginner', '未実行のマイグレーションをデータベースへ適用するコマンドを入力せよ。', ['php artisan migrate', 'artisan migrate'], 'migrateで未実行のマイグレーションを適用します。'),

  cli('l-i-cli-4', 'intermediate', 'PostControllerをリソースコントローラとして作成するコマンドを入力せよ。', ['php artisan make:controller PostController --resource', 'artisan make:controller PostController --resource', 'php artisan make:controller PostController -r', 'artisan make:controller PostController -r'], '--resourceでCRUD用のメソッドを持つコントローラを作れます。'),
  cli('l-i-cli-5', 'intermediate', 'PostSeederを作成するArtisanコマンドを入力せよ。', ['php artisan make:seeder PostSeeder', 'artisan make:seeder PostSeeder'], 'make:seederで開発用データを投入するクラスを作れます。'),
  cli('l-i-cli-6', 'intermediate', 'PostSeederだけを実行するArtisanコマンドを入力せよ。', ['php artisan db:seed --class=PostSeeder', 'artisan db:seed --class=PostSeeder'], '--classを指定すると、選んだSeederだけを実行できます。'),

  cli('l-a-cli-4', 'advanced', 'Postモデル用のPostPolicyを作成するArtisanコマンドを入力せよ。', ['php artisan make:policy PostPolicy --model=Post', 'artisan make:policy PostPolicy --model=Post'], '--modelを指定すると、Postに対応するPolicyの雛形を作れます。'),
  cli('l-a-cli-5', 'advanced', 'PostFactoryをPostモデルに対応させて作成するコマンドを入力せよ。', ['php artisan make:factory PostFactory --model=Post', 'artisan make:factory PostFactory --model=Post'], 'Factoryはテストや開発用の投稿データを生成するのに使えます。'),
  cli('l-a-cli-6', 'advanced', 'Laravelのテストを実行するArtisanコマンドを入力せよ。', ['php artisan test', 'artisan test'], 'testでLaravelのテストスイートを実行できます。'),
];
