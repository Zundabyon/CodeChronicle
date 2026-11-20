import type { Question } from './content';

// 序幕「海底の古道」ボス、ヘドロの主・スパゲッティ戦。汚いコードを読み解く第一章・第二章の総復習。
// Snippets are not executed. Format follows rangerBattleQuestions.ts (wrong option paired with its reason).
type Wrong = [option: string, reason: string];
let ordinal = 0;
const reasons: Record<string, Record<string, string>> = {};
const battle = (
  id: string, topic: Question['topic'], prompt: string, correct: string, wrongs: [Wrong, Wrong, Wrong],
  explanation: string, code: string, filename = 'ヘドロの主戦 / Laravel', extra: Partial<Question> = {},
): Question => {
  const options = [correct, ...wrongs.map(([option]) => option)];
  const answer = ordinal++ % 4;
  options.splice(answer, 0, options.shift()!);
  reasons[id] = Object.fromEntries(wrongs);
  return {
    id, difficulty: 'intermediate', topic, kind: 'choice', prompt,
    options: options as [string, string, string, string], answer, reveal: correct, explanation,
    code, filename, ...extra,
  };
};

export const hedoroBattleQuestions: Question[] = [
  // 役割を見抜く
  battle('hedoro-1', 'laravel',
    'ヘドロに埋もれたメソッド。名前が消えている。この処理は resource の7つの役割のどれ？',
    'store（新しい行を保存する）',
    [
      ['update（既存の行を書き換える）', 'update なら既存の行を ID で取り出して書き換えます。ここでは new Lamp で新しい行を作っています。'],
      ['create（入力フォームを表示する）', 'create はフォームを返すだけで保存しません。ここでは save() で保存しています。'],
      ['index（一覧を表示する）', 'index は全件を取り出して表示します。この処理は1件を作って保存しています。'],
    ],
    'new で新しいモデルを作り、リクエストの値を入れて save() し、一覧へ戻している。新しい行を保存する store の処理。',
    'public function ???(Request $r){$x=new Lamp;$x->night=$r->night;$x->keeper=$r->keeper;\n  $x->save();return redirect(\'/lamps\');}'),
  battle('hedoro-2', 'laravel',
    'ぐちゃぐちゃな名前のメソッド。中身から見て、7つの役割のどれ？',
    'edit（修正用のフォームを表示する）',
    [
      ['show（1件の詳細を表示する）', 'show も1件を取り出しますが、返すのは詳細画面です。ここでは lamps.edit のフォーム画面を返しています。'],
      ['update（既存の行を書き換える）', 'update ならリクエストの値を入れて保存します。ここには代入も save() もありません。'],
      ['create（新規入力フォームを表示する）', 'create は新しい行用の空のフォームで、既存の行を取り出しません。ここでは $id の行を取り出しています。'],
    ],
    '既存の1件を findOrFail で取り出し、修正フォーム lamps.edit に渡しているだけ。保存はしないので edit。',
    'public function doStuff2($id){ $l = Lamp::findOrFail($id);   // TODO??\n  return view(\'lamps.edit\', [\'lamp\'=>$l]); }'),
  battle('hedoro-3', 'laravel',
    'このメソッドは何をしている？',
    'index（全件の一覧を表示する）',
    [
      ['show（1件の詳細を表示する）', 'show は ID を受け取って1件を取り出します。all() は全件です。'],
      ['destroy（行を削除する）', '変数名が $trash でも、delete() は呼んでいません。全件を取り出して表示しているだけです。'],
      ['store（新しい行を保存する）', 'store は新しい行を作って保存します。ここには new も save() もありません。'],
    ],
    '変数名が $trash でも、all() で全件を取り出して一覧画面に渡しているので index。名前ではなく中身で判断する。',
    'public function x(){ $trash = Lamp::all(); /* ゴミ */ return view(\'lamps.index\',[\'lamps\'=>$trash]); }'),
  // バグを見抜く
  battle('hedoro-4', 'laravel',
    'PATCH /lamps/12 で12番の当番だけを「ミナ」に直したかった。このコードを実行すると表はどうなる？',
    'すべての行の keeper が「ミナ」になる',
    [
      ['12番の行だけが「ミナ」になる', '条件（where や find）で12番に絞っていないので、update は全行に効きます。'],
      ['何も変わらない', 'Lamp::query()->update() は実際に全行を書き換えます。保存忘れではありません。'],
      ['12番の行が削除される', '削除の delete() は呼んでいません。書き換えが全行に及ぶのが問題です。'],
    ],
    '$id を受け取っているのに使っていない。条件なしの一括更新になり、全行の keeper が書き換わる。Lamp::findOrFail($id)->update(...) のように対象を絞る。',
    'public function update(Request $r,$id){ // $id つかってない…\n  Lamp::query()->update([\'keeper\'=>$r->keeper]); return back(); }'),
  battle('hedoro-5', 'laravel',
    '「13番の詳細を見せて」と GET /lamps/13 を開いたのに、いつも違う当番が出る。原因の行は？',
    'Lamp::find(1) と、受け取った $id ではなく1番を取り出している',
    [
      ['view(\'lamps.show\') を返している', '詳細画面の lamps.show を返すのは show として正しい動作です。'],
      ['引数に $id を受け取っている', 'URL の13を受け取るには $id が必要です。問題は受け取った $id を使っていないことです。'],
      ['save() を呼んでいない', 'show は表示だけなので保存は不要です。保存忘れはこのバグの原因ではありません。'],
    ],
    '$id を受け取っているのに find(1) と固定の番号で取り出している。別IDの show になる。Lamp::findOrFail($id) にする。',
    'public function show($id){ $lamp=Lamp::find(1);//$lamp=Lamp::find($id);\n  return view(\'lamps.show\',compact(\'lamp\')); }'),
  battle('hedoro-6', 'laravel',
    '32番の重複行だけを消したかった。このコードを実行するとどうなる？',
    'loans の行がすべて消える',
    [
      ['32番だけが消える', 'where で32番に絞っていないので、delete() は全行に効きます。'],
      ['32番がゴミ箱に移り、あとで戻せる', 'SoftDeletes なしの表なので、消した行は戻りません。そもそも全行が対象です。'],
      ['何も消えない', 'Loan::query()->delete() は実際に全行を削除します。'],
    ],
    '$id を受け取っても使わず、対象を絞らない削除になっている。消したものは戻らない。Loan::findOrFail($id)->delete() にする。',
    '// loans（SoftDeletes なし）\npublic function destroy($id){ Loan::query()->delete(); /* 32だけ…のはず */ return redirect(\'/loans\'); }'),
  battle('hedoro-7', 'laravel',
    '新しい在庫を登録したのに、一覧に増えていない。原因は？',
    'save() を呼んでいないので、データベースに保存されていない',
    [
      ['new Item で作る書き方が間違っている', 'new でモデルを作り、値を入れるところまでは正しい書き方です。最後の保存が抜けています。'],
      ['redirect で一覧に戻っているから', '保存後に一覧へ戻るのは store の普通の流れです。戻る前に保存していないのが問題です。'],
      ['$r->name の値が届いていないから', '値は代入されています。代入した値をデータベースへ書き込む save() がありません。'],
    ],
    'モデルに値を入れただけでは保存されない。$i->save() を呼んで初めて行が増える。保存忘れ。',
    'public function store(Request $r){ $i=new Item; $i->name=$r->name;\n  $i->stock=$r->stock; /* $i->save(); */ return redirect(\'/items\'); }'),
  battle('hedoro-8', 'laravel',
    'このコードで、名前が空の在庫が登録されてしまう。どこが抜けている？',
    '$r->validate([...]) で入力を検証していない',
    [
      ['save() を呼んでいない', 'save() は呼ばれているので行は保存されます。保存はされるのに、空でも通ってしまうのが問題です。'],
      ['redirect を返していない', 'redirect は返しています。空の名前を止めるのは検証の役目です。'],
      ['対象を ID で絞っていない', 'store は新しい行を作るので ID で絞りません。必要なのは入力の検証です。'],
    ],
    '検証（validate）がないので空の name でもそのまま保存される。$r->validate([\'name\'=>\'required\']) のように保存前に確かめる。',
    'public function store(Request $r){ /* チェック？あとで */ $i=new Item;\n  $i->name=$r->name; $i->stock=$r->stock; $i->save(); return redirect(\'/items\'); }'),
  // ルート
  battle('hedoro-9', 'laravel',
    'ヘドロまみれのルート定義。Route::resource(\'lamps\', ...) と同じ動きにするには、PUT /lamps/{id} が呼ぶべきメソッドはどれ？',
    'update',
    [
      ['store', 'store は番号なしの POST /lamps です。番号付きの PUT は既存の行の書き換えです。'],
      ['edit', 'edit は GET /lamps/{id}/edit でフォームを開くだけです。PUT で書き換えるのは update です。'],
      ['show', 'show は GET /lamps/{id} で詳細を表示します。PUT は書き換えの update です。'],
    ],
    'resource では PUT/PATCH /lamps/{id} が update。このルート定義は destroy を割り当てていて、更新のつもりが削除になる。',
    "Route::get('/lamps',[LampController::class,'index']);Route::post('/lamps',[LampController::class,'store']);\nRoute::put('/lamps/{id}',[LampController::class,'destroy']); // ←ここ"),
  // 第一章の基礎（フロント）
  battle('hedoro-10', 'frontend',
    'ボタンを押しても数字が増えない React のコード。直し方は？',
    'count++ ではなく setCount(count + 1) で更新する',
    [
      ['useState をやめて let count = 0 にする', '普通の変数は変えても再描画されません。画面に反映するには state とその setter が必要です。'],
      ['count を props で受け取る', 'props は親から渡される読み取り専用の値で、子が書き換えるものではありません。'],
      ['onClick を onclick に書き換える', 'JSX のイベントは onClick と書きます。問題はイベント名ではなく、state の更新方法です。'],
    ],
    'state を直接 count++ で書き換えても React は再描画しない。setter の setCount で新しい値を渡す。',
    'const [count,setCount]=useState(0)\nreturn <button onClick={()=>{count++}}>{count}</button>',
    'ヘドロの主戦 / React', { track: 'react' }),
  battle('hedoro-11', 'frontend',
    '子コンポーネントが、親から受け取った title を書き換えようとしている。Vue で正しい考え方は？',
    'props は読み取り専用なので、親に変更を伝えて親の値を変える',
    [
      ['props.title に直接代入すれば親の値も変わる', 'props は子から書き換えないものです。Vue は警告を出し、親の値も変わりません。'],
      ['props を使わず子で title を ref で作り直せば親も変わる', '子で作った ref は子だけの値です。親の title とはつながりません。'],
      ['defineProps を2回書けば書き換えられる', 'defineProps を何回書いても props は読み取り専用のままです。'],
    ],
    'props は親から子への一方向。子は emit で親に伝え、親が自分の state を変える。',
    "<script setup>\nconst props=defineProps(['title'])\nfunction fix(){ props.title='直した' } // ???\n</script>",
    'ヘドロの主戦 / Vue', { track: 'vue' }),
  // 混合：一見 update に見えて実は別ID
  battle('hedoro-12', 'laravel',
    'PATCH /items/22 で灯油の在庫を直したのに、薪の行が書き換わった。原因は？',
    '$id ではなく $r->id（フォームの隠し値）で行を取り出している',
    [
      ['update ではなく store を使っている', 'メソッドは既存の行を取り出して書き換えているので update の処理です。取り出す番号が違うのが問題です。'],
      ['save() を呼んでいない', 'save() は呼ばれているので書き換えは保存されています。保存された行が違うのが問題です。'],
      ['対象を絞らず全行を書き換えている', 'findOrFail で1件に絞っています。ただし URL の22ではなくフォームの値の行です。'],
    ],
    'URL の {id}（22）を受け取りながら、フォームから来た $r->id で取り出しているため別の行を書き換えた。Item::findOrFail($id) で URL の番号を使う。',
    '// items: 22 灯油 / 23 薪。フォームの隠し値 id には 23 が残っていた\npublic function update(Request $r,$id){ $i=Item::findOrFail($r->id);\n  $i->stock=$r->stock; $i->save(); return back(); }'),
];

export const hedoroBattleSet: string[] = hedoroBattleQuestions.map(({ id }) => id);
export const hedoroBattleReasons: Record<string, Record<string, string>> = reasons;
