export type ArtworkSize={width:number;height:number};

// Same cover + percentage object-position geometry as the image underneath.
export function artworkViewport(source:ArtworkSize,box:ArtworkSize,position:{x:number;y:number}){
  const scale=Math.max(box.width/source.width,box.height/source.height);
  if(!Number.isFinite(scale)||scale<=0)return null;
  const width=box.width/scale,height=box.height/scale;
  return {x:(source.width-width)*position.x,y:(source.height-height)*position.y,width,height};
}
