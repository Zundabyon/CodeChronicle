import type { CSSProperties } from 'react';
import { type Area, type Enemy } from './content';
import { enemySprite, PixelSprite } from './PixelSprite';

type BattleStageProps = {
  area: Area | 'church';
  enemy: Enemy;
  enemyHp: number;
  enemyMaxHp: number;
  hero: { name: string; level: number; hp: number; mp: number };
  heroMaxHp: number;
  heroMaxMp: number;
  attack: 'hero' | 'enemy' | null;
};

export function BattleStage({ area, enemy, enemyHp, enemyMaxHp, hero, heroMaxHp, heroMaxMp, attack }: BattleStageProps) {
  const terrain = area === 'field' || area === 'dungeon' || area === 'church' ? area : 'town';
  const location = terrain === 'field' ? '風渡りの平原' : terrain === 'dungeon' ? '忘却の遺跡' : terrain === 'church' ? '黎明の教会' : '黎明の町';
  const ground = terrain === 'field' ? 'field-ground.png' : terrain === 'town' ? 'town-ground.png' : 'dungeon-ground.png';
  const attackTone = enemy.id === 'f1' ? 'green' : enemy.id === 'f2' ? 'cyan' : enemy.boss ? 'gold' : 'violet';
  const style = { '--battle-ground': `url("${import.meta.env.BASE_URL}maps/${ground}")` } as CSSProperties;

  return (
    <div className={`battlefield battlefield-${terrain} ${attack ? `battlefield-${attack}-attack` : ''}`} style={style}>
      <span className="battlefield-location">{location}</span>
      <div className="battlefield-backdrop" aria-hidden="true">
        <span className="battlefield-scenery-back" />
        <span className="battlefield-scenery-front" />
      </div>
      {attack && <span className="battle-action-banner" aria-hidden="true">{attack === 'hero' ? `${hero.name}の斬りつけ！` : `${enemy.name}の「${enemy.attackName}」！`}</span>}
      {attack === 'hero' && <div className="battle-slash-effect" aria-hidden="true"><i /><i /><i /></div>}
      {attack === 'enemy' && <div className={`battle-enemy-effect battle-enemy-effect-${attackTone}`} aria-hidden="true"><span className="battle-enemy-projectile" /><span className="battle-enemy-impact" /></div>}

      <div className={`battle-combatant battle-foe ${enemy.boss ? 'battle-foe-boss' : ''}`}>
        <div className="battle-combatant-sprite battle-foe-sprite">
          <PixelSprite name={enemySprite(enemy.id)} />
        </div>
        <div className="battle-combatant-status battle-foe-status">
          <strong>{enemy.name}</strong>
          <div className="enemy-hp" role="progressbar" aria-label={`${enemy.name}のHP`} aria-valuenow={enemyHp} aria-valuemin={0} aria-valuemax={enemyMaxHp}>
            <i style={{ width: `${enemyHp / enemyMaxHp * 100}%` }} />
          </div>
          <span>HP {enemyHp} / {enemyMaxHp}</span>
        </div>
      </div>

      <div className="battle-combatant battle-hero">
        <div className="battle-combatant-sprite battle-hero-sprite">
          <PixelSprite name="hero" />
        </div>
        <div className="battle-combatant-status battle-hero-status">
          <strong>{hero.name} <small>LV {hero.level}</small></strong>
          <span>HP {hero.hp} / {heroMaxHp}</span>
          <span>MP {hero.mp} / {heroMaxMp}</span>
        </div>
      </div>
    </div>
  );
}
