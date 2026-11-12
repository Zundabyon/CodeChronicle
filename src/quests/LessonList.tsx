import { dungeonLessons, isLessonRead } from '../world/dungeonLessons';

export function LessonList({readBooks,onOpen}:{readBooks:string[];onOpen:(id:string)=>void}) {
  const read=Object.entries(dungeonLessons).filter(([id])=>isLessonRead(readBooks,id));
  if(!read.length)return null;
  return <details className="learning-records"><summary>ダンジョンで読んだ解説</summary>
    <div className="library-books">{read.map(([id,lesson])=><button key={id} onClick={()=>onOpen(id)}>{lesson.title}<span>読み直す ▶</span></button>)}</div>
  </details>;
}
