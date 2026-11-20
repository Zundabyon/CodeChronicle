import { useId, useState, type ReactNode } from 'react';

const key='code-chronicle-hud-v1';
function readOpen():Record<string,boolean>{try{return JSON.parse(localStorage.getItem(key)??'{}')??{};}catch{return {};}}

/** World-screen side panel whose open/closed state is remembered per browser. */
export function HudPanel({id,title,extra,defaultOpen=true,className='',label,children}:{id:string;title:ReactNode;extra?:ReactNode;defaultOpen?:boolean;className?:string;label?:string;children:ReactNode}) {
  const [open,setOpen]=useState(()=>readOpen()[id]??defaultOpen);
  const bodyId=useId();
  const toggle=()=>{const next=!open;setOpen(next);try{localStorage.setItem(key,JSON.stringify({...readOpen(),[id]:next}));}catch{/* storage blocked: state just isn't remembered */}};
  return <section className={`world-panel retro-window ${className}`} aria-label={label}>
    <button className="world-panel-toggle" aria-expanded={open} aria-controls={bodyId} onClick={toggle}><span aria-hidden="true">{open?'▼':'▶'}</span> {title}{extra}</button>
    {open&&<div id={bodyId} className="world-panel-body">{children}</div>}
  </section>;
}
