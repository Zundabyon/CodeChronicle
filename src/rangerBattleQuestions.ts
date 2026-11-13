import type { Question } from './content';

// Original examples for Laravel's ordinary web Route::resource. Snippets are not executed.
// Each wrong option is paired with its reason, so the reason key always matches the option text exactly.
type Wrong = [option: string, reason: string];
let ordinal = 0;
const reasons: Record<string, Record<string, string>> = {};
const battle = (
  id: string, prompt: string, correct: string, wrongs: [Wrong, Wrong, Wrong], explanation: string,
  code?: string, filename = '悪レンジャー戦 / Laravel',
): Question => {
  const options = [correct, ...wrongs.map(([option]) => option)];
  const answer = ordinal++ % 4;
  options.splice(answer, 0, options.shift()!);
  reasons[id] = Object.fromEntries(wrongs);
  return {
    id, difficulty: 'intermediate', topic: 'laravel', kind: 'choice', prompt,
    options: options as [string, string, string, string], answer, reveal: correct, explanation,
    ...(code ? { code, filename } : {}),
  };
};

const lampTable = '// lamp_duties（灯り当番表。id は主キー）\n// id | night  | keeper\n// 11 | 一日目 | ダン\n// 12 | 二日目 | ミナ\n// 13 | 三日目 | ユナ\n// 14 | 四日目 | ユナ';
const innTable = '// reservations（宿の予約。id は主キー）\n// id | guest | nights\n// 5  | カイ  | 2\n// 6  | リオ  | 1';
const stockTable = '// items（倉庫の在庫。id は主キー）\n// id | name | stock\n// 21 | 小麦 | 8\n// 22 | 灯油 | 3\n// 23 | 薪   | 12';
const loanTable = '// loans（貸し出し記録。id は主キー。SoftDeletes なし）\n// id | item   | borrower\n// 31 | 釣り竿 | ダン\n// 32 | 釣り竿 | ダン   ← 控えと照合済みの重複\n// 33 | 角灯   | ミナ\n// 34 | 毛布   | ユナ';
const postTable = '// posts（掲示板。id は主キー）\n// id | title          | user_id\n// 71 | 宿の修理人募集 | 6\n// 86 | 焚火の講習     | 9';

