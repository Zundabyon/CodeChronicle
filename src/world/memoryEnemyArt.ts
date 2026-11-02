import { memoryEnemyBaseId } from './memoryEnemyIdentity';
import type { Visual } from './catalog';

export const memoryEnemyAtlas = {
  src:'sprites/memory-dungeon-enemies-v1.png',
  width:1086,height:1448,
} as const;

// Measured transparent bounds retain wings and quills beyond nominal grid cells.
export const memoryEnemyFrames:Record<string,readonly [number,number,number,number]>={
  'memory-c-enemy-0':[24,8,336,352],
  'memory-c-enemy-1':[382,16,338,346],
  'memory-c-enemy-2':[750,90,336,272],
  'memory-r-enemy-0':[0,369,384,355],
  'memory-r-enemy-1':[422,363,286,344],
  'memory-r-enemy-2':[704,405,382,266],
  'memory-u-enemy-0':[0,727,384,325],
  'memory-u-enemy-1':[388,704,328,370],
  'memory-u-enemy-2':[734,702,352,346],
  'memory-d-enemy-0':[0,1054,388,394],
  'memory-d-enemy-1':[388,1073,334,375],
  'memory-d-enemy-2':[734,1058,352,390],
};

export function memoryEnemyVisual(enemyId:string):Extract<Visual,{renderer:'atlas'}>|undefined {
  const frame=memoryEnemyFrames[memoryEnemyBaseId(enemyId)];
  return frame?{renderer:'atlas',src:memoryEnemyAtlas.src,sourceWidth:memoryEnemyAtlas.width,
    sourceHeight:memoryEnemyAtlas.height,frame,width:.95,height:.95,anchor:{x:.5,y:.5}}:undefined;
}
