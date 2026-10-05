import type { Question } from './content';

// 【①】は1問につき1か所。入力の別解はacceptedへ明示的に登録する。
export const fillQuestions: Question[] = [
  {
    "id": "fill-react-beginner-1",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "入力欄をtitleのstateと常に同期する制御された入力にするために、①を埋めてください。",
    "code": "import { useState } from 'react';\n\nexport function PostForm() {\n  const [title, setTitle] = useState('');\n  return (\n    <section>\n      <input 【①】={title}\n        onChange={e => setTitle(e.target.value)} />\n      <p>{title}</p>\n    </section>\n  );\n}",
    "filename": "PostForm.tsx",
    "reveal": "value",
    "explanation": "valueで入力欄をstateと同期し、setTitleで変更を保存します。",
    "track": "react",
    "options": [
      "value",
      "key",
      "name",
      "defaultValue"
    ],
    "answer": 0
  },
  {
    "id": "fill-react-beginner-2",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "入力欄をtitleのstateと常に同期する制御された入力にするために、①を埋めてください。",
    "code": "import { useState } from 'react';\n\nexport function PostForm() {\n  const [title, setTitle] = useState('');\n  return (\n    <section>\n      <input value={title}\n        onChange={e => 【①】(e.target.value)} />\n      <p>{title}</p>\n    </section>\n  );\n}",
    "filename": "PostForm.tsx",
    "reveal": "setTitle",
    "explanation": "valueで入力欄をstateと同期し、setTitleで変更を保存します。",
    "track": "react",
    "accepted": [
      "setTitle"
    ]
  },
  {
    "id": "fill-react-intermediate-1",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "削除対象以外の投稿を残す新しい配列を作るために、①を埋めてください。",
    "code": "import { useState } from 'react';\ntype Post = { id: number; title: string };\n\nexport function PostList() {\n  const [posts, setPosts] = useState<Post[]>([]);\n  function remove(id: number) {\n    setPosts(prev => prev.【①】(post => post.id !== id));\n  }\n  return <ul>{posts.map(post => (\n    <li key={post.id}>\n      {post.title}\n      <button onClick={() => remove(post.id)}>削除</button>\n    </li>\n  ))}</ul>;\n}",
    "filename": "PostList.tsx",
    "reveal": "filter",
    "explanation": "filterは条件を満たす要素だけを新しい配列に残します。削除するIDと異なる投稿を残します。",
    "track": "react",
    "options": [
      "map",
      "filter",
      "find",
      "some"
    ],
    "answer": 1
  },
  {
    "id": "fill-react-intermediate-2",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "削除対象以外の投稿を残す新しい配列を作るために、①を埋めてください。",
    "code": "import { useState } from 'react';\ntype Post = { id: number; title: string };\n\nexport function PostList() {\n  const [posts, setPosts] = useState<Post[]>([]);\n  function remove(id: number) {\n    setPosts(prev => prev.filter(post => 【①】));\n  }\n  return <ul>{posts.map(post => (\n    <li key={post.id}>\n      {post.title}\n      <button onClick={() => remove(post.id)}>削除</button>\n    </li>\n  ))}</ul>;\n}",
    "filename": "PostList.tsx",
    "reveal": "post.id !== id",
    "explanation": "filterは条件を満たす要素だけを新しい配列に残します。削除するIDと異なる投稿を残します。",
    "track": "react",
    "accepted": [
      "post.id !== id",
      "post.id!==id",
      "id !== post.id",
      "id!==post.id"
    ]
  },
  {
    "id": "fill-react-advanced-1",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "同じクリックでカウントを2増やすために、①を埋めてください。",
    "code": "import { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  function incrementTwice() {\n    【①】(prev => prev + 1);\n    setCount(prev => prev + 1);\n  }\n  return (\n    <button onClick={incrementTwice}>\n      カウント：{count}\n    </button>\n  );\n}",
    "filename": "Counter.tsx",
    "reveal": "setCount",
    "explanation": "関数型更新は更新キューの直前の値を受け取ります。prev + 1を2回適用すると2増えます。",
    "track": "react",
    "options": [
      "count",
      "useState",
      "setCount",
      "incrementTwice"
    ],
    "answer": 2
  },
  {
    "id": "fill-react-advanced-2",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "同じクリックでカウントを2増やすために、①を埋めてください。",
    "code": "import { useState } from 'react';\n\nexport function Counter() {\n  const [count, setCount] = useState(0);\n  function incrementTwice() {\n    setCount(prev => prev + 1);\n    setCount(prev => 【①】);\n  }\n  return (\n    <button onClick={incrementTwice}>\n      カウント：{count}\n    </button>\n  );\n}",
    "filename": "Counter.tsx",
    "reveal": "prev + 1",
    "explanation": "関数型更新は更新キューの直前の値を受け取ります。prev + 1を2回適用すると2増えます。",
    "track": "react",
    "accepted": [
      "prev + 1",
      "prev+1",
      "1 + prev",
      "1+prev"
    ]
  },
  {
    "id": "fill-vue-beginner-1",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "入力とタイトル表示を同期するために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref } from 'vue';\nconst title = ref('');\n</script>\n\n<template>\n  <section>\n    <input 【①】=\"title\" />\n    <p>{{ title }}</p>\n  </section>\n</template>",
    "filename": "PostForm.vue",
    "reveal": "v-model",
    "explanation": "v-modelは入力を状態と同期します。テンプレートではトップレベルのrefが自動で展開されるためtitleと書きます。",
    "track": "vue",
    "options": [
      "v-once",
      "v-if",
      "v-for",
      "v-model"
    ],
    "answer": 3
  },
  {
    "id": "fill-vue-beginner-2",
    "difficulty": "beginner",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "入力とタイトル表示を同期するために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref } from 'vue';\nconst title = ref('');\n</script>\n\n<template>\n  <section>\n    <input v-model=\"title\" />\n    <p>{{ 【①】 }}</p>\n  </section>\n</template>",
    "filename": "PostForm.vue",
    "reveal": "title",
    "explanation": "v-modelは入力を状態と同期します。テンプレートではトップレベルのrefが自動で展開されるためtitleと書きます。",
    "track": "vue",
    "accepted": [
      "title"
    ]
  },
  {
    "id": "fill-vue-intermediate-1",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "スクリプト内でクリック数を1増やすために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref } from 'vue';\nconst count = ref(0);\nfunction increment() {\n  【①】 = count.value + 1;\n}\n</script>\n\n<template>\n  <button @click=\"increment\">{{ count }}</button>\n</template>",
    "filename": "Counter.vue",
    "reveal": "count.value",
    "explanation": "スクリプト内ではrefの.valueを読み書きします。現在の値に1を加えて代入します。",
    "track": "vue",
    "options": [
      "count.value",
      "count",
      "count.current",
      "ref.value"
    ],
    "answer": 0
  },
  {
    "id": "fill-vue-intermediate-2",
    "difficulty": "intermediate",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "スクリプト内でクリック数を1増やすために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref } from 'vue';\nconst count = ref(0);\nfunction increment() {\n  count.value = 【①】;\n}\n</script>\n\n<template>\n  <button @click=\"increment\">{{ count }}</button>\n</template>",
    "filename": "Counter.vue",
    "reveal": "count.value + 1",
    "explanation": "スクリプト内ではrefの.valueを読み書きします。現在の値に1を加えて代入します。",
    "track": "vue",
    "accepted": [
      "count.value + 1",
      "count.value+1",
      "1 + count.value",
      "1+count.value"
    ]
  },
  {
    "id": "fill-vue-advanced-1",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-choice",
    "prompt": "投稿や検索語の変化に追従する検索結果を作るために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref, computed } from 'vue';\nconst posts = ref<{ id: number; title: string }[]>([]);\nconst query = ref('');\nconst visiblePosts = 【①】(() =>\n  posts.value.filter(post => post.title.includes(query.value))\n);\n</script>\n\n<template>\n  <input v-model=\"query\" />\n  <p v-for=\"post in visiblePosts\" :key=\"post.id\">{{ post.title }}</p>\n</template>",
    "filename": "SearchPosts.vue",
    "reveal": "computed",
    "explanation": "computedで依存する状態から表示一覧を導出します。スクリプトの検索語はquery.valueで参照します。",
    "track": "vue",
    "options": [
      "ref",
      "computed",
      "String",
      "Array"
    ],
    "answer": 1
  },
  {
    "id": "fill-vue-advanced-2",
    "difficulty": "advanced",
    "topic": "frontend",
    "kind": "fill-input",
    "prompt": "投稿や検索語の変化に追従する検索結果を作るために、①を埋めてください。",
    "code": "<script setup lang=\"ts\">\nimport { ref, computed } from 'vue';\nconst posts = ref<{ id: number; title: string }[]>([]);\nconst query = ref('');\nconst visiblePosts = computed(() =>\n  posts.value.filter(post => post.title.includes(【①】))\n);\n</script>\n\n<template>\n  <input v-model=\"query\" />\n  <p v-for=\"post in visiblePosts\" :key=\"post.id\">{{ post.title }}</p>\n</template>",
    "filename": "SearchPosts.vue",
    "reveal": "query.value",
    "explanation": "computedで依存する状態から表示一覧を導出します。スクリプトの検索語はquery.valueで参照します。",
    "track": "vue",
    "accepted": [
      "query.value"
    ]
  },
  {
    "id": "fill-laravel-beginner-1",
    "difficulty": "beginner",
    "topic": "laravel",
    "kind": "fill-choice",
    "prompt": "投稿詳細のURLをコントローラへ結び付けるために、①を埋めてください。",
    "code": "<?php\n\nuse Illuminate\\Support\\Facades\\Route;\nuse App\\Http\\Controllers\\PostController;\n\n// 投稿詳細を取得するルート\nRoute::【①】('/posts/{post}', [PostController::class, 'show']);\n\n// 投稿を保存するルート\nRoute::post('/posts', [PostController::class, 'store']);\n// 削除は別のHTTPメソッドで受け付ける\nRoute::delete('/posts/{post}', [PostController::class, 'destroy']);",
    "filename": "routes/web.php",
    "reveal": "get",
    "explanation": "詳細の取得はGET、リソースコントローラの詳細表示はshowに対応します。",
    "options": [
      "delete",
      "post",
      "get",
      "patch"
    ],
    "answer": 2
  },
  {
    "id": "fill-laravel-beginner-2",
    "difficulty": "beginner",
    "topic": "laravel",
    "kind": "fill-input",
    "prompt": "投稿詳細のURLをコントローラへ結び付けるために、①を埋めてください。",
    "code": "<?php\n\nuse Illuminate\\Support\\Facades\\Route;\nuse App\\Http\\Controllers\\PostController;\n\n// 投稿詳細を取得するルート\nRoute::get('/posts/{post}', [PostController::class, '【①】']);\n\n// 投稿を保存するルート\nRoute::post('/posts', [PostController::class, 'store']);\n// 削除は別のHTTPメソッドで受け付ける\nRoute::delete('/posts/{post}', [PostController::class, 'destroy']);",
    "filename": "routes/web.php",
    "reveal": "show",
    "explanation": "詳細の取得はGET、リソースコントローラの詳細表示はshowに対応します。",
    "accepted": [
      "show"
    ]
  },
  {
    "id": "fill-laravel-intermediate-1",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "fill-choice",
    "prompt": "IDに対応する投稿がなければ404にし、あればJSONで返すために①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\n\nclass PostController extends Controller\n{\n    public function show(int $id)\n    {\n        $post = Post::【①】($id);\n        return response()->json(['post' => $post]);\n    }\n}",
    "filename": "PostController.php",
    "reveal": "findOrFail",
    "explanation": "findOrFailは対象がない場合に例外を投げ、通常のLaravel処理で404になります。jsonでJSON応答を返します。",
    "options": [
      "create",
      "all",
      "count",
      "findOrFail"
    ],
    "answer": 3
  },
  {
    "id": "fill-laravel-intermediate-2",
    "difficulty": "intermediate",
    "topic": "laravel",
    "kind": "fill-input",
    "prompt": "IDに対応する投稿がなければ404にし、あればJSONで返すために①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\n\nclass PostController extends Controller\n{\n    public function show(int $id)\n    {\n        $post = Post::findOrFail($id);\n        return response()->【①】(['post' => $post]);\n    }\n}",
    "filename": "PostController.php",
    "reveal": "json",
    "explanation": "findOrFailは対象がない場合に例外を投げ、通常のLaravel処理で404になります。jsonでJSON応答を返します。",
    "accepted": [
      "json"
    ]
  },
  {
    "id": "fill-laravel-advanced-1",
    "difficulty": "advanced",
    "topic": "laravel",
    "kind": "fill-choice",
    "prompt": "論理削除した投稿を、IDで取得して復元するために①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\n\n// PostにはSoftDeletesとdeleted_at列を設定済み\nclass PostController extends Controller\n{\n    public function restore(int $id)\n    {\n        $post = Post::【①】()->findOrFail($id);\n        $post->restore();\n        return redirect('/posts');\n    }\n}",
    "filename": "PostController.php",
    "reveal": "onlyTrashed",
    "explanation": "onlyTrashedで論理削除済みの投稿を取得し、restoreでdeleted_atを解除して復元します。",
    "options": [
      "onlyTrashed",
      "withoutTrashed",
      "latest",
      "oldest"
    ],
    "answer": 0
  },
  {
    "id": "fill-laravel-advanced-2",
    "difficulty": "advanced",
    "topic": "laravel",
    "kind": "fill-input",
    "prompt": "論理削除した投稿を、IDで取得して復元するために①を埋めてください。",
    "code": "<?php\nnamespace App\\Http\\Controllers;\nuse App\\Models\\Post;\n\n// PostにはSoftDeletesとdeleted_at列を設定済み\nclass PostController extends Controller\n{\n    public function restore(int $id)\n    {\n        $post = Post::onlyTrashed()->findOrFail($id);\n        $post->【①】();\n        return redirect('/posts');\n    }\n}",
    "filename": "PostController.php",
    "reveal": "restore",
    "explanation": "onlyTrashedで論理削除済みの投稿を取得し、restoreでdeleted_atを解除して復元します。",
    "accepted": [
      "restore"
    ]
  },
  {
    "id": "fill-inertia-beginner-1",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "新しい投稿を保存し、成功した場合だけ入力を戻すために①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '' });\n\nfunction submit() {\n  form.【①】(\"/posts\", {\n    onSuccess: () => form.reset(),\n  });\n}\n\n// テンプレートの送信イベントからsubmitを呼ぶ\n// form.processingで送信中を表示する",
    "filename": "postForm.ts",
    "reveal": "post",
    "explanation": "作成はpost、部分更新はpatch、削除はdeleteを使います。resetはフォームの入力を初期値に戻します。",
    "inertia": true,
    "options": [
      "get",
      "post",
      "patch",
      "delete"
    ],
    "answer": 1
  },
  {
    "id": "fill-inertia-beginner-2",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "新しい投稿を保存し、成功した場合だけ入力を戻すために①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '' });\n\nfunction submit() {\n  form.post(\"/posts\", {\n    onSuccess: () => form.【①】(),\n  });\n}\n\n// テンプレートの送信イベントからsubmitを呼ぶ\n// form.processingで送信中を表示する",
    "filename": "postForm.ts",
    "reveal": "reset",
    "explanation": "作成はpost、部分更新はpatch、削除はdeleteを使います。resetはフォームの入力を初期値に戻します。",
    "inertia": true,
    "accepted": [
      "reset"
    ]
  },
  {
    "id": "fill-inertia-intermediate-1",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "既存投稿のタイトルを部分更新し、成功した場合だけ入力を戻すために①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '' });\n\nfunction submit() {\n  form.【①】(\"/posts/7\", {\n    onSuccess: () => form.reset(),\n  });\n}\n\n// テンプレートの送信イベントからsubmitを呼ぶ\n// form.processingで送信中を表示する",
    "filename": "postForm.ts",
    "reveal": "patch",
    "explanation": "作成はpost、部分更新はpatch、削除はdeleteを使います。resetはフォームの入力を初期値に戻します。",
    "inertia": true,
    "options": [
      "post",
      "get",
      "patch",
      "delete"
    ],
    "answer": 2
  },
  {
    "id": "fill-inertia-intermediate-2",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "既存投稿のタイトルを部分更新し、成功した場合だけ入力を戻すために①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '' });\n\nfunction submit() {\n  form.patch(\"/posts/7\", {\n    onSuccess: () => form.【①】(),\n  });\n}\n\n// テンプレートの送信イベントからsubmitを呼ぶ\n// form.processingで送信中を表示する",
    "filename": "postForm.ts",
    "reveal": "reset",
    "explanation": "作成はpost、部分更新はpatch、削除はdeleteを使います。resetはフォームの入力を初期値に戻します。",
    "inertia": true,
    "accepted": [
      "reset"
    ]
  },
  {
    "id": "fill-inertia-advanced-1",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "既存投稿を削除し、成功した場合だけ入力を戻すために①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '' });\n\nfunction submit() {\n  form.【①】(\"/posts/7\", {\n    onSuccess: () => form.reset(),\n  });\n}\n\n// テンプレートの送信イベントからsubmitを呼ぶ\n// form.processingで送信中を表示する",
    "filename": "postForm.ts",
    "reveal": "delete",
    "explanation": "作成はpost、部分更新はpatch、削除はdeleteを使います。resetはフォームの入力を初期値に戻します。",
    "inertia": true,
    "options": [
      "patch",
      "get",
      "post",
      "delete"
    ],
    "answer": 3
  },
  {
    "id": "fill-inertia-advanced-2",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "既存投稿を削除し、成功した場合だけ入力を戻すために①を埋めてください。",
    "code": "// Vue版InertiaのuseFormを使用\nimport { useForm } from '@inertiajs/vue3';\nconst form = useForm({ title: '' });\n\nfunction submit() {\n  form.delete(\"/posts/7\", {\n    onSuccess: () => form.【①】(),\n  });\n}\n\n// テンプレートの送信イベントからsubmitを呼ぶ\n// form.processingで送信中を表示する",
    "filename": "postForm.ts",
    "reveal": "reset",
    "explanation": "作成はpost、部分更新はpatch、削除はdeleteを使います。resetはフォームの入力を初期値に戻します。",
    "inertia": true,
    "accepted": [
      "reset"
    ]
  },
  {
    "id": "fill-api-beginner-1",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "一覧を取得してJSON本文を読み取るために、①を埋めてください。",
    "code": "type Post = { id: number; title: string };\n\nasync function loadPosts(): Promise<Post[]> {\n  const response = await fetch('/api/posts', {\n    method: '【①】',\n  });\n  if (!response.ok) {\n    throw new Error('取得に失敗しました');\n  }\n  const posts: Post[] = await response.json();\n  return posts;\n}",
    "filename": "postsApi.ts",
    "reveal": "GET",
    "explanation": "取得はGETを使います。json()で応答本文をJSONとして解析します。",
    "inertia": false,
    "options": [
      "GET",
      "POST",
      "DELETE",
      "PATCH"
    ],
    "answer": 0
  },
  {
    "id": "fill-api-beginner-2",
    "difficulty": "beginner",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "一覧を取得してJSON本文を読み取るために、①を埋めてください。",
    "code": "type Post = { id: number; title: string };\n\nasync function loadPosts(): Promise<Post[]> {\n  const response = await fetch('/api/posts', {\n    method: 'GET',\n  });\n  if (!response.ok) {\n    throw new Error('取得に失敗しました');\n  }\n  const posts: Post[] = await response.【①】();\n  return posts;\n}",
    "filename": "postsApi.ts",
    "reveal": "json",
    "explanation": "取得はGETを使います。json()で応答本文をJSONとして解析します。",
    "inertia": false,
    "accepted": [
      "json"
    ]
  },
  {
    "id": "fill-api-intermediate-1",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "JSONで投稿を送信するために、①を埋めてください。",
    "code": "async function createPost(title: string) {\n  const response = await fetch('/api/posts', {\n    method: 'POST',\n    headers: {\n      'Content-Type': '【①】',\n    },\n    body: JSON.stringify({ title }),\n  });\n  if (!response.ok) throw new Error('保存失敗');\n  return response.json();\n}",
    "filename": "postsApi.ts",
    "reveal": "application/json",
    "explanation": "Content-TypeでJSON本文を伝え、JSON.stringifyでオブジェクトをJSON文字列へ変換します。",
    "inertia": false,
    "options": [
      "text/plain",
      "application/json",
      "text/html",
      "multipart/form-data"
    ],
    "answer": 1
  },
  {
    "id": "fill-api-intermediate-2",
    "difficulty": "intermediate",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "JSONで投稿を送信するために、①を埋めてください。",
    "code": "async function createPost(title: string) {\n  const response = await fetch('/api/posts', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n    },\n    body: JSON.【①】({ title }),\n  });\n  if (!response.ok) throw new Error('保存失敗');\n  return response.json();\n}",
    "filename": "postsApi.ts",
    "reveal": "stringify",
    "explanation": "Content-TypeでJSON本文を伝え、JSON.stringifyでオブジェクトをJSON文字列へ変換します。",
    "inertia": false,
    "accepted": [
      "stringify"
    ]
  },
  {
    "id": "fill-api-advanced-1",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-choice",
    "prompt": "204の削除成功で空の本文を解析しないように、①を埋めてください。",
    "code": "async function deletePost(id: number) {\n  const response = await fetch(`/api/posts/${id}`, {\n    method: 'DELETE',\n  });\n  if (!response.【①】) throw new Error('削除失敗');\n  if (response.status === 204) {\n    return;\n  }\n  const result = await response.json();\n  return result;\n}",
    "filename": "postsApi.ts",
    "reveal": "ok",
    "explanation": "okでHTTPの成功範囲を確認します。204 No Contentには本文がないのでJSON解析の前にreturnします。",
    "inertia": false,
    "options": [
      "bodyUsed",
      "redirected",
      "ok",
      "url"
    ],
    "answer": 2
  },
  {
    "id": "fill-api-advanced-2",
    "difficulty": "advanced",
    "topic": "connection",
    "kind": "fill-input",
    "prompt": "204の削除成功で空の本文を解析しないように、①を埋めてください。",
    "code": "async function deletePost(id: number) {\n  const response = await fetch(`/api/posts/${id}`, {\n    method: 'DELETE',\n  });\n  if (!response.ok) throw new Error('削除失敗');\n  if (response.status === 【①】) {\n    return;\n  }\n  const result = await response.json();\n  return result;\n}",
    "filename": "postsApi.ts",
    "reveal": "204",
    "explanation": "okでHTTPの成功範囲を確認します。204 No Contentには本文がないのでJSON解析の前にreturnします。",
    "inertia": false,
    "accepted": [
      "204"
    ]
  }
];
