import { RecoveryCue, type RecoveryEvent } from './RecoveryCue';
import './world/interactionHint.css';
import type { MapTab } from './TravelMap';
import { TownMap } from './TownMap';
import { chestId } from './chests';
import { useEffect, useId, useRef, type CSSProperties } from 'react';
import { areaLabel, difficultyLabel, fieldRegion, fieldRuinsGate, fieldTownGate, type Area, type Point, type Track, type Difficulty } from './content';
import { positionOf, type EnemyPositions } from './enemyMovement';
import { items, type Equipment } from './items';
import { TerrainTile, TerrainTextures } from './TerrainTile';
import { mountainVillageGate } from './world/mountainVillage';
import { worldMaps, eventAt, minimapColorAt, canWalkOnMap } from './world/maps';
import { terrainChips, propChips, buildingChips, characterChips } from './world/catalog';
import { WorldChip } from './world/WorldChip';
import { storyNpcs, storyObjective, type StoryStage } from './story';

type WorldSave = {
  story:StoryStage; name: string; area: Area; pos: Point; level: number; hp: number; mp: number;
  xp: number; defeated: string[]; correct: number; total: number; wrong: string[];
  track: Track; difficulty: Difficulty; bossDefeated: boolean; gold:number; equipment:Equipment; openedChests:string[];
};

type Props = {
  save: WorldSave;
  recovery?:RecoveryEvent|null;
  enemyPositions: EnemyPositions;
  knightVisible?:boolean;
  menu: 'command'|'status'|'quest'|null;
  onMenu: (menu: 'command'|'status'|'quest'|null) => void;
  onTile: (point: Point) => void;
  onGuide: () => void;
  onMap:(tab?:MapTab)=>void;
  onChurch: () => void;
  onInventory: () => void;
  onSettings: () => void;
  onSound: () => void;
  muted: boolean;
  walking: boolean;
  facing?: Point;
  objectiveOverride?:{title:string;text:string};
  nearbyHint?:{point:Point;label:string};
};

const hpLimit = (level: number) => 20 + (level - 1) * 5;
const mpLimit = (level: number) => 3 + Math.floor((level - 1) / 2);

function FieldMiniMap({position,onOpen}:{position:Point;onOpen:()=>void}) {
  const ref=useRef<HTMLCanvasElement>(null);
  const map=worldMaps.field;
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas?.getContext('2d');
    if(!canvas||!ctx)return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    map.terrain.forEach((row,y)=>row.forEach((_,x)=>{ctx.fillStyle=minimapColorAt(map,{x,y});ctx.fillRect(x,y,1,1)}));
    ctx.fillStyle='#f7e8bb';ctx.fillRect(fieldTownGate.x-1,fieldTownGate.y-2,3,2);
    ctx.fillStyle='#ecb9ff';ctx.fillRect(fieldRuinsGate.x-1,fieldRuinsGate.y-1,3,3);
    ctx.fillStyle='#efcd82';ctx.fillRect(mountainVillageGate.x-1,mountainVillageGate.y-1,3,3);
    ctx.fillStyle='#151721';ctx.fillRect(position.x-2,position.y-2,5,5);
    ctx.fillStyle='#ffe18d';ctx.fillRect(position.x-1,position.y-1,3,3);
  },[position.x,position.y,map]);
  return <div className="field-minimap retro-window">
    <div className="field-minimap-title">世界地図 <small>{position.x}, {position.y}</small></div>
    <canvas ref={ref} width={120} height={80} role="img" aria-label={`現在地 ${fieldRegion(position)}。町は南、遺跡と石灯の村は北東。下のボタンで世界地図を拡大`} onClick={onOpen}/>
    <button className="field-minimap-expand" onClick={onOpen}>世界地図を大きく開く</button>
    <div className="field-minimap-key"><span>● 現在地</span><span>▣ 町</span><span>✦ 遺跡</span><span>▣ 村</span></div>
  </div>;
}

