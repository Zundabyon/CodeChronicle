import './bossBreakEffect.css';
import { bossGuardBroken } from './bossBattle';
import { useEffect, useState, type CSSProperties } from 'react';
import { battleTiming, type BattleImpact } from './battleTiming';
import { HeroBattleSprite } from './HeroBattleSprite';
import { EnemyEffectSprite, type EnemyAttackStyle } from './EnemyEffectSprite';
import { enemyKinds, type Area, type Enemy } from './content';
import { enemySprite, PixelSprite } from './PixelSprite';
import { battleBanter, type BattleMoment } from './battleBanter';
import type { HeroTechnique } from './heroTechniques';

type BattleStageProps = {
  area: Area | 'church';
  enemy: Enemy;
  enemyHp: number;
  enemyMaxHp: number;
  bossStage?: number;
  hero: { name: string; level: number; hp: number; mp: number };
  heroMaxHp: number;
  heroMaxMp: number;
  attack: 'hero' | 'enemy' | null;
  attackRound: number;
  answered: boolean;
  attackAnimating: boolean;
  impact?: BattleImpact;
  banterSeed?: number;
  heroTechnique?: HeroTechnique | null;
};

const enemyAttackStyles: Record<string, EnemyAttackStyle> = {
  slime:'splash',bat:'wave',ghost:'curse',shadow:'blade',memory:'drain',guardian:'lightning',
  crab:'splash',wolf:'blade',treant:'drain',moth:'wave',beetle:'shock',scorpion:'blade',
  cactus:'shock',serpent:'curse',golem:'shock',wisp:'lightning',skeleton:'blade',mimic:'drain',
  review:'curse','after-gate':'shock',
};

const heroMoves = ['斬りつけ', '横薙ぎ', '突き'] as const;

