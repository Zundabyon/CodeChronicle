import type { Area } from './content';

export type LibraryWing = 'frontend' | 'backend';
export const libraryWingLabel:Record<LibraryWing,string> = {frontend:'西棟・フロントエンド',backend:'東棟・バックエンド'};
export const libraryFloors:{area:Area;wing:LibraryWing;floor:number;language:string}[] = [
  {area:'scholarHouse',wing:'frontend',floor:1,language:'JavaScript'},
  {area:'librarySecondFloor',wing:'frontend',floor:2,language:'TypeScript'},
  {area:'libraryThirdFloor',wing:'frontend',floor:3,language:'React'},
  {area:'libraryFourthFloor',wing:'frontend',floor:4,language:'Vue'},
  {area:'backendLibrary',wing:'backend',floor:1,language:'PHP'},
  {area:'backendSecondFloor',wing:'backend',floor:2,language:'Laravel'},
];

export type LibraryBook = { id:string; title:string; explanation:string; code:string; result:string; takeaway:string };
export type LibraryShelf = { id:string; language:string; topic:string; wing:LibraryWing; floor:number; source?:string; x:number; y:number; introduction:string; books:LibraryBook[] };
const book=(id:string,title:string,explanation:string,code:string,result:string,takeaway:string):LibraryBook=>({id,title,explanation,code,result,takeaway});

