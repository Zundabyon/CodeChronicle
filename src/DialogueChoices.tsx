import { useLayoutEffect, useRef } from 'react';

type Choice = {label:string; response:string;onChoose?:()=>void};

export function DialogueChoices({choices,onChoose}:{choices:Choice[];onChoose:(choice:Choice)=>void}) {
  const groupRef=useRef<HTMLDivElement>(null);
  useLayoutEffect(()=>{
    groupRef.current?.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});
  },[choices]);
  return <>
    <div ref={groupRef} className="dialogue-choices" role="group" aria-label="会話の選択肢" aria-describedby="dialogue-choice-help" onKeyDown={event=>{
      if(event.altKey||event.ctrlKey||event.metaKey||event.nativeEvent.isComposing)return;
      const direction=['ArrowRight','ArrowDown'].includes(event.key)?1:['ArrowLeft','ArrowUp'].includes(event.key)?-1:0;
      if(!direction)return;
      event.preventDefault();
      const buttons=Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
      const index=buttons.indexOf(document.activeElement as HTMLButtonElement);
      buttons[(index+direction+buttons.length)%buttons.length]?.focus({preventScroll:true});
    }}>
      {choices.map(choice=><button type="button" key={choice.label} onClick={event=>{event.stopPropagation();onChoose(choice);}}>{choice.label}　▶</button>)}
    </div>
    <p id="dialogue-choice-help" className="dialogue-choice-help">← → で選択 / Enter で決定</p>
  </>;
}
