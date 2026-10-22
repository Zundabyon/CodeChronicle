export function MysteriousKnight({className='',world=false}:{className?:string;world?:boolean}) {
  if(world)return <span className={`mysterious-knight ${className}`} aria-hidden="true">
    <svg className="character-art-image" width={64} height={64} viewBox="0 0 64 64" overflow="hidden">
      <svg x={14} y={14} width={36} height={50} viewBox="284 130 705 989" preserveAspectRatio="xMidYMax meet" overflow="hidden">
        <image href={`${import.meta.env.BASE_URL}sprites/knight-generated-original.png`} width={1254} height={1254} imageRendering="pixelated"/>
      </svg>
    </svg>
  </span>;
  // Dialogue portraits retain their existing artwork and proportions.
  return <svg className={`mysterious-knight ${className}`} viewBox="0 0 32 40" shapeRendering="crispEdges" role="img" aria-label="顔を兜で隠した謎の騎士">
    <path fill="#111924" d="M9 2h14v2h3v4h2v14h-3v3h3v10h-4v4H8v-4H4V25h3v-3H4V8h3V4h2z"/>
    <path fill="#44435d" d="M6 21h20v6h3v11H3V27h3z"/>
    <path fill="#252a43" d="M5 28h5v10H3v-7h2zM23 27h4v4h2v7h-7z"/>
    <path fill="#8d9eae" d="M9 4h14v3h3v14h-4v3H10v-3H6V7h3z"/>
    <path fill="#c8d1d1" d="M10 4h6v9H7V8h3zM17 5h5v3h3v5h-8z"/>
    <path fill="#202735" d="M7 13h18v5H7z"/><path fill="#7da4b4" d="M9 14h5v1H9zM18 14h5v1h-5z"/>
    <path fill="#63758b" d="M8 18h16v3h-4v3h-8v-3H8z"/><path fill="#b4bec0" d="M15 6h2v17h-2z"/>
    <path fill="#66788b" d="M10 24h12v4h3v7H7v-7h3z"/><path fill="#a4b0b8" d="M11 25h10v7H11zM6 25h5v5H5v-3h1zM21 25h5v2h1v3h-6z"/>
    <path fill="#cbb88a" d="M9 32h14v2H9z"/><path fill="#293345" d="M9 35h6v4H7v-2h2zM17 35h6v2h2v2h-8z"/>
    <path fill="#d0d5d4" d="M27 27h2v8h-2z"/><path fill="#b39255" d="M25 34h6v2h-6zM27 36h2v3h-2z"/>
  </svg>;
}
