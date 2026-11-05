// Stable encounter IDs preserve defeated saves while sharing twelve visual species.
export const memoryEnemyCopies = 4;
export function memoryEnemyBaseId(id:string):string {
  return /^memory-[crud]-enemy-[0-2]-copy-[1-3]$/.test(id) ? id.replace(/-copy-[1-3]$/, '') : id;
}
export function memoryEnemyInstanceId(baseId:string,copy:number):string {
  return copy===0 ? baseId : `${baseId}-copy-${copy}`;
}
