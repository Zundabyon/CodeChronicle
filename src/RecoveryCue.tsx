import './recoveryCue.css';

export type RecoveryEvent = { sequence:number; hp:number; mp:number; source:'inventory'|'church'|'world' };

export function RecoveryCue({event}:{event:RecoveryEvent}) {
  return <span className="recovery-cue" role="status">
    <span className="recovery-sparks" aria-hidden="true"><i/><i/><i/><i/></span>
    <strong>回復 {event.hp>0&&`HP +${event.hp}`}{event.hp>0&&event.mp>0&&' / '}{event.mp>0&&`MP +${event.mp}`}</strong>
  </span>;
}