export function BattleStage({ area, enemy, enemyHp, enemyMaxHp, hero, heroMaxHp, heroMaxMp, attack, attackRound, answered, attackAnimating, impact, banterSeed=0, heroTechnique, bossStage=0 }: BattleStageProps) {
  const [impactRound,setImpactRound]=useState<number|null>(null);
  useEffect(()=>{
    if(!attack||!attackAnimating||!impact)return;
    const timer=setTimeout(()=>setImpactRound(attackRound),battleTiming[attack].impact);
    return ()=>clearTimeout(timer);
  },[attack,attackAnimating,attackRound,impact]);
  const impactReached=!attackAnimating||impactRound===attackRound;
  const displayedEnemyHp=attack==='hero'&&impact&&!impactReached?impact.enemyBefore:enemyHp;
  const displayedHeroHp=attack==='enemy'&&impact&&!impactReached?impact.heroBefore:hero.hp;
  const guardBreak=!!enemy.boss&&attack==='hero'&&!!impact?.enemyDamage&&impactReached&&!bossGuardBroken(impact.enemyBefore,bossStage)&&bossGuardBroken(enemyHp,bossStage);
  const defeated=attack==='hero'&&enemyHp<=0&&impactReached;
  const terrain = area === 'field' || area === 'dungeon' || area === 'church' ? area : 'town';
  const location = terrain === 'field' ? '風渡りの平原' : terrain === 'dungeon' ? '忘却の遺跡' : terrain === 'church' ? '黎明の教会' : '黎明の町';
  const ground = terrain === 'field' ? 'field-ground.png' : terrain === 'town' ? 'town-ground.png' : 'dungeon-ground.png';
  const enemyAttackStyle = enemyAttackStyles[enemy.id] ?? enemyAttackStyles[enemyKinds[enemy.id] ?? 'shadow'];
  const heroMove = heroTechnique?.motion ?? (Math.max(0, attackRound - 1) % heroMoves.length) as 0 | 1 | 2;
  let moment: BattleMoment = attackRound ? 'ready' : 'intro';
  if (answered) {
    if (!attackAnimating && hero.hp <= 0) moment = 'defeat';
    else if (!attackAnimating && enemyHp <= 0) moment = 'victory';
    else if (attack === 'hero') moment = 'heroAttack';
    else if (attack === 'enemy') moment = 'enemyAttack';
    else moment = 'reviewMiss';
  }
  const voices = battleBanter(enemy, moment, attackRound, banterSeed);
  const style = { '--battle-ground': `url("${import.meta.env.BASE_URL}maps/${ground}")`, '--battle-hero-duration': `${battleTiming.hero.duration}ms`, '--battle-hero-impact': `${battleTiming.hero.impact}ms` } as CSSProperties;

  return (
    <>
    <div className={`battlefield battlefield-${terrain} ${attack ? `battlefield-${attack}-attack` : ''} ${attack === 'hero' ? `battlefield-hero-move-${heroMove}` : ''} ${attack === 'enemy' ? `battlefield-enemy-${enemyAttackStyle}` : ''}`} style={style}>
      <span className="battlefield-location">{location}</span>
      <div className="battlefield-backdrop" aria-hidden="true">
        <span className="battlefield-scenery-back" />
        <span className="battlefield-scenery-front" />
      </div>
      {attack && <span key={`banner-${attackRound}`} className="battle-action-banner" aria-hidden="true">{attack === 'hero' ? `${hero.name}の「${heroTechnique?.name ?? heroMoves[heroMove]}」！` : `${enemy.name}の「${enemy.attackName}」！`}</span>}
      {attack === 'hero' && <div key={`slash-${attackRound}`} className="battle-slash-effect" aria-hidden="true"><i /><i /><i /><b /><em className="battle-sword-trail" /></div>}
      {attack === 'enemy' && <div className={`battle-enemy-effect battle-enemy-effect-${enemyAttackStyle}`} aria-hidden="true"><span className="battle-enemy-projectile"><EnemyEffectSprite style={enemyAttackStyle}/></span><span className="battle-enemy-impact" /><i /><i /><i /></div>}

      <div className={`battle-combatant battle-foe ${enemy.boss ? 'battle-foe-boss' : ''} ${defeated ? 'is-defeated' : ''}`}>
        <div key={`foe-${attackRound}`} className="battle-combatant-sprite battle-foe-sprite">
          <PixelSprite name={enemySprite(enemy.id)} />
          {attack==='hero'&&impactReached&&!!impact?.enemyDamage&&<span key={`impact-${attackRound}`} className="battle-impact-indicator" aria-hidden="true"><i/><b>−{impact.enemyDamage}</b></span>}
          {guardBreak&&<span key={`break-${attackRound}`} className="boss-break-effect" aria-hidden="true"><i/><b>{enemyHp<=0?'決着':'防御突破'}</b></span>}
          {defeated&&<span className="battle-defeat-effect" aria-hidden="true"><i/><i/><i/><i/><b>撃破</b></span>}
        </div>
        <div className="battle-combatant-status battle-foe-status">
          <strong>{enemy.name}</strong>
          <div className="enemy-hp" role="progressbar" aria-label={`${enemy.name}のHP`} aria-valuenow={displayedEnemyHp} aria-valuemin={0} aria-valuemax={enemyMaxHp}>
            <i style={{ width: `${displayedEnemyHp / enemyMaxHp * 100}%` }} />
          </div>
          <span>HP {displayedEnemyHp} / {enemyMaxHp}</span>
        </div>
      </div>

      <div className="battle-combatant battle-hero">
        <div key={`hero-${attackRound}`} className="battle-combatant-sprite battle-hero-sprite">
          <HeroBattleSprite motion={heroMove} attacking={attack==='hero'&&attackAnimating} attackId={attackRound}/>
          {attack==='enemy'&&impactReached&&!!impact?.heroDamage&&<span key={`impact-${attackRound}`} className="battle-impact-indicator battle-impact-hero" aria-hidden="true"><i/><b>−{impact.heroDamage}</b></span>}
        </div>
        <div className="battle-combatant-status battle-hero-status">
          <strong>{hero.name} <small>LV {hero.level}</small></strong>
          <span>HP {displayedHeroHp} / {heroMaxHp}</span>
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
