import type { QuestStep } from './types';
import type { QuestStudy, TableSnapshot } from './studyTypes';
import { resourceTrials } from '../resourceQuestions';

// Original step IDs remain valid for old saves; each seal has a physical location.
const originalLessons: QuestStep[] = [
  {
    "id": "read-records",
    "title": "第二章：読解の書庫（1/5）",
    "description": "鏡の湖の「読解の書庫」で、第1の封印を解こう（1/5）。",
    "questionIntro": "Read 1/5：まず控えを読もう。Read は情報を取り出す操作じゃ。実習の Villager は villagers テーブルを扱う Eloquent モデルとする。 五つの封印を解き、奥の祭壇で欠片を手に入れよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "basics-crud-r",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-r-trial-0",
    "reminder": "鏡の湖の「読解の書庫」で、第1の封印を解こう（1/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-read-filter",
    "title": "第二章：読解の書庫（2/5）",
    "description": "鏡の湖の「読解の書庫」で、第2の封印を解こう（2/5）。",
    "questionIntro": "Read 2/5：where は条件で絞る、get は該当する行をまとめて読む。表とコードを照らしてみよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-read-filter",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-r-trial-1",
    "reminder": "鏡の湖の「読解の書庫」で、第2の封印を解こう（2/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-read-id",
    "title": "第二章：読解の書庫（3/5）",
    "description": "鏡の湖の「読解の書庫」で、第3の封印を解こう（3/5）。",
    "questionIntro": "Read 3/5：名簿の id は各行を区別する番号じゃ。ここでは Villager モデルの主キーを id とする。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-read-id",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-r-trial-2",
    "reminder": "鏡の湖の「読解の書庫」で、第3の封印を解こう（3/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-read-missing",
    "title": "第二章：読解の書庫（4/5）",
    "description": "鏡の湖の「読解の書庫」で、第4の封印を解こう（4/5）。",
    "questionIntro": "Read 4/5：検索が失敗する場合もある。find の結果が null なら、名前を読む前に分岐しよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-read-missing",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-r-trial-3",
    "reminder": "鏡の湖の「読解の書庫」で、第4の封印を解こう（4/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-read-no-write",
    "title": "第二章：読解の書庫（5/5）",
    "description": "鏡の湖の「読解の書庫」で、第5の封印を解こう（5/5）。",
    "questionIntro": "Read 5/5：検索結果を絞ることと、DBの行を消すことは別じゃ。結果と保存先を区別できるかな。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-read-no-write",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-r-trial-4",
    "reminder": "鏡の湖の「読解の書庫」で、第5の封印を解こう（5/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "collect-r",
    "title": "第二章：Readの記憶を取り戻す",
    "description": "読解の書庫の最奥にある記憶の祭壇に触れ、Rの欠片を入手しよう。",
    "npcId": "memory-r-altar",
    "trigger": {
      "type": "npc-talked",
      "npcId": "memory-r-altar"
    },
    "lines": [
      {
        "speaker": "Readの記憶",
        "face": "📜",
        "text": "五つの封印がほどけ、Rの記憶の欠片が手のひらに舞い降りた。眠る記録を読み解く。条件と取得結果を照合する。"
      },
      {
        "speaker": "語り手",
        "face": "📜",
        "text": "「Readの記憶の欠片」を入手した。取り戻した記憶は「たびのもくてき」に刻まれる。出口から平原へ戻り、次の記憶を探そう。"
      }
    ]
  },
  {
    "id": "update-address",
    "title": "第二章：改変の回廊（1/5）",
    "description": "石鳴り山脈の「改変の回廊」で、第1の封印を解こう（1/5）。",
    "questionIntro": "Update 1/5：控えが読めた。次は既存の村人の住所を直そう。Update は行を増やさず、対象の値を変更する。 五つの封印を解き、奥の祭壇で欠片を手に入れよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "basics-crud-u",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-u-trial-0",
    "reminder": "石鳴り山脈の「改変の回廊」で、第1の封印を解こう（1/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-update-target",
    "title": "第二章：改変の回廊（2/5）",
    "description": "石鳴り山脈の「改変の回廊」で、第2の封印を解こう（2/5）。",
    "questionIntro": "Update 2/5：取得した既存のモデルは、その行を表す。プロパティを変え、save で保存してみよう。以降、独自のイベント処理などはないものとする。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-update-target",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-u-trial-1",
    "reminder": "石鳴り山脈の「改変の回廊」で、第2の封印を解こう（2/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-update-save",
    "title": "第二章：改変の回廊（3/5）",
    "description": "石鳴り山脈の「改変の回廊」で、第3の封印を解こう（3/5）。",
    "questionIntro": "Update 3/5：手元のモデルとDBは同じものではない。変えた値を保存したか確認しよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-update-save",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-u-trial-2",
    "reminder": "石鳴り山脈の「改変の回廊」で、第3の封印を解こう（3/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-update-scope",
    "title": "第二章：改変の回廊（4/5）",
    "description": "石鳴り山脈の「改変の回廊」で、第4の封印を解こう（4/5）。",
    "questionIntro": "Update 4/5：更新前に対象を絞ろう。query()->update は、条件がなければ全行へ影響する。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-update-scope",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-u-trial-3",
    "reminder": "石鳴り山脈の「改変の回廊」で、第4の封印を解こう（4/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-update-count",
    "title": "第二章：改変の回廊（5/5）",
    "description": "石鳴り山脈の「改変の回廊」で、第5の封印を解こう（5/5）。",
    "questionIntro": "Update 5/5：住所を直すのは既存行の変更。行数と、変更後の値を分けて確かめるのじゃ。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-update-count",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-u-trial-4",
    "reminder": "石鳴り山脈の「改変の回廊」で、第5の封印を解こう（5/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "collect-u",
    "title": "第二章：Updateの記憶を取り戻す",
    "description": "改変の回廊の最奥にある記憶の祭壇に触れ、Uの欠片を入手しよう。",
    "npcId": "memory-u-altar",
    "trigger": {
      "type": "npc-talked",
      "npcId": "memory-u-altar"
    },
    "lines": [
      {
        "speaker": "Updateの記憶",
        "face": "📜",
        "text": "五つの封印がほどけ、Uの記憶の欠片が手のひらに舞い降りた。書き換えの術を学ぶ。対象を絞り、変化を確かめる。"
      },
      {
        "speaker": "語り手",
        "face": "📜",
        "text": "「Updateの記憶の欠片」を入手した。取り戻した記憶は「たびのもくてき」に刻まれる。出口から平原へ戻り、次の記憶を探そう。"
      }
    ]
  },
  {
    "id": "create-family",
    "title": "第二章：創生の工房（1/5）",
    "description": "深緑の森の「創生の工房」で、第1の封印を解こう（1/5）。",
    "questionIntro": "Create 1/5：住所が直った。次は未登録の家族じゃ。Create は新しい行を追加する。必要な入力も確かめよう。 五つの封印を解き、奥の祭壇で欠片を手に入れよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "basics-crud-c",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-c-trial-0",
    "reminder": "深緑の森の「創生の工房」で、第1の封印を解こう（1/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-create-save",
    "title": "第二章：創生の工房（2/5）",
    "description": "深緑の森の「創生の工房」で、第2の封印を解こう（2/5）。",
    "questionIntro": "Create 2/5：新しい家族を登録しよう。new で新規モデルを作り、必要な値を入れて save する。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-create-save",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-c-trial-1",
    "reminder": "深緑の森の「創生の工房」で、第2の封印を解こう（2/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-create-validate",
    "title": "第二章：創生の工房（3/5）",
    "description": "深緑の森の「創生の工房」で、第3の封印を解こう（3/5）。",
    "questionIntro": "Create 3/5：名簿に空の名前を入れないため、書き込み前に入力を検証しよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-create-validate",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-c-trial-2",
    "reminder": "深緑の森の「創生の工房」で、第3の封印を解こう（3/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-create-unpersisted",
    "title": "第二章：創生の工房（4/5）",
    "description": "深緑の森の「創生の工房」で、第4の封印を解こう（4/5）。",
    "questionIntro": "Create 4/5：new、値の代入、DBへの保存は別の段階じゃ。どこまで実行されたか追ってみよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-create-unpersisted",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-c-trial-3",
    "reminder": "深緑の森の「創生の工房」で、第4の封印を解こう（4/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-create-vs-schema",
    "title": "第二章：創生の工房（5/5）",
    "description": "深緑の森の「創生の工房」で、第5の封印を解こう（5/5）。",
    "questionIntro": "Create 5/5：名簿の「用紙の形式」と「記入する1行」は違う。既存テーブルへ家族を追加する方法を考えよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-create-vs-schema",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-c-trial-4",
    "reminder": "深緑の森の「創生の工房」で、第5の封印を解こう（5/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "collect-c",
    "title": "第二章：Createの記憶を取り戻す",
    "description": "創生の工房の最奥にある記憶の祭壇に触れ、Cの欠片を入手しよう。",
    "npcId": "memory-c-altar",
    "trigger": {
      "type": "npc-talked",
      "npcId": "memory-c-altar"
    },
    "lines": [
      {
        "speaker": "Createの記憶",
        "face": "📜",
        "text": "五つの封印がほどけ、Cの記憶の欠片が手のひらに舞い降りた。新しい命を名簿へ。入力を確かめ、記録を保存する。"
      },
      {
        "speaker": "語り手",
        "face": "📜",
        "text": "「Createの記憶の欠片」を入手した。取り戻した記憶は「たびのもくてき」に刻まれる。出口から平原へ戻り、次の記憶を探そう。"
      }
    ]
  },
  {
    "id": "delete-duplicate",
    "title": "第二章：忘却の墓所（1/5）",
    "description": "陽炎の砂漠の「忘却の墓所」で、第1の封印を解こう（1/5）。",
    "questionIntro": "Delete 1/5：家族の登録ができた。最後は不要な重複だけを消そう。Delete の前に、対象と影響を確認するのじゃ。 五つの封印を解き、奥の祭壇で欠片を手に入れよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "basics-crud-d",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-d-trial-0",
    "reminder": "陽炎の砂漠の「忘却の墓所」で、第1の封印を解こう（1/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-delete-target",
    "title": "第二章：忘却の墓所（2/5）",
    "description": "陽炎の砂漠の「忘却の墓所」で、第2の封印を解こう（2/5）。",
    "questionIntro": "Delete 2/5：名前が同じでも別の行じゃ。控えと照合して、削除する id を確定しよう。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-delete-target",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-d-trial-1",
    "reminder": "陽炎の砂漠の「忘却の墓所」で、第2の封印を解こう（2/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-delete-result",
    "title": "第二章：忘却の墓所（3/5）",
    "description": "陽炎の砂漠の「忘却の墓所」で、第3の封印を解こう（3/5）。",
    "questionIntro": "Delete 3/5：削除後に残る行を予測しよう。ここでは SoftDeletes を使わず、対象行をDBから削除する。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-delete-result",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-d-trial-2",
    "reminder": "陽炎の砂漠の「忘却の墓所」で、第3の封印を解こう（3/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-delete-preview",
    "title": "第二章：忘却の墓所（4/5）",
    "description": "陽炎の砂漠の「忘却の墓所」で、第4の封印を解こう（4/5）。",
    "questionIntro": "Delete 4/5：削除前に対象の中身を読み、控えと照合するのじゃ。確認操作そのものではデータを変えない。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-delete-preview",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-d-trial-3",
    "reminder": "陽炎の砂漠の「忘却の墓所」で、第4の封印を解こう（4/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "ledger-delete-transfer",
    "title": "第二章：忘却の墓所（5/5）",
    "description": "陽炎の砂漠の「忘却の墓所」で、第5の封印を解こう（5/5）。",
    "questionIntro": "Delete 5/5：名簿で学んだ対象の確認を、将来の掲示板へつなげよう。実際のアプリでは「操作してよい人か」もサーバーで確かめる。",
    "trigger": {
      "type": "question-answered",
      "questionId": "ledger-delete-transfer",
      "correct": true,
      "source": "quest"
    },
    "npcId": "memory-d-trial-4",
    "reminder": "陽炎の砂漠の「忘却の墓所」で、第5の封印を解こう（5/5）。 地図から入口への道筋を確認できる。"
  },
  {
    "id": "collect-d",
    "title": "第二章：Deleteの記憶を取り戻す",
    "description": "忘却の墓所の最奥にある記憶の祭壇に触れ、Dの欠片を入手しよう。",
    "npcId": "memory-d-altar",
    "trigger": {
      "type": "npc-talked",
      "npcId": "memory-d-altar"
    },
    "lines": [
      {
        "speaker": "Deleteの記憶",
        "face": "📜",
        "text": "五つの封印がほどけ、Dの記憶の欠片が手のひらに舞い降りた。残すべき記憶を守る。不要な行だけを見極めて消す。"
      },
      {
        "speaker": "語り手",
        "face": "📜",
        "text": "「Deleteの記憶の欠片」を入手した。取り戻した記憶は「たびのもくてき」に刻まれる。四つの欠片がそろった。石灯の村のオルへ戻り、名簿を復元しよう。"
      }
    ]
  }
];


