import type { Difficulty, Question } from './content';

const choice = (
  id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string,
  options: [string, string, string, string], answer: number, explanation: string,
  extra: Partial<Question> = {},
  slotOverride?: number,
): Question => {
  const slot = slotOverride ?? [...id].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 7) % 4;
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

  // 投稿の操作を一歩ずつ組み立てる追加問題
  choice('r-b-8', 'beginner', 'frontend', '「投稿する」ボタンを押したときにsaveを呼ぶReactの指定は？', ['onClick={save}', 'onClick="save"', 'onSubmit={save}をボタンに指定', 'click={save}'], 0, 'Reactではイベント名をonClickとし、関数を波括弧で渡します。', { track: 'react' }),
  choice('r-b-9', 'beginner', 'frontend', '投稿タイトルを画面に文字として表示するTSXは？', ['<h2>{post.title}</h2>', '<h2>post.title</h2>', '<h2>${post.title}</h2>', '<h2 v-model="post.title" />'], 0, 'JSXでは波括弧の中にJavaScriptの式を書いて値を表示します。', { track: 'react' }),
  choice('r-i-7', 'intermediate', 'frontend', '空白だけの投稿タイトルを送らないため、送信前に使う文字列メソッドは？', ['title.trim()', 'title.map()', 'title.push()', 'title.filter()'], 0, 'trim()で前後の空白を除き、残りが空文字なら送信を止められます。', { track: 'react' }),
  choice('r-i-8', 'intermediate', 'frontend', '投稿の保存中に送信ボタンの連打を防ぐReactの指定は？', ['disabled={saving}', 'disabled="saving"', 'onClick={saving}', 'key={saving}'], 0, '保存中を表す真偽値をdisabledに渡すと、送信ボタンを無効にできます。', { track: 'react' }),
  choice('r-a-7', 'advanced', 'frontend', '投稿を新しい順に並べたい。stateの配列を直接変更しない式は？', ['[...posts].sort(comparePosts)', 'posts.sort(comparePosts)', 'posts.reverse()', 'posts.splice(0, 1)'], 0, 'sortは元の配列を変更するため、コピーしてから並べ替えます。', { track: 'react' }, 2),
  choice('r-a-8', 'advanced', 'frontend', '投稿一覧の取得中に検索条件が変わった。古い結果を反映しない対策は？', ['古いリクエストを中止するか結果を無視する', '古い結果を必ず先にstateへ入れる', 'propsを書き換える', 'keyを毎回乱数にする'], 0, '通信の後始末を行い、現在の条件に合わない結果で画面を上書きしないようにします。', { track: 'react' }),

  choice('v-b-8', 'beginner', 'frontend', '投稿カード内のリンク先をpost.urlに合わせるVueの指定は？', [':href="post.url"', 'href="post.url"', '@href="post.url"', 'v-for="post.url"'], 0, ':hrefでリンク先の属性をデータに結び付けます。', { track: 'vue' }),
  choice('v-b-9', 'beginner', 'frontend', '投稿保存中のボタンを無効にするVueの属性指定は？', [':disabled="saving"', 'disabled="saving"だけ', '@disabled="saving"', 'v-for="saving"'], 0, ':disabledで真偽値の状態をHTML属性へ結び付けます。', { track: 'vue' }),
  choice('v-i-7', 'intermediate', 'frontend', '入力の前後の空白をv-modelで除きたい。使える修飾子は？', ['v-model.trim', 'v-model.filter', 'v-model.clean', 'v-model.strip'], 0, 'v-model.trimは入力値の前後の空白を除く修飾子です。', { track: 'vue' }),
  choice('v-i-8', 'intermediate', 'frontend', '検索語が変わるたびに非同期で投稿を取得したい。副作用を起こす用途に適するのは？', ['watch', 'computedだけ', 'v-for', 'defineProps'], 0, 'watchはリアクティブな値の変化に応じて通信などの副作用を実行できます。', { track: 'vue' }),
  choice('v-a-7', 'advanced', 'frontend', '検索条件を変えて再取得するとき、前回の通信を止める処理を登録する場所は？', ['watchのクリーンアップ', 'computedの戻り値だけ', 'v-forのkey', 'propsの直接変更'], 0, 'watchのクリーンアップで古い通信を中止すると、古い応答による上書きを防げます。', { track: 'vue' }),
  choice('v-a-8', 'advanced', 'frontend', '投稿を日付順に表示したい。元のref配列を変更せずにcomputedで返す式は？', ['[...posts.value].sort(comparePosts)', 'posts.value.sort(comparePosts)', 'posts.value.reverse()', 'posts.value.splice(0, 1)'], 0, 'sortは配列を直接変更するので、コピーしてから並べ替えます。', { track: 'vue' }),

  choice('l-b-8', 'beginner', 'laravel', '投稿1件の詳細を表示するリソースコントローラのメソッドは？', ['show', 'index', 'store', 'destroy'], 0, 'showは指定した1件のリソースを表示する処理です。'),
  choice('l-b-9', 'beginner', 'laravel', '投稿を登録するテーブルにtitle列を追加する場所は？', ['マイグレーション', 'CSS', 'Reactのkey', 'ブラウザの履歴'], 0, 'マイグレーションでテーブルの列を定義します。'),
  choice('l-i-8', 'intermediate', 'laravel', '投稿を1ページ10件ずつ取得するEloquentの呼び出しは？', ['Post::paginate(10)', 'Post::all(10)', 'Post::destroy(10)', 'Post::create(10)'], 0, 'paginate(10)で投稿をページに分けて取得できます。'),
  choice('l-i-9', 'intermediate', 'laravel', '投稿タイトルを100文字以内の文字列にしたい。適切な検証規則は？', ["['required', 'string', 'max:100']", "['required', 'array', 'max:100']", "['nullable', 'string']", "['integer', 'min:100']"], 0, 'requiredで必須、stringで文字列、max:100で最大100文字を指定します。', {}, 3),
  choice('l-a-8', 'advanced', 'laravel', '投稿一覧に各投稿のコメント数だけ追加して取得するEloquentの呼び出しは？', ["Post::withCount('comments')->get()", "Post::with('comments')->count()", 'Post::count()で各投稿の数を得る', 'Post::pluck("comments")'], 0, 'withCountは関連件数を各モデルの属性として取得できます。'),
  choice('l-a-9', 'advanced', 'laravel', '投稿を後から復元できる削除にしたい。Eloquentで使う仕組みは？', ['SoftDeletes', 'Seeder', 'Route::view', 'Blade'], 0, 'SoftDeletesを使い、deleted_at列も用意すると論理削除と復元ができます。'),

  choice('i-b-6', 'beginner', 'connection', 'InertiaのLinkで投稿詳細へ移動するとき、行き先を渡す属性は？', ['href', 'src', 'actionだけ', 'methodだけ'], 0, 'Linkのhrefに移動先URLを指定します。', { inertia: true }),
  choice('i-b-7', 'beginner', 'connection', '投稿を保存したあと一覧ページを表示したい。Laravel側で一般的な応答は？', ['一覧へのリダイレクト', 'CSS文字列だけを返す', 'JavaScriptのstateを直接変更', 'マイグレーションを返す'], 0, '保存後のリダイレクト先のInertiaページが、更新された投稿を表示します。', { inertia: true }),
  choice('i-i-6', 'intermediate', 'connection', 'InertiaのuseFormで送信中か調べるプロパティは？', ['form.processing', 'form.loading', 'form.pending', 'form.waiting'], 0, 'processingを使って送信中の表示やボタンの無効化ができます。', { inertia: true }),
  choice('i-i-7', 'intermediate', 'connection', '投稿が保存できた後、useFormの入力を初期値に戻すメソッドは？', ['form.reset()', 'form.clear()', 'form.reload()', 'form.destroy()'], 0, 'reset()はフォームの値を初期値に戻します。', { inertia: true }),
  choice('i-a-6', 'advanced', 'connection', '投稿保存が成功した場合だけ入力を戻したい。form.postのオプションは？', ['onSuccess: () => form.reset()', 'onError: () => form.reset()', 'preserveScroll: falseだけ', 'only: ["title"]'], 0, 'onSuccessで成功時の処理を指定できます。', { inertia: true }),
  choice('i-a-7', 'advanced', 'connection', '入力エラーが出たときだけスクロール位置を残したい。訪問オプションは？', ["preserveScroll: 'errors'", 'preserveScroll: false', 'only: ["errors"]', 'resetScroll: true'], 0, "preserveScroll: 'errors'は検証エラーがある訪問でスクロールを保ちます。", { inertia: true }, 3),

  choice('api-b-6', 'beginner', 'connection', '投稿タイトルをJSONでAPIへ送るとき、本文に入れるキーは？', ['title', 'stylesheet', 'migration', 'component'], 0, 'サーバが受け取る投稿データの項目名に合わせてtitleを送ります。', { inertia: false }),
  choice('api-b-7', 'beginner', 'connection', '投稿ID 7の詳細を取得するAPIリクエストとして適切なのは？', ["GET /api/posts/7", "DELETE /api/posts/7", "POST /api/posts/7", "PATCH /api/posts/7"], 0, '1件の取得には対象のURLへGETを送ります。', { inertia: false }),
  choice('api-i-6', 'intermediate', 'connection', 'fetchでJavaScriptの投稿データをJSON本文として送る式は？', ['JSON.stringify({ title })', 'JSON.parse({ title })', 'String.parse({ title })', 'response.json({ title })'], 0, 'JSON.stringifyでオブジェクトをJSON文字列に変換してbodyへ渡します。', { inertia: false }),
  choice('api-i-7', 'intermediate', 'connection', '投稿の検索語をURLのクエリへ安全に入れるときに使うものは？', ['encodeURIComponent(query)', 'JSON.parse(query)', 'query.toUpperCase()だけ', 'document.write(query)'], 0, 'encodeURIComponentは検索語の空白や記号をURLの一部として安全に符号化します。', { inertia: false }),
  choice('api-a-6', 'advanced', 'connection', 'DELETEの応答が204 No Contentだった。本文を読む処理は？', ['JSONを読まずに成功として処理する', '必ずresponse.json()を呼ぶ', '必ず投稿を再作成する', '必ず422として扱う'], 0, '204には応答本文がないので、JSON解析を行わず成功を反映します。', { inertia: false }),
  choice('api-a-7', 'advanced', 'connection', '投稿一覧APIがページ分割されている。画面で次ページへ進むために必要なのは？', ['現在ページと次ページの情報を応答から管理する', '最初の10件を無限に複製する', '毎回DELETEを送る', 'CSSだけで残りを表示する'], 0, 'ページ番号や次ページへのリンクを管理して、必要なページを取得します。', { inertia: false }, 3),

  cli('l-b-cli-7', 'beginner', '投稿テーブルを作るマイグレーションの雛形を生成するArtisanコマンドを入力せよ。', ['php artisan make:migration create_posts_table', 'artisan make:migration create_posts_table'], 'make:migrationでテーブル構造を定義するファイルを作ります。'),
  cli('l-i-cli-7', 'intermediate', '投稿更新用のUpdatePostRequestを作成するArtisanコマンドを入力せよ。', ['php artisan make:request UpdatePostRequest', 'artisan make:request UpdatePostRequest'], 'make:requestで更新時の検証をまとめるForm Requestを作れます。'),
  cli('l-a-cli-7', 'advanced', 'マイグレーションを1段階だけ戻すArtisanコマンドを入力せよ。', ['php artisan migrate:rollback --step=1', 'artisan migrate:rollback --step=1'], '--step=1で直近のマイグレーションを1件だけ戻せます。'),
];
