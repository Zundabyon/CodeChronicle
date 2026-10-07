import type { Question } from './content';

export function QuestionCode({ question, answered }: { question: Question; answered: boolean }) {
  return <div className="question-code" aria-label="問題のコード">
    <div className="code-heading"><strong>{question.filename ?? 'コード'}</strong><span>{answered ? '① 正解を表示' : '① の空欄を埋めよう'}</span></div>
    <pre tabIndex={0}><code>{question.code!.split('\n').map((line, index) => {
      const parts = line.split('【①】');
      return <span className={`code-line ${parts.length > 1 ? 'code-line-target' : ''}`} key={index}><span className="code-line-number" aria-hidden="true">{index + 1}</span><span>{parts[0]}{parts.length > 1 && <><mark className={answered ? 'code-blank solved' : 'code-blank'}>{answered ? question.reveal : '【①】'}</mark>{parts[1]}</>}</span></span>;
    })}</code></pre>
  </div>;
}
