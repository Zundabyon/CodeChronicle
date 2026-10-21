import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { libraryWingLabel, type LibraryShelf } from './library';

export function LibraryPanel({shelf,onClose,readBooks,onToggleRead,bookmark,onBookmark}:{shelf:LibraryShelf;onClose:()=>void;readBooks:string[];onToggleRead:(id:string)=>void;bookmark?:string;onBookmark:(shelfId:string,bookId:string)=>void}) {
  const [index,setIndex]=useState<number|null>(()=>{const saved=shelf.books.findIndex(book=>book.id===bookmark);return saved>=0?saved:null;});
  const openBook=(index:number)=>{
    const book=shelf.books[index];if(!book)return;
    setIndex(index);onBookmark(shelf.id,book.id);
  };
  const [copyStatus,setCopyStatus]=useState('');
  useEffect(()=>setCopyStatus(''),[index,shelf.id]);
  const panelRef=useRef<HTMLElement>(null);
  useLayoutEffect(()=>{
    panelRef.current?.querySelector<HTMLButtonElement>('.library-actions button, .library-books button')?.focus({preventScroll:true});
  },[index]);
  const book=index===null?null:shelf.books[index];
  const copyCode=async()=>{
    if(!book)return;
    try {await navigator.clipboard.writeText(book.code);setCopyStatus('コードをコピーしました。');}
    catch {setCopyStatus('コピーできませんでした。コードを選択してコピーしてください。');}
  };
  return <div className="modal-backdrop adventure-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section ref={panelRef} className="library-panel retro-window" role="dialog" aria-modal="true" aria-labelledby="library-title">
      <div className="library-heading"><div><small>{libraryWingLabel[shelf.wing]} · {shelf.floor}階 · {shelf.language}</small><h2 id="library-title">{shelf.topic}の本棚</h2></div><button onClick={onClose} aria-label="本棚を閉じる">閉じる</button></div>
      {book?<article className="library-book" aria-live="polite">
        <h3>{book.title}</h3><p>{book.explanation}</p><pre tabIndex={0} aria-label="本のコード"><code>{book.code}</code></pre><button onClick={()=>void copyCode()}>コードをコピー</button><p role="status">{copyStatus}</p>
        <p className="library-result"><strong>実行結果・読み方</strong><br/>{book.result}</p><p>{book.takeaway}</p>
        <p><button aria-pressed={readBooks.includes(book.id)} onClick={()=>onToggleRead(book.id)}>{readBooks.includes(book.id)?'既読を取り消す':'既読にする'}</button></p><div className="library-actions"><button onClick={()=>setIndex(null)}>◀ 目次に戻る</button><button disabled={index===0} onClick={()=>{if(index!==null)openBook(Math.max(0,index-1));}}>◀ 前の本へ</button>{index!==null&&index<shelf.books.length-1&&<button onClick={()=>openBook(index+1)}>次の本へ ▶</button>}</div>
      </article>:<><p>{shelf.introduction}</p>{bookmark&&<button onClick={()=>openBook(shelf.books.findIndex(book=>book.id===bookmark))}>しおりの本から読む</button>}<div className="library-books">{shelf.books.map((item,i)=><button key={item.id} onClick={()=>openBook(i)}>{item.title}<span>{readBooks.includes(item.id)?'既読 · ':''}読む ▶</span></button>)}</div><p className="library-note">一冊ずつ、ゆっくり。何度でも読み返せます。</p></>}
      <p className="library-note">読書位置は自動でしおりに保存します。目次から別の本も選べます。</p>
      <p className="library-note">既読 {shelf.books.filter(book=>readBooks.includes(book.id)).length} / {shelf.books.length}冊。既読は読んだ印で、理解度の判定ではありません。</p>
      {shelf.source&&<p className="library-note"><a href={shelf.source} target="_blank" rel="noreferrer">{shelf.language}の公式ガイド ↗</a></p>}
      <small className="library-note">矢印キーで選択 / Enterで決定 / Escで閉じる</small>
    </section>
  </div>;
}
