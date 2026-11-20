// Shrinks lesson diagrams in public/lessons/ with a 256-color palette (≈1/3 the size, no visible loss on pixel art).
import sharp from 'sharp';
import {readdirSync,renameSync,rmSync,statSync} from 'node:fs';
const dir='public/lessons';
for(const name of readdirSync(dir).filter(n=>n.endsWith('.png'))){
  const path=`${dir}/${name}`,before=statSync(path).size;
  const info=await sharp(path).png({palette:true,colors:256,quality:92,effort:10,compressionLevel:9}).toFile(path+'.tmp');
  // Already-compressed files would barely shrink; keep them as they are.
  if(info.size<before*0.9)renameSync(path+'.tmp',path);else rmSync(path+'.tmp');
  console.log(name,before,'→',Math.min(info.size,before));
}
