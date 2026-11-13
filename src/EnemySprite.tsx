import { PixelSprite, enemySprite } from './PixelSprite';
import { memoryEnemyVisual } from './world/memoryEnemyArt';
import { rangerBattles } from './quests/rangerBattles';

export function EnemySprite({enemyId}:{enemyId:string}) {
  if(rangerBattles[enemyId])return <img className="pixel-sprite" src={`${import.meta.env.BASE_URL}sprites/${enemyId}-right.png`} alt="" aria-hidden="true" draggable={false}/>;
  const visual=memoryEnemyVisual(enemyId);
  if(!visual)return <PixelSprite name={enemySprite(enemyId)}/>;
  const [x,y,width,height]=visual.frame;
  return <svg className="pixel-sprite memory-enemy-sprite" data-memory-enemy-art={enemyId}
    viewBox={'0 0 '+width+' '+height} preserveAspectRatio="xMidYMax meet"
    overflow="hidden" aria-hidden="true">
    <image href={import.meta.env.BASE_URL+visual.src} x={-x} y={-y}
      width={visual.sourceWidth} height={visual.sourceHeight} imageRendering="pixelated"/>
  </svg>;
}
