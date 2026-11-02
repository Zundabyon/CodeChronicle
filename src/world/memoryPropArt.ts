import type { Visual } from './catalog';

// Keep generated originals untouched; crop their transparent padding at render
// time. Door states share one frame so unlocking never shifts the stone arch.
export const MEMORY_PROP_ART = {
  spring: {src:'maps/props/memory-spring-v2.png',sourceWidth:1346,sourceHeight:1168,frame:[76,60,1196,1056]},
  door: {src:'maps/props/memory-door-v2.png',sourceWidth:1041,sourceHeight:1511,frame:[58,70,926,1336]},
  doorOpen: {src:'maps/props/memory-door-open-v2.png',sourceWidth:1041,sourceHeight:1511,frame:[58,70,926,1336]},
} as const;

export function memoryPropVisual(name:keyof typeof MEMORY_PROP_ART,width:number,height:number):Visual {
  return {renderer:'atlas',...MEMORY_PROP_ART[name],width,height,anchor:{x:.5,y:1}};
}
