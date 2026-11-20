import { bestiary } from './bestiary';
import { PixelSprite, enemySprite } from './PixelSprite';

export function MonsterBook({ defeated, onClose }: { defeated: string[]; onClose: () => void }) {
  const seen = new Set(defeated);
  const found = bestiary.filter(e => e.ids.some(id => seen.has(id))).length;
  return <section className="monster-book">
    <header><h2>モンスター図鑑</h2><span>{found} / {bestiary.length} 種</span><button onClick={onClose}>とじる</button></header>
    <p>倒したモンスターの強さが記録されます。LVが自分より高い相手には、装備やレベルを整えて挑もう。</p>
    <div className="monster-book-scroll"><table>
      <thead><tr><th></th><th>名前</th><th>出現場所</th><th>LV</th><th>HP</th><th>攻撃</th><th>防御</th><th>経験値</th><th>G</th></tr></thead>
      <tbody>{bestiary.map(e => {
        const known = e.ids.some(id => seen.has(id)), s = e.stats;
        return <tr key={e.key} className={known ? '' : 'unknown'}>
          <td>{known ? <PixelSprite name={enemySprite(e.spriteId)} /> : '？'}</td>
          <td>{known ? e.name : '？？？'}</td><td>{e.areaName}</td><td>{s.level}</td>
          {known ? <><td>{s.hp}</td><td>{s.attack}</td><td>{s.defense}</td><td>{s.xp}</td><td>{s.gold}</td></> : <td colSpan={5}>まだ倒していない</td>}
        </tr>;
      })}</tbody>
    </table></div>
  </section>;
}
