import type {ObjectMotionSpec} from './motion/ObjectMotion';

// Positions are original-image pixels, never viewport percentages.
export const titleArtwork={width:1672,height:941};
export const titleLights:{id:string;motion:ObjectMotionSpec;color:string;path:string;halo:{x:number;y:number;rx:number;ry:number}}[]=[
  {id:'gate-inscription',motion:{preset:'glow',duration:3.6,delay:-1,strength:1},color:'#8ee8ff',path:'M1323 133L1339 151L1323 172L1307 153Z M1323 142L1315 153L1323 163L1331 152Z',halo:{x:1323,y:153,rx:54,ry:66}},
  {id:'tree-lantern',motion:{preset:'glow',duration:2.8,delay:-.4,strength:1},color:'#ffe7a1',path:'M1533 336H1551L1550 361H1534Z',halo:{x:1542,y:349,rx:44,ry:52}},
];
