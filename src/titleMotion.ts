import type {ObjectMotionSpec} from './motion/ObjectMotion';

// Positions are original-image pixels, never viewport percentages.
export const titleArtwork={width:1672,height:941};
export const titleLights:{id:string;motion:ObjectMotionSpec;color:string;path:string}[]=[
  {id:'gate-inscription',motion:{preset:'glow',duration:7.8,delay:-2.5,strength:.7},color:'#8ee8ff',path:'M1323 133L1339 151L1323 172L1307 153Z M1323 142L1315 153L1323 163L1331 152Z'},
  {id:'tree-lantern',motion:{preset:'glow',duration:5.6,delay:-1.2,strength:.55},color:'#ffe7a1',path:'M1533 336H1551L1550 361H1534Z'},
];
