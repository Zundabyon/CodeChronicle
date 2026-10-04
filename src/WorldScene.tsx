import { useEffect, useId, useRef, type CSSProperties } from 'react';
import { areaLabel, difficultyLabel, fieldRegion, fieldRuinsGate, fieldTownGate, type Area, type Point, type Track, type Difficulty } from './content';
import { positionOf, type EnemyPositions } from './enemyMovement';
import { items, type Equipment } from './items';
import { TerrainTile, TerrainTextures } from './TerrainTile';
import { worldMaps, eventAt, minimapColorAt } from './world/maps';
import { terrainChips, propChips, buildingChips, characterChips } from './world/catalog';
import { WorldChip } from './world/WorldChip';

type WorldSave = {
  name: string; area: Area; pos: Point; level: number; hp: number; mp: number;
  xp: number; defeated: string[]; correct: number; total: number; wrong: string[];
  track: Track; difficulty: Difficulty; bossDefeated: boolean; gold:number; equipment:Equipment;
};

type Props = {
  save: WorldSave;
  enemyPositions: EnemyPositions;
  menu: 'command'|'status'|'quest'|null;
  onMenu: (menu: 'command'|'status'|'quest'|null) => void;
  onTile: (point: Point) => void;
  onChurch: () => void;
  onInventory: () => void;
  onSettings: () => void;
  onSound: () => void;
  muted: boolean;
  walking: boolean;
};

const hpLimit = (level: number) => 20 + (level - 1) * 5;
const mpLimit = (level: number) => 3 + Math.floor((level - 1) / 2);

function FieldMiniMap({position,onTile}:{position:Point;onTile:(point:Point)=>void}) {
  const ref=useRef<HTMLCanvasElement>(null);
  const map=worldMaps.field;
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas?.getContext('2d');
    if(!canvas||!ctx)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    map.terrain.forEach((row,y)=>row.forEach((_,x)=>{ctx.fillStyle=minimapColorAt(map,{x,y});ctx.fillRect(x,y,1,1)}));
    ctx.fillStyle='#f7e8bb';ctx.fillRect(fieldTownGate.x-1,fieldTownGate.y-2,3,2);
    ctx.fillStyle='#ecb9ff';ctx.fillRect(fieldRuinsGate.x-1,fieldRuinsGate.y-1,3,3);
    ctx.fillStyle='#151721';ctx.fillRect(position.x-2,position.y-2,5,5);
    ctx.fillStyle='#ffe18d';ctx.fillRect(position.x-1,position.y-1,3,3);
  },[position.x,position.y,map]);
  return <div className="field-minimap retro-window">
    <div className="field-minimap-title">世界地図 <small>{position.x}, {position.y}</small></div>
    <canvas ref={ref} width={120} height={80} role="img" aria-label={`現在地 ${fieldRegion(position)}。町は南、遺跡は北東。小地図をクリックして移動`} onClick={event=>{
      const bounds=event.currentTarget.getBoundingClientRect();
      const x=Math.min(119,Math.max(0,Math.floor((event.clientX-bounds.left)/bounds.width*120)));
      const y=Math.min(79,Math.max(0,Math.floor((event.clientY-bounds.top)/bounds.height*80)));
      onTile({x,y});
    }}/>
    <div className="field-minimap-key"><span>● 現在地</span><span>▣ 町</span><span>✦ 遺跡</span></div>
  </div>;
}

