import type { Area, Point } from './content';
import { items, type Inventory, type ItemId } from './items';

// The location stays stable if decorative props are reordered or renamed.
export const chestId=(area:Area,point:Point)=>`${area}:${point.x},${point.y}`;
export const normalizeOpenedChests=(value:unknown):string[]=>
  Array.isArray(value)?[...new Set(value.filter((id):id is string=>typeof id==='string'))]:[];

type ChestReward={gold:number;inventory:Inventory};
const rewards:Record<string,ChestReward>={
  'armorShop:2,2':{gold:30,inventory:{herb:2}},
};
const defaultReward:ChestReward={gold:20,inventory:{herb:1}};
type ChestSave={gold:number;inventory:Inventory;openedChests:string[]};

export function claimChest<T extends ChestSave>(save:T,id:string):{save:T;opened:boolean;message:string} {
  if(save.openedChests.includes(id)) return {save,opened:false,message:'宝箱は空っぽだ。'};
  const reward=rewards[id]??defaultReward;
  const inventory={...save.inventory};
  const found:string[]=[];
  for(const [key,count] of Object.entries(reward.inventory)) {
    const item=key as ItemId;
    inventory[item]=(inventory[item]??0)+count;
    found.push(`${items[item].name} ×${count}`);
  }
  if(reward.gold) found.push(`${reward.gold} G`);
  return {save:{...save,gold:save.gold+reward.gold,inventory,openedChests:[...save.openedChests,id]},
    opened:true,message:`宝箱を開けた！ ${found.join('、')}を手に入れた！`};
}
