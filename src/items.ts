export type ShopType = 'weapon' | 'armor' | 'item';
export type ItemId = 'woodSword' | 'ironSword' | 'silverSword' | 'travelerClothes' | 'leatherArmor' | 'chainMail' | 'herb' | 'potion' | 'ether' | 'familyLetter';
export type Equipment = { weapon: ItemId; armor: ItemId };
export type Inventory = Partial<Record<ItemId, number>>;
export type Item = { id: ItemId; name: string; kind: ShopType | 'key'; price: number; description: string; power?: number; healHp?: number; healMp?: number };

export const items: Record<ItemId, Item> = {
  woodSword:{id:'woodSword',name:'木の剣',kind:'weapon',price:0,description:'旅立ちのときから持つ剣。',power:0},
  ironSword:{id:'ironSword',name:'鉄の剣',kind:'weapon',price:90,description:'正解時の攻撃力が上がる。',power:2},
  silverSword:{id:'silverSword',name:'銀の剣',kind:'weapon',price:220,description:'よく鍛えられた剣。',power:4},
  travelerClothes:{id:'travelerClothes',name:'旅人の服',kind:'armor',price:0,description:'軽くて動きやすい服。',power:0},
  leatherArmor:{id:'leatherArmor',name:'革の鎧',kind:'armor',price:80,description:'誤答時の被ダメージを軽減する。',power:2},
  chainMail:{id:'chainMail',name:'鎖かたびら',kind:'armor',price:190,description:'丈夫な鎖で身を守る。',power:4},
  herb:{id:'herb',name:'やくそう',kind:'item',price:15,description:'HPを8回復する。',healHp:8},
  potion:{id:'potion',name:'ポーション',kind:'item',price:35,description:'HPを18回復する。',healHp:18},
  ether:{id:'ether',name:'エーテル',kind:'item',price:45,description:'MPを3回復する。',healMp:3},
  familyLetter:{id:'familyLetter',name:'家族の手紙',kind:'key',price:0,description:'旅立ちの日にタンスから見つけた手紙。'},
};

export const shopStock: Record<ShopType, ItemId[]> = {
  weapon:['ironSword','silverSword'],
  armor:['leatherArmor','chainMail'],
  item:['herb','potion','ether'],
};

export const shopName: Record<ShopType,string> = {weapon:'武器屋',armor:'防具屋',item:'道具屋'};
export const allItemIds = Object.keys(items) as ItemId[];
