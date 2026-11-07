import { useEffect, useState } from 'react';
import { App } from './App';
import { questions } from './content';
import { catalogVersion } from './catalogRelease';
import { fetchQuestionCatalog, type QuestionCatalog } from './questionCatalog';
import './questionBootstrap.css';

export function QuestionBootstrap() {
  const [attempt, setAttempt] = useState(0);
  const [catalog, setCatalog] = useState<QuestionCatalog | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void fetchQuestionCatalog(catalogVersion, questions, controller.signal).then(value => {
      if (!controller.signal.aborted) setCatalog(value);
    }).catch(() => {
      if (!controller.signal.aborted) setFailed(true);
    });
    return () => controller.abort();
  }, [attempt]);
  if (catalog) return <App questionBank={catalog.questions}/>;
  return <main className="catalog-screen"><section className="retro-window" aria-labelledby="catalog-heading">
    <small>CODE CHRONICLE</small><h1 id="catalog-heading">{failed ? '記憶の書が届きませんでした' : '記憶の書を読み込んでいます'}</h1>
    <p role="status">{failed ? '通信状況を確かめて、もう一度お試しください。冒険のセーブデータはそのままです。' : '冒険に必要な知識を集めています。'}</p>
    {failed && <button className="primary" onClick={() => { setFailed(false); setAttempt(value => value + 1); }}>もう一度読み込む</button>}
  </section></main>;
}
