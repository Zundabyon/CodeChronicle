export function MysteriousKnight({className='',world=false}:{className?:string;world?:boolean}) {
  if(world)return <span className={`mysterious-knight ${className}`} aria-hidden="true">
    <svg className="character-art-image" width={64} height={64} viewBox="0 0 64 64" overflow="hidden">
      <svg x={14} y={14} width={36} height={50} viewBox="284 130 705 989" preserveAspectRatio="xMidYMax meet" overflow="hidden">
        <image href={`${import.meta.env.BASE_URL}sprites/knight-generated-original.png`} width={1254} height={1254} imageRendering="pixelated"/>
      </svg>
    </svg>
  </span>;
  // A dedicated bust keeps dialogue detail consistent with the other portraits.
  return <svg className={`mysterious-knight ${className}`} viewBox="0 78 1086 1352" preserveAspectRatio="xMidYMax meet" role="img" aria-label="顔を兜で隠した謎の騎士">
    <image href={`${import.meta.env.BASE_URL}portraits/knight-v2.png`} width={1086} height={1448} imageRendering="pixelated"/>
  </svg>;
}