export const libraryShelves:LibraryShelf[] = [
  {id:'js-variables',language:'JavaScript',topic:'変数',wing:'frontend',floor:1,x:2,y:2,introduction:'値に名前をつけるところから。一冊ずつ、書き方を増やそう。',books:[
    book('js-variables-01','01 名前のついた値','constで、値に名前をつけます。ここではgoldという名前に10を結びつけます。','const gold = 10;','goldという名前で、10を使える。','この一冊では「const 名前 = 値;」の形だけ覚えよう。'),
    book('js-variables-02','02 値をのぞく','console.logは、値を確認するための命令です。前の本でつけた名前を渡してみよう。','const gold = 10;\nconsole.log(gold);','10','名前を書くと、その名前に結びついた値を使えます。'),
    book('js-variables-03','03 入れ直せる名前','letで作った変数には、別の値を入れ直せます。constの変数には再代入できません。','let gold = 10;\ngold = 15;\nconsole.log(gold);','15','二度目はletを書かず、gold = 15;で入れ直します。'),
  ]},
  {id:'js-conditions',language:'JavaScript',topic:'条件分岐',wing:'frontend',floor:1,x:5,y:2,introduction:'比べる、確かめる、道を選ぶ。それぞれ別の本で。',books:[
    book('js-conditions-01','01 大きさを比べる','>=は「以上かどうか」を調べます。比べた結果はtrueかfalseになります。','console.log(15 >= 10);\nconsole.log(5 >= 10);','true / false（順に表示）','trueは成り立つ、falseは成り立たない。まずは比較だけ。'),
    book('js-conditions-02','02 もし成り立つなら','ifは、条件がtrueのときに{}の中を動かします。','const gold = 15;\nif (gold >= 10) {\n  console.log("買える");\n}','買える','条件がfalseなら、{}の中は動きません。'),
    book('js-conditions-03','03 そうでなければ','elseには、ifの条件がfalseだったときの処理を書きます。','const gold = 5;\nif (gold >= 10) {\n  console.log("買える");\n} else {\n  console.log("足りない");\n}','足りない','ifとelseのどちらか片方が動きます。'),
  ]},
  {id:'js-functions',language:'JavaScript',topic:'関数',wing:'frontend',floor:1,x:8,y:2,introduction:'まず呼び出す。次に値を渡す。最後に結果を受け取る。',books:[
    book('js-functions-01','01 処理に名前をつける','functionで処理に名前をつけます。名前の後ろに()をつけると呼び出せます。','function greet() {\n  console.log("こんにちは");\n}\ngreet();','こんにちは','作っただけでは処理は動きません。greet()が呼び出しです。'),
    book('js-functions-02','02 値を渡す','関数が受け取る値を引数と呼びます。この関数はnameという名前で値を受け取ります。','function greet(name) {\n  console.log(name);\n}\ngreet("旅人");','旅人','呼び出しの"旅人"が、関数の中のnameに渡ります。'),
    book('js-functions-03','03 結果を返す','returnは、関数を呼んだ場所に結果を返します。','function heal(hp) {\n  return hp + 5;\n}\nconst nextHp = heal(10);\nconsole.log(nextHp);','15','画面に表示するconsole.logと、値を返すreturnは役割が違います。'),
  ]},
  {id:'ts-types',language:'TypeScript',topic:'型',wing:'frontend',floor:2,x:2,y:2,introduction:'JavaScriptに加わる型の約束。値の種類を一つずつ知ろう。',books:[
    book('ts-types-01','01 数値の約束','変数名の後ろの: numberで、数値を使う約束を表せます。','const gold: number = 10;','goldの型はnumber。','numberの変数に文字列を入れると、型チェックでエラーになります。'),
    book('ts-types-02','02 文字の約束','stringは文字列の型です。文字列は引用符で囲みます。','const hero: string = "旅人";','heroの型はstring。','"10"も、引用符で囲めば文字列です。数値の10とは種類が違います。'),
    book('ts-types-03','03 二つの答え','booleanはtrueとfalseを扱う型。条件が成り立つかなどを表します。','const ready: boolean = true;','readyの型はboolean。','trueに引用符はつけません。"true"は文字列です。'),
  ]},
  {id:'ts-arrays',language:'TypeScript',topic:'配列',wing:'frontend',floor:2,x:5,y:2,introduction:'持ち物を並べて、取り出して、数えてみよう。',books:[
    book('ts-arrays-01','01 値を並べる','配列は複数の値を順番にまとめるもの。string[]は文字列の配列という型です。','const items: string[] = ["やくそう", "かぎ"];','二つの文字列をまとめた配列。','角かっこ[]の中で、値をカンマで区切ります。'),
    book('ts-arrays-02','02 一つ取り出す','配列の位置は0から数えます。[0]が最初の値です。','const items: string[] = ["やくそう", "かぎ"];\nconsole.log(items[0]);','やくそう','[1]なら二つ目の「かぎ」。最初が0なのを覚えよう。'),
    book('ts-arrays-03','03 個数を数える','配列の.lengthで、入っている値の個数を調べられます。','const items: string[] = ["やくそう", "かぎ"];\nconsole.log(items.length);','2','位置は0から数えても、個数はそのまま2個です。'),
  ]},
  {id:'ts-functions',language:'TypeScript',topic:'関数の型',wing:'frontend',floor:2,x:8,y:2,introduction:'西棟1階で読んだ関数に、少しずつ型をつけていこう。',books:[
    book('ts-functions-01','01 引数の型','関数の引数にも型をつけられます。ここでは数値を受け取る約束です。','function showHp(hp: number) {\n  console.log(hp);\n}\nshowHp(10);','10','showHp("十")は、引数の型チェックでエラーになります。'),
    book('ts-functions-02','02 戻り値の型','引数のかっこの後ろに、返す値の型を書けます。','function heal(hp: number): number {\n  return hp + 5;\n}','数値を受け取り、数値を返す関数。','最後の: numberが、returnで返す値の約束です。'),
    book('ts-functions-03','03 型を推測する','TypeScriptは、書かれた値から型を推測することもできます。','function heal(hp: number) {\n  return hp + 5;\n}\nconst nextHp = heal(10);','nextHpの型はnumberと推測される。','すべての型を毎回書かなくても、型チェックは働きます。'),
  ]},
  {id:'php-variables',language:'PHP',topic:'変数',wing:'backend',floor:1,x:2,y:2,introduction:'PHPの本は<?phpから。$のついた名前に慣れよう。',books:[
    book('php-variables-01','01 $のついた名前','PHPの変数名は$から始まります。=で値を入れ、文の終わりに;をつけます。','<?php\n$gold = 10;','$goldに10が入る。','<?phpはPHPのコードの始まりを表します。'),
    book('php-variables-02','02 値を出力する','echoで値を出力します。変数名を渡すと、その値が出力されます。','<?php\n$gold = 10;\necho $gold;','10','echo $gold;で、名前ではなく値の10が出ます。'),
    book('php-variables-03','03 値を入れ直す','同じ変数に=で別の値を入れると、新しい値に変わります。','<?php\n$gold = 10;\n$gold = 15;\necho $gold;','15','上から順に動くので、最後に入れた15が出力されます。'),
  ]},
  {id:'php-conditions',language:'PHP',topic:'条件分岐',wing:'backend',floor:1,x:5,y:2,introduction:'PHPでも、条件を比べてから道を選ぼう。',books:[
    book('php-conditions-01','01 以上を調べる','>=は「左が右以上か」を調べる比較です。結果はtrueかfalseになります。','<?php\n$gold = 10;\n$canBuy = $gold >= 10;','$canBuyはtrue。','「以上」なので、同じ10のときもtrueになります。'),
    book('php-conditions-02','02 条件で動かす','ifのかっこの中がtrueなら、{}の中を動かします。','<?php\n$gold = 15;\nif ($gold >= 10) {\n  echo "買える";\n}','買える','5 >= 10はfalseなので、$goldが5なら何も出力されません。'),
    book('php-conditions-03','03 別の道を用意する','elseは、ifの条件がfalseのときに動きます。','<?php\n$gold = 5;\nif ($gold >= 10) {\n  echo "買える";\n} else {\n  echo "足りない";\n}','足りない','条件によって、二つの道から一つを選びます。'),
  ]},
  {id:'php-functions',language:'PHP',topic:'関数',wing:'backend',floor:1,x:8,y:2,introduction:'まとめる、渡す、返す。PHPの関数も三冊に分けて。',books:[
    book('php-functions-01','01 処理を呼び出す','functionで名前をつけた処理を作り、名前()で呼び出します。','<?php\nfunction greet() {\n  echo "こんにちは";\n}\ngreet();','こんにちは','関数を作ることと、呼び出すことは別です。'),
    book('php-functions-02','02 引数を受け取る','呼び出すときに渡した値を、関数の引数で受け取ります。','<?php\nfunction greet($name) {\n  echo $name;\n}\ngreet("旅人");','旅人','PHPでは、引数の名前にも$がつきます。'),
    book('php-functions-03','03 戻り値を受け取る','returnで結果を返すと、呼び出した側で変数に入れられます。','<?php\nfunction heal($hp) {\n  return $hp + 5;\n}\n$nextHp = heal(10);\necho $nextHp;','15','echoは出力、returnは結果を返す処理です。'),
  ]},
  {id:'react-components',language:'React',topic:'コンポーネント',wing:'frontend',floor:3,x:2,y:2,source:'https://react.dev/learn',introduction:'JavaScriptの関数から、画面の小さな部品へ。',books:[
    book('react-components-01','01 画面の部品を作る','Reactでは、マークアップを返す関数をコンポーネントとして使えます。','function Greeting() {\n  return <p>こんにちは</p>;\n}','「こんにちは」と表示する部品の定義。','この例はJSXです。部品の名前は大文字で始めます。'),
    book('react-components-02','02 部品を置く','作ったコンポーネントは、タグの形で別の部品の中に置けます。','function Greeting() {\n  return <p>こんにちは</p>;\n}\nfunction App() {\n  return <Greeting />;\n}','Appを表示すると「こんにちは」が出る。','<Greeting />は、Greetingという部品を使う書き方です。'),
    book('react-components-03','03 値を表示する','JSXの{}の中には、JavaScriptの式を書けます。','function Status() {\n  const hp = 10;\n  return <p>HP: {hp}</p>;\n}','HP: 10','文字をそのまま書く場所と、{}で値を埋め込む場所を見分けよう。'),
  ]},
  {id:'react-props',language:'React',topic:'props',wing:'frontend',floor:3,x:5,y:2,source:'https://react.dev/learn/passing-props-to-a-component',introduction:'親から子へ渡すものを、一つずつ見てみよう。',books:[
    book('react-props-01','01 親から渡す','コンポーネントに渡す入力をpropsと呼びます。タグの属性として渡せます。','<Hero name="旅人" />','Heroにnameという入力を渡す。','この断片では、Heroという部品が別に定義されているとします。'),
    book('react-props-02','02 子で受け取る','関数の引数でpropsを受け取れます。{ name }はnameという入力を取り出す書き方です。','function Hero({ name }) {\n  return <p>{name}</p>;\n}','nameに「旅人」を渡すと、旅人と表示する。','この本の例は型注釈のないJavaScriptとJSXです。'),
    book('react-props-03','03 数値を渡す','JSXの属性でも、{}の中にはJavaScriptの値を書けます。','function Status({ hp }) {\n  return <p>HP: {hp}</p>;\n}\n// 親のJSXに置く\n<Status hp={10} />','HP: 10','hp={10}は数値、hp="10"は文字列を渡します。'),
  ]},
  {id:'react-state',language:'React',topic:'state',wing:'frontend',floor:3,x:8,y:2,source:'https://react.dev/learn/state-a-components-memory',introduction:'変化する値を覚えておく、Reactの仕組み。',books:[
    book('react-state-01','01 値を覚えておく','useStateは、コンポーネントが値を覚えるための仕組みです。最初の値を渡します。',"import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <p>{count}</p>;\n}",'最初は0を表示する。','countが今の値、setCountが更新を頼む関数です。'),
    book('react-state-02','02 クリックを受け取る','onClickに関数を渡すと、クリックされたときに動きます。','function Notice() {\n  function handleClick() {\n    console.log("押した");\n  }\n  return <button onClick={handleClick}>押す</button>;\n}','クリックするとコンソールに「押した」。','handleClickを渡します。handleClick()と書いて今すぐ呼び出さないように。'),
    book('react-state-03','03 値を更新する','stateの更新関数を呼ぶと、Reactに次の表示への更新を頼めます。',"import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(n => n + 1)}>\n      {count}\n    </button>\n  );\n}",'クリックするたびに、0、1、2…と表示が変わる。','nは更新前の値。直接countを書き換える代わりにsetCountを使います。'),
  ]},
  {id:'vue-template',language:'Vue',topic:'テンプレート',wing:'frontend',floor:4,x:2,y:2,source:'https://vuejs.org/guide/essentials/template-syntax.html',introduction:'Vueの部品の形と、画面への表示から始めよう。',books:[
    book('vue-template-01','01 画面を書く場所','Vueの単一ファイルコンポーネントでは、templateに画面を書きます。','<template>\n  <p>こんにちは</p>\n</template>','こんにちは','この本のコードは.vueファイルに書く例です。'),
    book('vue-template-02','02 値を文字にする','{{ }}で、script setupに用意した値を文字として表示します。','<script setup>\nconst name = "旅人";\n</script>\n\n<template>\n  <p>{{ name }}</p>\n</template>','旅人','{{ name }}の部分が、nameの値になります。'),
    book('vue-template-03','03 属性に値を渡す',':の後ろに属性名を書くと、属性にJavaScriptの値を渡せます。','<script setup>\nconst message = "道具を見る";\n</script>\n\n<template>\n  <button :title="message">道具</button>\n</template>','ボタンのtitle属性に「道具を見る」が入る。',':titleはv-bind:titleの省略形です。'),
  ]},
  {id:'vue-ref',language:'Vue',topic:'ref',wing:'frontend',floor:4,x:5,y:2,source:'https://vuejs.org/guide/essentials/reactivity-fundamentals.html',introduction:'値の変化を表示につなげる、小さな仕組み。',books:[
    book('vue-ref-01','01 変わる値を用意する','refで、変更を追跡できる値を用意します。最初の値を渡します。',"<script setup>\nimport { ref } from 'vue';\nconst count = ref(0);\n</script>",'countは、最初の値0を持つref。','この本では値の用意だけ。表示は次の一冊で。'),
    book('vue-ref-02','02 テンプレートで読む','templateでは、refを{{ }}に書いて値を表示できます。',"<script setup>\nimport { ref } from 'vue';\nconst count = ref(0);\n</script>\n\n<template>{{ count }}</template>",'0','テンプレートではrefの値が自動で取り出されます。'),
    book('vue-ref-03','03 scriptで更新する','scriptの中では、refの.valueを読み書きします。',"import { ref } from 'vue';\nconst count = ref(0);\ncount.value = count.value + 1;\nconsole.log(count.value);",'1','この例はscript setupの中身。.valueをつける場所を覚えよう。'),
  ]},
  {id:'vue-events',language:'Vue',topic:'イベント',wing:'frontend',floor:4,x:8,y:2,source:'https://vuejs.org/guide/essentials/event-handling.html',introduction:'クリックと処理を、一つずつ結びつけよう。',books:[
    book('vue-events-01','01 クリックを受け取る','@clickは、クリックされたときの処理を指定します。','<script setup>\nfunction greet() {\n  console.log("こんにちは");\n}\n</script>\n\n<template>\n  <button @click="greet">話す</button>\n</template>','押すとコンソールに「こんにちは」。','@clickはv-on:clickの省略形です。'),
    book('vue-events-02','02 引数を渡す','イベントの式から関数を呼ぶとき、引数を渡せます。','<script setup>\nfunction greet(name) {\n  console.log(name);\n}\n</script>\n\n<template>\n  <button @click="greet(\'旅人\')">話す</button>\n</template>','押すとコンソールに「旅人」。','クリックしたときに、greetへ名前が渡ります。'),
    book('vue-events-03','03 クリックで表示を変える','イベントの処理でrefを更新すると、その値を使う表示も更新されます。',"<script setup>\nimport { ref } from 'vue';\nconst count = ref(0);\nfunction add() {\n  count.value += 1;\n}\n</script>\n\n<template>\n  <button @click=\"add\">{{ count }}</button>\n</template>",'クリックするたび、0、1、2…と表示が変わる。','イベントの本とrefの本が、ここでつながります。'),
  ]},
  {id:'laravel-routes',language:'Laravel',topic:'ルート',wing:'backend',floor:2,x:2,y:2,source:'https://laravel.com/docs/routing',introduction:'PHPで書くLaravel。まずはURLと応答を結びつけよう。',books:[
    book('laravel-routes-01','01 URLに応答する','routes/web.phpに、GETリクエストの行き先を書けます。',"use Illuminate\\Support\\Facades\\Route;\n\nRoute::get('/hello', function () {\n    return 'こんにちは';\n});",'GET /helloへアクセスすると「こんにちは」。','この例はLaravelプロジェクトのroutes/web.phpに書く部分です。'),
    book('laravel-routes-02','02 URLから値を受け取る','URLの{名前}の部分を、ルートパラメータとして受け取れます。',"Route::get('/heroes/{name}', function (string $name) {\n    return $name;\n});",'GET /heroes/noaなら「noa」。','この棚の続きの例では、最初の本と同じRouteのimportを使います。'),
    book('laravel-routes-03','03 ルートに名前をつける','->name()で、ルートに名前をつけられます。URLのパスとは別の名前です。',"Route::get('/hello', function () {\n    return 'こんにちは';\n})->name('hello');",'このルートの名前はhello。','名前を使えば、コードからルートを指し示せます。'),
  ]},
  {id:'laravel-controllers',language:'Laravel',topic:'コントローラ',wing:'backend',floor:2,x:5,y:2,source:'https://laravel.com/docs/controllers',introduction:'ルートが受けたお願いを、処理の担当へ渡そう。',books:[
    book('laravel-controllers-01','01 担当のひな形を作る','ArtisanはLaravelのコマンドラインツール。make:controllerでクラスのひな形を作れます。','php artisan make:controller GreetingController','app/Http/Controllers/GreetingController.phpを作成。','Laravelプロジェクトのディレクトリで実行するコマンドです。'),
    book('laravel-controllers-02','02 処理を書く','作ったコントローラに、応答するメソッドを書きます。',"namespace App\\Http\\Controllers;\n\nclass GreetingController extends Controller\n{\n    public function show()\n    {\n        return 'こんにちは';\n    }\n}",'showを呼ぶと「こんにちは」を返す。','この例はPHPファイルの<?phpに続く部分です。'),
    book('laravel-controllers-03','03 ルートから呼ぶ','ルートにクラスとメソッドを指定して、処理を担当させます。',"use App\\Http\\Controllers\\GreetingController;\nuse Illuminate\\Support\\Facades\\Route;\n\nRoute::get('/hello', [GreetingController::class, 'show']);",'GET /helloでGreetingControllerのshowが動く。','この本のコードはroutes/web.phpに書きます。'),
  ]},
  {id:'laravel-validation',language:'Laravel',topic:'バリデーション',wing:'backend',floor:2,x:8,y:2,source:'https://laravel.com/docs/validation',introduction:'受け取った入力を、使う前に確かめよう。',books:[
    book('laravel-validation-01','01 入力を受け取る','コントローラのメソッドでRequestを受け取り、inputで入力を読み取れます。',"use Illuminate\\Http\\Request;\n\n// コントローラ内のメソッド\npublic function store(Request $request)\n{\n    $title = $request->input('title');\n}",'titleという入力を$titleに受け取る。','この段階では、入力が正しいかはまだ確かめていません。'),
    book('laravel-validation-02','02 必須の入力を確かめる','Requestのvalidateでルールを指定します。requiredは、入力があり空でないことを求めます。',"// storeメソッド内\n$validated = $request->validate([\n    'title' => ['required'],\n]);",'titleが空ならバリデーションに失敗する。','失敗時の応答はリクエストによって異なります。通常のフォーム送信なら元の画面へ戻ります。'),
    book('laravel-validation-03','03 文字の長さを確かめる','stringとmaxを組み合わせて、文字列であることと最大の長さを確かめます。',"// storeメソッド内\n$validated = $request->validate([\n    'title' => ['required', 'string', 'max:50'],\n]);",'titleに、必須・文字列・最大50文字のルールを適用。','使うのは検証済みの$validated。DBへの保存は、まだ別の学習です。'),
  ]},
];

const knownBookIds=new Set(libraryShelves.flatMap(shelf=>shelf.books.map(book=>book.id)));
export function normalizeReadBooks(value:unknown):string[] {
  return Array.isArray(value)?[...new Set(value.filter((id):id is string=>typeof id==='string'&&knownBookIds.has(id)))]:[];
}

export function normalizeBookmarks(value:unknown):Record<string,string> {
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  return Object.fromEntries(Object.entries(value).filter(([shelfId,bookId])=>
    typeof bookId==='string'&&libraryShelves.some(shelf=>shelf.id===shelfId&&shelf.books.some(book=>book.id===bookId))));
}
