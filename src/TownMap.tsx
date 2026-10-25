import { houses, type Point } from './content';
import { minimapColorAt, worldMaps } from './world/maps';
import './townMap.css';
const map=worldMaps.town;
export const townFacilities=map.events.filter(event=>event.action.kind==='church'||event.action.kind==='transition'&&Object.hasOwn(houses,event.action.to));
export function TownMap({position}:{position:Point}) {
  return <details className="town-map retro-window"><summary>町の施設マップ</summary><p>● 現在地 {position.x}, {position.y}　▣ 施設の入口</p>
    <svg viewBox={`0 0 ${map.width} ${map.height}`} role="img" aria-label={`町の施設と現在地 ${position.x}, ${position.y}`}>
      {map.terrain.flatMap((row,y)=>row.map((_,x)=><rect key={`${x},${y}`} x={x} y={y} width={1} height={1} fill={minimapColorAt(map,{x,y})}/>))}
      {townFacilities.map((facility,i)=><g key={facility.id}><rect x={facility.x-.25} y={facility.y-.25} width={1.5} height={1.5} fill="#ffe5ab"/><text x={facility.x+.5} y={facility.y+.9} textAnchor="middle" fill="#19222d" fontSize={1.3}>{i+1}</text></g>)}
      <circle cx={position.x+.5} cy={position.y+.5} r={.8} fill="#f47979" stroke="#fff" strokeWidth={.2}/>
    </svg>
    <ol>{townFacilities.map(facility=><li key={facility.id}>{facility.label} <small>入口 {facility.x}, {facility.y}</small></li>)}</ol>
    <small>地図は案内用です。いつもの移動で入口へ向かってください。</small>
  </details>;
}
