import type {ReactNode} from 'react';
import '../base.css';
import '../style.css';

// 効果音さくせい・BGMさくせいで共通の枠と見た目。
export const designerBox={background:'#211e2c',border:'2px solid #c3a06d',boxShadow:'0 0 0 4px #171421',padding:16,marginBottom:16} as const;
export const codeBox={width:'100%',marginTop:10,background:'#0d1320',color:'#b6d4c6',font:'12px monospace',border:'1px solid #548475'} as const;
export function DesignerShell({title,help,onClose,children}:{title:string;help:string;onClose?:()=>void;children:ReactNode}){
  return <div className="app-shell" style={{padding:20}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><h1 style={{color:'#f4e4bd',margin:'0 0 4px'}}>{title}</h1>{onClose&&<button className="secondary" onClick={onClose}>✕ とじる</button>}</div>
    <p style={{color:'#bfa779',margin:'0 0 16px',fontSize:12}}>{help}</p>
    {children}
  </div>;
}
export function download(data:ArrayBuffer,name:string){const url=URL.createObjectURL(new Blob([data],{type:'audio/wav'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();URL.revokeObjectURL(url);}
