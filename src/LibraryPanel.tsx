import { useLayoutEffect, useRef, useState } from 'react';
import { libraryWingLabel, type LibraryShelf } from './library';

export function LibraryPanel({shelf,onClose}:{shelf:LibraryShelf;onClose:()=>void}) {
  const [index,setIndex]=useState<number|null>(null);
  const panelRef=useRef<HTMLElement>(null);
  useLayoutEffect(()=>{
    panelRef.current?.querySelector<HTMLButtonElement>('.library-actions button, .library-books button')?.focus({preventScroll:true});
  },[index]);
  const book=index===null?null:shelf.books[index];
  return <div className="modal-backdrop adventure-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section ref={panelRef} className="library-panel retro-window" role="dialog" aria-modal="true" aria-labelledby="library-title">
      <div className="library-heading"><div><small>{libraryWingLabel[shelf.wing]} · {shelf.floor}階 · {shelf.language}</small><h2 id="library-title">{shelf.topic}の本棚</h2></div><button onClick={onClose} aria-label="本棚を閉じる">閉じる</button></div>
      {book?<article className="library-book" aria-live="polite">
        <h3>{book.title}</h3><p>{book.explanation}</p><pre><code>{book.code}</code></pre>
        <p className="library-result"><strong>実行結果・読み方</strong><br/>{book.result}</p><p>{book.takeaway}</p>
        <div className="library-actions"><button onClick={()=>setIndex(null)}>◀ 目次に戻る</button>{index!==null&&index<shelf.books.length-1&&<button onClick={()=>setIndex(index+1)}>次の本へ ▶</button>}</div>
      </article>:<><p>{shelf.introduction}</p><div className="library-books">{shelf.books.map((item,i)=><button key={item.title} onClick={()=>setIndex(i)}>{item.title}<span>読む ▶</span></button>)}</div><p className="library-note">一冊ずつ、ゆっくり。何度でも読み返せます。</p></>}
      {shelf.source&&<p className="library-note"><a href={shelf.source} target="_blank" rel="noreferrer">{shelf.language}の公式ガイド ↗</a></p>}
      <small className="library-note">矢印キーで選択 / Enterで決定 / Escで閉じる</small>
    </section>
  </div>;
}