export function WorldScene({save,recovery,enemyPositions,knightVisible=true,menu,onMenu,onTile,onGuide,onMap,onChurch,onInventory,onSettings,onSound,muted,walking,facing={x:0,y:1},objectiveOverride,nearbyHint}:Props) {
  const textureId = `terrain-${useId().replace(/:/g, '')}`;
  const map=worldMaps[save.area];
  const npcs=storyNpcs(map.npcs,save.story);
  const objective=objectiveOverride??storyObjective(save.story,save.bossDefeated);
  const knightPoint=[{x:save.pos.x+2,y:save.pos.y},{x:save.pos.x+1,y:save.pos.y},{x:save.pos.x-1,y:save.pos.y}].find(point=>canWalkOnMap(map,point))??save.pos;
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
    <div className="world-viewport" style={{width:`calc(${viewColumns} * var(--tile-size))`,height:`calc(${viewRows} * var(--tile-size))`}} tabIndex={-1} aria-label={areaLabel[save.area]}>
      <div key={save.area} className={`world-map map-${save.area} ${interior?'map-interior':''}`} style={mapStyle} role="grid" aria-label={`${areaLabel[save.area]}のマップ`} onMouseDown={event=>{if(event.button===0)event.preventDefault();}} onDragStart={event=>event.preventDefault()}>
        {map.terrain.slice(firstY,lastY).flatMap((row,rowIndex)=>row.slice(firstX,lastX).map((tile,columnIndex)=>{
          const x=firstX+columnIndex,y=firstY+rowIndex;
          const inViewport=x>=cameraX&&x<cameraX+viewColumns&&y>=cameraY&&y<cameraY+viewRows;
          const point={x,y};
          const npc=npcs.find(person=>person.x===x&&person.y===y);
          const player=save.pos.x===x&&save.pos.y===y;
          const chip=terrainChips[tile];
          const event=eventAt(map,point,'interact')??eventAt(map,point,'enter');
          const destination=event?.action.kind==='chest'&&save.openedChests.includes(event.action.id)?'空の宝箱を調べる':event?.label??'移動';
          const background=outdoor&&chip.connection?'none':map.backdrop&&chip.transparentOnBackdrop?'transparent':
            `${chip.color}${chip.image?` url('${import.meta.env.BASE_URL}${chip.image}') center / 100% 100%`:''}`;
          return <button key={`${x}-${y}`} role="gridcell" style={{gridColumn:x+1,gridRow:y+1,pointerEvents:inViewport?'auto':'none',background}} tabIndex={inViewport?0:-1} aria-hidden={!inViewport} className={`world-tile terrain-${tile} ${player?'player':''} ${npc?'npc':''} ${event?.action.kind==='transition'&&interior?'map-exit':''}`} onClick={()=>onTile(point)} title={player?save.name:npc?.name??(destination==='移動'?undefined:destination)} aria-label={player?'現在地':npc?.name??`${destination} ${x}, ${y}`}>{outdoor&&<TerrainTile tiles={map.terrain} x={x} y={y} textureId={textureId}/>}</button>;
        }))}
        <div className="world-placements">
          {recovery&&<div className="world-recovery" style={{left:`calc(${save.pos.x+.5} * var(--tile-size))`,top:`calc(${save.pos.y+.3} * var(--tile-size))`}}><RecoveryCue key={recovery.sequence} event={recovery}/></div>}
          {nearbyHint&&<div className="world-interaction-hint" role="status" style={{left:`calc(${Math.max(cameraX+2,Math.min(cameraX+viewColumns-2,nearbyHint.point.x+.5))} * var(--tile-size))`,top:`calc(${Math.max(cameraY+1.2,nearbyHint.point.y-.1)} * var(--tile-size))`}}><kbd>Enter</kbd>{nearbyHint.label}</div>}
          {map.terrain.slice(firstY,lastY).flatMap((row,rowIndex)=>row.slice(firstX,lastX).map((id,columnIndex)=>{
            const chip=terrainChips[id],point={x:firstX+columnIndex,y:firstY+rowIndex};
            return chip.overlay?<WorldChip key={`terrain-${point.x}-${point.y}`} definition={{category:'terrain',label:chip.label,visual:chip.overlay,layer:'depth'}} point={point}/>:null;
          }))}
          {map.buildings.filter(placement=>visible(placement,buildingChips[placement.chip].visual)).map(placement=>
            <WorldChip key={placement.id} definition={buildingChips[placement.chip]} point={placement}/>)}
          {map.props.filter(placement=>visible(placement,propChips[placement.chip].visual)).map(placement=>{
            const chest=placement.chip==='chest';
            const opened=chest&&save.openedChests.includes(chestId(save.area,placement));
            return <WorldChip key={placement.id} definition={propChips[placement.chip]} point={placement} text={placement.text}
              chestOpen={chest?opened:undefined} label={chest?(opened?'空の宝箱を調べる':'宝箱を開ける'):undefined}
              onClick={chest?()=>onTile(placement):undefined}/>;
          })}
          {map.characters.map(character=>{
            if(character.role==='npc'&&!npcs.some(npc=>npc.id===character.id))return null;
            const enemy=character.role==='enemy'?character.enemy:null;
            const point=enemy?positionOf(enemy,enemyPositions):character;
            const definition=characterChips[character.chip];
            if(enemy&&save.defeated.includes(enemy.id)||!visible(point,definition.visual)) return null;
            return <WorldChip key={character.id} definition={definition} point={point}
              className={enemy?`world-enemy ${enemy.boss?'boss':''}`:'world-npc'}
              label={enemy?`${enemy.name}に近づく`:undefined} onClick={enemy?()=>onTile(point):undefined}/>;
          })}
          {save.story==='knight'&&knightVisible&&<WorldChip definition={characterChips.knight} point={knightPoint} className="world-knight"/>}
          <WorldChip definition={characterChips.hero} point={save.pos} walking={walking} direction={facing.x<0?'left':facing.x>0?'right':facing.y<0?'up':'down'} className="world-hero"/>
        </div>
      </div>
    </div>
    <div className="world-place retro-window"><span>{save.area==='field'?fieldRegion(save.pos):areaLabel[save.area]}</span></div>
    {save.area==='town'&&<TownMap position={save.pos} onExpand={()=>onMap('town')}/>}
    {save.area==='field'&&<FieldMiniMap position={save.pos} onOpen={()=>onMap()}/>}
    {(save.story!=='legacy'||objectiveOverride)&&<aside className="world-objective retro-window" aria-label="現在の目的"><strong>{objective.title}</strong><p>{objective.text}</p></aside>}
    <button className="world-command retro-window" onClick={()=>onMenu(menu?null:'command')} aria-expanded={!!menu}>▶ コマンド <small>Esc</small></button>
    <button className="world-map-button retro-window" onClick={()=>onMap()} aria-keyshortcuts="M">地図 <kbd className="shortcut-key">M</kbd></button>
    <button className="world-guide retro-window" onClick={onGuide} aria-keyshortcuts="F1">? 操作方法 <kbd className="shortcut-key">F1</kbd></button>
    <div className="world-hint">矢印 / WASD：移動　•　Enter：話す・調べる　•　クリック：目的地へ</div>
    {menu&&<div className="world-menu retro-window" role="region" aria-label="コマンドメニュー">
      <div className="world-menu-title">{menu==='command'?'コマンド':menu==='status'?'つよさ': 'たびのもくてき'}</div>
      {menu==='command'&&<div className="world-menu-items">
        <button onClick={()=>onMenu('status')}>▶ つよさ</button>
        <button data-shortcut="i f2" aria-keyshortcuts="I F2" onClick={()=>{onMenu(null);onInventory();}}>▶ もちもの <kbd className="shortcut-key">I / F2</kbd></button>
        <button onClick={()=>{onMenu(null);onMap();}}>▶ 地図 <kbd className="shortcut-key">M</kbd></button>
        <button onClick={()=>onMenu('quest')}>▶ たびのもくてき</button>
        {save.area==='town'&&<button onClick={()=>{onMenu(null);onChurch();}}>▶ きょうかい</button>}
        <button onClick={()=>{onMenu(null);onSettings();}}>▶ 学習設定</button>
        <button onClick={onGuide}>▶ 操作方法</button>
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
        <strong>{objective.title}</strong>
        <p>{objective.text}</p>
        <p>倒した敵　{save.defeated.length}</p>
        <button onClick={()=>onMenu('command')}>◀ もどる</button>
      </div>}
    </div>}
  </main>;
}