const ledger: TableSnapshot = {
  columns: ['id', 'name', 'address'],
  rows: [['1', 'ユナ', '東通り'], ['2', 'オル', '西通り'], ['3', 'ミナ', '東通り']],
};
const duplicates: TableSnapshot = {
  columns: ledger.columns,
  rows: [['7', 'ソラ', '南通り'], ['8', 'ソラ', '南通り'], ['9', 'ミナ', '東通り']],
};
const fixedAddress: TableSnapshot = { columns: ledger.columns, rows: [['1', 'ユナ', '東通り'], ['2', 'オル', '北通り'], ['3', 'ミナ', '東通り']] };
const addedVillager: TableSnapshot = { columns: ledger.columns, rows: [...ledger.rows, ['4', 'ソラ', '南通り']] };
const noDuplicate: TableSnapshot = { columns: ledger.columns, rows: [['7', 'ソラ', '南通り'], ['9', 'ミナ', '東通り']] };
const unchanged = (objective: string, result: string, action: QuestStudy['action'], before = ledger): QuestStudy => ({ objective, result, action, before, after: before, mode: 'practice' });
const legacyStudy: Record<string, QuestStudy> = {
  'read-records': unchanged('CRUDの読み取りを理解する', 'Readは記録を読む操作。通常のresourceでは一覧のindexと詳細のshowに分かれる。', 'index'),
  'ledger-read-filter': unchanged('条件と取得結果を照合する', '一覧の取得結果は東通りのユナとミナ。DBの3行は変化しない。', 'index'),
  'ledger-read-id': unchanged('主キーで1件を特定する', 'id=2を取得するとオル1人。countは件数、allは全件を返す。', 'show'),
  'ledger-read-missing': unchanged('存在しない検索結果を扱う', 'find(99)はnull。分岐で「見つかりません」を返し、保存や削除は行わない。', 'show'),
  'ledger-read-no-write': unchanged('検索結果とDB本体を区別する', '検索結果だけを絞っても、DBには3行とも残る。', 'index'),
  'update-address': unchanged('既存行の変更を理解する', 'Updateは既存行の値を変更する仕事。editでフォームを表示し、updateで変更を保存する。', 'update'),
  'ledger-update-target': { objective: '1件を特定して住所を保存する', action: 'update', before: ledger, after: fixedAddress, result: 'id=2の住所だけ北通りになる。名前・他の行・行数は変わらない。' },
  'ledger-update-save': unchanged('手元の代入とDBの保存を区別する', 'モデルの値に代入しただけでsaveはない。DBのid=1の住所は東通りのまま。', 'update'),
  'ledger-update-scope': { objective: '更新する範囲を主キーで限定する', action: 'update', before: ledger, after: fixedAddress, result: 'id=2に絞ったupdateならオルだけの住所を直せる。条件なしでは全行が対象。' },
  'ledger-update-count': { objective: '更新後の値と行数を分けて確認する', action: 'update', before: ledger, after: fixedAddress, result: '既存1行の住所だけ修正され、行数は3のまま。' },
  'create-family': unchanged('新規行の追加を理解する', 'CRUDのCreateは新規作成。通常resourceではcreateがフォーム表示、storeが入力の保存を担当する。', 'store'),
  'ledger-create-save': { objective: '新規モデルの保存を判断する', action: 'store', before: ledger, after: addedVillager, result: 'ソラの行が1件増え、4人になる。次の自動採番が4である例。既存の3人はそのまま。' },
  'ledger-create-validate': unchanged('検証の失敗で新規保存を止める', '名前のrequiredに失敗するためsaveへ進まず、3人のまま。', 'store'),
  'ledger-create-unpersisted': unchanged('オブジェクト作成と永続化を区別する', 'newと代入だけではDBには追加されない。ソラを保存するにはsaveが必要。', 'store'),
  'ledger-create-vs-schema': { objective: '行の追加とテーブル構造の変更を区別する', action: 'store', before: ledger, after: addedVillager, result: '構造は足りているので新規モデルを保存する。ここでは次の自動採番を4とした例。' },
  'delete-duplicate': unchanged('不要な行を取り除く操作を理解する', 'CRUDのDeleteは削除。通常resourceではdestroyが対象の削除を担当する。', 'destroy', duplicates),
  'ledger-delete-target': { objective: '同名の正しい行を残して対象だけ削除する', action: 'destroy', before: duplicates, after: noDuplicate, result: '照合済みのid=8だけを消す。名前で絞ると正しいid=7も消してしまう。' },
  'ledger-delete-result': { objective: '削除後に残る主キーを確かめる', action: 'destroy', before: duplicates, after: noDuplicate, result: 'id=8だけが削除され、id=7と9が残る。SoftDeletesは使わない。' },
  'ledger-delete-preview': unchanged('削除前の照合と実際の削除を分ける', 'find(8)は確認するだけ。まだ削除していないので3行とも残る。', 'show', duplicates),
  'ledger-delete-transfer': unchanged('認可と対象の特定を組み合わせる', '投稿IDだけでなくサーバー上のログイン情報で投稿者を照合する。ここでは照合の必要性を判断した段階で、まだ削除しない。', 'destroy', { columns: ['id', 'title', 'user_id'], rows: [['21', '薬草ください', '5'], ['34', '隊員募集', '8']] }),
};
const dungeonNames = { r: '読解の書庫', u: '改変の回廊', c: '創生の工房', d: '忘却の墓所' };
const checkpointIntro = '新しい依頼じゃ。表とコードを自分で照合し、目的に合う結果を判断しよう。';

