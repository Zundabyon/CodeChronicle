import { chapterTwoObjective, type ChapterTwoStage } from './chapterTwo';
import { areaLabel, type Area } from './content';
import { storyObjective, type StoryStage } from './story';
import './resumeSummary.css';

export function ResumeSummary({save,savedAt}:{save:{name:string;level:number;area:Area;story:StoryStage;bossDefeated:boolean;chapterTwo?:ChapterTwoStage;chapterTwoStep?:number};savedAt:number|null}) {
  const objective=(save.chapterTwo?chapterTwoObjective(save.chapterTwo,save.chapterTwoStep):undefined)??storyObjective(save.story,save.bossDefeated);
  return <aside className="resume-summary" aria-label="冒険の続き">
    <strong>{save.name}　LV {save.level}</strong>
    <p>現在地：{areaLabel[save.area]}</p><p>次の目的：{objective.title}</p>
    <small>最終保存：{savedAt===null?'時刻情報なし':new Date(savedAt).toLocaleString('ja-JP')}</small>
  </aside>;
}
