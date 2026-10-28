import { useRef, useState } from 'react';
import './saveTransfer.css';

type Props<T>={current:T|null;validate:(value:unknown)=>{save:T|null;notice:string};onImport:(save:T)=>string|null};
export function SaveTransfer<T extends {name:string;level:number}>({current,validate,onImport}:Props<T>) {
  const [pending,setPending]=useState<T|null>(null),[message,setMessage]=useState('');
  const fileRef=useRef<HTMLInputElement>(null);
  const exportSave=()=>{
    if(!current)return;
    const url=URL.createObjectURL(new Blob([JSON.stringify({...current,lastSavedAt:Date.now()},null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download=`code-chronicle-${new Date().toISOString().slice(0,10)}.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    setMessage('セーブファイルを書き出しました。');
  };
  const readFile=async(file?:File)=>{
    setPending(null);if(!file)return;
    if(file.size>2*1024*1024){setMessage('2MB以下のセーブファイルを選んでください。');return;}
    try {
      const result=validate(JSON.parse(await file.text()));
      if(!result.save){setMessage(result.notice);return;}
      setPending(result.save);setMessage(result.notice||'保存データを確認しました。');
    }catch{setMessage('セーブファイルを読み取れませんでした。現在の冒険は変更していません。');}
  };
  return <details className="save-transfer"><summary>セーブファイルの書き出し・読み込み</summary>
    <p>ファイルを手元に保存して、別のブラウザーでも冒険を続けられます。</p>
    <button disabled={!current} onClick={exportSave}>セーブを書き出す</button>
    <label>セーブファイルを選ぶ<input ref={fileRef} type="file" accept=".json,application/json" onChange={e=>{void readFile(e.target.files?.[0]);e.target.value='';}}/></label>
    <p role="status">{message}</p>
    {pending&&<div><strong>{pending.name} · LV {pending.level}</strong><p>読み込むと現在の冒険を置き換えます。今の冒険は「保護した前の冒険」に残します。</p>
      <button onClick={()=>{const error=onImport(pending);if(error)setMessage(error);else{setPending(null);setMessage('セーブを読み込みました。');}}}>このセーブを読み込む</button>
      <button onClick={()=>{setPending(null);setMessage('読み込みを取り消しました。');}}>取り消す</button></div>}
  </details>;
}
