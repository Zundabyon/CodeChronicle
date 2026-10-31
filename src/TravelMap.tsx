import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { Area, Point } from './content';
import { buildingChips } from './world/catalog';
import { minimapColorAt, worldMaps, type WorldMap } from './world/maps';
import { compassDirection, mapLocation, mapRoute, townEntrances, worldPlaces } from './world/mapGuide';
import './travelMap.css';
export type MapTab='world'|'town';
const pinPosition=(point:Point,map:WorldMap):CSSProperties=>({left:`${(point.x+.5)/map.width*100}%`,top:`${(point.y+.5)/map.height*100}%`});
function MapTerrain({map}:{map:WorldMap}){
  const ref=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{const ctx=ref.current?.getContext('2d');if(!ctx)return;map.terrain.forEach((row,y)=>row.forEach((_,x)=>{ctx.fillStyle=minimapColorAt(map,{x,y});ctx.fillRect(x,y,1,1);}));
    if(map===worldMaps.town)for(const building of map.buildings){
      const visual=buildingChips[building.chip].visual,x=building.x-visual.width*visual.anchor.x,y=building.y-visual.height*visual.anchor.y;
      ctx.fillStyle=building.chip==='church'?'#c8b995':building.chip.startsWith('library')?'#777d9d':'#906a49';ctx.fillRect(x,y,visual.width,visual.height);
      ctx.strokeStyle='#ead9ab';ctx.lineWidth=.16;ctx.strokeRect(x+.15,y+.15,visual.width-.3,visual.height-.3);
    }
  },[map]);
  return <canvas ref={ref} width={map.width} height={map.height} aria-hidden="true"/>;
}
export function TravelMap({area,position,inChurch=false,initialTab='world',onClose}:{area:Area;position:Point;inChurch?:boolean;initialTab?:MapTab;onClose:()=>void}){
  const [tab,setTab]=useState<MapTab>(initialTab),[destination,setDestination]=useState('town'),[facility,setFacility]=useState(townEntrances[0].id);
  const location=mapLocation(area,position,inChurch);
  const place=worldPlaces.find(place=>place.id===destination)??worldPlaces[0];
  const route=useMemo(()=>mapRoute(location.world,place.point),[location.world.x,location.world.y,place.point.x,place.point.y]);
  const panelRef=useRef<HTMLElement>(null),closeRef=useRef<HTMLButtonElement>(null);
  useEffect(()=>{closeRef.current?.focus();},[]);
  const map=tab==='world'?worldMaps.field:worldMaps.town;
  const selected=townEntrances.find(entry=>entry.id===facility)??townEntrances[0];
  return <div className="modal-backdrop travel-map-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <section ref={panelRef} className="travel-map-panel" role="dialog" aria-modal="true" aria-labelledby="travel-map-title" onKeyDown={e=>{
      if(e.key!=='Tab')return;
      const buttons=Array.from(panelRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')??[]).filter(button=>button.getClientRects().length>0);
      const first=buttons[0],last=buttons.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
    }}>
      <header className="travel-map-header"><div><small>行き先を確かめる</small><h2 id="travel-map-title">旅の地図</h2></div><button ref={closeRef} onClick={onClose} aria-label="地図を閉じる">閉じる <kbd>Esc</kbd></button></header>
      <p className="travel-map-location"><span className="travel-map-dot"/>現在地：<strong>{location.label}</strong>{area==='field'&&<span>（{position.x}, {position.y}）</span>}</p>
      <div className="travel-map-tabs" role="tablist" aria-label="地図の種類"><button id="map-tab-world" role="tab" aria-controls="travel-map-content" aria-selected={tab==='world'} onClick={()=>setTab('world')}>世界地図</button><button id="map-tab-town" role="tab" aria-controls="travel-map-content" aria-selected={tab==='town'} onClick={()=>setTab('town')}>町の施設</button></div>
      <div className="travel-map-layout" id="travel-map-content" role="tabpanel" aria-labelledby={`map-tab-${tab}`}>
        <div className="travel-map-main"><div className={`travel-map-surface map-surface-${tab}`} style={{aspectRatio:`${map.width}/${map.height}`}} role="group" aria-label={tab==='world'?'町・村・遺跡の位置':'町の施設の位置'}>
          <MapTerrain map={map}/><span className="travel-map-compass">↑ 北</span>
          {tab==='world'?<>
            <svg className="travel-map-route" viewBox={`0 0 ${map.width} ${map.height}`} aria-hidden="true"><polyline points={route.map(p=>`${p.x+.5},${p.y+.5}`).join(' ')} fill="none" stroke="#2b201c" strokeWidth={1.3} strokeLinejoin="round"/><polyline points={route.map(p=>`${p.x+.5},${p.y+.5}`).join(' ')} fill="none" stroke="#ffe7a3" strokeWidth={.6} strokeLinejoin="round"/></svg>
            {worldPlaces.map(p=><button key={p.id} className={`travel-map-pin world-pin-${p.id} ${destination===p.id?'selected':''}`} style={pinPosition(p.point,map)} onClick={()=>setDestination(p.id)} aria-label={`${p.name}を地図で確認`} aria-pressed={destination===p.id}><span className="travel-map-pin-icon">{p.id==='dungeon'?'◆':'▣'}</span><span className="travel-map-pin-label">{p.name}</span></button>)}
            <span className="travel-map-player" style={pinPosition(location.world,map)} aria-label="世界地図の現在地">●</span>
          </>:<>
            {townEntrances.map((entry,i)=><button key={entry.id} className={`travel-map-pin town-map-pin ${facility===entry.id?'selected':''}`} style={pinPosition(entry,map)} onClick={()=>setFacility(entry.id)} aria-label={`${entry.label}を地図で確認`} aria-pressed={facility===entry.id}>{i+1}</button>)}
            {location.town&&<span className="travel-map-player" style={pinPosition(location.town,map)} aria-label="町の地図の現在地">●</span>}
          </>}
        </div><p className="travel-map-key"><span><i className="travel-map-dot"/>現在地</span><span>▣ 町・村 / ◆ 遺跡</span>{tab==='world'&&<span>━ 選んだ行き先への道筋</span>}</p><p className="travel-map-note">場所の名前や印を選ぶと、案内を確認できます。</p></div>
        <aside className="travel-map-destinations" aria-label={tab==='world'?'世界の行き先':'町の施設案内'}>
          <h3>{tab==='world'?'どこへ行く？':'施設を探す'}</h3>
          <div className="travel-map-place-list">{tab==='world'?worldPlaces.map(p=><button key={p.id} aria-pressed={destination===p.id} onClick={()=>setDestination(p.id)}>{p.name}<small>{p.description}</small></button>):townEntrances.map((entry,i)=><button key={entry.id} aria-pressed={facility===entry.id} onClick={()=>setFacility(entry.id)}><b>{i+1}</b> {entry.label}</button>)}</div>
          <div className="travel-map-directions" role="status">{tab==='world'?<><strong>{place.name}への案内</strong>{route.length===0?<p>ここからの道筋を表示できません。入口と街道を目印に進んでください。</p>:route.length===1?<p>{area==='field'?'入口のすぐそばです。':place.id==='town'?'この町にいます。町の中の行き先は「町の施設」で確認できます。':`${place.name}の中にいます。赤い印が平原からの入口です。`}</p>:<p>{area==='field'?'現在地':`${location.worldLabel}の外の入口`}から<strong>{compassDirection(location.world,place.point)}</strong>へ。地図の明るい線を目印に進もう。<br/><small>道のりの目安：約{route.length-1}歩</small></p>}</>:<><strong>{selected.label}</strong><p>地図の「{townEntrances.indexOf(selected)+1}」が入口です。</p>{!location.town&&<p>現在は町の外にいます。黎明の町へ戻ってから、この入口を目指しましょう。</p>}</>}</div>
        </aside>
      </div>
    </section>
  </div>;
}
