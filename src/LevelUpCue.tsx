import './levelUpCue.css';

export type LevelUpEvent = { level:number; hpGain:number; mpGain:number };

export function LevelUpCue({event}:{event:LevelUpEvent}) {
  return <span className="level-up-cue" role="status">
    <span className="level-up-light" aria-hidden="true"><i/><i/><i/><i/></span>
    <strong>LEVEL UP! Lv.{event.level}</strong>
    <small>最大HP +{event.hpGain}{event.mpGain>0&&` / 最大MP +${event.mpGain}`}</small>
  </span>;
}
