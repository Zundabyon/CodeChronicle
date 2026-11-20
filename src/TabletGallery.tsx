import { useState } from 'react';
import { dungeonLessons, galleryGroups, galleryLessons, isLessonRead, lessonImage } from './world/dungeonLessons';

export function TabletGallery({ readBooks, onClose }: { readBooks: string[]; onClose: () => void }) {
  const found = galleryLessons.filter(id => isLessonRead(readBooks, id));
  const [group, setGroup] = useState(() => Math.max(0, galleryGroups.findIndex(([, ids]) => ids.some(id => isLessonRead(readBooks, id)))));
  const [open, setOpen] = useState<string | null>(found[0] ?? null);
  const lesson = open ? dungeonLessons[open] : null;
  const [, ids] = galleryGroups[group];
  return <section className="tablet-gallery">
    <header><h2>石板ギャラリー</h2><span>{found.length} / {galleryLessons.length} 枚</span><button onClick={onClose}>とじる</button></header>
    <p>ダンジョンで読んだ解説の石板を、いつでも見返せます。</p>
    <nav className="tablet-gallery-tabs" aria-label="ダンジョン">{galleryGroups.map(([name, groupIds], i) =>
      <button key={name} aria-pressed={i === group} onClick={() => setGroup(i)}>{name}<small>{groupIds.filter(id => isLessonRead(readBooks, id)).length}/{groupIds.length}</small></button>)}</nav>
    <div className="tablet-gallery-body">
      <ul>{ids.map(id => {
        const read = isLessonRead(readBooks, id);
        return <li key={id}><button disabled={!read} aria-current={open === id} onClick={() => setOpen(id)}>
          {read ? <img loading="lazy" src={`${import.meta.env.BASE_URL}${lessonImage(id)}`} alt="" /> : <span className="locked">？</span>}
          <small>{read ? dungeonLessons[id].title.replace(/^(ふり返り|石板)：/, '') : 'まだ読んでいない'}</small>
        </button></li>;
      })}</ul>
      {lesson && open ? <article>
        <img src={`${import.meta.env.BASE_URL}${lessonImage(open)}`} alt={`${lesson.title}の図解`} />
        <h3>{lesson.title}</h3>
        {lesson.lines.map(line => <p key={line}>{line}</p>)}
      </article> : <article className="empty"><p>ダンジョンで石板を調べると、ここに並びます。</p></article>}
    </div>
  </section>;
}
