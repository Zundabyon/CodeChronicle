export type Track = 'react' | 'vue';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type Area = 'town' | 'field' | 'dungeon';
export type Question = {
  id: string;
  difficulty: Difficulty;
  topic: 'frontend' | 'laravel' | 'connection';
  track?: Track;
  inertia?: boolean;
  kind: 'choice' | 'cli';
  prompt: string;
  code?: string;
  options?: [string, string, string, string];
  answer?: number;
  accepted?: string[];
  reveal: string;
  explanation: string;
};

const choice = (id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string, options: [string,string,string,string], answer: number, explanation: string, extra: Partial<Question> = {}): Question => ({ id, difficulty, topic, kind: 'choice', prompt, options, answer, reveal: options[answer], explanation, ...extra });
const cli = (id: string, difficulty: Difficulty, topic: Question['topic'], prompt: string, accepted: string[], explanation: string, extra: Partial<Question> = {}): Question => ({ id, difficulty, topic, kind: 'cli', prompt, accepted, reveal: accepted[0], explanation, ...extra });

export const questions: Question[] = [
  choice('r-b-1','beginner','frontend','Reactで画面の一部分を再利用する単位は？',['コンポーネント','マイグレーション','ルート','ミドルウェア'],0,'ReactのUIはコンポーネントを組み合わせて作ります。',{track:'react'}),
  choice('r-b-2','beginner','frontend','親コンポーネントから子に渡す値は？',['state','props','route','migration'],1,'propsは親から子に渡す読み取り専用の入力です。',{track:'react'}),
  choice('r-b-3','beginner','frontend','画面内で変化し、再描画に使う値は？',['props','state','controller','schema'],1,'stateが変わると、Reactは必要な表示を更新します。',{track:'react'}),
  choice('r-b-4','beginner','frontend','TSXで複数の要素を返すとき、外側に使えるものは？',['Fragment','Route','Seeder','Request'],0,'Fragment（<>...</>）なら余分なDOM要素を増やさずに要素をまとめられます。',{track:'react'}),
  choice('r-i-1','intermediate','frontend','useStateの更新で正しい書き方は？',['count = count + 1','setCount(count + 1)','props.count++','return count++'],1,'stateはsetterを使って更新します。',{track:'react',code:'const [count, setCount] = useState(0);'}),
  choice('r-i-2','intermediate','frontend','配列から一覧を描画するとき、各要素に必要な識別子は？',['key','id属性のみ','ref','name'],0,'keyは兄弟要素の間で一意にし、Reactが項目を追跡できるようにします。',{track:'react'}),
  choice('r-i-3','intermediate','frontend','この型でtitleはどう扱われる？',['必須の文字列','省略可能な文字列','数値のみ','任意の関数'],1,'? はプロパティが省略可能であることを示します。',{track:'react',code:'type Props = { title?: string };'}),
  choice('r-a-1','advanced','frontend','前のstateを元に更新するとき、安全な書き方は？',['setCount(count + 1)を連続で2回','setCount(prev => prev + 1)','count++','props.count = 1'],1,'関数型更新は直前のstateを受け取るので、連続更新でも意図を表せます。',{track:'react'}),
  choice('r-a-2','advanced','frontend','子の複数箇所で同じ状態が必要。まず検討する設計は？',['各子が別々に保持','共通の親へ状態を持ち上げる','DOMを直接書き換える','すべてグローバル変数にする'],1,'共有状態は共通の親に持たせ、propsで必要な子へ渡すのが基本です。',{track:'react'}),
  choice('r-a-3','advanced','frontend','この関数で配列の要素を直接変更しない方法は？',['items.push(item)','items[0] = item','setItems(prev => [...prev, item])','props.items.push(item)'],2,'新しい配列を作ってstate setterへ渡すと、更新を追跡しやすくなります。',{track:'react'}),

  choice('v-b-1','beginner','frontend','Vueで画面の一部分を再利用する単位は？',['コンポーネント','マイグレーション','ルート','ミドルウェア'],0,'Vueの画面もコンポーネントを組み合わせて作ります。',{track:'vue'}),
  choice('v-b-2','beginner','frontend','親コンポーネントから子へ値を渡す仕組みは？',['props','emit','migration','route'],0,'propsは親から子へ渡す入力です。',{track:'vue'}),
  choice('v-b-3','beginner','frontend','Vueのテンプレートで値を表示する基本の構文は？',['{{ value }}','${value}','<% value %>','#value'],0,'二重波括弧の補間で値をテキストとして表示します。',{track:'vue'}),
  choice('v-b-4','beginner','frontend','Vueでボタンのクリックを受け取る記法は？',['@click','@route','#click','v-props'],0,'@clickはv-on:clickの省略形です。',{track:'vue'}),
  choice('v-i-1','intermediate','frontend','このコードでcountを1増やす式は？',['count++','count.value++','setCount(count + 1)','props.count++'],1,'script内でrefの値へアクセスするときは.valueを使います。',{track:'vue',code:'const count = ref<number>(0);'}),
  choice('v-i-2','intermediate','frontend','子コンポーネントから親へ出来事を通知する基本の仕組みは？',['emit','propsを書き換える','migration','computed'],0,'子から親への通知にはイベントのemitを使います。',{track:'vue'}),
  choice('v-i-3','intermediate','frontend','一覧表示で各要素を識別するために付けるものは？',[':key','@click','v-model','ref'],0,'v-forの要素には安定した:keyを指定します。',{track:'vue'}),
  choice('v-a-1','advanced','frontend','元の値から導ける表示用の値に適したものは？',['computed','同じ値を二重にrefへ保存','直接DOM操作','migration'],0,'computedは依存するリアクティブな値から導出値を計算します。',{track:'vue'}),
  choice('v-a-2','advanced','frontend','propsを子で直接変更したい。基本的にどうする？',['直接代入する','親へイベントを通知する','DOMを書き換える','型をanyにする'],1,'propsは親からの入力として扱い、変更は親へイベントで通知します。',{track:'vue'}),
  choice('v-a-3','advanced','frontend','非同期通信の結果に応じて表示を変えるには？',['結果をリアクティブな状態に入れる','HTML文字列を常に直接書き換える','propsを変異させる','CSSだけで判断する'],0,'結果と読み込み状態をリアクティブに管理してテンプレートへ反映します。',{track:'vue'}),

  choice('l-b-1','beginner','laravel','LaravelでURLと処理を結びつける設定は？',['ルート','コンポーネント','props','ref'],0,'ルートはリクエストの行き先を定義します。'),
  choice('l-b-2','beginner','laravel','HTTPリクエストを受け、処理をまとめるクラスは？',['コントローラ','コンポーネント','スタイルシート','型エイリアス'],0,'コントローラはリクエストへの応答処理を整理します。'),
  choice('l-b-3','beginner','laravel','入力値が条件を満たすか確認する処理は？',['バリデーション','レンダリング','スタイリング','マウント'],0,'バリデーションは入力の形式や必須条件を確かめます。'),
  cli('l-b-cli','beginner','laravel','LaravelのCLIで使う実行ファイル名を入力せよ。',['artisan','php artisan'],'artisanはLaravelのコマンドラインツールです。'),
  cli('l-b-cli-2','beginner','laravel','Artisanで利用可能なコマンドの一覧を表示するコマンドを入力せよ。',['php artisan list','artisan list'],'listで使えるArtisanコマンドを確認できます。'),
  cli('l-b-cli-3','beginner','laravel','Artisanコマンドのヘルプを表示するコマンドを入力せよ。',['php artisan help','artisan help'],'helpでコマンドの説明や引数を確認できます。'),
  choice('l-i-1','intermediate','laravel','フォーム入力を保存する前にまず行うべきことは？',['バリデーション','CSSの変更','ブラウザ再起動','ルート削除'],0,'サーバ側で入力を検証してから利用します。'),
  choice('l-i-2','intermediate','laravel','データベースのテーブル構造の変更履歴を管理するものは？',['マイグレーション','props','TSX','Fragment'],0,'マイグレーションはDBスキーマの変更をコードで管理します。'),
  choice('l-i-3','intermediate','laravel','このルートが受け付けるHTTPメソッドは？',['GET','POST','PUT','DELETE'],1,'Route::postはPOSTリクエストを扱います。',{code:"Route::post('/notes', [NoteController::class, 'store']);"}),
  cli('l-i-cli','intermediate','laravel','Laravelの登録済みルートを一覧表示するコマンドを入力せよ。',['php artisan route:list','artisan route:list'],'route:listでルート一覧を確認できます。'),
  cli('l-i-cli-2','intermediate','laravel','PostControllerを作成するArtisanコマンドを入力せよ。',['php artisan make:controller PostController','artisan make:controller PostController'],'make:controllerでコントローラの雛形を作れます。'),
  cli('l-i-cli-3','intermediate','laravel','マイグレーションの適用状況を表示するコマンドを入力せよ。',['php artisan migrate:status','artisan migrate:status'],'migrate:statusで各マイグレーションの実行状態を確認できます。'),
  choice('l-a-1','advanced','laravel','閲覧権限を複数のルートへ共通で適用したい。適切な場所は？',['ミドルウェア','CSS','コンポーネント名','マイグレーション名'],0,'ミドルウェアはルートの前後で共通のリクエスト処理を担います。'),
  choice('l-a-2','advanced','laravel','入力値を画面へ戻す前に考慮すべきものは？',['型と公開してよいデータの範囲','変数名の長さだけ','画面の色だけ','配列の順序だけ'],0,'応答では必要なデータだけを渡し、型と公開範囲を意識します。'),
  choice('l-a-3','advanced','laravel','レコードが見つからない場合に404として扱いやすい取得は？',['findOrFail','all','count','pluck'],0,'findOrFailは対象がなければモデル未発見の例外を投げます。'),
  cli('l-a-cli','advanced','laravel','Laravelの未実行マイグレーションを実行するコマンドを入力せよ。',['php artisan migrate','artisan migrate'],'migrateで未実行のマイグレーションを適用します。'),
  cli('l-a-cli-2','advanced','laravel','指定した名前でForm Requestを作成するArtisanコマンドを入力せよ。',['php artisan make:request StorePostRequest','artisan make:request StorePostRequest'],'make:requestでバリデーション用のForm Requestクラスを作れます。'),
  cli('l-a-cli-3','advanced','laravel','ルートキャッシュを削除するArtisanコマンドを入力せよ。',['php artisan route:clear','artisan route:clear'],'route:clearは生成済みのルートキャッシュを削除します。'),

  choice('i-b-1','beginner','connection','InertiaでLaravelからフロントのページへ渡す値は何と呼ぶ？',['props','migration','stylesheet','ref'],0,'Inertiaのページへ渡したデータはpropsとして受け取ります。',{inertia:true}),
  choice('i-b-2','beginner','connection','Inertiaで画面を表示する際、Laravel側が指定するものは？',['ページコンポーネント名','DOMの座標','CSSの画素数','ブラウザの履歴番号'],0,'サーバ側がページ名とpropsを返し、対応する画面を表示します。',{inertia:true}),
  choice('i-i-1','intermediate','connection','Inertiaのページ遷移で、通常のAPI JSONだけを返す代わりに使うものは？',['Inertiaレスポンス','CSSファイル','マイグレーション','コンソールログ'],0,'Inertiaはページ名とpropsを含む応答でサーバと画面をつなぎます。',{inertia:true}),
  choice('i-i-2','intermediate','connection','Inertiaページのpropsの型を決める主な利点は？',['受け取るデータの形を確認できる','DBが自動で消える','CSSが不要になる','通信が必ずゼロになる'],0,'TypeScriptの型でページが期待するデータを明確にできます。',{inertia:true}),
  choice('i-a-1','advanced','connection','Inertiaページへ渡すデータで優先すべき設計は？',['画面に必要な値だけ渡す','全モデルの全属性を常に渡す','DB接続情報も渡す','型をすべてanyにする'],0,'ページに不要な値や非公開情報を渡さないようにします。',{inertia:true}),
  choice('i-a-2','advanced','connection','フォームの検証エラーを画面に示すとき重要なのは？',['各入力と対応するエラーを表示する','すべて成功扱いにする','エラーをログだけに残す','フォームを消す'],0,'ユーザーが修正箇所を分かるよう、入力ごとにエラーを伝えます。',{inertia:true}),

  choice('api-b-1','beginner','connection','フロントとLaravelをAPIでつなぐとき、一般的な応答形式は？',['JSON','PNG','CSS','TSX'],0,'JSONはフロントとサーバのデータ交換で広く使われます。',{inertia:false}),
  choice('api-b-2','beginner','connection','一覧データを取得するHTTPメソッドは通常どれ？',['GET','POST','PATCH','DELETE'],0,'取得には通常GETを使います。',{inertia:false}),
  choice('api-i-1','intermediate','connection','fetchでJSON応答を読む処理は？',['response.json()','response.css()','response.tsx()','response.migrate()'],0,'fetchのResponseからJSON本文を読むにはjson()を呼びます。',{inertia:false}),
  choice('api-i-2','intermediate','connection','API通信中に画面で管理したい状態は？',['読み込み中と失敗','文字色だけ','端末の時刻だけ','コンポーネント名だけ'],0,'通信には待機と失敗があるため、画面でも状態を分けます。',{inertia:false}),
  choice('api-a-1','advanced','connection','APIが401を返した。まず確認すべき意味は？',['認証が必要、または認証できない','必ずサーバが落ちた','CSSに構文エラー','JSON配列が空'],0,'401は認証に関するHTTPステータスです。',{inertia:false}),
  choice('api-a-2','advanced','connection','APIへの書き込みでフロント側だけの検証では足りない理由は？',['サーバへ直接リクエストできるから','TypeScriptが無効になるから','画面が必ず白くなるから','GETしか使えないから'],0,'クライアント側を迂回できるため、サーバ側でも検証します。',{inertia:false}),
];

