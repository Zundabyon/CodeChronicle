import './chestSprite.css';

// Reuse the original art. The browser raises the lid without changing the PNG.
export function ChestSprite({opened}:{opened:boolean}) {
  const src=`${import.meta.env.BASE_URL}maps/chest-64.png`;
  if(!opened)return <img src={src} alt="" draggable={false}/>;
  return <span className="opened-chest" aria-hidden="true">
    <span className="chest-interior"/>
    <img className="chest-base" src={src} alt="" draggable={false}/>
    <img className="chest-lid" src={src} alt="" draggable={false}/>
    <span className="chest-empty">空</span>
  </span>;
}
