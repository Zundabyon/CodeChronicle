import type { Question } from './content';

// 第四章導入「王都の関所街」四天王・道化師エヌコイールイーチ戦。第三章（1対多）のふり返りと、N+1問題・with によるEager Loading。
// Snippets are not executed. Format follows hedoroBattleQuestions.ts (wrong option paired with its reason).
type Wrong = [option: string, reason: string];
let ordinal = 0;
const reasons: Record<string, Record<string, string>> = {};
const battle = (
  id: string, prompt: string, correct: string, wrongs: [Wrong, Wrong, Wrong],
  explanation: string, code: string, difficulty: Question['difficulty'] = 'intermediate',
): Question => {
  const options = [correct, ...wrongs.map(([option]) => option)];
  const answer = ordinal++ % 4;
  options.splice(answer, 0, options.shift()!);
  reasons[id] = Object.fromEntries(wrongs);
  return {
    id, difficulty, topic: 'laravel', kind: 'choice', prompt,
    options: options as [string, string, string, string], answer, reveal: correct, explanation,
    code, filename: '道化師戦 / Laravel',
  };
};

export const clownBattleQuestions: Question[] = [
  // 1対多のふり返り
  battle('clown-1',
    '依頼（Quest）は一人の村人（Villager）が出したもの。Quest モデルから依頼主をたどるメソッドの中身は？',
    'return $this->belongsTo(Villager::class);',
    [
      ['return $this->hasMany(Villager::class);', 'hasMany は「一人が多くを持つ」側、つまり Villager から Quest をたどるときに使います。依頼から見た依頼主は一人です。'],
      ['return $this->hasOne(Quest::class);', 'hasOne は親から子を1件たどる関係で、相手も Quest ではなく Villager です。'],
      ['return Villager::find($this->id);', '$this->id は依頼自身の番号です。依頼主の番号は villager_id に入っているので、別の村人を取り出してしまいます。'],
    ],
    '子（quests）が villager_id を持ち、親（villagers）を指す。子から親をたどるのは belongsTo。',
    "// quests: id, villager_id, title\nclass Quest extends Model\n{\n    public function villager()\n    {\n        ???\n    }\n}",
    'beginner'),
  battle('clown-2',
    '村人 Rio が出した依頼をすべて表示したい。Villager に quests() が定義されているとき、$rio->quests が返すものは？',
    'Rio の villager_id を持つ依頼のコレクション（複数件）',
    [
      ['Rio の最初の依頼1件だけ', 'hasMany は該当する子をすべて返します。1件だけになるのは hasOne や first() を使った場合です。'],
      ['quests テーブルの全件', 'リレーションは villager_id が Rio の id と一致する行に絞って取り出します。'],
      ['クエリビルダ（まだ取り出していない問い合わせ）', 'メソッド呼び出しの $rio->quests() ならビルダですが、括弧なしのプロパティはデータを取り出した結果を返します。'],
    ],
    'hasMany のプロパティ $rio->quests は、外部キー villager_id が Rio の id と一致する行を Collection で返す。',
    "class Villager extends Model\n{\n    public function quests()\n    {\n        return $this->hasMany(Quest::class);\n    }\n}\n\n$rio = Villager::where('name', 'Rio')->first();\n$rio->quests;"),
  battle('clown-3',
    '道具の注文（Order）は一人の村人（user）のもの。$order->user->name が返すものは？',
    'その注文をした村人の名前（文字列）',
    [
      ['その村人が出した注文すべての名前', '$order->user は belongsTo なので村人1人のモデルです。その name は1つの文字列です。'],
      ['注文の user_id（数値）', 'user_id は orders 側の列です。->user で村人モデルをたどり、その name 列を読んでいます。'],
      ['users テーブルの全員の名前', 'リレーションは注文の user_id が指す1人だけを取り出します。'],
    ],
    '$order->user で orders.user_id が指す村人モデルを1件取り出し、その name を読む。',
    "class Order extends Model\n{\n    public function user()\n    {\n        return $this->belongsTo(User::class);\n    }\n}\n\n$order = Order::find(7);\necho $order->user->name;"),
  battle('clown-4',
    '名簿（guilds）と冒険者（adventurers）。一つのギルドに多くの冒険者が所属する。外部キー guild_id はどちらのテーブルに置く？',
    'adventurers テーブル（多い側・子の側）',
    [
      ['guilds テーブル（一の側・親の側）', '親の行に子の番号を入れると、一つの列に一人分しか入りません。多くの冒険者を持てなくなります。'],
      ['両方のテーブル', '1対多では子の側だけで足ります。両方に持つと値が食い違う原因になります。'],
      ['どちらにも置かず、別の中間テーブルを作る', '中間テーブルは多対多で使います。1対多では子の側に外部キーを置けば足ります。'],
    ],
    '多い側（子）の各行が「自分はどのギルドか」を guild_id で持つ。Guild は hasMany、Adventurer は belongsTo。',
    "Schema::create('adventurers', function (Blueprint $table) {\n    $table->id();\n    $table->string('name');\n    // guild_id はどこに？\n});"),
  // N+1 を見つける
  battle('clown-5',
    '通行人の届け出（posts）が10件ある。このループで作者名を表示すると、データベースへの問い合わせは何回？',
    '11回（届け出を取る1回 ＋ 作者を取る10回）',
    [
      ['1回', '最初の Post::all() は届け出だけを取ります。作者は $post->user を読むたびに別に問い合わせます。'],
      ['2回', '2回になるのは with(\'user\') で作者をまとめて先に取った場合です。このコードには with がありません。'],
      ['10回', '作者を取る10回に加えて、届け出の一覧を取る最初の1回があります。'],
    ],
    '一覧の1回に加え、ループの中で $post->user を読むたびに作者を1回ずつ取りに行く。1+N で11回。これがN+1問題。',
    "// posts は10件。各 post は belongsTo(User::class)\n$posts = Post::all();\n\nforeach ($posts as $post) {\n    echo $post->user->name;\n}"),
  battle('clown-6',
    '道化師は通行人を一人ずつ呼び止め、そのたびに名簿の倉庫まで往復させる。このコードで、往復（問い合わせ）が起きているのはどこ？',
    'ループの中の $quest->villager（1件ごとに村人を取りに行く）',
    [
      ['ループの中の echo（表示のたびに問い合わせる）', 'echo は取り出した値を出力するだけです。問い合わせを起こすのはまだ読み込まれていないリレーション $quest->villager です。'],
      ['Quest::all() が1件ごとに問い合わせる', 'Quest::all() は依頼をまとめて1回で取ります。1件ずつの往復はループの中で起きています。'],
      ['foreach が1周ごとに Quest を取り直す', 'foreach は取り出し済みのコレクションを順に回るだけで、依頼を取り直しません。'],
    ],
    'リレーションは初めて読んだときに問い合わせる（遅延読み込み）。ループの中で読むと件数分の問い合わせになる。',
    "$quests = Quest::all();\n\nforeach ($quests as $quest) {\n    echo $quest->title . ' / ' . $quest->villager->name;\n}"),
  battle('clown-7',
    '関所の通行人（travelers）は50件、全員が一つの出身の村（belongsTo）を持つ。出身村の名前を並べるこのコードの問い合わせは何回？',
    '51回',
    [
      ['2回', 'with を使っていないので、村はまとめて取られません。50人分それぞれに問い合わせが起きます。'],
      ['50回', '通行人の一覧を取る最初の1回を数え忘れています。'],
      ['村の種類の数だけ（たとえば3回）', '同じ村でも通行人ごとに別々に問い合わせます。種類ではなく人数分です。'],
    ],
    '一覧の1回 ＋ 通行人50人それぞれの $traveler->village で50回。データが増えるほど問い合わせも増える。',
    "// travelers は50件。村は3つ\n$travelers = Traveler::all();\n\nforeach ($travelers as $traveler) {\n    echo $traveler->village->name;\n}",
    'advanced'),
  // with で解く
  battle('clown-8',
    '届け出（posts）が10件ある。作者をまとめて先に取るように直した。問い合わせは何回になる？',
    '2回（届け出の1回 ＋ 作者をまとめて取る1回）',
    [
      ['1回', 'with は JOIN で一つにまとめるのではなく、届け出と作者を別々に1回ずつ取ります。'],
      ['11回', '11回は with を付ける前の数です。with(\'user\') で作者は1回にまとまります。'],
      ['10回', 'ループの中ではもう問い合わせません。作者は取り出し済みのものを読むだけです。'],
    ],
    'with(\'user\') は届け出を取ったあと、必要な作者を whereIn でまとめて1回で取る（Eager Loading）。件数が増えても2回のまま。',
    "// posts は10件\n$posts = Post::with('user')->get();\n\nforeach ($posts as $post) {\n    echo $post->user->name;\n}"),
  battle('clown-9',
    'Quest モデルには villager() リレーションがあり、テーブル名は villagers。依頼主をまとめて先に取るとき ??? に入るのは？',
    "'villager'",
    [
      ["'villagers'", 'with に渡すのはテーブル名ではなく、モデルに定義したリレーションのメソッド名です。villagers というメソッドはありません。'],
      ["'villager_id'", 'villager_id は外部キーの列名です。with にはリレーションのメソッド名を渡します。'],
      ["Villager::class", 'with はモデルのクラスではなく、リレーション名の文字列を受け取ります。'],
    ],
    'with の引数は Quest に定義した public function villager() の名前。テーブル名や列名ではない。',
    "class Quest extends Model\n{\n    public function villager()\n    {\n        return $this->belongsTo(Villager::class);\n    }\n}\n\n$quests = Quest::with(???)->get();"),
  battle('clown-10',
    '関所の門番がN+1を直そうとして書いたコード。正しく作者をまとめて取れる書き方は？',
    "Post::with('user')->get();",
    [
      ["Post::get()->with('user');", 'get() のあとはもう取り出し済みのコレクションです。with は get() の前、問い合わせを組み立てる段階で付けます。'],
      ["Post::all()->with('user');", 'all() も取り出し済みのコレクションを返します。with を付けるなら Post::with(...)->get() です。'],
      ["Post::with('users')->get();", "Post のリレーションは user() です。with('users') ではそのような名前のリレーションがなく例外になります。"],
    ],
    'with はクエリを組み立てる段階のメソッド。モデル::with(リレーション名)->get() の順に書く。',
    "// Post は belongsTo(User::class) の user() を持つ\n// posts は10件"),
  battle('clown-11',
    'ギルドの一覧と、各ギルドの冒険者（hasMany）をまとめて表示したい。ギルドが5件のとき、問い合わせを最も少なくできる書き方は？',
    "Guild::with('adventurers')->get();",
    [
      ['Guild::all(); してループの中で $guild->adventurers を読む', 'ループの中で読むと各ギルドで1回ずつ問い合わせ、1+5で6回になります。'],
      ["Adventurer::with('guild')->get(); してギルドごとに数え直す", '冒険者からギルドをたどる逆向きの取り方で、冒険者のいないギルドが一覧から漏れます。'],
      ["Guild::with('adventurer')->get();", 'Guild のリレーションは adventurers()（複数形）です。存在しない名前では例外になります。'],
    ],
    'with は hasMany にも使える。ギルドの1回＋冒険者をまとめて1回の2回で済む。名前は定義したメソッドの adventurers。',
    "class Guild extends Model\n{\n    public function adventurers()\n    {\n        return $this->hasMany(Adventurer::class);\n    }\n}"),
  // 結果は同じか
  battle('clown-12',
    'A と B のコードを比べる。表示される作者名はどうなる？',
    '同じ作者名が表示される。変わるのは問い合わせの回数だけ',
    [
      ['B は作者が付いた届け出だけに絞られる', 'with は絞り込みをしません。取れる届け出も作者も A と同じです。'],
      ['B は作者名がまとめて1つの文字列になる', 'with を付けても $post->user は各届け出の作者モデルのままです。'],
      ['B のほうが新しい作者情報を取ってくる', 'どちらも同じ users の行を読みます。違うのは取りに行くタイミングと回数です。'],
    ],
    'with は「いつ・何回で」取るかを変えるだけで、取れるデータは同じ。A は1+N回、B は2回。',
    "// A\nforeach (Post::all() as $post) {\n    echo $post->user->name;\n}\n\n// B\nforeach (Post::with('user')->get() as $post) {\n    echo $post->user->name;\n}"),
];

export const clownBattleSet: string[] = clownBattleQuestions.map(({ id }) => id);
export const clownBattleReasons: Record<string, Record<string, string>> = reasons;
