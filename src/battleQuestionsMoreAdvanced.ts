import type { Difficulty, Question } from './content';

// 正解をoptions[0]に書き、slotで表示位置を指定する（バッチ内で正解位置を分散させるため）。
const choice = (
  id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string,
  options: [string, string, string, string], slot: number, explanation: string,
  extra: Partial<Question> = {},
): Question => {
  const shuffled: [string, string, string, string] = [...options];
  [shuffled[0], shuffled[slot]] = [shuffled[slot], shuffled[0]];
  return { id, difficulty, topic, kind: 'choice', prompt, options: shuffled, answer: slot, reveal: shuffled[slot], explanation, ...extra };
};

// moreQuestions.ts の上級（CLI以外）各問に1問ずつ対応する通常戦用の追加問題。
export const battleQuestionsMoreAdvanced: Question[] = [
  // React（r-a-4〜r-a-8に対応）
  choice('bma2-r-1', 'advanced', 'frontend', '削除ボタンを押した直後に投稿を一覧から消し、API通信が失敗したら元に戻したい。適切な流れは？', [
    '削除前の配列を控えてから除外し、失敗時に控えをsetPostsで戻す',
    '先に除外し、通信が失敗しても画面はそのままにする',
    '通信が成功するまで一覧を変えず、成功後に除外する',
    '失敗したら消した投稿をposts.pushで末尾に足し直す',
  ], 1, '押した直後に消す楽観的更新では、失敗時に戻すため削除前の状態を控えます。失敗を放置するとサーバと画面が食い違います。成功を待つ方法は安全ですが「直後に消す」条件に合いません。pushはstateを直接変更し、元の順序も崩れます。', { track: 'react' }),
  choice('bma2-r-2', 'advanced', 'frontend', '数千件の投稿を並べ替えて表示する。入力欄の1文字ごとの再描画で並べ替えが毎回走って重い。postsとsortKeyが変わったときだけ計算するには？', [
    'useMemo(() => sortPosts(posts, sortKey), [posts, sortKey])',
    'useMemo(() => sortPosts(posts, sortKey), [])',
    'useEffectで並べ替え、結果を別のstateへsetする',
    '初回の並べ替え結果をuseRefに入れて使い続ける',
  ], 2, 'useMemoは依存配列の値が変わらない限り前回の結果を再利用します。依存配列が空だと投稿や並び順が変わっても古い結果のままです。useEffectとstateでは描画が1回余分に増え、同じ情報を二重に持ちます。useRefは値の変化で再計算も再描画もしません。', { track: 'react' }),
  choice('bma2-r-3', 'advanced', 'frontend', 'post.author.nameだけを変更した新しいpostを作りたい。元のpostとauthorを変更しない式は？', [
    '{ ...post, author: { ...post.author, name } }',
    '{ ...post, name }',
    '{ ...post }を作り、そのauthor.nameへ代入する',
    'post.author.name = nameとしてからsetPost(post)',
  ], 3, 'スプレッドは浅いコピーなので、変更する階層ごとに新しいオブジェクトを作ります。{ ...post, name }ではauthorではなくpost直下にnameが増えます。浅いコピーのauthorへ代入すると、元のpostと共有しているauthorまで変わります。同じ参照をsetしても変化を検出できない場合があります。', { track: 'react' }),
  choice('bma2-r-4', 'advanced', 'frontend', '一覧で選んだ投稿を<EditForm post={post} />で編集する。別の投稿を選んでも、前の投稿で入力途中のstateが残る。フォームの状態を投稿ごとに作り直すには？', [
    '<EditForm key={post.id} post={post} />とする',
    'useState(post.title)の初期値に任せる',
    '<EditForm key={Math.random()} post={post} />とする',
    'EditForm内でprops.post.titleへ入力値を代入する',
  ], 0, 'keyが変わるとReactは別のコンポーネントとして扱い、内部のstateを初期化します。useStateの初期値は最初の描画でだけ使われ、propsが変わっても再設定されません。乱数のkeyは描画のたびに作り直すため、入力中の文字も消えます。propsは読み取り専用です。', { track: 'react' }),
  choice('bma2-r-5', 'advanced', 'frontend', '描画ごとにconst filters = { tag }を作ってuseEffectの依存配列に入れたら、毎回再取得された。tagが変わったときだけ取得するには？', [
    '依存配列にはtagを入れ、filtersはeffectの中で作る',
    '依存配列を省略する',
    '依存配列を[]にする',
    'filtersをuseState({ tag })の初期値にして使う',
  ], 1, '依存配列は前回の値とObject.isで比べます。描画ごとに作るオブジェクトは毎回別物なので、値が同じでも変化とみなされます。依存配列を省略すると毎描画で実行し、[]ではtagが変わっても再取得しません。useStateの初期値は最初だけ使うため、後からtagが変わってもfiltersは古いままです。', { track: 'react' }),

  // Vue（v-a-4〜v-a-8に対応）
  choice('bma2-v-1', 'advanced', 'frontend', '検索語が変わるたびにAPIから結果を取得して表示したい。Vueで取得処理を書く場所として適切なのは？', [
    'watchで検索語を監視し、取得結果をrefへ入れる',
    'computedの中でfetchし、そのPromiseを返す',
    'onMountedで1回だけ取得する',
    'v-forで描画する各要素の中で取得関数を呼ぶ',
  ], 2, '通信のような副作用はwatchで扱い、結果をリアクティブな状態に入れます。computedは値を導出する純粋な計算用で、Promiseを返しても画面には結果の配列が入りません。onMountedだけでは検索語の変更に反応しません。描画中に通信を呼ぶと再描画のたびに要求が増えます。', { track: 'vue' }),
  choice('bma2-v-2', 'advanced', 'frontend', 'const state = reactive({ posts: [], loading: false })から、loadingだけを取り出して変化に追従させたい。適切なのは？', [
    'const { loading } = toRefs(state)',
    'const { loading } = state',
    'const loading = state.loading',
    'const loading = ref(state.loading)',
  ], 3, 'reactiveの値を分割代入や代入で取り出すと、その時点の真偽値がコピーされるだけで追従しません。toRefsは各プロパティを元のstateにつながるrefに変換します。ref(state.loading)は初期値をコピーした別のrefになり、stateとはつながりません。', { track: 'vue' }),
  choice('bma2-v-3', 'advanced', 'frontend', '親から受けた投稿titleを子で編集する。「保存」を押すまで親へ反映せず、「取消」で元に戻せるようにしたい。子の設計は？', [
    'propsの値をローカルrefへ写して編集し、保存時だけemitする',
    'defineModelで親の値と直接双方向に結ぶ',
    'props.titleへ入力値を直接代入する',
    'getterだけのcomputedをv-modelに渡す',
  ], 0, '確定前の下書きは子のローカル状態に持ち、保存時に結果をemitします。取消ではローカルの値を捨てればよいです。defineModelは入力のたびに親へ反映されるため、確定までの保留ができません。propsは子から変更しません。getterだけのcomputedは読み取り専用で、v-modelからは書き込めません。', { track: 'vue' }),
  choice('bma2-v-4', 'advanced', 'frontend', 'filtersはreactive({ tag: "", page: 1 })。tagが変わったときだけ再取得し、pageの変更では取得しない。適切なwatchは？', [
    'watch(() => filters.tag, fetchPosts)',
    'watch(filters.tag, fetchPosts)',
    'watch(filters, fetchPosts)',
    'computed(() => fetchPosts(filters.tag))',
  ], 1, 'reactiveの特定のプロパティはgetter関数で監視します。filters.tagを直接渡すとその時点の文字列が渡されるだけで、監視対象になりません。reactiveオブジェクト全体を監視すると、pageの変更でも実行されます。computedは副作用を書く場所ではありません。', { track: 'vue' }),
  choice('bma2-v-5', 'advanced', 'frontend', '公開済みの投稿だけを表示し、非公開の投稿のDOM要素は作りたくない。Vue 3での書き方は？', [
    'computedで公開済みに絞った配列をv-forで回す',
    '同じ要素にv-forとv-if="post.published"を書く',
    '各要素にv-show="post.published"を書く',
    'v-forの:keyにpost.publishedを使う',
  ], 2, 'Vue 3では同じ要素のv-ifがv-forより先に評価されるため、v-ifからpostを参照できません。v-showは要素を作ったうえでCSSで隠すだけです。keyは表示の有無を決めず、真偽値では一意にもなりません。先に絞り込んだcomputedを使うのが公式の推奨です。', { track: 'vue' }),

  // Laravel（l-a-4〜l-a-9に対応）
  choice('bma2-l-1', 'advanced', 'laravel', '開発中はN+1になる遅延読み込みにすぐ気づきたいが、本番では利用者にエラーを見せたくない。AppServiceProviderのbootに書く設定は？', [
    'Model::preventLazyLoading(! $this->app->isProduction())',
    'Model::preventLazyLoading(true)を常に有効にする',
    '一覧のループ内で各投稿に$post->load(\'comments\')を呼ぶ',
    "Post::with('*')を全クエリに付ける",
  ], 3, 'preventLazyLoadingは遅延読み込みを例外にします。本番以外でだけ有効にすると、開発中に気づけて本番は止まりません。常に有効だと本番で見落とした箇所が例外になります。ループ内のloadは投稿ごとにクエリを発行し、N+1が残ります。with("*")のような全関連の一括指定はありません。'),
  choice('bma2-l-2', 'advanced', 'laravel', 'PostPolicyで、管理者はすべての操作を許可し、それ以外の利用者は各メソッドの判定に任せたい。適切な実装は？', [
    'before()で管理者ならtrue、それ以外はnullを返す',
    'before()で管理者ならtrue、それ以外はfalseを返す',
    'update()にだけ管理者の条件を足す',
    'ルートにauthミドルウェアだけを付ける',
  ], 0, 'Policyのbeforeがnullを返すと、通常のメソッドで判定が続きます。falseを返すと管理者以外はすべて拒否されます。updateだけに条件を足しても、deleteなど他の操作には効きません。authミドルウェアはログインの有無だけを確認し、誰の投稿かは判断しません。'),
  choice('bma2-l-3', 'advanced', 'laravel', 'DB::transactionの中で投稿を保存し、通知ジョブも投入する。トランザクションがロールバックしたら通知を送らないようにしたい。方法は？', [
    'ジョブをafterCommit()付きでdispatchする',
    'トランザクション内で通知メールを同期送信する',
    'トランザクションの前に通知ジョブを投入する',
    '例外をtry/catchで握りつぶしてコミットさせる',
  ], 1, 'afterCommitを付けると、ジョブは開いているトランザクションがすべてコミットされた後に投入され、ロールバック時は破棄されます。同期送信や事前の投入では、保存が取り消されても通知は送られます。例外を握りつぶすと不完全なデータを残す恐れがあります。'),
  choice('bma2-l-4', 'advanced', 'laravel', '投稿をログイン中の利用者のものとして保存したい。user_idを利用者の入力から変えられないようにする保存方法は？', [
    '$request->user()->posts()->create($request->validated())',
    'user_idをfillableに含めてPost::create($request->all())',
    'フォームのhidden入力でuser_idを送る',
    '$guarded = []にしてPost::create($request->all())',
  ], 2, 'リレーション経由のcreateはuser_idをログイン中の利用者から設定します。検証ルールに含めない項目はvalidated()に入りません。all()やhidden入力の値は送信者が書き換えられるため、他人のIDで投稿される恐れがあります。$guarded = []は一括代入の保護を外します。'),
  choice('bma2-l-5', 'advanced', 'laravel', '承認済みコメントが1件以上ある投稿だけを、DB側で絞り込んで取得したい。適切なのは？', [
    "Post::whereHas('comments', fn ($q) => $q->where('approved', true))->get()",
    "Post::has('comments')->get()",
    "Post::with(['comments' => fn ($q) => $q->where('approved', true)])->get()",
    "Post::all()->filter(fn ($p) => $p->comments->where('approved', true)->isNotEmpty())",
  ], 3, 'whereHasは関連の条件で親の投稿を絞り込みます。hasは承認条件を見ないため、未承認コメントだけの投稿も含みます。withの条件は読み込むコメントを絞るだけで、投稿は全件返ります。all()の後のfilterは全件をPHPへ読み込み、投稿ごとの追加クエリも発生します。'),
  choice('bma2-l-6', 'advanced', 'laravel', 'SoftDeletesで削除した投稿を復元するルートを作った。暗黙のルートモデル結合で404になる。どうする？', [
    'ルート定義に->withTrashed()を付ける',
    'コントローラで$post->forceDelete()を呼ぶ',
    'Post::find($id)で取得し直す',
    'deleted_at列をマイグレーションから削除する',
  ], 0, 'ルートモデル結合は論理削除済みのモデルを除外するため、復元用のルートではwithTrashedで含めます。forceDeleteは完全に削除し、復元できなくなります。Post::findも通常は論理削除済みを除外します。deleted_atを消すと論理削除自体が使えません。'),

  // Inertia環境（i-a-3〜i-a-7に対応）
  choice('bma2-i-1', 'advanced', 'connection', '同じページの投稿フォームとコメントフォームを、どちらもrouter.postで送る。両方にbody項目があり、検証エラーが両方の欄に出る。項目名を変えずに分けるには？', [
    "送信ごとにerrorBag: 'createPost'のように別の名前を指定する",
    "only: ['errors']を指定する",
    'preserveState: falseを指定する',
    'Laravel側で検証エラーを返さないようにする',
  ], 1, 'errorBagを指定すると、エラーがその名前の下にまとめて返り、同じ項目名でも区別できます。onlyは再読み込みするpropsを絞るだけで、エラーは分かれません。preserveState: falseはコンポーネントの状態を捨てるだけです。エラーを返さないと修正箇所を示せません。なお、useFormで送るとエラーは自動でフォームごとに分かれます。', { inertia: true }),
  choice('bma2-i-2', 'advanced', 'connection', '検索欄でEnterを押すたびにrouter.getで同じ一覧ページへ訪問する。入力欄などの状態を保ち、検索のたびにブラウザ履歴を増やさないための指定は？', [
    '{ preserveState: true, replace: true }',
    '{ preserveState: false, replace: true }',
    '{ preserveState: true, replace: false }',
    '{ preserveScroll: true, replace: false }',
  ], 2, 'preserveStateは同じページコンポーネントの状態を保ち、replaceは履歴を追加せず現在の項目を置き換えます。preserveState: falseは入力欄などの状態を初期化します。replace: falseでは検索のたびに履歴が増えます。preserveScrollが保つのはスクロール位置だけです。', { inertia: true }),
  choice('bma2-i-3', 'advanced', 'connection', '一覧ページのpropsにpostsと重い集計statsがある。初回表示ではstatsも必要だが、postsだけの部分再読み込みでは集計を実行したくない。Laravel側での渡し方は？', [
    "'stats' => fn () => Stats::heavy()",
    "'stats' => Stats::heavy()",
    "'stats' => Inertia::optional(fn () => Stats::heavy())",
    "'stats' => Inertia::always(Stats::heavy())",
  ], 3, 'クロージャで渡すと、初回表示では評価され、部分再読み込みでは要求されたときだけ評価されます。値を直接渡すとpropsへ含めなくても毎回計算されます。optionalは初回表示にも含まれません。alwaysは部分再読み込みでも常に含まれ、毎回計算されます。', { inertia: true }),
  choice('bma2-i-4', 'advanced', 'connection', 'useFormのtagsは画面で配列のまま扱い、送信時だけカンマ区切りの文字列にしたい。入力値を変えない方法は？', [
    "form.transform(data => ({ ...data, tags: data.tags.join(',') })).post(url)",
    "送信前にform.tags = form.tags.join(',')と代入してからpostする",
    "form.defaults('tags', form.tags.join(','))を呼んでからpostする",
    "form.post(url, { only: ['tags'] })で送る",
  ], 0, 'transformは送信するデータだけを変換し、フォームの状態は配列のまま残します。送信前に代入するとフォームの値が文字列になり、検証エラーで戻ったときに配列として扱えません。defaultsはreset時の初期値を変えるもので、送信内容は変わりません。onlyは応答で受け取るpropsを絞る指定です。', { inertia: true }),
  choice('bma2-i-5', 'advanced', 'connection', '保存後のリダイレクト先がどのページでも、セッションのsuccessメッセージを表示したい。Laravel側の渡し方は？', [
    "HandleInertiaRequestsのshareで'flash' => fn () => $request->session()->get('success')を返す",
    '各コントローラのInertia::renderに毎回successを書き足す',
    'ページ表示後に各コンポーネントからメッセージ取得APIを呼ぶ',
    'メッセージをブラウザのlocalStorageに保存しておく',
  ], 1, 'HandleInertiaRequestsのshareは全ページへ共通のpropsを渡せます。クロージャにするとリクエストごとに現在のセッションから読みます。コントローラごとに書き足すと漏れが出ます。別APIは通信が増え、表示も遅れます。localStorageにはサーバ側のセッションの内容が届きません。', { inertia: true }),

  // API環境（api-a-3〜api-a-7に対応）
  choice('bma2-a-1', 'advanced', 'connection', '通信が遅いとき自動で再試行したい。POST /api/postsも再試行すると、同じ投稿が二重に作られる恐れがある。適切な方針は？', [
    'GETなど冪等な要求に再試行を限り、POSTはサーバ側で重複を防ぐ仕組みがある場合だけ再試行する',
    'POSTもGETと同じく無条件に3回まで再試行する',
    '一覧の取得も含め、自動再試行をすべてやめる',
    'タイムアウトをなくし、応答が来るまで待ち続ける',
  ], 2, 'GETは繰り返しても結果が変わりませんが、POSTは要求が届いていた場合に再送で二重作成されます。冪等キーなどでサーバが重複を判別できるときだけPOSTも再試行できます。すべての再試行をやめると安全なGETの回復も失います。待ち続けると利用者が操作できません。', { inertia: false }),
  choice('bma2-a-2', 'advanced', 'connection', '2人が同じ投稿を編集した。後から保存した人の内容が、古い版を元にしていると判定された。APIの応答と画面の処理として適切なのは？', [
    '409 Conflictを返し、画面は最新版を取得して利用者に確認させる',
    '200で保存し、古い版の内容で上書きする',
    '401を返し、利用者に再ログインさせる',
    '422を返し、入力欄の検証エラーとして表示する',
  ], 3, '409は対象の現在の状態と要求が衝突したことを表します。最新版を見せれば、利用者は変更を取り込むか判断できます。そのまま上書きすると先に保存した人の変更が消えます。401は認証の問題です。422は入力値の検証失敗を表し、入力自体に誤りはありません。', { inertia: false }),
  choice('bma2-a-3', 'advanced', 'connection', '検索欄に300msのdebounceを入れて、入力が止まってから検索APIを呼ぶようにした。古い応答で結果が上書きされる問題への効果として正しいのは？', [
    '要求の数は減るが、送った要求同士の応答順の逆転は残るので、中止や要求IDの確認も必要',
    'debounceを入れれば応答順の逆転は起きなくなる',
    'debounceをthrottleに変えれば応答順の逆転は起きなくなる',
    '待ち時間を1秒に延ばせば応答順の逆転は起きなくなる',
  ], 0, 'debounceが減らすのは送信回数です。300ms以上あけて送った2つの要求でも、先の要求の応答が遅れれば後から届きます。throttleや待ち時間の延長も送信間隔を変えるだけです。古い応答を反映しないためには、前の要求の中止や最新の要求かどうかの確認が必要です。', { inertia: false }),
  choice('bma2-a-4', 'advanced', 'connection', '別オリジンのAPIへContent-Type: application/jsonでPOSTすると、先にOPTIONSが送られ、CORSエラーになる。JSONのまま送って応答も読みたい。対処は？', [
    'APIサーバがOPTIONSに許可するオリジン・メソッド・ヘッダーを返す',
    "fetchにmode: 'no-cors'を指定する",
    'フロント側でOPTIONSの送信を止める設定を書く',
    'Content-Typeを外して、本文をtext/plainとして送る',
  ], 1, 'application/jsonでの送信はプリフライト（OPTIONS）の対象になり、サーバが許可を返して初めて本送信されます。no-corsでは応答を読めず、JSONのContent-Typeも使えません。プリフライトはブラウザが行うため、フロントから止められません。text/plainで送るとJSONとして送る条件に反し、サーバも本文をJSONとして扱えない恐れがあります。', { inertia: false }),
  choice('bma2-a-5', 'advanced', 'connection', '新着投稿が頻繁に追加される一覧を無限スクロールで表示する。ページ番号方式では次ページに同じ投稿が重複して出る。適切な取得方法は？', [
    '最後に取得した投稿を基準に続きを取得するカーソル方式にする',
    '1ページの件数を増やして、ページ番号方式のまま取得する',
    'スクロールのたびに全件を取得し直す',
    '重複した投稿を描画時にCSSで隠す',
  ], 2, 'ページ番号方式は件数の位置で区切るため、先頭に投稿が増えると既に取得した投稿が次ページへずれます。カーソル方式は最後の投稿を基準にするので、追加があっても続きから取得できます。件数を増やしても、ずれは残ります。全件の再取得は通信が重くなります。CSSで隠しても重複データは残ります。', { inertia: false }),
];
