import type { Enemy } from './content';
import { battleBanter } from './battleBanter';
import { enemySprite, PixelSprite } from './PixelSprite';

type BattleEncounterProps = {
  enemy: Enemy;
  heroName: string;
  banterSeed?: number;
  onEnter: () => void;
};

export function BattleEncounter({ enemy, heroName, banterSeed=0, onEnter }: BattleEncounterProps) {
  const voices = battleBanter(enemy, 'intro', 0, banterSeed);

  return <main className={`encounter-screen ${enemy.boss ? 'boss-encounter' : ''}`} role="status" aria-live="assertive">
    <div className="encounter-flash" />
    <div className="encounter-rays" />
    <div className="encounter-content">
      <span className="encounter-kicker">ENCOUNTER!</span>
      <h2>{enemy.name}が現れた！</h2>
      <div className="encounter-duo" aria-hidden="true">
        <div className="encounter-sprite encounter-foe-sprite"><PixelSprite name={enemySprite(enemy.id)} /></div>
        <span>VS</span>
        <div className="encounter-sprite encounter-hero-sprite"><PixelSprite name="hero" /></div>
      </div>
      <div className="encounter-banter">
        <div className="battle-voice battle-voice-enemy"><strong>{enemy.name}</strong><p>「{voices.enemy}」</p></div>
        <div className="battle-voice battle-voice-hero"><strong>{heroName}</strong><p>「{voices.hero}」</p></div>
      </div>
      <button onClick={onEnter}>戦闘へ ›</button>
    </div>
  </main>;
}
