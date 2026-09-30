import type { CSSProperties } from 'react';
import { areaLabel, difficultyLabel, houseAt, maps, type Area, type Point, type Track, type Difficulty } from './content';
import { PixelSprite, enemySprite, npcSprite } from './PixelSprite';
import { WorldCharacter, type CharacterName } from './WorldCharacter';
import { positionOf, type EnemyPositions } from './enemyMovement';

type WorldSave = {
  name: string; area: Area; pos: Point; level: number; hp: number; mp: number;
  xp: number; defeated: string[]; correct: number; total: number; wrong: string[];
  track: Track; difficulty: Difficulty; bossDefeated: boolean;
};

type Props = {
  save: WorldSave;
  enemyPositions: EnemyPositions;
  menu: 'command'|'status'|'quest'|null;
  onMenu: (menu: 'command'|'status'|'quest'|null) => void;
  onTile: (point: Point) => void;
  onChurch: () => void;
  onSettings: () => void;
  onSound: () => void;
  muted: boolean;
  walking: boolean;
};

const hpLimit = (level: number) => 20 + (level - 1) * 5;
const mpLimit = (level: number) => 3 + Math.floor((level - 1) / 2);

export function WorldScene({save,enemyPositions,menu,onMenu,onTile,onChurch,onSettings,onSound,muted,walking}:Props) {
  const map=maps[save.area];
  const width=map.tiles[0].length;
  const height=map.tiles.length;
  const viewColumns=Math.min(14,width),viewRows=Math.min(9,height);
  const cameraX=Math.max(0,Math.min(save.pos.x-7,width-viewColumns));
  const cameraY=Math.max(0,Math.min(save.pos.y-4,height-viewRows));
  const interior=!['town','field','dungeon'].includes(save.area);
  const mapStyle={
    '--map-columns':width,
    '--map-rows':height,
    transform:`translate(${-cameraX/width*100}%, ${-cameraY/height*100}%)`,
  } as CSSProperties;
  const visibleEnemies=map.enemies.filter(enemy=>!save.defeated.includes(enemy.id));
  return <main className="world-stage">
    <div className="world-viewport" style={{width:`calc(${viewColumns} * var(--tile-size))`,height:`calc(${viewRows} * var(--tile-size))`}} aria-label={areaLabel[save.area]}>
      <div className={`world-map map-${save.area} ${interior?'map-interior':''}`} style={mapStyle} role="grid" aria-label={`${areaLabel[save.area]}のマップ`}>
        {map.tiles.map((row,y)=>row.split('').map((tile,x)=>{
          const point={x,y};
          const npc=map.npcs.find(person=>person.x===x&&person.y===y);
          const player=save.pos.x===x&&save.pos.y===y;
          const objectPath=tile==='t'?'tree':tile==='#'&&!interior&&save.area!=='dungeon'?(save.area==='town'?'tree':'mountain'):null;
          const shore=tile==='r'?`${row[x-1]!=='r'?' shore-west':''}${row[x+1]!=='r'?' shore-east':''}`:'';
          const icon=player?<WorldCharacter name="hero" walking={walking}/>:npc?npc.id==='letter'?<span className="map-letter">✉</span>:<WorldCharacter name={npcSprite(npc.id) as CharacterName}/>:objectPath?<img className={`world-object world-object-${objectPath}`} src={`${import.meta.env.BASE_URL}maps/${objectPath}-64.png`} alt="" draggable={false}/>:tile==='d'?'◈':tile==='b'?'▣':tile==='s'?'▤':tile==='c'?'◉':null;
          const destination=save.area==='town'&&tile==='D'?(houseAt(point)?areaLabel[houseAt(point)!]:'家'):tile==='f'?'教会':tile==='e'?'町へ出る':tile==='d'?'遺跡への門':'移動';
          return <button key={`${x}-${y}`} role="gridcell" className={`world-tile tile-${tile} ${player?'player':''} ${npc?'npc':''}${shore}`} onClick={()=>onTile(point)} title={player?save.name:npc?.name??destination} aria-label={player?'現在地':npc?.name??`${destination} ${x}, ${y}`}>{icon}</button>;
        }))}
        <div className="world-enemies">
          {visibleEnemies.map(enemy=>{
            const point=positionOf(enemy,enemyPositions);
            return <button key={enemy.id} className={`world-enemy ${enemy.boss?'boss':''}`} style={{left:`calc(${point.x} * var(--tile-size))`,top:`calc(${point.y} * var(--tile-size))`}} onClick={()=>onTile(point)} aria-label={`${enemy.name}に近づく`}><PixelSprite name={enemySprite(enemy.id)}/></button>;
          })}
        </div>
      </div>
    </div>
    <div className="world-place retro-window"><span>{areaLabel[save.area]}</span></div>
    <button className="world-command retro-window" onClick={()=>onMenu(menu?null:'command')} aria-expanded={!!menu}>▶ コマンド <small>Esc</small></button>
    <div className="world-hint">{interior?'玄関から町へ　•　クリック / 十字キーで移動':'十字キー / WASD で移動　•　扉から家へ入る'}</div>
    {menu&&<div className="world-menu retro-window">
      <div className="world-menu-title">{menu==='command'?'コマンド':menu==='status'?'つよさ': 'たびのもくてき'}</div>
      {menu==='command'&&<div className="world-menu-items">
        <button onClick={()=>onMenu('status')}>▶ つよさ</button>
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