export const rangerBattleQuestions: Question[] = [
  // 2-1 Read：ノゾミ・ブルーと灯り当番表。記録は変えず、見せる行を取り違えさせる。
  battle('ranger-r-1',
    'ノゾミが「今夜（二日目）の当番はこれだよ」と言い、GET /lamp-duties/13 の画面を見せた。何が起きた？',
    '13番の詳細を見せただけで、当番表は変わっていない',
    [
      ['13番の当番を12番の内容へ書き換えた', '書き換えるなら PUT/PATCH の update が必要です。GET で詳細を開くのは show で、行の中身は変わりません。'],
      ['12番の行を当番表から消した', '削除は DELETE の destroy です。GET /lamp-duties/13 は13番を表示するだけで、12番には触れていません。'],
      ['当番表の一覧を表示した', '一覧の index は番号なしの GET /lamp-duties です。URLに13が付いているので、1件の詳細を見せる show です。'],
    ],
    'URLの番号が詳細表示の対象を決める。二日目は12番なのに13番（三日目）の show を見せたので、見せる行を取り違えさせただけ。show は読み取りなので、当番表の4行はそのまま残っている。'),
  battle('ranger-r-2',
    '二日目の当番は12番だと分かった。12番の1件だけを、正しく詳しく確かめるリクエストは？',
    'GET /lamp-duties/12 → show',
    [
      ['GET /lamp-duties → index', 'index は全件の一覧です。12番だと分かっていて1件だけを詳しく見たいなら、番号付きの show を使います。'],
      ['PATCH /lamp-duties/12 → update', 'update は送った値で行を書き換える操作です。確かめるだけなのに書き換える必要はありません。'],
      ['GET /lamp-duties/12/edit → edit', 'edit は修正用のフォームを開く段階です。直すつもりがなく、中身を読むだけなら show です。'],
    ],
    '主キーが分かっている1件の詳細は GET /lamp-duties/12 の show。一覧の index、修正フォームの edit、書き換えの update と取り違えない。'),
  battle('ranger-r-3',
    'ノゾミがでたらめな番号ばかり言うので、どの日が何番か分からない。四日分を並べて見比べるリクエストは？',
    'GET /lamp-duties → index',
    [
      ['GET /lamp-duties/1 → show', '1番は当番表に存在しません。番号が分からないのに番号を当て推量で引くのは、ノゾミと同じ取り違えです。まず一覧で確かめます。'],
      ['GET /lamp-duties/create → create', 'create は新しい当番を書き込むフォームです。既にある四日分を見比べたいので一覧の index です。'],
      ['POST /lamp-duties → store', 'store は新しい行を保存します。見比べるだけなのに当番表へ行を増やしてしまいます。'],
    ],
    '番号が分からないときは、まず番号なしの GET で index を開き、一覧で日付とIDを確かめてから show で1件を見る。存在しないIDを推測で引くと取り違えのもとになる。'),
  battle('ranger-r-4',
    'ノゾミがこの show を何十回も開いて笑っている。当番表はどうなった？',
    '4行とも元のまま。表示しただけで何も変わらない',
    [
      ['13番の行が、開いた回数だけ複製される', '行を増やすのは保存（store など）です。findOrFail は1件を探して取り出すだけで、複製はしません。'],
      ['開いた13番の行が当番表から消える', 'view へ渡すのは表示のためです。delete を呼んでいないので、行は消えません。'],
      ['13番の keeper が開いた人の名前に書き換わる', 'このコードには代入も save もありません。読み取りを何度くり返しても中身は書き換わりません。'],
    ],
    'findOrFail は主キーで1件を取り出し、view は画面へ値を渡すだけ。どちらも保存・更新・削除をしないので、何回開いてもデータは変わらない。困りごとは「見せる行を取り違えたこと」で、記録そのものは無事。',
    `${lampTable}\n$duty = LampDuty::findOrFail(13);\nreturn view('lamp-duties.show', ['duty' => $duty]);`),
  battle('ranger-r-5',
    'ノゾミは first() の結果だけを見せて「ユナの当番は一回だけ」と言った。ユナの当番をすべて並べる取得は？',
    "LampDuty::where('keeper', 'ユナ')->get()",
    [
      ["LampDuty::where('keeper', 'ユナ')->first()", 'first は条件に合う最初の1件だけを返します。ノゾミが見せたのと同じで、14番が漏れます。'],
      ['LampDuty::find(13)', 'find は主キーで1件を探します。13番だけなので、同じユナの14番は含まれません。'],
      ['LampDuty::count()', 'count は件数を数えるだけで、しかも条件がないので当番表全体の4を返します。ユナの行は並びません。'],
    ],
    'where で keeper がユナの行に絞り、get で該当する全行（13番と14番）を取り出す。first は最初の1件、find は主キーの1件、count は件数。どれも読み取りで、当番表は変わらない。',
    `${lampTable}\n$first = LampDuty::where('keeper', 'ユナ')->first(); // ノゾミが見せたもの`),

  // 2-2 Create：ツクネ・アンバーと宿の予約。検証のない store。
  battle('ranger-c-1',
    'guest と nights の列は空でも保存できる設定。ツクネが guest を空のまま、この store へ3回送った。何が起きた？',
    '名前のない予約が3件増え、予約は5件になった',
    [
      ['空の予約は自動で拒否され、予約は2件のまま', 'Laravel は検証を書かない限り空の入力を拒否しません。このコードには validate がないので、そのまま save されます。'],
      ['既存の5番と6番の guest が空に書き換わった', 'new Reservation() は新しい行を作ります。既存の行を取り出して代入していないので、カイとリオの予約は変わりません。'],
      ['最後の1件だけが残り、予約は3件になった', 'save は送信ごとに新しい行を1件ずつ追加します。前の送信分を消す処理はありません。'],
    ],
    '検証のない store は、送られた値をそのまま新しい行として保存する。3回送れば名前のない予約が3件増える。既存行の更新でも上書きでもない。',
    `${innTable}\n$reservation = new Reservation();\n$reservation->guest = $request->input('guest');\n$reservation->nights = $request->input('nights');\n$reservation->save();`),
  battle('ranger-c-2',
    '名前のない予約をこれ以上作らせないため、この store をどう直す？',
    '保存の前に guest と nights を required で検証する',
    [
      ['保存した後で、guest が空かどうかを確かめる', '確かめる前に save してしまうので、空の予約は既に増えています。検証は保存の前に置きます。'],
      ['create のフォームに「名前は必須」と書き足すだけ', 'フォームの注意書きは送信を止めません。POST /reservations へ直接送ればすり抜けるので、サーバー側の store で検証します。'],
      ['空の予約を見つけるたびに、後から destroy する', '後片付けでは偽の予約が作られること自体を止められません。入口の store で受け付けないようにします。'],
    ],
    "$request->validate(['guest' => ['required', 'string'], 'nights' => ['required', 'integer', 'min:1']]) を save の前に置くと、必須項目が欠けた送信は保存まで進まない。フォームの表示や事後の削除では防げない。",
    `${innTable}\npublic function store(Request $request)\n{\n    // ここに何を置く？\n    $reservation = new Reservation();\n    $reservation->guest = $request->input('guest');\n    $reservation->nights = $request->input('nights');\n    $reservation->save();\n}`),
  battle('ranger-c-3',
    '旅人が予約を書き込むために、空の入力欄の画面を開きたい。まだ何も送信しない。対応するリクエストは？',
    'GET /reservations/create → create',
    [
      ['POST /reservations → store', 'store は入力を送信して保存する段階です。まだ何も書いていないので、先にフォームを開く create です。'],
      ['GET /reservations → index', 'index は予約の一覧です。新しい予約を書き込む入力欄は表示されません。'],
      ['GET /reservations/5/edit → edit', 'edit は5番の既存予約を直すフォームです。カイの予約が入った欄が開き、新しい予約には使えません。'],
    ],
    '新規の入力欄を開くのは GET /reservations/create の create、送信して保存するのが POST /reservations の store。create を開いただけでは予約は増えない。'),
  battle('ranger-c-4',
    '検証を入れた store へ、旅人が guest=ソウ、nights を空にして送った。結果は？',
    '検証で止まり、予約は2件のまま。入力の書き直しへ戻る',
    [
      ['nights が空のまま保存され、予約は3件になる', 'nights は required なので空は通りません。検証に失敗すると、その後の save へ進みません。'],
      ['nights を0で補って保存し、予約は3件になる', '検証は足りない値を補いません。不足を見つけたら止めて、送り直しを求めます。'],
      ['検証で止まり、既存の5番と6番も取り消される', '検証の失敗は今回の送信を止めるだけです。既存の予約を消す処理はありません。'],
    ],
    '通常の画面からの送信で validate が失敗すると、Laravel は元のフォームへ戻してエラーを表示し、save には進まない。既存の予約はそのまま残る。必須項目の検証は、入力の欠けた行を作らせないための門番。',
    `${innTable}\n$data = $request->validate([\n    'guest' => ['required', 'string'],\n    'nights' => ['required', 'integer', 'min:1'],\n]);\n$reservation = new Reservation();\n$reservation->guest = $data['guest'];\n$reservation->nights = $data['nights'];\n$reservation->save();`),
  battle('ranger-c-5',
    '宿守のダンが「5番の予約がツクネの偽物でないか、中身だけ確かめたい」と言う。対応するリクエストは？',
    'GET /reservations/5 → show',
    [
      ['POST /reservations → store', 'store は新しい予約を保存します。確かめたいだけなのに予約が1件増えてしまいます。'],
      ['GET /reservations/create → create', 'create は新規予約の入力欄です。5番の中身は表示されません。'],
      ['GET /reservations → index', 'index は全件の一覧です。5番と分かっている1件の中身を詳しく見るなら show です。'],
    ],
    '番号の分かっている1件を読むのは、第一幕で学んだ show。Create の幕でも、読むだけの場面では保存の操作を選ばない。show では予約は変わらない。'),

  // 2-3 Update：ヌリエ・ジェイドと倉庫の在庫。条件のない一括更新。
  battle('ranger-u-1',
    'ヌリエが「全部同じ数がかわいい」と言って、このコードを実行した。何が起きた？',
    '3行すべての在庫が99になった',
    [
      ['最初の小麦だけが99になった', 'query()->update は条件で絞っていないので、1件ではなく全行が対象になります。'],
      ['在庫99の新しい行が1件増えた', 'update は既存の行を書き換えます。行を増やすのは store などの新規保存です。'],
      ['画面の表示だけ99になり、DBは元のまま', 'update はDBの行を書き換える命令です。表示だけの変更ではありません。'],
    ],
    '条件のない update は、テーブルの全行を同じ値に書き換える。小麦・灯油・薪の在庫がすべて99になり、元の数は分からなくなる。直すときは対象を1行に絞る。',
    `${stockTable}\nItem::query()->update(['stock' => 99]);`),
  battle('ranger-u-2',
    'ヌリエに塗り替えられた後。倉庫番の帳面によると、灯油（22番）の本当の在庫は3。22番だけを正しく直す処理は？',
    'Item::findOrFail(22) で取り出し、stock に3を代入して save する',
    [
      ["Item::query()->update(['stock' => 3]) を実行する", 'ヌリエと同じ条件のない一括更新です。小麦と薪まで3になってしまいます。'],
      ['new Item() に name=灯油、stock=3 を入れて save する', '新しい行が増えるだけで、22番の99は残ります。灯油の行が二つになります。'],
      ['Item::findOrFail(22) で取り出し、view へ渡す', '取り出して表示するだけでは書き換わりません。代入と save が必要です。'],
    ],
    '主キーで対象の1行を取り出し、値を代入して save すれば、その行だけが更新される。条件のない update は全行、new は新規行、view は表示だけ。',
    `${stockTable.replace(/\| \d+$/gm, '| 99')}`),
  battle('ranger-u-3',
    '灯油を直す前に、今の在庫が入った修正フォームを開いて中身を確かめたい。対応するリクエストは？',
    'GET /items/22/edit → edit',
    [
      ['PATCH /items/22 → update', 'update はフォームを送信して保存する段階です。まだ中身を確かめているところなので、先に edit で開きます。'],
      ['GET /items/22 → show', 'show は詳細を読む画面です。直すための入力欄は付きません。修正フォームは edit です。'],
      ['GET /items/create → create', 'create は新しい品目を登録する空のフォームです。22番の今の在庫は入っていません。'],
    ],
    '既存の行を直すときは、GET /items/22/edit の edit で今の値が入ったフォームを開き、送信を PUT/PATCH /items/22 の update で受ける。edit を開いただけでは在庫は変わらない。'),
  battle('ranger-u-4',
    '倉庫に新しく塩が届いた。在庫表にまだ塩の行はない。入力し終えたフォームを送信するリクエストは？',
    'POST /items → store',
    [
      ['PATCH /items/21 → update', '21番は小麦の行です。update で送ると小麦が塩に塗り替えられ、ヌリエと同じ被害になります。'],
      ['GET /items/create → create', 'create は入力欄を開く段階です。もう入力し終えて送信するので store です。'],
      ['PATCH /items/23 → update', '23番は薪の行です。まだない品目を既存の行へ上書きすると、薪の記録が失われます。'],
    ],
    'まだない行を加えるのは第二幕の store。既存の行を書き換える update とは使い分ける。直す操作を学んだ後でも、新しい品目を既存の行へ上書きしない。'),
  battle('ranger-u-5',
    'ヌリエの一括更新で3行とも99になった後、この処理を実行した。在庫表はどうなる？',
    '灯油だけ3に戻り、小麦と薪は99のまま',
    [
      ['3行すべてが元の在庫に戻る', 'findOrFail(22) で取り出した1行だけを save しています。ほかの行は、それぞれ同じように直す必要があります。'],
      ['在庫3の灯油の行が増え、22番は99のまま', 'findOrFail で取り出した既存の行に代入して save しているので、新しい行は作られません。'],
      ['22番が消えて、在庫3の行に置き換わる', '削除の処理はありません。同じ22番の行の stock だけが書き換わります。'],
    ],
    'IDを指定した update は対象の1行だけを直す。だからこそ、一括で塗り替えられた残りの行も、正しい値を確かめて1行ずつ直していく。',
    `${stockTable.replace(/\| \d+$/gm, '| 99')}\n$item = Item::findOrFail(22);\n$item->stock = 3;\n$item->save();`),

  // 2-4 Delete：ケシ・パープルと貸し出し記録。対象を絞らない削除。
  battle('ranger-d-1',
    'ケシが「重複を消すと静かになる」と言い、このコードを実行しようとしている。実行したら何が起きる？',
    '貸し出し記録が4件すべて消える',
    [
      ['重複している32番だけが消える', 'query()->delete には条件がありません。重複かどうかを見分ける処理はなく、全行が対象になります。'],
      ['最初の31番だけが消える', 'delete は1件で止まりません。条件で絞らない限り、テーブルの全行を消します。'],
      ['記録は消えず、画面から見えなくなるだけ', 'この表は SoftDeletes を使っていません。delete は行そのものを消します。'],
    ],
    '条件のない delete は、重複の32番だけでなく正しい記録まで全部消す。消す前に対象を1件に絞るのが肝心。',
    `${loanTable}\nLoan::query()->delete();`),
  battle('ranger-d-2',
    '控えと照合して、32番がダンの重複だと確かめた。重複だけを取り除く操作は？',
    'DELETE /loans/32 で32番だけを destroy する',
    [
      ['DELETE /loans/31 で31番を destroy する', '31番も32番も中身は同じですが、照合で重複と確かめたのは32番です。確かめた番号と違う行を消してはいけません。'],
      ["Loan::where('item', '釣り竿')->delete() を実行する", '釣り竿の行は31番と32番の二つです。両方消え、ダンの正しい記録まで失われます。'],
      ['PATCH /loans/32 で borrower を空にする', 'update で中身を空にしても行は残ります。空の記録が一件増えたのと同じで、重複は解消しません。'],
    ],
    '照合で確かめた重複のIDを指定して destroy すれば、その1行だけが消える。品目の条件では正しい行まで巻き込み、update で空にしても行は残る。'),
  battle('ranger-d-3',
    'ケシが34番（毛布・ユナ）を消してしまった。SoftDeletes はなく、紙の控えは残っている。正しい対応は？',
    '消した行は戻らないので、控えを見て新しい記録として store し直す',
    [
      ['GET /loans/34 を開けば、消えた記録が表示されて戻る', 'show は既にある行を読むだけです。行がないので見つからず、元にも戻りません。'],
      ['PATCH /loans/34 で中身を書き戻せば復活する', 'update は既にある行を書き換える操作です。34番の行はもうないので、書き換える相手がいません。'],
      ['もう一度 DELETE /loans/34 を送ると取り消しになる', 'destroy に取り消しの働きはありません。消えた行をもう一度消そうとしても、見つからないだけです。'],
    ],
    'destroy で消した行は、操作を重ねても戻らない。残っている控えをもとに、新しい行として store し直すしかない。だから消す前の照合が大事になる。'),
  battle('ranger-d-4',
    '消す前に、32番が本当にダンの釣り竿の重複か、その1件の中身を確かめたい。対応するリクエストは？',
    'GET /loans/32 → show',
    [
      ['DELETE /loans/32 → destroy', '確かめる前に消してしまいます。消したものは戻らないので、中身の確認は消す前に済ませます。'],
      ['GET /loans/32/edit → edit', 'edit は中身を直すためのフォームです。直すつもりはなく、読むだけなら show です。'],
      ['PATCH /loans/32 → update', 'update は中身を書き換えます。確かめるだけの場面で記録を変えてはいけません。'],
    ],
    '1件の中身を読むのは GET の show で、記録は変わらない。消す前に show で中身を確かめ、控えと照合してから destroy する。'),
  battle('ranger-d-5',
    '33番の借り手は「ミナ」ではなく「ミナト」だったと分かった。角灯を貸した事実は残す。修正を送信するリクエストは？',
    'PATCH /loans/33 → update',
    [
      ['DELETE /loans/33 → destroy', '貸した事実は残すので、消すのは誤りです。名前の書き間違いは update で直します。'],
      ['POST /loans → store', '新しい行が増え、角灯の貸し出しが二重に記録されます。既存の33番を直すのが目的です。'],
      ['GET /loans/33/edit → edit', 'edit は修正フォームを開く段階です。修正内容を送信して保存するのは update です。'],
    ],
    '記録を残したまま中身だけを直すのは第三幕の update。消す destroy、増やす store、フォームを開く edit と取り違えない。'),

  // 最終戦：記録卿グラフィウスと掲示板。七役割と「データは変わらない」の判断。
  battle('graphius-1',
    'グラフィウスが「読むたびに帳簿は私のものになる」と言い、GET /posts を何度も送った。index が一覧を表示するだけの処理なら、posts は？',
    '2件とも変わらない。一覧を表示しただけ',
    [
      ['2件の user_id が、送った者のidに書き換わる', '一覧の表示には代入も save もありません。読み取りで投稿者は書き換わりません。'],
      ['送った回数だけ投稿が複製される', '行を増やすのは POST /posts の store です。GET の index は増やしません。'],
      ['古い71番から順に消えていく', '削除は DELETE の destroy です。一覧を開いても投稿は消えません。'],
    ],
    'GET /posts の index は一覧を表示する読み取り。何度送ってもDBの2件は変わらない。読むことと書き換えることを分けて考える。',
    postTable, '最終戦 / Laravel'),
  battle('graphius-2',
    '86番「焚火の講習」の本文を詳しく読みたい。対応するリクエストは？',
    'GET /posts/86 → show',
    [
      ['GET /posts → index', 'index は全件の一覧です。86番1件の本文を詳しく読むなら show です。'],
      ['GET /posts/86/edit → edit', 'edit は86番を直すフォームです。読むだけなら show です。'],
      ['PATCH /posts/86 → update', 'update は86番を書き換えます。読むだけの場面で記録を変えてはいけません。'],
    ],
    '番号付きの GET は show、末尾に /edit が付けば edit。読むだけなら show を選び、DBは変わらない。',
    postTable, '最終戦 / Laravel'),
  battle('graphius-3',
    'グラフィウスが「新規投稿」ボタンの行き先を GET /posts/71/edit へすり替えた。押すと何が起き、本来の行き先は？',
    '71番の編集フォームが開く。本来は GET /posts/create → create',
    [
      ['どちらでも空のフォームが開くので問題ない', 'edit は既存の71番の内容が入ったフォームです。新規用の空のフォームは create です。'],
      ['71番がその場で削除される。本来は GET /posts/create', 'GET で開くだけでは削除されません。削除は DELETE の destroy です。'],
      ['新しい投稿が保存される。本来は POST /posts', 'フォームを開いただけでは保存されません。また、空の入力欄を出す本来の行き先は POST ではなく GET /posts/create です。'],
    ],
    '新規の入力欄は GET /posts/create の create、既存投稿の修正フォームは GET /posts/{id}/edit の edit。どちらも開いただけではDBは変わらないが、新規のつもりで71番を直すと別の投稿を書き換えてしまう。',
    postTable, '最終戦 / Laravel'),
  battle('graphius-4',
    'ログイン中の利用者は6。グラフィウスが送信に user_id=9 を紛れ込ませ、title=薬草の採取 で POST /posts を送らせた。処理は成功する。結果は？',
    '投稿が1件増えて3件になり、新しい投稿の user_id は6',
    [
      ['投稿が1件増えて3件になり、新しい投稿の user_id は9', 'user_id は送信値ではなく、ログイン中の利用者 $request->user()->id から入れています。紛れ込ませた9は使われません。'],
      ['86番（user_id=9）のタイトルが「薬草の採取」に変わる', 'new Post() は新しい行を作ります。既存の86番を取り出していないので、86番は変わりません。'],
      ['検証で止まり、投稿は2件のまま', 'title は空でない文字列なので required を通ります。検証に失敗する入力ではありません。'],
    ],
    'store は検証した title と、サーバーが知っているログイン中の利用者のidで新しい行を作る。送信に紛れた値をそのまま使わないので、投稿者を偽れない。既存の2件は変わらない。',
    `${postTable}\n$data = $request->validate(['title' => ['required', 'string']]);\n$post = new Post();\n$post->title = $data['title'];\n$post->user_id = $request->user()->id;\n$post->save();`, '最終戦 / Laravel'),
  battle('graphius-5',
    '投稿者9が GET /posts/86/edit を開き、欄に「記録卿の講習」と打ち込んだ。まだ送信していない。86番のタイトルは？',
    '「焚火の講習」のまま。保存は送信後の update が担う',
    [
      ['「記録卿の講習」に変わっている', '欄に打ち込んだだけではサーバーへ届いていません。保存は PUT/PATCH /posts/86 の update で行います。'],
      ['欄の内容に関係なく、タイトルが空になる', 'edit はフォームを表示するだけです。開いたことで投稿の中身が消えることはありません。'],
      ['新しい投稿「記録卿の講習」が1件増えている', '行を増やすのは store です。edit のフォームを開いても、送信していないので何も保存されません。'],
    ],
    'edit は今の値が入ったフォームを表示する段階で、DBは変わらない。送信して PUT/PATCH /posts/86 の update が成功したときに初めて書き換わる。',
    postTable, '最終戦 / Laravel'),
  battle('graphius-6',
    'グラフィウスが「PUT で送った修正は update に届かない」と言った。Route::resource を登録済みのとき、PUT /posts/71 を受けるのは？',
    'update（PUT と PATCH のどちらも update が受ける）',
    [
      ['store（PUT は新規保存に使う）', 'store は番号なしの POST /posts です。番号付きの PUT は既存の71番を更新する update です。'],
      ['edit（PUT は修正フォームを開く）', 'edit は GET /posts/71/edit です。フォームを開くのは GET で、PUT は送信した修正の保存です。'],
      ['どの役割も受けず、受け付けられない', 'Route::resource は PUT と PATCH の両方を update へ割り当てます。グラフィウスの言うことは誤りです。'],
    ],
    'Route::resource の標準では PUT/PATCH /posts/{post} が update。POST /posts の store、GET /posts/{post}/edit の edit と、HTTPメソッドとURLの組で見分ける。',
    `${postTable}\nRoute::resource('posts', PostController::class);`, '最終戦 / Laravel'),
  battle('graphius-7',
    '利用者6が、募集を終えた自分の71番を削除したい。自分の投稿だけ削除でき、SoftDeletes はない。正しいリクエストと結果は？',
    'DELETE /posts/71 → destroy。71番だけが消え、86番は残る',
    [
      ['GET /posts/71 → show。開けば71番が消える', 'show は1件を読むだけで、記録は変わりません。削除は DELETE の destroy です。'],
      ['DELETE /posts/86 → destroy。86番が消える', '86番は利用者9の投稿で、消したいのは71番です。番号を取り違えると、他人の投稿を消そうとしてしまいます。'],
      ['PATCH /posts/71 → update。タイトルを空にすれば削除と同じ', 'update で空にしても行は残ります。削除したいなら destroy です。'],
    ],
    '対象のIDを指定した DELETE の destroy で、その1件だけを消す。消した行は戻らないので、番号と持ち主を確かめてから送る。show は読むだけ、update は書き換えで、どちらも削除ではない。',
    postTable, '最終戦 / Laravel'),
];

export const rangerBattleSets: Record<'r' | 'c' | 'u' | 'd' | 'graphius', string[]> = {
  r: ['ranger-r-1', 'ranger-r-2', 'ranger-r-3', 'ranger-r-4', 'ranger-r-5'],
  c: ['ranger-c-1', 'ranger-c-2', 'ranger-c-3', 'ranger-c-4', 'ranger-c-5'],
  u: ['ranger-u-1', 'ranger-u-2', 'ranger-u-3', 'ranger-u-4', 'ranger-u-5'],
  d: ['ranger-d-1', 'ranger-d-2', 'ranger-d-3', 'ranger-d-4', 'ranger-d-5'],
  graphius: ['graphius-1', 'graphius-2', 'graphius-3', 'graphius-4', 'graphius-5', 'graphius-6', 'graphius-7'],
};

export const rangerBattleReasons: Record<string, Record<string, string>> = reasons;
