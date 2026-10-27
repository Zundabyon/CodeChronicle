import type { Question } from './content';
// Match exact option text, so changing or reordering options cannot attach a different explanation.
const reasons:Record<string,Record<string,string>>={
  'r-b-1':{'マイグレーション':'マイグレーションはデータベースの構造を管理するものです。Reactの画面の部品はコンポーネントです。','ルート':'ルートはURLと処理の行き先を結びつけます。画面を再利用する部品の名前とは役割が違います。','ミドルウェア':'ミドルウェアはリクエストの前後に共通処理を挟む仕組みです。Reactの画面の部品はコンポーネントです。'},
  'r-b-2':{'state':'stateはコンポーネントが保持する状態です。親から子への入力はpropsと呼びます。','route':'routeはURLの行き先を表します。子コンポーネントへの入力はpropsです。','migration':'migrationはデータベースの構造変更を管理します。コンポーネントへ値を渡す仕組みではありません。'},
  'r-b-3':{'props':'propsは親から受け取る入力です。部品自身が更新して覚える値はstateです。','controller':'controllerはサーバー側のリクエスト処理などを整理します。Reactで変化する値を保持するのはstateです。','schema':'schemaはデータの構造を表します。Reactの再描画に使う状態の名前はstateです。'},
  'v-b-3':{'${value}':'${value}はJavaScriptのテンプレートリテラル内で使う書き方です。Vueのtemplateのテキスト補間は{{ value }}です。','<% value %>':'この構文はVueのテキスト補間ではありません。Vueでは二重波括弧を使います。','#value':'#valueではVueの値をテキストとして展開できません。{{ value }}と書きます。'},
  'v-b-4':{'@route':'@はイベント処理の省略記法ですが、クリックのイベント名はclickです。@clickを使います。','#click':'#clickはVueのクリックイベントを受け取る記法ではありません。@clickを使います。','v-props':'v-propsというクリック用の指示はありません。イベントにはv-on:clickまたは@clickを使います。'},
  'l-b-1':{'コンポーネント':'コンポーネントは画面などを構成する部品です。LaravelでURLと処理を結ぶのはルートです。','props':'propsはコンポーネントなどへ渡す入力です。URLの行き先を設定する名前ではありません。','ref':'refはVueなどで値の変化を追跡するときに使います。LaravelのURLと処理の対応はルートで定義します。'},
};
export function wrongChoiceReason(question:Question,selected:unknown):string|null {
  if(typeof selected!=='number'||selected===question.answer)return null;
  const option=question.options?.[selected];return option?reasons[question.id]?.[option]??null:null;
}
