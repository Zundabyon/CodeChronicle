import type { Enemy, Point } from '../content';

// Two routes around the outer chambers, with side rooms and short dead ends.
// Kept as authored cells so walls, enemy placement and navigation share one source.
export const dungeonTiles:string[]=[
  '############################',
  '########........############',
  '########........############',
  '########........##########.#',
  '###########.##############.#',
  '##.....##..g...####......#.#',
  '##.........g...............#',
  '##.....##..g...####......###',
  '##.....############......###',
  '#####.#################.####',
  '#####.####......#######.####',
  '##......##......####......##',
  '##.#............####....#.##',
  '##......##......####......##',
  '##......############......##',
  '####.#################.#####',
  '####.#################.#####',
  '#....#################.#####',
  '#.##.###........######.#####',
  '####.....gggggg........#####',
  '########..g.....############',
  '##########g#################',
];
export const dungeonEntry:Point={x:10,y:20};
export const dungeonExit:Point={x:10,y:21};
export const dungeonEnemies:Enemy[]=[
  {id:'d1',name:'ヌルシャドウ',attackName:'断片斬り',x:5,y:13,icon:'♢'},
  {id:'d2',name:'コマンドゴースト',attackName:'コマンドの呪縛',x:22,y:12,icon:'♟'},
  {id:'d3',name:'キャッシュキーパー',attackName:'記憶侵食',x:12,y:6,icon:'◆'},
  {id:'d4',name:'遺跡のスタックスケルトン',attackName:'錆びた剣',x:4,y:8,icon:'♟'},
  {id:'d5',name:'モックミミック',attackName:'宝箱の噛みつき',x:13,y:11,icon:'▣'},
  {id:'d6',name:'遺跡の非同期ウィスプ',attackName:'忘却の火花',x:21,y:7,icon:'✧'},
  {id:'d7',name:'石碑のスタックスケルトン',attackName:'骨刃',x:26,y:4,icon:'♟'},
  {id:'boss',name:'CLIゲートガーディアン',attackName:'封印の雷',x:10,y:1,icon:'♛',boss:true},
];
