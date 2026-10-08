import type { Area } from '../content';
import type { PropId } from './catalog';
import type { PropPlacement } from './maps';

// Decorations stay separate from terrain, doors and the legacy map adapter.
const props=(prefix:string,placements:[PropId,number,number][]):PropPlacement[]=>
  placements.map(([chip,x,y],i)=>({id:`decor-${prefix}-${i}-${chip}`,chip,x,y}));
const room=(name:string,extras:[PropId,number,number][])=>props(name,[
  ['plant',1,1],['lantern',8,1],['rug',4,6],...extras,
]);
export const mapDecorations:Partial<Record<Area,PropPlacement[]>>={
  home:room('home',[
    ['stove',1,2],['diningTable',6,2],['chair',6,3],['chair',8,3],
    ['plant',9,6],['barrel',1,5],['crate',1,6],['books',7,1],
  ]),
  elderHouse:room('elder',[
    ['diningTable',6,2],['chair',6,3],['books',8,1],['shelf',1,3],['books',1,5],
  ]),
  scholarHouse:room('scholar',[
    ['diningTable',6,2],['chair',6,3],['books',8,1],['shelf',1,3],['potions',1,5],['books',9,3],
  ]),
  childHouse:room('child',[
    ['stove',1,3],['diningTable',6,2],['chair',6,3],['books',2,5],['flowers',8,2],
  ]),
  guestHouse:room('inn',[
    ['bed',1,3],['bed',1,5],['diningTable',6,2],['chair',6,3],['barrel',9,2],['crate',9,3],
  ]),
  weaponShop:room('weapons',[
    ['crate',1,3],['crate',2,3],['barrel',1,5],['diningTable',6,2],['wallSword',8,0],['toolRack',6,0],
  ]),
  armorShop:room('armor',[
    ['crate',1,3],['barrel',1,5],['shelf',8,2],['diningTable',6,2],['chair',6,3],
  ]),
  itemShop:room('items',[
    ['potions',1,3],['potions',2,3],['barrel',1,5],['crate',9,2],['potions',8,2],
  ]),
  town:props('town',[
    // Front gardens and door-side lamps leave the east-west paths clear.
    ['flowers',2,8],['flowers',3,8],['plant',7,5],['lantern',7,6],
    ['flowers',11,8],['flowers',12,8],['lantern',15,6],
    ['flowers',21,8],['flowers',22,8],['plant',25,6],
    ['flowers',2,17],['flowers',3,17],['plant',1,15],
    ['flowers',21,17],['flowers',22,17],['barrel',25,15],['lantern',24,17],
    // A small public square west of the church.
    ['well',9,19],['bench',6,18],['bench',9,21],['lantern',8,17],['lantern',12,20],
    ['flowers',6,20],['flowers',7,20],['flowers',11,17],['flowers',12,17],
    // Church garden and an eastern rest spot.
    ['flowers',11,16],['flowers',12,16],['flowers',15,17],['flowers',16,17],
    ['bench',19,19],['plant',22,19],['lantern',23,19],
    // Shop deliveries and the southern approach.
    ['crate',1,24],['barrel',7,24],['flowers',3,26],['flowers',4,26],
    ['crate',11,26],['barrel',16,24],['flowers',15,26],
    ['crate',25,24],['barrel',24,26],['crate',21,27],['barrel',22,27],
    ['bench',8,28],['lantern',11,29],['lantern',17,29],['flowers',18,28],['flowers',19,28],
  ]),
};
