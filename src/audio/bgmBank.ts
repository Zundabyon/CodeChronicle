import {normalizeSong, noteToMidi, midiToName, type RawSong, type Song} from './music';
// 場面ごとのオリジナル曲。作成ツール（npm run dev:bgm）の「TSコードをコピー」の結果を bank に貼ると置き換わる。
// notes は "音名/長さ(16分音符)@音量" をスペース区切り。r は休符。1小節は beatsPerBar×4 ステップ。

const TRIADS: Record<string, number[]> = {'': [0,4,7], m: [0,3,7], dim: [0,3,6], sus4: [0,5,7]};
/** 'Am' などのコード名を指定オクターブの三和音（MIDI）にする。 */
const triad = (sym: string, oct: number) => { const [, root, kind] = /^([A-G][#b]?)(m|dim|sus4)?$/.exec(sym)!; const r = noteToMidi(root + oct)!; return TRIADS[kind ?? ''].map(i => r + i); };
type Style = 'pulse' | 'eighth' | 'bounce' | 'long' | 'arp' | 'pad';
/** 1小節に1コード（'F G' のように2つ書くと半小節ずつ）から伴奏を作る。 */
function accompany(chords: string[], oct: number, style: Style, beats = 4): string {
  const piece = ([r, t, f]: number[], n: number) => {
    const N = midiToName;
    switch (style) {
      case 'pulse': return Array.from({length: n / 4}, (_, i) => `${N(i % 2 ? f : r)}/4`).join(' ');
      case 'eighth': return Array.from({length: n / 2}, (_, i) => `${N(i % 4 === 3 ? r + 12 : i % 2 ? f : r)}/2`).join(' ');
      case 'bounce': return Array.from({length: n / 4}, (_, i) => `${N(i % 2 ? f : r)}/2 r/2`).join(' ');
      case 'long': return `${N(r)}/${n}`;
      case 'arp': return Array.from({length: n / 2}, (_, i) => `${N([r, t, f, t][i % 4])}/2@.8`).join(' ');
      case 'pad': return `${N(t)}/${n}@.7`;
    }
  };
  return chords.map(bar => { const parts = bar.split(' '), n = beats * 4 / parts.length; return parts.map(c => piece(triad(c, oct), n)).join(' '); }).join(' ');
}
const rep = (bar: string, times: number) => Array(times).fill(bar).join(' ');
// ノイズ：40前後=太鼓、60=スネア、84以上=ハイハット。
const HAT = 'r/4 88/1@.5 r/3', BEAT = '40/2 88/2@.4 60/2@.7 88/2@.4', DRIVE = '40/2 88/1@.4 88/1@.3 60/2@.8 88/2@.4';

const bank = {
  title: {bpm: 96, bars: 8, volume: 0.8, channels: [
    {duty: 0.5, notes: 'E5/4 G5/4 C6/6 B5/2 A5/4 E5/4 A5/8 F5/4 A5/4 C6/4 A5/4 G5/8 D5/4 G5/4 E5/4 G5/4 C6/4 E6/4 D6/4 B5/4 G5/8 A5/4 C6/4 B5/4 D6/4 C6/12 r/4'},
    {duty: 0.25, notes: accompany(['C','Am','F','G','C','Em','F G','C'], 4, 'arp')},
    {notes: accompany(['C','Am','F','G','C','Em','F G','C'], 2, 'pulse')},
    {notes: rep(`${HAT} ${HAT}`, 8)},
  ]},
  town: {bpm: 112, bars: 8, volume: 0.75, channels: [
    {duty: 0.5, notes: 'A4/2 C5/2 F5/4 E5/2 F5/2 G5/4 A5/6 G5/2 F5/4 D5/4 D5/2 F5/2 Bb5/4 A5/2 G5/2 F5/4 G5/8 E5/4 C5/4 A4/2 C5/2 F5/4 G5/2 A5/2 C6/4 C6/4 A5/4 E5/8 D5/4 F5/4 E5/2 G5/2 C6/4 F5/12 r/4'},
    {duty: 0.125, notes: accompany(['F','Dm','Bb','C','F','Am','Bb C','F'], 4, 'arp')},
    {notes: accompany(['F','Dm','Bb','C','F','Am','Bb C','F'], 2, 'pulse')},
    {notes: rep(`${HAT} ${HAT}`, 8)},
  ]},
  village: {bpm: 92, beatsPerBar: 3, bars: 8, volume: 0.75, channels: [
    {duty: 0.25, notes: 'D5/4 G5/4 B5/4 C6/6 B5/2 A5/4 A5/4 F#5/4 D5/4 G5/12 B5/4 G5/4 E5/4 E5/6 G5/2 C6/4 B5/4 A5/4 F#5/4 G5/8 r/4'},
    {duty: 0.5, volume: 0.2, notes: accompany(['G','C','D','G','Em','C','D','G'], 4, 'pad', 3)},
    {notes: accompany(['G','C','D','G','Em','C','D','G'], 2, 'pulse', 3)},
    {volume: 0.2, notes: rep('r/4 88/1@.4 r/3 88/1@.3 r/3', 8)},
  ]},
  field: {bpm: 132, bars: 8, volume: 0.75, channels: [
    {duty: 0.5, notes: 'D5/2 r/1 D5/1 A5/4 F#5/2 G5/2 A5/4 B5/6 A5/2 G5/4 F#5/4 E5/2 F#5/2 A5/4 C#6/4 B5/2 A5/2 A5/12 r/4 F#5/2 r/1 F#5/1 B5/4 A5/2 F#5/2 D5/4 G5/4 B5/4 D6/6 B5/2 G5/4 E5/4 A5/4 C#6/4 D6/12 r/4'},
    {duty: 0.25, notes: accompany(['D','G','A','D','Bm','G','Em A','D'], 4, 'arp')},
    {notes: accompany(['D','G','A','D','Bm','G','Em A','D'], 2, 'eighth')},
    {notes: rep(BEAT, 16)},
  ]},
  dungeon: {bpm: 84, bars: 8, volume: 0.7, channels: [
    {duty: 0.25, volume: 0.4, notes: 'A4/4 C5/4 E5/8 D5/4 C5/4 B4/8 C5/4 A4/4 F5/8 E5/12 r/4 A5/4 G5/4 E5/8 F5/4 D5/4 A4/8 B4/4 G#4/4 E5/8 A4/12 r/4'},
    {duty: 0.125, volume: 0.2, notes: accompany(['Am','Am','F','E','Am','Dm','E','Am'], 4, 'arp')},
    {notes: accompany(['Am','Am','F','E','Am','Dm','E','Am'], 2, 'long')},
    {volume: 0.2, notes: rep('r/8 92/1@.5 r/7', 8)},
  ]},
  memoryDungeon: {bpm: 100, bars: 8, volume: 0.7, channels: [
    {duty: 0.125, volume: 0.4, notes: 'D5/2 F5/2 A5/2 D6/2 C6/4 A5/4 G5/2 A5/2 C6/4 E5/8 F5/2 G5/2 A5/2 D6/2 C6/2 Bb5/2 A5/4 E5/8 C#5/8 D5/2 F5/2 A5/2 D6/2 C6/4 A5/4 G5/2 A5/2 C6/4 G5/8 F5/4 D5/4 Bb5/4 G5/4 A5/12 r/4'},
    {duty: 0.25, volume: 0.22, notes: accompany(['Dm','C','Bb','A','Dm','C','Bb','A'], 5, 'arp')},
    {notes: accompany(['Dm','C','Bb','A','Dm','C','Bb','A'], 2, 'pulse')},
    {volume: 0.2, notes: rep(`${HAT} ${HAT}`, 8)},
  ]},
  // 戦闘曲は問題文を読む邪魔にならないよう volume を控えめにする。
  battle: {bpm: 152, bars: 8, volume: 0.55, channels: [
    {duty: 0.25, notes: 'E5/2 E5/1 r/1 G5/2 B5/2 A5/2 G5/2 F#5/4 E5/4 G5/4 C6/4 B5/4 A5/2 A5/1 r/1 F#5/2 D5/2 F#5/2 A5/2 D6/4 B5/8 D#5/8 E5/2 E5/1 r/1 G5/2 B5/2 A5/2 G5/2 F#5/4 G5/4 C6/4 E6/4 D6/4 C6/4 A5/4 B5/4 D#6/4 E6/8 B5/4 r/4'},
    {duty: 0.5, volume: 0.2, notes: accompany(['Em','C','D','B','Em','C','Am','B'], 4, 'arp')},
    {notes: accompany(['Em','C','D','B','Em','C','Am','B'], 2, 'eighth')},
    {notes: rep(DRIVE, 16)},
  ]},
  // 第一章 遺跡の守護者：重厚・神秘的。
  bossGuardian: {bpm: 138, bars: 8, volume: 0.55, channels: [
    {duty: 0.5, notes: 'C5/2 r/2 C5/2 Eb5/2 G5/4 F5/4 Eb5/4 C5/4 Ab5/8 Bb5/2 r/2 Bb5/2 Ab5/2 G5/4 F5/4 D5/8 G5/8 C6/4 Bb5/4 G5/4 Eb5/4 Ab5/4 C6/4 Eb6/8 F5/4 Ab5/4 C6/4 Ab5/4 B5/8 G5/4 r/4'},
    {duty: 0.25, volume: 0.22, notes: accompany(['Cm','Ab','Bb','G','Cm','Ab','Fm','G'], 4, 'pad')},
    {notes: accompany(['Cm','Ab','Bb','G','Cm','Ab','Fm','G'], 2, 'eighth')},
    {notes: rep(DRIVE, 16)},
  ]},
  // 悪レンジャー4人：各曲の奇数小節に共通の戦隊モチーフ（ド・ミb・ソ・ファ#・ソ・ド型）を調を変えて入れる。
  // ノゾミ：おしゃべりで軽快（16分の早口）。
  rangerNozomi: {bpm: 144, bars: 8, volume: 0.55, channels: [
    {duty: 0.125, notes: 'G4/1 r/1 Bb4/1 r/1 D5/2 r/2 C#5/1 r/1 D5/1 r/1 G5/4 A5/1 G5/1 F#5/1 G5/1 A5/1 Bb5/1 A5/1 G5/1 F#5/2 D5/2 r/4 G4/1 r/1 Bb4/1 r/1 D5/2 r/2 C#5/1 r/1 D5/1 r/1 G5/4 Bb5/1 A5/1 G5/1 A5/1 Bb5/1 C6/1 D6/2 C6/1 Bb5/1 A5/2 G5/4 Eb5/1 F5/1 G5/1 Eb5/1 G5/1 Bb5/1 G5/1 Eb5/1 D5/1 Eb5/1 F5/1 D5/1 F5/1 A5/1 F5/1 D5/1 C5/1 D5/1 Eb5/1 C5/1 Eb5/1 G5/1 Eb5/1 C5/1 D5/1 F#5/1 A5/1 F#5/1 D6/2 r/2 G4/1 r/1 Bb4/1 r/1 D5/2 r/2 C#5/1 r/1 D5/1 r/1 G5/4 A5/1 Bb5/1 A5/1 G5/1 F#5/2 A5/2 D5/4 r/4'},
    {duty: 0.25, volume: 0.18, notes: accompany(['Gm','D','Gm','D','Eb','Cm D','Gm','D'], 4, 'arp')},
    {notes: accompany(['Gm','D','Gm','D','Eb','Cm D','Gm','D'], 2, 'eighth')},
    {notes: rep(DRIVE, 16)},
  ]},
  // ツクネ：はずむ・増える（同じ音が倍々に増える）。
  rangerTsukune: {bpm: 132, bars: 8, volume: 0.55, channels: [
    {duty: 0.25, notes: 'C5/1 r/1 Eb5/1 r/1 G5/2 r/2 F#5/1 r/1 G5/1 r/1 C6/4 G5/4 G5/4 G5/2 G5/2 G5/1 G5/1 G5/1 G5/1 C5/1 r/1 Eb5/1 r/1 G5/2 r/2 F#5/1 r/1 G5/1 r/1 C6/4 Ab5/4 Ab5/4 Ab5/2 Ab5/2 Ab5/1 Ab5/1 Ab5/1 Ab5/1 Eb5/2 r/2 G5/2 r/2 C6/2 r/2 Eb6/2 r/2 F5/2 r/2 Ab5/2 r/2 C6/2 r/2 F6/2 r/2 C5/1 r/1 Eb5/1 r/1 G5/2 r/2 F#5/1 r/1 G5/1 r/1 C6/4 D6/2 r/2 B5/2 r/2 G5/4 r/4'},
    {duty: 0.5, volume: 0.18, notes: accompany(['Cm','G','Cm','Ab','Eb','Fm','Cm','G'], 4, 'arp')},
    {notes: accompany(['Cm','G','Cm','Ab','Eb','Fm','Cm','G'], 2, 'bounce')},
    {notes: rep(BEAT, 16)},
  ]},
  // ヌリエ：わがままで派手（高音の跳躍と駆け上がり）。
  rangerNurie: {bpm: 150, bars: 8, volume: 0.55, channels: [
    {duty: 0.5, notes: 'D5/1 r/1 F5/1 r/1 A5/2 r/2 G#5/1 r/1 A5/1 r/1 D6/4 D6/1 E6/1 F6/1 G6/1 A6/4 F6/2 D6/2 A5/4 D5/1 r/1 F5/1 r/1 A5/2 r/2 G#5/1 r/1 A5/1 r/1 D6/4 Bb5/1 C6/1 D6/1 E6/1 F6/4 E6/2 D6/2 C#6/4 G6/6 F6/2 E6/4 D6/4 C#6/2 E6/2 A6/8 r/4 D5/1 r/1 F5/1 r/1 A5/2 r/2 G#5/1 r/1 A5/1 r/1 D6/4 D6/1 C6/1 Bb5/1 A5/1 G5/1 F5/1 E5/1 D5/1 A5/8'},
    {duty: 0.25, volume: 0.2, notes: accompany(['Dm','F','Dm','Bb A','Gm','A','Dm','A'], 4, 'arp')},
    {notes: accompany(['Dm','F','Dm','Bb A','Gm','A','Dm','A'], 2, 'eighth')},
    {notes: rep(DRIVE, 16)},
  ]},
  // ケシ：静かで不穏（低めのモチーフと長い休符、音数少なめ）。
  rangerKeshi: {bpm: 96, bars: 8, volume: 0.5, channels: [
    {duty: 0.125, volume: 0.4, notes: 'E4/1 r/1 G4/1 r/1 B4/2 r/2 A#4/1 r/1 B4/1 r/1 E5/4 r/8 D#5/4 r/4 E4/1 r/1 G4/1 r/1 B4/2 r/2 A#4/1 r/1 B4/1 r/1 E5/4 C5/8 r/4 B4/4 r/4 G4/4 r/4 E4/4 r/4 F#4/4 r/4 A4/4 E4/1 r/1 G4/1 r/1 B4/2 r/2 A#4/1 r/1 B4/1 r/1 E5/4 D#5/12 r/4'},
    {duty: 0.5, volume: 0.15, notes: accompany(['Em','B','Em','B','C','Am','Em','B'], 4, 'pad')},
    {notes: accompany(['Em','B','Em','B','C','Am','Em','B'], 2, 'long')},
    {volume: 0.25, notes: rep('r/8 40/2@.6 r/6', 8)},
  ]},
  graphius: {bpm: 116, bars: 8, volume: 0.6, channels: [
    {duty: 0.5, notes: 'D5/6 A4/2 D5/4 E5/4 F5/6 D5/2 Bb5/8 G5/4 Bb5/4 D6/4 C6/4 A5/8 C#6/4 E6/4 F6/6 E6/2 D6/4 A5/4 C6/6 A5/2 F5/8 G5/4 Bb5/4 D6/4 F6/4 E6/8 C#6/4 A5/4'},
    {duty: 0.25, volume: 0.25, notes: accompany(['Dm','Bb','Gm','A','Dm','F','Gm Bb','A'], 4, 'pad')},
    {notes: accompany(['Dm','Bb','Gm','A','Dm','F','Gm Bb','A'], 2, 'eighth')},
    {notes: rep('40/2 40/2 88/2@.4 60/2@.8 40/2 88/2@.4 60/2@.8 88/2@.4', 8)},
  ]},
  // 第三章 序幕のボス「ヘドロの主・スパゲッティ」：のそのそした低音、ずれたリズム、泡のノイズ。
  bossHedoro: {bpm: 88, bars: 8, volume: 0.55, channels: [
    {duty: 0.5, notes: 'E3/3 r/1 E3/2 G3/3 r/1 F#3/2 r/4 Bb3/6 A3/2 G3/1 r/1 E3/2 r/4 E3/3 r/1 E3/2 G3/3 r/1 F#3/2 r/4 C4/3 r/1 B3/3 r/1 Bb3/3 r/1 A3/4 E4/1 r/2 E4/1 r/2 D#4/2 E4/4 r/4 G4/3 F#4/3 F4/3 E4/7 E3/3 r/1 E3/2 G3/3 r/1 F#3/2 r/4 Bb3/2 A3/2 Ab3/2 G3/2 F#3/2 F3/2 E3/4'},
    {duty: 0.25, volume: 0.18, notes: accompany(['Em','Bb','Em','C','Em','C','Em','B'], 4, 'bounce')},
    {notes: accompany(['Em','Bb','Em','C','Em','C','Em','B'], 1, 'long')},
    {notes: rep('40/3 r/1 40/2 92/1@.3 r/1 60/3@.6 r/1 96/1@.4 96/1@.3 r/2', 8)},
  ]},
  // 第三章 序幕「海底の古道」：水中の静けさ・泡・遠い反響。
  undersea: {bpm: 76, bars: 8, volume: 0.65, channels: [
    {duty: 0.125, volume: 0.35, notes: 'E5/8 A5/4 G5/4 F5/12 r/4 E5/4 G5/4 C6/8 B5/8 G5/4 D5/4 C5/4 E5/4 A5/8 A5/4 C6/4 F5/8 D5/8 F5/4 A5/4 G#5/12 r/4'},
    {duty: 0.25, volume: 0.15, notes: accompany(['Am','F','C','G','Am','F','Dm','E'], 4, 'arp')},
    {notes: accompany(['Am','F','C','G','Am','F','Dm','E'], 2, 'long')},
    {volume: 0.2, notes: rep('r/6 96/1@.25 r/3 100/1@.2 r/5', 8)},
  ]},
  victory: {bpm: 140, bars: 2, loop: false, volume: 0.7, channels: [
    {duty: 0.25, notes: 'G5/2 C6/2 E6/2 G6/6 E6/4 F6/4 D6/4 C6/8'},
    {duty: 0.5, notes: 'E5/8 C5/8 A5/4 B5/4 G5/8'},
    {notes: 'C3/8 G2/8 F2/4 G2/4 C3/8'},
    {notes: ''},
  ]},
} satisfies Record<string, RawSong>;
export type BgmName = keyof typeof bank;
export const bgmBank = Object.fromEntries(Object.entries(bank).map(([k, v]) => [k, normalizeSong(v as RawSong)])) as Record<BgmName, Song>;

/** 場面から曲名を選ぶ。戦闘・遭遇は敵で、探索は場所で決める。 */
const enemyBgm: Record<string, BgmName> = {graphius: 'graphius', 'ranger-read': 'rangerNozomi', 'ranger-create': 'rangerTsukune', 'ranger-update': 'rangerNurie', 'ranger-delete': 'rangerKeshi', hedoro: 'bossHedoro', clown: 'graphius'};
export function sceneBgm({phase, area, environment, enemyId, boss}: {phase: string; area: string; environment?: string; enemyId?: string; boss?: boolean}): BgmName {
  if (phase === 'battle' || phase === 'encounter') return enemyBgm[enemyId ?? ''] ?? (boss ? 'bossGuardian' : 'battle');
  if (['title','prologue','setup','clear'].includes(phase)) return 'title';
  if (phase !== 'world') return 'town';
  if (area.startsWith('crud')) return 'memoryDungeon';
  if (area === 'undersea') return 'undersea';
  if (environment === 'dungeon') return 'dungeon';
  return area === 'field' || area === 'village' ? area : 'town';
}
