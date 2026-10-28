import { chapterTwoObjective, type ChapterTwoStage } from './chapterTwo';
export function ChapterTwoJournal({stage,step,available,onStart}:{stage:ChapterTwoStage;step:number;available:boolean;onStart:()=>void}){
  const objective=chapterTwoObjective(stage,step);
  return <details className="learning-records"><summary>第二章：消えた名簿</summary>{objective?<><strong>{objective.title}</strong><p>{objective.text}</p></>:available?<><p>石灯の村から届いた、新たな助けを求める手紙。既存の村と遺跡を巡る短い冒険です。</p><button onClick={onStart}>第二章を始める</button></>:<p>第一章を終えると、新しい冒険を始められます。</p>}</details>;
}
