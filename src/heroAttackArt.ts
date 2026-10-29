type Rect = readonly [number,number,number,number];
type AttackArt = {name:string;src:string;width:number;height:number;scale:number;frames:readonly {box:Rect;anchor:readonly [number,number];clips?:readonly Rect[]}[]};

// Source PNGs are untouched. Measured frame bounds retain complete sword tips,
// and foot anchors keep the hero grounded as his arms and torso change pose.
export const heroAttackArt:readonly AttackArt[] = [
  {name:"cut",src:"sprites/hero-attack-cut.png",width:1536,height:1024,scale:1.2,frames:[
    {"box":[27,128,511,368],"anchor":[332.0,492]},
    {"box":[621,96,352,400],"anchor":[768.5,492]},
    {"box":[972,153,540,343],"anchor":[1288.5,492]},
    {"box":[12,612,503,338],"anchor":[314,946]},
    {"box":[528,602,476,353],"anchor":[812.0,951]},
    {"box":[1017,602,495,353],"anchor":[1294.0,951]},
  ]},
  {name:"sweep",src:"sprites/hero-attack-sweep.png",width:1536,height:1024,scale:1.23,frames:[
    {"box":[44,137,485,359],"anchor":[308.5,492]},
    {"box":[630,58,326,438],"anchor":[767.5,492],"clips":[[630,58,270,440],[900,58,56,170],[900,310,56,190]]},
    {"box":[909,140,584,355],"anchor":[1300.5,491],"clips":[[974,140,520,360],[909,248,70,44]]},
    {"box":[43,588,482,369],"anchor":[214.0,953]},
    {"box":[537,589,469,368],"anchor":[794.5,953]},
    {"box":[1041,584,471,373],"anchor":[1300.5,953]},
  ]},
  {name:"thrust",src:"sprites/hero-attack-thrust.png",width:1536,height:1024,scale:1.315,frames:[
    {"box":[45,166,470,336],"anchor":[315.5,498]},
    {"box":[626,81,314,421],"anchor":[763.5,498]},
    {"box":[980,182,525,320],"anchor":[1321.5,498]},
    {"box":[23,626,576,326],"anchor":[365.0,948]},
    {"box":[619,625,418,334],"anchor":[847.0,955]},
    {"box":[1061,629,453,331],"anchor":[1331.0,956]},
  ]},
];
