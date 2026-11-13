import type { Question } from './content';

// fillQuestionsの各問と同じ難易度・track・inertia・kindで別の論点を問う追加分。
// 【①】は1問につき1か所。入力の別解はacceptedへ明示的に登録する。
export const battleQuestionsFill: Question[] = [
  {
    "id": "bf2-react-beginner-1",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "投稿が0件のときだけ案内文を表示するために、①を埋めてください。",
    "code": "type Post = { id: number; title: string };\n\nexport function PostList({ posts }: { posts: Post[] }) {\n  return (\n    <section>\n      <h2>投稿一覧</h2>\n      {posts.length === 0 【①】 <p>投稿はまだありません</p>}\n      <ul>\n        {posts.map(post => <li key={post.id}>{post.title}</li>)}\n      </ul>\n    </section>\n  );\n}",
    "filename": "PostList.tsx",
    "reveal": "&&",
    "explanation": "&&は左側が真のときだけ右側の要素を返すので、0件のときだけ案内が出ます。||は左側が偽（1件以上ある）ときに案内を出してしまい、??は左側がnullかundefinedのときだけ右側を使うため真偽値では案内が出ません。===は比較を続けるだけで表示の条件になりません。",
    "track": "react",
    "options": [
      "||",
      "&&",
      "??",
      "==="
    ],
    "answer": 1
  },
  {
    "id": "bf2-react-beginner-2",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "ボタンを押すたびに表示のいいね数が1増えるように、0から始まる状態を作る関数名で①を埋めてください。",
    "code": "import { useState } from 'react';\n\nexport function LikeButton() {\n  const [likes, setLikes] = 【①】(0);\n  return (\n    <button onClick={() => setLikes(likes + 1)}>\n      いいね：{likes}\n    </button>\n  );\n}",
    "filename": "LikeButton.tsx",
    "reveal": "useState",
    "explanation": "useStateは現在の値と更新関数の組を返します。setLikesで値を変えるとReactが再描画し、新しいいいね数が表示されます。普通の変数では再描画が起きません。",
    "track": "react",
    "accepted": [
      "useState"
    ]
  },
  {
    "id": "bf2-react-intermediate-1",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "クリックしたTodoだけdoneを反転し、ほかのTodoはそのまま残した新しい配列を作るために、①を埋めてください。",
    "code": "import { useState } from 'react';\ntype Todo = { id: number; title: string; done: boolean };\n\nexport function TodoList() {\n  const [todos, setTodos] = useState<Todo[]>([]);\n  function toggle(id: number) {\n    setTodos(prev => prev.【①】(todo =>\n      todo.id === id ? { ...todo, done: !todo.done } : todo\n    ));\n  }\n  return <ul>{todos.map(todo => (\n    <li key={todo.id} onClick={() => toggle(todo.id)}>\n      {todo.done ? '✓ ' : ''}{todo.title}\n    </li>\n  ))}</ul>;\n}",
    "filename": "TodoList.tsx",
    "reveal": "map",
    "explanation": "mapは全要素を同じ件数のまま変換した新しい配列を返します。対象のTodoだけスプレッド構文で複製してdoneを反転し、それ以外は元の要素を返します。filterは要素を残すか捨てるかを決めるだけで中身を変えず、findは最初の1件、forEachはundefinedを返すため配列になりません。",
    "track": "react",
    "options": [
      "filter",
      "forEach",
      "find",
      "map"
    ],
    "answer": 3
  },
  {
    "id": "bf2-react-intermediate-2",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "親から渡されるuserIdが変わったときに投稿を取り直すため、依存配列の①を埋めてください。",
    "code": "import { useEffect, useState } from 'react';\ntype Post = { id: number; title: string };\n\nexport function UserPosts({ userId }: { userId: number }) {\n  const [posts, setPosts] = useState<Post[]>([]);\n  useEffect(() => {\n    fetch(`/api/users/${userId}/posts`)\n      .then(res => res.json())\n      .then(setPosts);\n  }, [【①】]);\n  return <ul>{posts.map(post => (\n    <li key={post.id}>{post.title}</li>\n  ))}</ul>;\n}",
    "filename": "UserPosts.tsx",
    "reveal": "userId",
    "explanation": "依存配列に入れた値が前回の描画から変わると、Reactはエフェクトを再実行します。エフェクト内で使っているuserIdを入れると、別のユーザーに切り替えたときに取り直します。空配列だと初回だけ、依存配列を省略すると毎回の描画後に実行されます。",
    "track": "react",
    "accepted": [
      "userId"
    ]
  },
  {
    "id": "bf2-react-advanced-1",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "コンポーネントが画面から外れたときにタイマーを止め、時計の更新が重複しないようにするために、①を埋めてください。",
    "code": "import { useEffect, useState } from 'react';\n\nexport function Clock() {\n  const [now, setNow] = useState(() => new Date());\n  useEffect(() => {\n    const id = setInterval(() => setNow(new Date()), 1000);\n    // 外れたとき（開発時のStrict Modeによる再実行前も）に呼ばれる後始末\n    return () => 【①】(id);\n  }, []);\n  return <p>現在時刻：{now.toLocaleTimeString()}</p>;\n}",
    "filename": "Clock.tsx",
    "reveal": "clearInterval",
    "explanation": "エフェクトが返す関数は、コンポーネントが外れるときや再実行の前に呼ばれます。setIntervalで登録したタイマーはclearIntervalで止めます。後始末でsetIntervalを呼ぶとタイマーが増え、removeEventListenerはイベント登録の解除、cancelAnimationFrameはrequestAnimationFrameの取り消しに使うもので、このタイマーは止まりません。",
    "track": "react",
    "options": [
      "clearInterval",
      "setInterval",
      "removeEventListener",
      "cancelAnimationFrame"
    ],
    "answer": 0
  },
  {
    "id": "bf2-react-advanced-2",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "入力が300ミリ秒止まってから検索します。再描画をまたいでタイマーIDを保持し、書き換えても再描画を起こさない入れ物を作るように、①を埋めてください。",
    "code": "import { useRef, useState } from 'react';\n\nexport function SearchBox({ onSearch }: { onSearch: (q: string) => void }) {\n  const [query, setQuery] = useState('');\n  const timerRef = 【①】<number | undefined>(undefined);\n  function handleChange(value: string) {\n    setQuery(value);\n    window.clearTimeout(timerRef.current);\n    timerRef.current = window.setTimeout(() => onSearch(value), 300);\n  }\n  return <input value={query} onChange={e => handleChange(e.target.value)} />;\n}",
    "filename": "SearchBox.tsx",
    "reveal": "useRef",
    "explanation": "useRefが返すオブジェクトは再描画しても同じものが使われ、currentを書き換えても再描画は起きません。表示に使わないタイマーIDの保持に向きます。useStateでは更新のたびに再描画され、currentプロパティもありません。関数内の普通の変数は再描画のたびに作り直され、前のタイマーを取り消せません。",
    "track": "react",
    "accepted": [
      "useRef"
    ]
  },
  {
    "id": "bf2-vue-beginner-1",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "入力の前後の空白を自動で取り除いてからtitleに入れるために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref } from 'vue';\nconst title = ref('');\n</script>\n\n<template>\n  <section>\n    <input v-model.【①】=\"title\" />\n    <p>文字数：{{ title.length }}</p>\n  </section>\n</template>",
    "filename": "TitleInput.vue",
    "reveal": "trim",
    "explanation": "v-modelの.trim修飾子は、入力値の前後の空白を除いてから状態に入れます。.numberは数値への変換、.lazyはinputではなくchangeイベントで同期するための修飾子です。.preventはイベントの既定動作を止める修飾子で、v-modelには使いません。",
    "track": "vue",
    "options": [
      "number",
      "lazy",
      "trim",
      "prevent"
    ],
    "answer": 2
  },
  {
    "id": "bf2-vue-beginner-2",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "importした関数を使い、0から始まってボタンを押すたびに増える状態を作るために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref } from 'vue';\nconst likes = 【①】(0);\n</script>\n\n<template>\n  <button @click=\"likes++\">\n    いいね：{{ likes }}\n  </button>\n</template>",
    "filename": "LikeButton.vue",
    "reveal": "ref",
    "explanation": "refは値をリアクティブな入れ物で包み、変更されると表示を更新します。テンプレートでは自動で展開されるため、likes++やlikesと書けます。普通の変数では変更しても表示が更新されません。",
    "track": "vue",
    "accepted": [
      "ref"
    ]
  },
  {
    "id": "bf2-vue-intermediate-1",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "親コンポーネントから渡される投稿を受け取って表示するために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\ntype Post = { id: number; title: string; author: string };\nconst props = 【①】<{ post: Post }>();\n</script>\n\n<template>\n  <article>\n    <h3>{{ props.post.title }}</h3>\n    <p>投稿者：{{ props.post.author }}</p>\n  </article>\n</template>",
    "filename": "PostCard.vue",
    "reveal": "defineProps",
    "explanation": "script setupでは、definePropsで親から受け取るpropsを宣言します。型引数で受け取る項目と型を指定でき、importは不要です。defineEmitsは子から親へ知らせるイベントの宣言で、refやreactiveはコンポーネント内の状態を作るもので親の値を受け取りません。",
    "track": "vue",
    "options": [
      "defineEmits",
      "defineProps",
      "ref",
      "reactive"
    ],
    "answer": 1
  },
  {
    "id": "bf2-vue-intermediate-2",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "削除ボタンを押したとき、親コンポーネントへdeletedイベントと投稿IDを知らせるために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nconst props = defineProps<{ postId: number }>();\nconst emit = 【①】<{\n  (e: 'deleted', id: number): void\n}>();\n\nfunction remove() {\n  emit('deleted', props.postId);\n}\n</script>\n\n<template>\n  <button @click=\"remove\">削除</button>\n</template>",
    "filename": "DeleteButton.vue",
    "reveal": "defineEmits",
    "explanation": "defineEmitsで子が発行できるイベントを宣言し、返された関数でイベントを親へ送ります。親は@deletedで受け取ります。子がpropsを直接書き換えて親へ知らせることはしません。",
    "track": "vue",
    "accepted": [
      "defineEmits"
    ]
  },
  {
    "id": "bf2-vue-advanced-1",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "コンポーネントが画面から外れたときにresizeの監視を解除し、不要な処理が残らないようにするために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref, onMounted, onUnmounted } from 'vue';\nconst width = ref(window.innerWidth);\nfunction update() {\n  width.value = window.innerWidth;\n}\nonMounted(() => window.addEventListener('resize', update));\n【①】(() => window.removeEventListener('resize', update));\n</script>\n\n<template>\n  <p>画面幅：{{ width }}px</p>\n</template>",
    "filename": "WindowWidth.vue",
    "reveal": "onUnmounted",
    "explanation": "windowへの登録はコンポーネントが消えても残るため、onUnmountedで解除します。onMountedで解除すると登録直後に外れてしまい、onUpdatedは再描画のたびに解除するだけで外れたときの後始末になりません。onBeforeMountは表示前に1回呼ばれるもので、解除の時点として不適切です。",
    "track": "vue",
    "options": [
      "onMounted",
      "onUpdated",
      "onBeforeMount",
      "onUnmounted"
    ],
    "answer": 3
  },
  {
    "id": "bf2-vue-advanced-2",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "userIdが変わったときだけでなく、コンポーネント作成直後の初回にも投稿を取得するために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref, watch } from 'vue';\nconst props = defineProps<{ userId: number }>();\nconst posts = ref<{ id: number; title: string }[]>([]);\n\nwatch(() => props.userId, async id => {\n  const res = await fetch(`/api/users/${id}/posts`);\n  posts.value = await res.json();\n}, { 【①】: true });\n</script>\n\n<template>\n  <p v-for=\"post in posts\" :key=\"post.id\">{{ post.title }}</p>\n</template>",
    "filename": "UserPosts.vue",
    "reveal": "immediate",
    "explanation": "watchは既定では監視対象が変わったときだけ実行されます。immediate: trueを指定すると作成直後にも1回実行されます。deepは入れ子のオブジェクトの変化まで監視する指定、onceは1回だけ実行する指定で、初回の実行にはなりません。",
    "track": "vue",
    "accepted": [
      "immediate"
    ]
  },
  {
    "id": "bf2-laravel-beginner-1",
    "difficulty": "beginner",
    "topic": "laravel",
    "kind": "fill-choice",
    "prompt": "Post::createでtitleとbodyを一括代入して保存できるようにするために、①を埋めてください。",
    "code": "<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Model;\n\nclass Post extends Model\n{\n    // Post::create($request->validated()) で\n    // titleとbodyだけを一括代入で保存できるようにする\n    protected $【①】 = ['title', 'body'];\n}",
    "filename": "app/Models/Post.php",
    "reveal": "fillable",
    "explanation": "$fillableには一括代入を許可する列を並べます。$guardedは逆に一括代入を禁止する列なので、ここに書くとtitleとbodyが保存されません。$hiddenはJSONに出さない列、$castsは型変換の指定です。",
    "options": [
      "fillable",
      "guarded",
      "hidden",
      "casts"
    ],
    "answer": 0
  },
  {
    "id": "bf2-laravel-beginner-2",
    "difficulty": "beginner",
    "topic": "laravel",
    "kind": "fill-input",
    "prompt": "投稿テーブルにcreated_atとupdated_atの2列をまとめて追加するために、①を埋めてください。",
    "code": "<?php\n\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration\n{\n    public function up(): void\n    {\n        Schema::create('posts', function (Blueprint $table) {\n            $table->id();\n            $table->string('title');\n            // created_atとupdated_atの2列をまとめて追加する\n            $table->【①】();\n        });\n    }\n};",
    "filename": "database/migrations/2024_01_01_000000_create_posts_table.php",
    "reveal": "timestamps",
    "explanation": "timestamps()はcreated_atとupdated_atをまとめて追加し、Eloquentは保存時にこの2列を自動で記録します。timestampsTz()はタイムゾーン付きで同じ2列を追加し、nullableTimestamps()はtimestamps()の別名なので、どちらも正解として扱います。softDeletes()はdeleted_atを追加するもので別の列です。",
    "accepted": [
      "timestamps",
      "timestampsTz",
      "nullableTimestamps"
    ]
  },
  {
    "id": "bf2-laravel-intermediate-1",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "fill-choice",
    "prompt": "公開済みの投稿を作成日時が新しい順に並べて返すために、①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\n\nclass PostController extends Controller\n{\n    public function index()\n    {\n        // 公開済みの投稿を、作成日時が新しい順に並べて返す\n        $posts = Post::where('published', true)\n            ->【①】()\n            ->get();\n        return response()->json(['posts' => $posts]);\n    }\n}",
    "filename": "PostController.php",
    "reveal": "latest",
    "explanation": "latest()は引数を省略するとcreated_atの降順（新しい順）に並べます。oldest()は昇順なので古い順になります。orderByは並べる列を引数で必ず指定する必要があり、groupByは並び替えではなく集約のための指定です。",
    "options": [
      "oldest",
      "groupBy",
      "latest",
      "orderBy"
    ],
    "answer": 2
  },
  {
    "id": "bf2-laravel-intermediate-2",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "fill-input",
    "prompt": "ログイン中のユーザーの投稿として新しい投稿を保存し、user_idを手で指定しないで済むように、①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse Illuminate\\Http\\Request;\n\nclass PostController extends Controller\n{\n    public function store(Request $request)\n    {\n        $data = $request->validate(['title' => ['required', 'string']]);\n        // ログイン中ユーザーのposts関係から作るので、user_idは自動で入る\n        $post = $request->user()->posts()->【①】($data);\n        return response()->json(['post' => $post], 201);\n    }\n}",
    "filename": "PostController.php",
    "reveal": "create",
    "explanation": "hasMany関係のcreateは、渡した配列で新しいモデルを保存し、親のuser_idを自動で設定します。saveは配列ではなくモデルのインスタンスを受け取り、makeは保存せずにモデルを作るだけです。",
    "accepted": [
      "create"
    ]
  },
  {
    "id": "bf2-laravel-advanced-1",
    "difficulty": "advanced",
    "topic": "laravel",
    "kind": "fill-choice",
    "prompt": "ポリシーで更新が許可されない場合は403で処理を止めるために、①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Support\\Facades\\Gate;\n\nclass PostController extends Controller\n{\n    public function update(Request $request, Post $post)\n    {\n        // PostPolicyのupdateで許可されなければ、ここで処理を止める\n        Gate::【①】('update', $post);\n        $post->update($request->validate(['title' => ['required', 'string']]));\n        return response()->json(['post' => $post]);\n    }\n}",
    "filename": "PostController.php",
    "reveal": "authorize",
    "explanation": "Gate::authorizeは許可されないときに例外を投げ、Laravelが403の応答に変換します。allows・denies・checkは真偽値を返すだけなので、ifで結果を使わないこのコードでは、許可されなくても次の行の更新が実行されてしまいます。",
    "options": [
      "allows",
      "authorize",
      "denies",
      "check"
    ],
    "answer": 1
  },
  {
    "id": "bf2-laravel-advanced-2",
    "difficulty": "advanced",
    "topic": "laravel",
    "kind": "fill-input",
    "prompt": "slugは他の投稿と重複させませんが、更新中の投稿自身が持つ現在のslugは重複扱いにしないために、①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Validation\\Rule;\n\nclass PostController extends Controller\n{\n    public function update(Request $request, Post $post)\n    {\n        // slugは他の投稿と重複禁止。ただし更新中の投稿自身の値は重複扱いにしない\n        $data = $request->validate([\n            'slug' => ['required', Rule::unique('posts')->【①】($post->id)],\n        ]);\n        $post->update($data);\n        return response()->json(['post' => $post]);\n    }\n}",
    "filename": "PostController.php",
    "reveal": "ignore",
    "explanation": "Rule::unique('posts')だけでは、slugを変えずに保存すると自分自身の行と重複したと判定されます。ignoreに投稿のIDを渡すと、その行を重複の確認から除外します。IDはリクエストの入力ではなく、ルートモデル結合で得た$postから取ります。",
    "accepted": [
      "ignore"
    ]
  },
  {
    "id": "bf2-inertia-beginner-1",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "useFormで作ったフォームのtitleと入力欄を同期するために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\n// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '' });\nfunction submit() {\n  form.post('/posts');\n}\n</script>\n\n<template>\n  <form @submit.prevent=\"submit\">\n    <input v-model=\"【①】.title\" />\n    <button type=\"submit\">保存</button>\n  </form>\n</template>",
    "filename": "PostCreate.vue",
    "reveal": "form",
    "explanation": "useFormが返すformは入力値をform.titleのように直接持ち、v-modelで入力欄と同期できます。form.postはこの値を送信します。propsはサーバーから受け取る値、routerはページ移動用の機能で、pageという変数はこのコードにありません。",
    "inertia": true,
    "options": [
      "props",
      "router",
      "page",
      "form"
    ],
    "answer": 3
  },
  {
    "id": "bf2-inertia-beginner-2",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "ブラウザのタブに「投稿一覧」と表示するため、Headコンポーネントへ渡す属性名で①を埋めてください。",
    "code": "<script setup lang=\"ts\">\n// Vue版InertiaのHeadコンポーネントを使用\nimport { Head } from '@inertiajs/vue3';\ndefineProps<{ posts: { id: number; title: string }[] }>();\n</script>\n\n<template>\n  <!-- ブラウザのタブに「投稿一覧」と表示する -->\n  <Head 【①】=\"投稿一覧\" />\n  <h1>投稿一覧</h1>\n  <ul>\n    <li v-for=\"post in posts\" :key=\"post.id\">{{ post.title }}</li>\n  </ul>\n</template>",
    "filename": "PostIndex.vue",
    "reveal": "title",
    "explanation": "InertiaのHeadコンポーネントはtitle属性でページのタイトルを設定します。ページごとに書くと、移動したときにタブの表示も切り替わります。h1は画面上の見出しで、タブのタイトルにはなりません。",
    "inertia": true,
    "accepted": [
      "title"
    ]
  },
  {
    "id": "bf2-inertia-intermediate-1",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "入力が初期値から変わっているときだけ「未保存の変更があります」と表示するために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\n// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst props = defineProps<{ post: { id: number; title: string } }>();\nconst form = useForm({ title: props.post.title });\n</script>\n\n<template>\n  <form @submit.prevent=\"form.patch(`/posts/${props.post.id}`)\">\n    <input v-model=\"form.title\" />\n    <!-- 入力が初期値から変わっているときだけ表示する -->\n    <p v-if=\"form.【①】\">未保存の変更があります</p>\n    <button type=\"submit\">更新</button>\n  </form>\n</template>",
    "filename": "PostEdit.vue",
    "reveal": "isDirty",
    "explanation": "isDirtyは、フォームの値が初期値から変わっているとtrueになります。processingは送信中、hasErrorsは検証エラーがあるとき、wasSuccessfulは直前の送信が成功したときにtrueになるもので、入力の変更有無は表しません。",
    "inertia": true,
    "options": [
      "isDirty",
      "processing",
      "hasErrors",
      "wasSuccessful"
    ],
    "answer": 0
  },
  {
    "id": "bf2-inertia-intermediate-2",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "検索語を変えるたびに一覧を取り直しても、入力中の検索欄などページ内の状態を捨てないために、①を埋めてください。",
    "code": "// Vue版Inertiaのrouterを使用\nimport { ref, watch } from 'vue';\nimport { router } from '@inertiajs/vue3';\n\nconst search = ref('');\n\nwatch(search, value => {\n  router.get('/posts', { search: value }, {\n    // ページを再描画しても、入力中の検索欄などの状態を捨てない\n    【①】: true,\n    replace: true,\n  });\n});",
    "filename": "postSearch.ts",
    "reveal": "preserveState",
    "explanation": "router.getの訪問は既定でpreserveStateがfalseで、同じページでもコンポーネントが作り直され、入力やフォーカスが失われます。preserveState: trueで状態を保ちます。preserveScrollはスクロール位置だけを保つ指定、replaceは履歴を積まずに置き換える指定です。",
    "inertia": true,
    "accepted": [
      "preserveState"
    ]
  },
  {
    "id": "bf2-inertia-advanced-1",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "入力欄の値は変えずに、送信するデータだけ空白を除いてタグを配列に整形するために、①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '', tags: '' });\n\nfunction submit() {\n  // 入力欄の値は変えず、送信するデータだけ整形する\n  form\n    .【①】(data => ({\n      title: data.title.trim(),\n      tags: data.tags.split(',').map(tag => tag.trim()),\n    }))\n    .post('/posts');\n}",
    "filename": "postForm.ts",
    "reveal": "transform",
    "explanation": "transformは送信直前にデータを変換する関数を登録し、form自体の値は変えません。resetは値を初期値に戻し、defaultsは初期値を設定し直し、setErrorはエラーを手動で設定するもので、送信データの整形には使えません。",
    "inertia": true,
    "options": [
      "reset",
      "defaults",
      "transform",
      "setError"
    ],
    "answer": 2
  },
  {
    "id": "bf2-inertia-advanced-2",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "ログインの送信が成功しても検証エラーで失敗しても、送信が終わったらpasswordを空にするために、①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ email: '', password: '' });\n\nfunction login() {\n  form.post('/login', {\n    // 成功でも検証エラーでも、送信が終わったらpasswordを空にする\n    【①】: () => form.reset('password'),\n  });\n}\n\n// テンプレートの送信イベントからloginを呼ぶ",
    "filename": "loginForm.ts",
    "reveal": "onFinish",
    "explanation": "onFinishは送信の成功・失敗にかかわらず、訪問が終わったときに呼ばれます。onSuccessは成功時だけ、onErrorは検証エラー時だけ呼ばれるため、片方では条件を満たしません。reset('password')はpasswordだけを初期値に戻し、emailは残します。",
    "inertia": true,
    "accepted": [
      "onFinish"
    ]
  },
  {
    "id": "bf2-api-beginner-1",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "JSONの読み取りが終わるのを待ってから投稿のタイトルを使うために、①を埋めてください。",
    "code": "type Post = { id: number; title: string };\n\nasync function loadPost(id: number): Promise<Post> {\n  const response = await fetch(`/api/posts/${id}`);\n  if (!response.ok) {\n    throw new Error('取得に失敗しました');\n  }\n  // JSONの読み取りが終わるのを待ってから値を使う\n  const post: Post = 【①】 response.json();\n  console.log(post.title);\n  return post;\n}",
    "filename": "postsApi.ts",
    "reveal": "await",
    "explanation": "response.json()はすぐに値ではなくPromiseを返します。awaitで解析の完了を待つと、postに投稿のデータが入ります。asyncは関数の宣言に付けるもので式の前には書けず、returnやnewもこの位置では代入の式になりません。",
    "inertia": false,
    "options": [
      "return",
      "await",
      "async",
      "new"
    ],
    "answer": 1
  },
  {
    "id": "bf2-api-beginner-2",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "ログイン時に受け取ったトークンをBearer方式で送るため、ヘッダー名で①を埋めてください。",
    "code": "type Post = { id: number; title: string };\n\nasync function loadMyPosts(token: string): Promise<Post[]> {\n  const response = await fetch('/api/me/posts', {\n    headers: {\n      // ログイン時に受け取ったトークンをBearer方式で送る\n      '【①】': `Bearer ${token}`,\n    },\n  });\n  if (!response.ok) throw new Error('取得に失敗しました');\n  return response.json();\n}",
    "filename": "postsApi.ts",
    "reveal": "Authorization",
    "explanation": "認証情報はAuthorizationヘッダーに「Bearer トークン」の形で送ります。HTTPのヘッダー名は大文字小文字を区別しないため、authorizationも正解です。Content-Typeは送る本文の形式、Acceptは受け取りたい形式を伝えるヘッダーです。",
    "inertia": false,
    "accepted": [
      "Authorization",
      "authorization"
    ]
  },
  {
    "id": "bf2-api-intermediate-1",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "認証切れなどのエラーでも、リダイレクトではなくJSONのエラー応答を返してほしいとLaravelへ伝えるために、①を埋めてください。",
    "code": "async function loadPost(id: number) {\n  const response = await fetch(`/api/posts/${id}`, {\n    headers: {\n      // エラー時もログイン画面へのリダイレクトではなく、\n      // JSONのエラー応答を返してほしいとLaravelへ伝える\n      '【①】': 'application/json',\n    },\n  });\n  if (!response.ok) {\n    const error = await response.json();\n    throw new Error(error.message);\n  }\n  return response.json();\n}",
    "filename": "postsApi.ts",
    "reveal": "Accept",
    "explanation": "Acceptは受け取りたい応答の形式を伝えます。LaravelはAcceptがJSONの要求を、エラー時もJSONを期待しているものとして扱います。Content-Typeは送信する本文の形式で、本文のないGETでは意味がありません。Authorizationは認証情報、Cache-Controlはキャッシュの指定です。",
    "inertia": false,
    "options": [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Accept"
    ],
    "answer": 3
  },
  {
    "id": "bf2-api-intermediate-2",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "投稿のタイトルだけを部分更新するため、HTTPメソッド名を大文字で①に入力してください。",
    "code": "type Post = { id: number; title: string };\n\n// routes/api.php に Route::patch('/posts/{post}', ...) を定義済み\nasync function renamePost(id: number, title: string): Promise<Post> {\n  const response = await fetch(`/api/posts/${id}`, {\n    method: '【①】',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ title }),\n  });\n  if (!response.ok) throw new Error('更新失敗');\n  return response.json();\n}",
    "filename": "postsApi.ts",
    "reveal": "PATCH",
    "explanation": "一部の項目だけを更新する要求にはPATCHを使い、サーバー側のRoute::patchと一致させます。PUTは資源全体の置き換え、POSTは作成に使います。fetchはgetやpostなどの小文字を大文字へ直しますが、patchは直さずそのまま送るため、大文字で書くのが安全です。",
    "inertia": false,
    "accepted": [
      "PATCH"
    ]
  },
  {
    "id": "bf2-api-advanced-1",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "新しい検索を始めるときに前の検索要求を中止できるように、fetchへ中止の合図を渡すために、①を埋めてください。",
    "code": "let controller: AbortController | null = null;\n\nasync function searchPosts(query: string) {\n  // 新しい検索を始める前に、前の検索要求を中止する\n  controller?.abort();\n  controller = new AbortController();\n  const response = await fetch(`/api/posts?q=${encodeURIComponent(query)}`, {\n    【①】: controller.signal,\n  });\n  if (!response.ok) throw new Error('検索失敗');\n  return response.json();\n}",
    "filename": "postsApi.ts",
    "reveal": "signal",
    "explanation": "fetchのsignalオプションにAbortControllerのsignalを渡すと、abort()を呼んだときにその要求を中止できます。keepaliveはページを閉じた後も送信を続ける指定、cacheはHTTPキャッシュの使い方、modeはCORSの扱いの指定で、中止とは関係ありません。",
    "inertia": false,
    "options": [
      "signal",
      "keepalive",
      "cache",
      "mode"
    ],
    "answer": 0
  },
  {
    "id": "bf2-api-advanced-2",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "自分で中止した古い検索要求は、失敗として扱わず静かに終えるために、エラー名で①を埋めてください。",
    "code": "let controller: AbortController | null = null;\n\nasync function searchPosts(query: string, show: (posts: unknown[]) => void) {\n  controller?.abort();\n  controller = new AbortController();\n  try {\n    const url = `/api/posts?q=${encodeURIComponent(query)}`;\n    const response = await fetch(url, { signal: controller.signal });\n    if (!response.ok) throw new Error('検索失敗');\n    show(await response.json());\n  } catch (error) {\n    // 自分で中止した古い検索は失敗として表示しない\n    if (error instanceof DOMException && error.name === '【①】') return;\n    throw error;\n  }\n}",
    "filename": "postsApi.ts",
    "reveal": "AbortError",
    "explanation": "理由を渡さずにabort()すると、fetchや本文の読み取りはnameがAbortErrorのDOMExceptionで失敗します。これだけを無視すれば、通信障害やHTTPエラーは呼び出し元へ伝えたまま、中止した古い検索の結果を表示しません。TimeoutErrorはAbortSignal.timeoutによる時間切れで、今回の中止とは別です。",
    "inertia": false,
    "accepted": [
      "AbortError"
    ]
  }
];
