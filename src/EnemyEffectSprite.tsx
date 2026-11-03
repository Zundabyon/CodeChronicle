export type EnemyAttackStyle = 'splash' | 'wave' | 'curse' | 'blade' | 'drain' | 'lightning' | 'shock';

/** Small stepped silhouettes retain their identity at both desktop and phone sizes. */
export function EnemyEffectSprite({style}:{style:EnemyAttackStyle}) {
  return <svg className="battle-enemy-pixel" viewBox="0 0 64 64" preserveAspectRatio="none" shapeRendering="crispEdges" aria-hidden="true">
    {style==='splash'&&<><path fill="#315a59" d="M24 4h16v8h8v8h8v8h4v20h-8v8H12v-8H4V28h4v-8h8v-8h8z"/><path fill="#72bf79" d="M24 9h16v8h8v8h7v20h-7v8H16v-8H9V28h7v-8h8z"/><path fill="#baf29b" d="M24 14h10v5h8v6h-8v6H20v-6h4z"/><path fill="#e8ffcc" d="M23 16h8v5h-8z"/><path fill="#498b75" d="M16 40h8v6h23v-7h8v7h-7v7H16z"/></>}
    {style==='wave'&&<><path fill="#27667d" d="M8 8h40v8h8v32h-8v8H8v-8H0V16h8zm8 8v8H8v16h8v8h24v-8h8V24h-8v-8z"/><path fill="#8ae5ed" d="M12 8h36v7h8v34h-8v7H12v-7H5V15h7zm4 8v8H9v16h7v8h28v-8h7V24h-7v-8z"/><path fill="#e0ffff" d="M16 12h24v5H16zM8 23h5v13H8zM44 41h7v7h-7z"/></>}
    {style==='curse'&&<><path fill="#291b42" d="M16 4h32v8h8v40h-8v8H16v-8H8V12h8z"/><path fill="#8e69bb" d="M16 8h32v8h8v32h-8v8H16v-8H8V16h8z"/><path fill="#35234e" d="M19 15h26v7h7v20h-7v7H19v-7h-7V22h7z"/><path fill="#ecd9ff" d="M28 16h8v10h10v8H36v10h-8V34H18v-8h10z"/><path fill="#bba0e6" d="M14 19h5v5h-5zM45 40h5v5h-5z"/></>}
    {style==='blade'&&<><path fill="#5b304e" d="M22 2h20v5h5v47h-5v7H22v-7h-5V7h5z"/><path fill="#f47f9f" d="M24 5h16v6h5v40h-5v7H24v-7h-5V11h5z"/><path fill="#fff1dc" d="M27 9h6v43h-6zM33 9h5v30h-5z"/><path fill="#bd4e7d" d="M38 18h5v31h-5z"/></>}
    {style==='drain'&&<><path fill="#291b48" d="M20 3h24v6h8v8h8v30h-8v8h-8v6H20v-6h-8v-8H4V17h8V9h8z"/><path fill="#68468f" d="M20 8h24v6h8v8h4v20h-4v8h-8v6H20v-6h-8v-8H8V22h4v-8h8z"/><path fill="#ad7bd4" d="M21 15h18v5h7v9h-7v7H21v-7h-6v-8h6z"/><path fill="#f3d8ff" d="M23 18h10v5H23zM38 38h8v6h-8z"/></>}
    {style==='lightning'&&<><path fill="#986a32" d="M34 0h24L45 22h11L19 64h-9l12-27H10z"/><path fill="#ffc858" d="M36 2h17L40 25h10L20 59l9-27H16z"/><path fill="#fff5b9" d="M37 4h9L34 27h8L22 52l8-24H23z"/></>}
    {style==='shock'&&<><path fill="#473951" d="M19 3h28v6h8v10h6v26h-8v10h-9v6H19v-6h-9V45H4V19h8V9h7z"/><path fill="#9a806b" d="M19 8h27v6h8v8h4v19h-8v10h-8v6H21v-6h-7v-9H9V22h7v-8h3z"/><path fill="#d7b77d" d="M20 13h19v6h7v10H33v6H19v-6h-5V21h6z"/><path fill="#fff0bc" d="M22 17h11v5H22z"/><path fill="#765c69" d="M16 38h8v7h16v-6h9v8h-9v5H22v-5h-6z"/></>}
  </svg>;
}