export const difficultyLabel: Record<Difficulty, string> = { beginner: '初級', intermediate: '中級', advanced: '上級' };
export const areaLabel: Record<Area, string> = { town: '黎明の町', field: '風渡りの平原', dungeon: '忘却の遺跡' };

export type Point = { x: number; y: number };
export type Npc = { id: string; name: string; x: number; y: number; face: string; lines: string[] };
export type Enemy = { id: string; name: string; x: number; y: number; icon: string; boss?: boolean; cli?: boolean };
export type MapData = { tiles: string[]; npcs: Npc[]; enemies: Enemy[]; entry: Point };

export const maps: Record<Area, MapData> = {
  town: {
    tiles: [
      '####################',
      '#....h.......h.....#',
      '#.................##',
      '#.h...............##',
      '#..........h.......#',
      '#..................#',
      '#..h.........h.....#',
      '#..................#',
      '#.....f............#',
      '#..................#',
      '#........g.........#',
      '##########.#########',
    ],
    entry: {x:10,y:9},
    npcs: [
      {id:'elder',name:'長老エルド',x:7,y:3,face:'👴',lines:['よく戻ったな、{name}。あの日から十年……世界の傷はいまだ癒えぬ。','魔王が奪ったのは言葉だけではない。考え、組み立てる力そのものだ。','平原を越え、忘却の遺跡へ向かうのだ。まず経験を積み、第二の階へ至れ。知識の扉が、お前を待っている。']},
      {id:'scholar',name:'学者ミラ',x:14,y:6,face:'👩🏻‍🎓',lines:['型とは、値がどんな姿をしているかを示す約束よ。','ReactもVueも、小さな部品を組み合わせて画面を作る。Laravelはその背後で道を示すの。','学ぶ道を変えたくなったら、右上の「学習設定」を開いてね。']},
      {id:'child',name:'町の子ども',x:5,y:7,face:'🧒',lines:['ねえ、世界を消すって、どういうこと？','みんなが教えてくれた言葉までなくなるのは、いやだよ。','だから、僕も一つずつ覚える。あなたも無事に帰ってきてね。']},
      {id:'priest',name:'司祭セラ',x:8,y:8,face:'👩🏼',lines:['教会では傷を癒し、思い出せなかった問いを振り返れます。','間違いは、知識の扉を開くための足跡。何度でもお越しください。']},
    ],
    enemies: [],
  },
  field: {
    tiles: [
      '####################',
      '#....t.............#',
      '#.t.......t........#',
      '#.................d#',
      '#......t..........d#',
      '#..................#',
      '#.t........t.......#',
      '#..................#',
      '#....t.............#',
      '#..................#',
      '#........g.........#',
      '##########.#########',
    ],
    entry: {x:10,y:10},
    npcs: [{id:'wanderer',name:'旅人ロイ',x:6,y:4,face:'🧑🏽',lines:['遺跡の守護者は、忘れられた知識を試すそうだ。','答えを急ぐな。問いを読み、選択肢を比べるんだ。','あの東の門の先に、忘却の遺跡がある。']}],
    enemies: [
      {id:'f1',name:'バグスライム',x:4,y:3,icon:'◕'},
      {id:'f2',name:'ノイズコウモリ',x:12,y:5,icon:'✦'},
      {id:'f3',name:'コマンドゴースト',x:15,y:8,icon:'♟',cli:true},
    ],
  },
  dungeon: {
    tiles: [
      '####################',
      '#......#...........#',
      '#......#...........#',
      '#..................#',
      '#.###......###.....#',
      '#..................#',
      '#.....###..........#',
      '#..................#',
      '#.###..............#',
      '#..................#',
      '#........g.........#',
      '##########.#########',
    ],
    entry: {x:10,y:10},
    npcs: [],
    enemies: [
      {id:'d1',name:'断片の影',x:4,y:7,icon:'♢'},
      {id:'d2',name:'コマンドゴースト',x:14,y:5,icon:'♟',cli:true},
      {id:'d3',name:'記憶の番人',x:11,y:3,icon:'◆'},
      {id:'boss',name:'ゲートガーディアン',x:10,y:1,icon:'♛',boss:true},
    ],
  },
};
