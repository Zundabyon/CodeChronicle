import { useState } from 'react';
import { libraryFloors, libraryShelves, libraryWingLabel, type LibraryShelf } from './library';
import './librarySearch.css';
export function LibrarySearch({onSelect}:{onSelect:(shelf:LibraryShelf,bookId:string)=>void}) {
  const [query,setQuery]=useState(''),[language,setLanguage]=useState('all');
  const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const results=libraryShelves.flatMap(shelf=>shelf.books.map(book=>({shelf,book}))).filter(({shelf,book})=>(language==='all'||shelf.language===language)&&words.every(word=>`${libraryWingLabel[shelf.wing]} ${shelf.floor}階 ${shelf.language} ${shelf.topic} ${book.title} ${book.explanation}`.toLocaleLowerCase().includes(word)));
  return <section className="library-search" aria-label="全館の蔵書検索"><h3>全館の蔵書案内</h3>
    <p>{libraryFloors.map(f=>`${libraryWingLabel[f.wing]} ${f.floor}階：${f.language}`).join(' / ')}</p>
    <label>言語<select aria-label="言語" value={language} onChange={e=>setLanguage(e.target.value)}><option value="all">全6フロア</option>{libraryFloors.map(f=><option key={f.area}>{f.language}</option>)}</select></label>
    <label>本を検索<input aria-label="本を検索" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="言語・階・テーマ・タイトル"/></label>
    <p role="status">{results.length}冊が見つかりました</p>
    {results.length===0?<p>条件に合う本がありません。言葉や言語を変えて探してください。</p>:<ul>{results.map(({shelf,book})=><li key={book.id}><button onClick={()=>onSelect(shelf,book.id)}>{book.title}<small>{libraryWingLabel[shelf.wing]} · {shelf.floor}階 · {shelf.language} · {shelf.topic}の本棚</small></button></li>)}</ul>}
  </section>;
}
