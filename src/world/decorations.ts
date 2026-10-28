import type { Area } from '../content';
import type { PropId } from './catalog';
import type { PropPlacement } from './maps';

const props=(prefix:string,placements:[PropId,number,number][]):PropPlacement[]=>
  placements.map(([chip,x,y],i)=>({id:`decor-${prefix}-${i}-${chip}`,chip,x,y}));

const libraryRoom=(name:string,extras:[PropId,number,number][])=>props(name,[
  ['plant',1,1],['lantern',8,1],['rug',4,6],...extras,
]);

// Coordinates describe useful household areas, not a shared decorative preset.
// Keep the central route from the south door to the residents open.
export const mapDecorations:Partial<Record<Area,PropPlacement[]>>={
  home:props('home',[
    // Bed and personal storage on the left; cooking and meals on the right.
    ['shelf',2,1],['bed',2,2],['dresser',3,5],
    ['stove',8,1],['diningTable',6,3],['chair',6,4],['rug',6,6],
  ]),
  elderHouse:props('elder',[
    // Records at the back, a small meeting table, and a private sleeping corner.
    ['shelf',1,1],['shelf',2,1],['books',8,2],
    ['diningTable',6,2],['chair',6,3],['bed',2,3],['dresser',1,6],
  ]),
  scholarHouse:libraryRoom('scholar',[
    ['diningTable',2,5],['chair',2,6],['books',9,3],
  ]),
  librarySecondFloor:libraryRoom('library-second',[['diningTable',2,5],['chair',2,6],['books',9,3]]),
  libraryThirdFloor:libraryRoom('library-third',[['diningTable',2,5],['chair',2,6],['books',9,3]]),
  libraryFourthFloor:libraryRoom('library-fourth',[['diningTable',2,5],['chair',2,6],['books',9,3]]),
  backendLibrary:libraryRoom('backend-first',[['diningTable',2,5],['chair',2,6],['books',9,3]]),
  backendSecondFloor:libraryRoom('backend-second',[['diningTable',2,5],['chair',2,6],['books',9,3]]),
  childHouse:props('child',[
    // Two sleeping places and a family meal area next to the stove.
    ['bed',1,2],['bed',3,2],['dresser',1,5],
    ['stove',8,1],['diningTable',6,3],['chair',6,4],['chair',8,4],
  ]),
  guestHouse:props('inn',[
    // Separate guest beds, linen storage, and a shared breakfast corner.
    ['bed',2,2],['bed',2,5],['bed',8,2],['dresser',1,1],
    ['stove',9,5],['diningTable',6,6],['chair',6,7],
  ]),
  weaponShop:props('weapons',[
    // Weapons belong inside the weapons shop, above the stock shelves.
    ['toolRack',2,1],['wallSword',5,1],['shelf',2,2],['crate',1,5],
    ['shelf',6,4],['shelf',7,4],['shelf',8,4],
  ]),
  armorShop:props('armor',[
    // Equipment storage and a sales counter; no household bed or dining setting.
    ['shelf',1,2],['chest',2,2],['crate',9,2],
    ['shelf',6,4],['shelf',7,4],['shelf',8,4],
  ]),
  itemShop:props('items',[
    // Bottles on the back displays, a barrel of supplies, and a clear customer aisle.
    ['potions',1,1],['potions',2,1],['potions',8,1],['barrel',9,2],
    ['shelf',6,4],['shelf',7,4],['shelf',8,4],
  ]),
  dungeon:props('dungeon',[
    // Supplies in side rooms reward exploration without blocking either main route.
    ['chest',2,5],['chest',15,10],['chest',19,5],
  ]),
  town:props('town',[
    // Small front gardens; avoid scattering indoor fixtures along the streets.
    ['flowers',2,8],['flowers',11,8],['flowers',21,8],
    ['flowers',2,17],['flowers',21,17],
    // Water and seating form one public square west of the church.
    ['well',9,21],['bench',6,16],['flowers',6,20],
    // A quiet garden east of the church, with room to walk past.
    ['bench',19,20],['flowers',22,20],
    // Deliveries stay beside the inn and weapons shop, rather than across the road.
    ['barrel',25,15],['crate',1,25],
    ['bench',8,30],['flowers',18,30],
  ]),
};
