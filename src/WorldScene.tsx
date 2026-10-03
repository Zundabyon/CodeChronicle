import { useEffect, useRef, type CSSProperties } from 'react';
import { areaLabel, difficultyLabel, fieldRegion, fieldRuinsGate, fieldTownGate, houseAt, houses, maps, type Area, type Point, type Track, type Difficulty } from './content';
import { PixelSprite, enemySprite, npcSprite } from './PixelSprite';
import { WorldCharacter, type CharacterName } from './WorldCharacter';
import { positionOf, type EnemyPositions } from './enemyMovement';
import { items, type Equipment } from './items';

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
  const tiles=maps.field.tiles;
  useEffect(()=>{
    const canvas=ref.current,ctx=canvas?.getContext('2d');
    if(!canvas||!ctx)return;
    const colors:Record<string,string>={'.':'#79a65a',v:'#a2b767',t:'#2d6a3d',r:'#347cb5',m:'#777985',s:'#dab56d',k:'#799054',g:'#c8ad83',d:'#a675d0','#':'#223849'};
    ctx.clearRect(0,0,canvas.width,canvas.height);
    tiles.forEach((row,y)=>[...row].forEach((tile,x)=>{ctx.fillStyle=colors[tile]??'#75985b';ctx.fillRect(x,y,1,1)}));
    ctx.fillStyle='#f7e8bb';ctx.fillRect(fieldTownGate.x-1,fieldTownGate.y-2,3,2);
    ctx.fillStyle='#ecb9ff';ctx.fillRect(fieldRuinsGate.x-1,fieldRuinsGate.y-1,3,3);
    ctx.fillStyle='#151721';ctx.fillRect(position.x-2,position.y-2,5,5);
    ctx.fillStyle='#ffe18d';ctx.fillRect(position.x-1,position.y-1,3,3);
  },[position.x,position.y,tiles]);
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
  const map=maps[save.area];
  const width=map.tiles[0].length;
  const height=map.tiles.length;
  const viewColumns=Math.min(14,width),viewRows=Math.min(9,height);
  const cameraX=Math.max(0,Math.min(save.pos.x-7,width-viewColumns));
  const cameraY=Math.max(0,Math.min(save.pos.y-4,height-viewRows));
  const firstX=Math.max(0,cameraX-2),lastX=Math.min(width,cameraX+viewColumns+2);
  const firstY=Math.max(0,cameraY-2),lastY=Math.min(height,cameraY+viewRows+2);
  const interior=!['town','field','dungeon'].includes(save.area);
  const mapStyle={
    '--map-columns':width,
    '--map-rows':height,
    transform:`translate(${-cameraX/width*100}%, ${-cameraY/height*100}%)`,
  } as CSSProperties;
  const visibleEnemies=map.enemies.filter(enemy=>{
    const point=positionOf(enemy,enemyPositions);
    return !save.defeated.includes(enemy.id)&&point.x>=cameraX-1&&point.x<cameraX+viewColumns+1&&point.y>=cameraY-1&&point.y<cameraY+viewRows+1;
  });
  return <main className="world-stage">
    <div className="world-viewport" style={{width:`calc(${viewColumns} * var(--tile-size))`,height:`calc(${viewRows} * var(--tile-size))`}} aria-label={areaLabel[save.area]}>
      <div className={`world-map map-${save.area} ${interior?'map-interior':''}`} style={mapStyle} role="grid" aria-label={`${areaLabel[save.area]}のマップ`} onMouseDown={event=>{if(event.button===0)event.preventDefault();}} onDragStart={event=>event.preventDefault()}>
        {map.tiles.slice(firstY,lastY).flatMap((row,rowIndex)=>[...row.slice(firstX,lastX)].map((tile,columnIndex)=>{
          const x=firstX+columnIndex,y=firstY+rowIndex;
          const inViewport=x>=cameraX&&x<cameraX+viewColumns&&y>=cameraY&&y<cameraY+viewRows;
          const point={x,y};
          const npc=map.npcs.find(person=>person.x===x&&person.y===y);
          const player=save.pos.x===x&&save.pos.y===y;
          const objectPath=tile==='t'?'tree':tile==='k'?'cactus':tile==='m'||tile==='#'&&!interior&&save.area!=='dungeon'?(save.area==='town'?'tree':'mountain'):null;
          const furniture=interior?tile==='T'?'dresser':tile==='b'?'bed':tile==='s'?'shelf':tile==='c'?'chest':null:null;
          const wallDecoration=interior&&y===0?(x===2?'tool-rack':x===8?'wall-sword':null):null;
          const shore=tile==='r'?`${row[x-1]!=='r'?' shore-west':''}${row[x+1]!=='r'?' shore-east':''}`:'';
          const icon=player?<WorldCharacter name="hero" walking={walking}/>:npc?<WorldCharacter name={npcSprite(npc.id) as CharacterName}/>:objectPath?<img className={`world-object world-object-${objectPath}`} src={`${import.meta.env.BASE_URL}maps/${objectPath}-64.png`} alt="" draggable={false}/>:furniture||wallDecoration?<img className={`interior-object ${wallDecoration?'wall-decoration':''}`} src={`${import.meta.env.BASE_URL}maps/${furniture??wallDecoration}-64.png`} alt="" draggable={false}/>:null;
          const destination=save.area==='town'&&tile==='D'?(houseAt(point)?areaLabel[houseAt(point)!]:'家'):tile==='f'?'教会':tile==='e'?'町へ出る':tile==='d'?'遺跡への門':tile==='T'?'タンスを調べる':'移動';
          return <button key={`${x}-${y}`} role="gridcell" style={{gridColumn:x+1,gridRow:y+1,pointerEvents:inViewport?'auto':'none'}} tabIndex={inViewport?0:-1} aria-hidden={!inViewport} className={`world-tile tile-${tile} ${player?'player':''} ${npc?'npc':''}${shore}`} onClick={()=>onTile(point)} title={player?save.name:npc?.name??(destination==='移動'?undefined:destination)} aria-label={player?'現在地':npc?.name??`${destination} ${x}, ${y}`}>{icon}</button>;
        }))}
        {save.area==='town'&&<div className="world-buildings" aria-hidden="true">
          {Object.entries(houses).map(([kind,house])=><div key={kind} className="world-building" style={{left:`calc(${house.door.x-2} * var(--tile-size))`,top:`calc(${house.door.y-3} * var(--tile-size))`}}>
            <img src={`${import.meta.env.BASE_URL}maps/house-town-320x256.png`} alt="" draggable={false}/>
            {kind==='weaponShop'||kind==='armorShop'||kind==='itemShop'?<span className="world-building-sign">{kind==='weaponShop'?'武器':kind==='armorShop'?'防具':'道具'}</span>:null}
          </div>)}
          <div className="world-building world-building-church" style={{left:'calc(11 * var(--tile-size))',top:'calc(12 * var(--tile-size))'}}><img src={`${import.meta.env.BASE_URL}maps/church-town-320x256.png`} alt="" draggable={false}/></div>
        </div>}
        {save.area==='field'&&<div className="world-ruins-gate" style={{left:`calc(${fieldRuinsGate.x-1} * var(--tile-size))`,top:`calc(${fieldRuinsGate.y-1} * var(--tile-size))`}} aria-hidden="true"><img src={`${import.meta.env.BASE_URL}maps/ruins-gate-128.png`} alt="" draggable={false}/></div>}
        <div className="world-enemies">
          {visibleEnemies.map(enemy=>{
            const point=positionOf(enemy,enemyPositions);
            return <button key={enemy.id} className={`world-enemy ${enemy.boss?'boss':''}`} style={{left:`calc(${point.x} * var(--tile-size))`,top:`calc(${point.y} * var(--tile-size))`}} onClick={()=>onTile(point)} aria-label={`${enemy.name}に近づく`}><PixelSprite name={enemySprite(enemy.id)}/></button>;
          })}
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
