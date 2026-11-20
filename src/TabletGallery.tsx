import { useState } from 'react';
import { dungeonLessons, galleryLessons, isLessonRead, lessonImage } from './world/dungeonLessons';

export function TabletGallery({ readBooks, onClose }: { readBooks: string[]; onClose: () => void }) {
  const found = galleryLessons.filter(id => isLessonRead(readBooks, id));
  const [open, setOpen] = useState<string | null>(found[0] ?? null);
  const lesson = open ? dungeonLessons[open] : null;
  return <section className="tablet-gallery">
    <header><h2>石板ギャラリー</h2><span>{found.length} / {galleryLessons.length} 枚</span><button onClick={onClose}>とじる</button></header>
    <p>海底の古道で読んだ「ふり返りの石板」を、いつでも見返せます。</p>
    <div className="tablet-gallery-body">
      <ul>{galleryLessons.map(id => {
        const read = isLessonRead(readBooks, id);
        return <li key={id}><button disabled={!read} aria-current={open === id} onClick={() => setOpen(id)}>
          {read ? <img src={`${import.meta.env.BASE_URL}${lessonImage(id)}`} alt="" /> : <span className="locked">？</span>}
          <small>{read ? dungeonLessons[id].title.replace(/^ふり返り：/, '') : 'まだ読んでいない'}</small>
        </button></li>;
      })}</ul>
      {lesson && open ? <article>
        <img src={`${import.meta.env.BASE_URL}${lessonImage(open)}`} alt={`${lesson.title}の図解`} />
        <h3>{lesson.title}</h3>
        {lesson.lines.map(line => <p key={line}>{line}</p>)}
      </article> : <article className="empty"><p>海底の古道で石板を調べると、ここに並びます。</p></article>}
    </div>
  </section>;
}