export function WorldScene({save,enemyPositions,menu,onMenu,onTile,onChurch,onInventory,onSettings,onSound,muted,walking}:Props) {
  const textureId = `terrain-${useId().replace(/:/g, '')}`;
  const map=worldMaps[save.area];
  const {width,height}=map;
  const viewColumns=Math.min(14,width),viewRows=Math.min(9,height);
  const cameraX=Math.max(0,Math.min(save.pos.x-7,width-viewColumns));
  const cameraY=Math.max(0,Math.min(save.pos.y-4,height-viewRows));
  const firstX=Math.max(0,cameraX-2),lastX=Math.min(width,cameraX+viewColumns+2);
  const firstY=Math.max(0,cameraY-2),lastY=Math.min(height,cameraY+viewRows+2);
  const interior=map.environment==='interior';
  const outdoor=map.environment==='outdoor';
  const mapStyle={
    '--map-columns':width,
    '--map-rows':height,
    transform:`translate(${-cameraX/width*100}%, ${-cameraY/height*100}%)`,
    background:map.backdrop?`#544f59 url('${import.meta.env.BASE_URL}${map.backdrop}') center / 100% 100%`:undefined,
  } as CSSProperties;
  const visible=(point:Point,visual:{width:number;height:number;anchor:Point})=>{
    const left=point.x+visual.anchor.x-visual.width*visual.anchor.x;
    const top=point.y+visual.anchor.y-visual.height*visual.anchor.y;
    return left+visual.width>cameraX-1&&left<cameraX+viewColumns+1&&top+visual.height>cameraY-1&&top<cameraY+viewRows+1;
  };
  return <main className="world-stage">
    {outdoor&&<TerrainTextures id={textureId}/>}
    <div className="world-viewport" style={{width:`calc(${viewColumns} * var(--tile-size))`,height:`calc(${viewRows} * var(--tile-size))`}} aria-label={areaLabel[save.area]}>
      <div className={`world-map map-${save.area} ${interior?'map-interior':''}`} style={mapStyle} role="grid" aria-label={`${areaLabel[save.area]}のマップ`} onMouseDown={event=>{if(event.button===0)event.preventDefault();}} onDragStart={event=>event.preventDefault()}>
        {map.terrain.slice(firstY,lastY).flatMap((row,rowIndex)=>row.slice(firstX,lastX).map((tile,columnIndex)=>{
          const x=firstX+columnIndex,y=firstY+rowIndex;
          const inViewport=x>=cameraX&&x<cameraX+viewColumns&&y>=cameraY&&y<cameraY+viewRows;
          const point={x,y};
          const npc=map.npcs.find(person=>person.x===x&&person.y===y);
          const player=save.pos.x===x&&save.pos.y===y;
          const chip=terrainChips[tile];
          const event=eventAt(map,point,'interact')??eventAt(map,point,'enter');
          const destination=event?.label??'移動';
          const background=outdoor&&chip.connection?'none':map.backdrop&&chip.transparentOnBackdrop?'transparent':
            `${chip.color}${chip.image?` url('${import.meta.env.BASE_URL}${chip.image}') center / 100% 100%`:''}`;
          return <button key={`${x}-${y}`} role="gridcell" style={{gridColumn:x+1,gridRow:y+1,pointerEvents:inViewport?'auto':'none',background}} tabIndex={inViewport?0:-1} aria-hidden={!inViewport} className={`world-tile terrain-${tile} ${player?'player':''} ${npc?'npc':''} ${event?.action.kind==='transition'&&interior?'map-exit':''}`} onClick={()=>onTile(point)} title={player?save.name:npc?.name??(destination==='移動'?undefined:destination)} aria-label={player?'現在地':npc?.name??`${destination} ${x}, ${y}`}>{outdoor&&<TerrainTile tiles={map.terrain} x={x} y={y} textureId={textureId}/>}</button>;
        }))}
        <div className="world-placements">
          {map.terrain.slice(firstY,lastY).flatMap((row,rowIndex)=>row.slice(firstX,lastX).map((id,columnIndex)=>{
            const chip=terrainChips[id],point={x:firstX+columnIndex,y:firstY+rowIndex};
            return chip.overlay?<WorldChip key={`terrain-${point.x}-${point.y}`} definition={{category:'terrain',label:chip.label,visual:chip.overlay,layer:'depth'}} point={point}/>:null;
          }))}
          {map.buildings.filter(placement=>visible(placement,buildingChips[placement.chip].visual)).map(placement=>
            <WorldChip key={placement.id} definition={buildingChips[placement.chip]} point={placement}/>)}
          {map.props.filter(placement=>visible(placement,propChips[placement.chip].visual)).map(placement=>
            <WorldChip key={placement.id} definition={propChips[placement.chip]} point={placement} text={placement.text}/>)}
          {map.characters.map(character=>{
            const enemy=character.role==='enemy'?character.enemy:null;
            const point=enemy?positionOf(enemy,enemyPositions):character;
            const definition=characterChips[character.chip];
            if(enemy&&save.defeated.includes(enemy.id)||!visible(point,definition.visual)) return null;
            return <WorldChip key={character.id} definition={definition} point={point}
              className={enemy?`world-enemy ${enemy.boss?'boss':''}`:'world-npc'}
              label={enemy?`${enemy.name}に近づく`:undefined} onClick={enemy?()=>onTile(point):undefined}/>;
          })}
          <WorldChip definition={characterChips.hero} point={save.pos} walking={walking} className="world-hero"/>
        </div>
      </div>
    </div>
    <div className="world-place retro-window"><span>{save.area==='field'?fieldRegion(save.pos):areaLabel[save.area]}</span></div>
    {save.area==='field'&&<FieldMiniMap position={save.pos} onTile={onTile}/>}
    <button className="world-command retro-window" onClick={()=>onMenu(menu?null:'command')} aria-expanded={!!menu}>▶ コマンド <small>Esc</small></button>
    <div className="world-hint">{interior?'玄関から町へ　•　クリック / 十字キーで移動':save.area==='field'?'十字キー / WASD　•　小地図をクリックして移動':'十字キー / WASD で移動　•　扉から家へ入る'}</div>
    {menu&&<div className="world-menu retro-window">
      <div className="world-menu-title">{menu==='command'?'コマンド':menu==='status'?'つよさ': 'たびのもくてき'}</div>
      {menu==='command'&&<div className="world-menu-items">
        <button onClick={()=>onMenu('status')}>▶ つよさ</button>
        <button onClick={()=>{onMenu(null);onInventory();}}>▶ もちもの</button>
        <button onClick={()=>onMenu('quest')}>▶ たびのもくてき</button>
        {save.area==='town'&&<button onClick={()=>{onMenu(null);onChurch();}}>▶ きょうかい</button>}
        <button onClick={()=>{onMenu(null);onSettings();}}>▶ 学習設定</button>
        <button onClick={onSound}>▶ おと　{muted?'オフ':'オン'}</button>
        <button onClick={()=>onMenu(null)}>▶ とじる</button>
      </div>}
      {menu==='status'&&<div className="world-menu-detail">
        <strong>{save.name}　LV {save.level}</strong>
        <p>HP　{save.hp} / {hpLimit(save.level)}</p>
        <p>MP　{save.mp} / {mpLimit(save.level)}</p>
        <p>EXP　{save.xp%12} / 12</p>
        <p>所持金　{save.gold} G</p>
        <p>武器　{items[save.equipment.weapon].name}</p>
        <p>防具　{items[save.equipment.armor].name}</p>
        <p>学習　{save.track==='react'?'React':'Vue'} / {difficultyLabel[save.difficulty]}</p>
        <p>正解　{save.correct} / {save.total}　復習　{save.wrong.length}</p>
        <button onClick={()=>onMenu('command')}>◀ もどる</button>
      </div>}
      {menu==='quest'&&<div className="world-menu-detail">
        <strong>失われた知識の扉</strong>
        <p>{save.bossDefeated?'守護者を倒し、魔法「見極め」を取り戻した。':'東の忘却の遺跡へ。守護者へ挑むには LV 2 が必要。'}</p>
        <p>倒した敵　{save.defeated.length}</p>
        <button onClick={()=>onMenu('command')}>◀ もどる</button>
      </div>}
    </div>}
  </main>;
}
