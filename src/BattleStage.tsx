import type { CSSProperties } from 'react';
import { type Area, type Enemy } from './content';
import { enemySprite, PixelSprite } from './PixelSprite';
import { battleBanter, type BattleMoment } from './battleBanter';

type BattleStageProps = {
  area: Area | 'church';
  enemy: Enemy;
  enemyHp: number;
  enemyMaxHp: number;
  hero: { name: string; level: number; hp: number; mp: number };
  heroMaxHp: number;
  heroMaxMp: number;
  attack: 'hero' | 'enemy' | null;
  attackRound: number;
  answered: boolean;
  attackAnimating: boolean;
};

type EnemyAttackStyle = 'splash' | 'wave' | 'curse' | 'blade' | 'drain' | 'lightning' | 'shock';

const enemyAttackStyles: Record<string, EnemyAttackStyle> = {
  f1: 'splash', f2: 'wave', f3: 'curse', d1: 'blade', d2: 'curse',
  d3: 'drain', boss: 'lightning', review: 'curse', 'after-gate': 'shock',
};

const heroMoves = ['斬りつけ', '横薙ぎ', '突き'] as const;

export function BattleStage({ area, enemy, enemyHp, enemyMaxHp, hero, heroMaxHp, heroMaxMp, attack, attackRound, answered, attackAnimating }: BattleStageProps) {
  const terrain = area === 'field' || area === 'dungeon' || area === 'church' ? area : 'town';
  const location = terrain === 'field' ? '風渡りの平原' : terrain === 'dungeon' ? '忘却の遺跡' : terrain === 'church' ? '黎明の教会' : '黎明の町';
  const ground = terrain === 'field' ? 'field-ground.png' : terrain === 'town' ? 'town-ground.png' : 'dungeon-ground.png';
  const enemyAttackStyle = enemyAttackStyles[enemy.id] ?? 'shock';
  const heroMove = (Math.max(0, attackRound - 1) % heroMoves.length) as 0 | 1 | 2;
  let moment: BattleMoment = attackRound ? 'ready' : 'intro';
  if (answered) {
    if (!attackAnimating && hero.hp <= 0) moment = 'defeat';
    else if (!attackAnimating && enemyHp <= 0) moment = 'victory';
    else if (attack === 'hero') moment = 'heroAttack';
    else if (attack === 'enemy') moment = 'enemyAttack';
    else moment = 'reviewMiss';
  }
  const voices = battleBanter(enemy, moment, attackRound);
  const style = { '--battle-ground': `url("${import.meta.env.BASE_URL}maps/${ground}")` } as CSSProperties;

  return (
    <>
    <div className={`battlefield battlefield-${terrain} ${attack ? `battlefield-${attack}-attack` : ''} ${attack === 'hero' ? `battlefield-hero-move-${heroMove}` : ''} ${attack === 'enemy' ? `battlefield-enemy-${enemyAttackStyle}` : ''}`} style={style}>
      <span className="battlefield-location">{location}</span>
      <div className="battlefield-backdrop" aria-hidden="true">
        <span className="battlefield-scenery-back" />
        <span className="battlefield-scenery-front" />
      </div>
      {attack && <span className="battle-action-banner" aria-hidden="true">{attack === 'hero' ? `${hero.name}の${heroMoves[heroMove]}！` : `${enemy.name}の「${enemy.attackName}」！`}</span>}
      {attack === 'hero' && <div className="battle-slash-effect" aria-hidden="true"><i /><i /><i /><b /></div>}
      {attack === 'enemy' && <div className={`battle-enemy-effect battle-enemy-effect-${enemyAttackStyle}`} aria-hidden="true"><span className="battle-enemy-projectile" /><span className="battle-enemy-impact" /><i /><i /><i /></div>}

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
          {attack === 'hero' && <span className="battle-hero-weapon" aria-hidden="true" />}
        </div>
        <div className="battle-combatant-status battle-hero-status">
          <strong>{hero.name} <small>LV {hero.level}</small></strong>
          <span>HP {hero.hp} / {heroMaxHp}</span>
          <span>MP {hero.mp} / {heroMaxMp}</span>
        </div>
      </div>
    </div>
    <div className={`battle-voices battle-voices-${moment}`} aria-live="polite" aria-atomic="true">
      <div key={`enemy-${moment}-${attackRound}`} className="battle-voice battle-voice-enemy"><strong>{enemy.name}</strong><p>「{voices.enemy}」</p></div>
      <div key={`hero-${moment}-${attackRound}`} className="battle-voice battle-voice-hero"><strong>{hero.name}</strong><p>「{voices.hero}」</p></div>
    </div>
    </>
  );
}