// Existing IDs and the four collect steps stay in their original order for saved games.
// A room may contain several consecutive questions at the same seal NPC.
export const chapterTwoLessons: QuestStep[] = [
  ...originalLessons.flatMap(step => {
    if (step.trigger.type !== 'question-answered') return [step];
    const match = step.npcId?.match(/^memory-([rucd])-trial-([0-4])$/);
    if (!match) return [step];
    const unit = match[1] as keyof typeof dungeonNames;
    const room = Number(match[2]);
    const additions = resourceTrials.filter(trial => trial.unit === unit && trial.afterStep === step.id);
    const total = additions.length + 1;
    const description = `${dungeonNames[unit]}の第${room + 1}の封印で実習を進めよう。全問正解すると次の扉が開く。`;
    const base: QuestStep = {
      ...step,
      title: `第二章：${dungeonNames[unit]} 第${room + 1}の封印（1/${total}）`,
      description,
      study: { ...legacyStudy[step.id], mode: room === 4 ? 'checkpoint' : 'practice' },
      questionIntro: room === 4 ? checkpointIntro : step.questionIntro,
      reminder: `${description} 同じ封印で続きから再開できる。地図から道筋を確かめよう。`,
    };
    return [base, ...additions.map((trial, index): QuestStep => ({
      id: trial.question.id,
      title: `第二章：${dungeonNames[unit]} 第${room + 1}の封印（${index + 2}/${total}）`,
      description,
      npcId: step.npcId,
      questionIntro: room === 4 ? checkpointIntro : trial.intro,
      reminder: `${description} この封印にはまだ実習が残っている。同じ封印に話しかけよう。`,
      study: trial.study,
      trigger: { type: 'question-answered', questionId: trial.question.id, correct: true, source: 'quest' },
    }))];
  }),
  ...resourceTrials.filter(trial => trial.unit === 'checkpoint').map((trial, index): QuestStep => ({
    id: trial.question.id,
    title: `第二章：七つの記憶をつなぐ（${index + 1}/7）`,
    description: '石灯の村のオルと、掲示板を題材に七つの仕事を確かめよう。',
    npcId: 'mountainGuide',
    questionIntro: index === 0
      ? '四つの欠片がそろった。名簿を戻す前に、掲示板で七つの仕事を確かめよう。各依頼は表に示した状態から始まる独立した演習じゃ。通常のRoute::resourceを使う。'
      : '次の依頼じゃ。表と状況を照合して判断しよう。各依頼は表の状態から始まる。',
    reminder: '四つの欠片を持って石灯の村の記録係オルに話しかけよう。途中から続けられる。',
    study: trial.study,
    trigger: { type: 'question-answered', questionId: trial.question.id, correct: true, source: 'quest' },
  })),
];
