import { allItemIds, items, shopName, shopStock, type Equipment, type Inventory, type ItemId, type ShopType } from './items';

type Possessions = { gold:number; inventory:Inventory; equipment:Equipment; hp:number; mp:number; level:number };
type Common = { save:Possessions; onClose:()=>void };
const owned = (save:Possessions,id:ItemId) => save.inventory[id] ?? 0;
const hpLimit = (level:number) => 20+(level-1)*5;
const mpLimit = (level:number) => 3+Math.floor((level-1)/2);

function Frame({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}) {
  return <div className="modal-backdrop adventure-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}><section className="adventure-panel retro-window" role="dialog" aria-modal="true" aria-label={title}><div className="adventure-heading"><h2>{title}</h2><button onClick={onClose} aria-label="閉じる">×</button></div>{children}</section></div>;
}

export function DresserPanel({opened,reading,onRead,onClose}:{opened:boolean;reading:boolean;onRead:()=>void;onClose:()=>void}) {
  return <Frame title="自宅のタンス" onClose={onClose}><div className="dresser-scene" aria-hidden="true"><span className="dresser-art"><i/><i/></span></div><p>{opened?'引き出しの奥から、古い封筒とやくそうを見つけた。':'引き出しは空になっている。'}</p><p>{opened?'家族の手紙とやくそうを持ち物に入れた。':'あの手紙は、今も持ち物の中にある。'}</p>{reading&&<div className="letter-paper"><strong>家族の手紙</strong><p>「知識の扉へ向かうときは、ひとりで背負わないで。<br/>覚えた言葉は、誰かを守る力になる。<br/>家は、いつでも帰ってこられる場所だから」</p><small>父と母より</small></div>}<div className="adventure-actions"><button onClick={onRead}>{reading?'手紙をしまう':'手紙を読む'}</button><button onClick={onClose}>とじる</button></div></Frame>;
}

export function InventoryPanel({save,onUse,onEquip,onReadLetter,onClose}:{save:Possessions;onUse:(id:ItemId)=>void;onEquip:(id:ItemId)=>void;onReadLetter:()=>void}&Common) {
  const available=allItemIds.filter(id=>owned(save,id)>0);
  return <Frame title="もちもの" onClose={onClose}><div className="adventure-summary"><span>所持金　{save.gold} G</span><span>HP {save.hp}/{hpLimit(save.level)}　MP {save.mp}/{mpLimit(save.level)}</span></div><p className="equipped-line">武器：{items[save.equipment.weapon].name}　防具：{items[save.equipment.armor].name}</p><div className="adventure-list">{available.map(id=>{const item=items[id],equipped=save.equipment.weapon===id||save.equipment.armor===id;const canUse=item.kind==='item'&&((item.healHp??0)>0?save.hp<hpLimit(save.level):save.mp<mpLimit(save.level));return <div className="adventure-row" key={id}><div><strong>{item.name} <small>×{owned(save,id)}</small></strong><p>{item.description}</p></div>{item.kind==='key'?<button onClick={onReadLetter}>読む</button>:item.kind==='item'?<button disabled={!canUse} onClick={()=>onUse(id)}>使う</button>:<button disabled={equipped} onClick={()=>onEquip(id)}>{equipped?'装備中':'装備'}</button>}</div>})}{available.length===0&&<p>持ち物はありません。</p>}</div><div className="adventure-actions"><button onClick={onClose}>とじる</button></div></Frame>;
}

export function ShopPanel({type,mode,save,onMode,onBuy,onSell,onClose}:{type:ShopType;mode:'buy'|'sell';onMode:(mode:'buy'|'sell')=>void;onBuy:(id:ItemId)=>void;onSell:(id:ItemId)=>void}&Common) {
  const ids=mode==='buy'?shopStock[type]:allItemIds.filter(id=>owned(save,id)>0&&items[id].price>0&&items[id].kind!=='key'&&save.equipment.weapon!==id&&save.equipment.armor!==id);
  return <Frame title={shopName[type]} onClose={onClose}><p className="shop-greeting">「いらっしゃい！ 何をお探しで？」</p><div className="adventure-summary"><span>所持金　{save.gold} G</span><span>武器：{items[save.equipment.weapon].name} / 防具：{items[save.equipment.armor].name}</span></div><div className="shop-tabs"><button className={mode==='buy'?'selected':''} onClick={()=>onMode('buy')}>買う</button><button className={mode==='sell'?'selected':''} onClick={()=>onMode('sell')}>売る</button></div><div className="adventure-list">{ids.map(id=>{const item=items[id],price=mode==='buy'?item.price:Math.floor(item.price/2);return <div className="adventure-row" key={id}><div><strong>{item.name} <small>{mode==='sell'?`×${owned(save,id)}`:''}</small></strong><p>{item.description}</p></div><span>{price} G</span><button disabled={mode==='buy'&&save.gold<price} onClick={()=>mode==='buy'?onBuy(id):onSell(id)}>{mode==='buy'?'買う':'売る'}</button></div>})}{ids.length===0&&<p>売れる品物はありません。</p>}</div><div className="adventure-actions"><button onClick={onClose}>店を出る</button></div></Frame>;
}
