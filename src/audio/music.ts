// トラッカー風のチップチューン。曲データの正規化・時刻計算（純粋関数）と、AudioContextの先読みスケジューラ。
import {encodeWav, SAMPLE_RATE} from './sfx';

export type MusicWave = 'square' | 'triangle' | 'sawtooth' | 'sine' | 'noise';
export const MUSIC_WAVES: MusicWave[] = ['square','triangle','sawtooth','sine','noise'];
export const DUTIES = [0.125, 0.25, 0.5, 0.75];
/** pitch は MIDI 番号、null は休符。len は16分音符いくつ分か。 */
export type Note = {pitch: number | null; len: number; vol: number};
export type Channel = {wave: MusicWave; duty: number; volume: number; notes: Note[]};
export type Song = {bpm: number; beatsPerBar: number; bars: number; loop: boolean; volume: number; channels: Channel[]};
/** 曲データの入力形。notes は "C5/4 r/2 60/2@.5" のような文字列（音名かMIDI番号/長さ@音量）でもよい。 */
export type RawChannel = Partial<Omit<Channel,'notes'>> & {notes?: string | Partial<Note>[]};
export type RawSong = Partial<Omit<Song,'channels'>> & {channels?: RawChannel[]};
export const CHANNEL_NAMES = ['矩形波1','矩形波2','三角波','ノイズ'];
const CHANNEL_DEFAULTS: Channel[] = [
  {wave:'square',duty:0.5,volume:0.5,notes:[]},{wave:'square',duty:0.25,volume:0.3,notes:[]},
  {wave:'triangle',duty:0.5,volume:0.7,notes:[]},{wave:'noise',duty:0.5,volume:0.3,notes:[]},
];

const clamp = (v: unknown, min: number, max: number, def: number) => { const n = Number(v); return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : def; };
const NOTE_OFFSETS: Record<string, number> = {C:0,D:2,E:4,F:5,G:7,A:9,B:11};
/** "C4"=60、"F#3"、"Bb2"、数値はそのまま。読めなければ null（休符扱い）。 */
export function noteToMidi(name: string | number): number | null {
  if (typeof name === 'number') return Number.isFinite(name) ? Math.round(Math.min(127, Math.max(0, name))) : null;
  if (/^\d+$/.test(name)) return noteToMidi(Number(name));
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(name);
  if (!m) return null;
  return noteToMidi(12 * (Number(m[3]) + 1) + NOTE_OFFSETS[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0));
}
const NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const midiToName = (midi: number) => `${NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
export const midiToFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

export function parseNotes(text: string): Note[] {
  return text.trim().split(/\s+/).filter(Boolean).map(token => {
    const [head, vol] = token.split('@'), [pitch, len] = head.split('/');
    return normalizeNote({pitch: pitch === 'r' || pitch === '-' ? null : noteToMidi(pitch), len: Number(len ?? 1), vol: vol === undefined ? 1 : Number(vol)});
  });
}
export const formatNotes = (notes: Note[]) => notes.map(n => `${n.pitch === null ? 'r' : midiToName(n.pitch)}/${n.len}${n.vol !== 1 ? `@${+n.vol.toFixed(2)}` : ''}`).join(' ');
const normalizeNote = (n: Partial<Note>): Note => ({pitch: n.pitch === null || n.pitch === undefined ? null : noteToMidi(n.pitch), len: Math.round(clamp(n.len, 1, 64, 1)), vol: clamp(n.vol, 0, 1, 1)});

export function normalizeSong(raw: RawSong | null | undefined): Song {
  const channels = CHANNEL_DEFAULTS.map((def, i) => {
    const c = raw?.channels?.[i];
    const notes = typeof c?.notes === 'string' ? parseNotes(c.notes) : Array.isArray(c?.notes) ? c.notes.map(normalizeNote) : [];
    return {wave: MUSIC_WAVES.includes(c?.wave as MusicWave) ? c!.wave! : def.wave, duty: clamp(c?.duty, 0.05, 0.95, def.duty), volume: clamp(c?.volume, 0, 1, def.volume), notes};
  });
  return {bpm: Math.round(clamp(raw?.bpm, 40, 240, 120)), beatsPerBar: Math.round(clamp(raw?.beatsPerBar, 2, 7, 4)), bars: Math.round(clamp(raw?.bars, 1, 32, 8)),
    loop: raw?.loop !== false, volume: clamp(raw?.volume, 0, 1, 0.8), channels};
}

export const stepSeconds = (song: Song) => 60 / song.bpm / 4;
export const loopSteps = (song: Song) => song.bars * song.beatsPerBar * 4;
export const loopSeconds = (song: Song) => loopSteps(song) * stepSeconds(song);

export type NoteEvent = {ch: number; step: number; pitch: number; len: number; vol: number};
/** 1ループ内の発音。ループ長を越える音は切り詰め、越えて始まる音は捨てる。 */
export function songEvents(song: Song): NoteEvent[] {
  const total = loopSteps(song), out: NoteEvent[] = [];
  song.channels.forEach((c, ch) => {
    let step = 0;
    for (const n of c.notes) {
      if (step >= total) break;
      if (n.pitch !== null) out.push({ch, step, pitch: n.pitch, len: Math.min(n.len, total - step), vol: n.vol});
      step += n.len;
    }
  });
  return out.sort((a, b) => a.step - b.step);
}

/** start に始まった曲で、[from,to) に鳴り始める発音と時刻。ループ曲は何周目でも返す。 */
export function eventsInWindow(song: Song, events: NoteEvent[], start: number, from: number, to: number): {ev: NoteEvent; time: number}[] {
  const step = stepSeconds(song), length = loopSeconds(song), out: {ev: NoteEvent; time: number}[] = [];
  if (to <= from || to <= start) return out;
  const first = Math.max(0, Math.floor((from - start) / length)), last = song.loop ? Math.floor((to - start) / length) : 0;
  for (let k = first; k <= last; k++) for (const ev of events) {
    const time = start + k * length + ev.step * step;
    if (time >= from && time < to) out.push({ev, time});
  }
  return out;
}

/** 再生位置（16分音符の番号）。開始前・ループなしの終了後は -1。 */
export function playheadStep(song: Song, start: number, now: number): number {
  if (now < start) return -1;
  const step = Math.floor((now - start) / stepSeconds(song)), total = loopSteps(song);
  return song.loop ? step % total : step < total ? step : -1;
}

/** 作成ツール用：単音チャンネルの (step,pitch) を切り替える。同じ音があれば消し、なければ重なる音を詰めて置く。 */
export function toggleNote(notes: Note[], step: number, pitch: number, len: number, total: number): Note[] {
  const timeline: {step: number; pitch: number; len: number; vol: number}[] = [];
  let at = 0;
  for (const n of notes) { if (n.pitch !== null && at < total) timeline.push({step: at, pitch: n.pitch, len: Math.min(n.len, total - at), vol: n.vol}); at += n.len; }
  const hit = timeline.findIndex(n => n.pitch === pitch && step >= n.step && step < n.step + n.len);
  let next: typeof timeline;
  if (hit >= 0) next = timeline.filter((_, i) => i !== hit);
  else {
    const end = Math.min(total, step + len);
    next = timeline.filter(n => n.step < step || n.step >= end).map(n => n.step < step && n.step + n.len > step ? {...n, len: step - n.step} : n);
    next.push({step, pitch, len: end - step, vol: 1});
    next.sort((a, b) => a.step - b.step);
  }
  const out: Note[] = [];
  at = 0;
  for (const n of next) { if (n.step > at) out.push({pitch: null, len: n.step - at, vol: 1}); out.push({pitch: n.pitch, len: n.len, vol: n.vol}); at = n.step + n.len; }
  return out;
}

// ---- 音を鳴らす部分（ブラウザのみ） ----
const pulseCache = new WeakMap<BaseAudioContext, Map<number, PeriodicWave>>();
function pulseWave(ctx: BaseAudioContext, duty: number): PeriodicWave {
  const map = pulseCache.get(ctx) ?? new Map<number, PeriodicWave>(); pulseCache.set(ctx, map);
  let wave = map.get(duty);
  if (!wave) {
    const n = 48, real = new Float32Array(n), imag = new Float32Array(n);
    for (let k = 1; k < n; k++) { real[k] = Math.sin(2 * Math.PI * k * duty) / (Math.PI * k); imag[k] = (1 - Math.cos(2 * Math.PI * k * duty)) / (Math.PI * k); }
    wave = ctx.createPeriodicWave(real, imag); map.set(duty, wave);
  }
  return wave;
}
const noiseCache = new WeakMap<BaseAudioContext, AudioBuffer>();
function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  let b = noiseCache.get(ctx);
  if (!b) { b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; noiseCache.set(ctx, b); }
  return b;
}

function playNote(ctx: BaseAudioContext, out: AudioNode, song: Song, ev: NoteEvent, time: number) {
  const c = song.channels[ev.ch], amp = c.volume * ev.vol * 0.3, dur = ev.len * stepSeconds(song);
  if (!amp) return;
  const gain = ctx.createGain(); gain.connect(out);
  if (c.wave === 'noise') {
    // 低い音名ほどこもった太鼓、高いほど短いハイハット。
    const low = ev.pitch < 56, len = Math.min(dur, low ? 0.18 : 0.07);
    const src = ctx.createBufferSource(), filter = ctx.createBiquadFilter();
    src.buffer = noiseBuffer(ctx); filter.type = low ? 'lowpass' : 'highpass'; filter.frequency.value = midiToFreq(ev.pitch) * (low ? 6 : 4);
    gain.gain.setValueAtTime(amp, time); gain.gain.exponentialRampToValueAtTime(0.001, time + len);
    src.connect(filter).connect(gain); src.start(time, Math.random() * 0.5); src.stop(time + len + 0.02);
    return;
  }
  const osc = ctx.createOscillator();
  if (c.wave === 'square') osc.setPeriodicWave(pulseWave(ctx, c.duty)); else osc.type = c.wave;
  osc.frequency.value = midiToFreq(ev.pitch);
  const release = Math.min(0.03, dur / 3);
  gain.gain.setValueAtTime(0, time); gain.gain.linearRampToValueAtTime(amp, time + 0.004);
  gain.gain.setValueAtTime(amp, time + dur - release); gain.gain.linearRampToValueAtTime(0, time + dur);
  osc.connect(gain); osc.start(time); osc.stop(time + dur + 0.01);
}

const LOOKAHEAD = 0.15, TICK_MS = 25;
type Current = {song: Song; events: NoteEvent[]; start: number; scheduledTo: number; gain: GainNode; onEnd?: () => void};
/** 先読みスケジューラ：TICK_MSごとに LOOKAHEAD 秒先までの音を AudioContext の時刻で予約する。 */
export class MusicPlayer {
  private cur: Current | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  constructor(private ctx: BaseAudioContext, private out: AudioNode) {}
  play(song: Song, {fade = 0.3, onEnd}: {fade?: number; onEnd?: () => void} = {}) {
    this.stop(fade);
    const now = this.ctx.currentTime, gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(song.volume, now + Math.max(0.01, fade));
    gain.connect(this.out);
    const start = now + 0.05;
    this.cur = {song, events: songEvents(song), start, scheduledTo: start, gain, onEnd};
    this.timer = setInterval(() => this.tick(), TICK_MS); this.tick();
  }
  /** 再生位置を保ったまま曲データだけ差し替える（作成ツールの編集中試聴）。 */
  update(song: Song) { if (this.cur) { this.cur.song = song; this.cur.events = songEvents(song); this.cur.gain.gain.setValueAtTime(song.volume, this.ctx.currentTime); } }
  stop(fade = 0.3) {
    const c = this.cur; if (!c) return;
    this.cur = null; if (this.timer) clearInterval(this.timer); this.timer = null;
    const now = this.ctx.currentTime, g = c.gain.gain;
    g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(0, now + Math.max(0.01, fade));
    setTimeout(() => c.gain.disconnect(), (fade + LOOKAHEAD + 0.2) * 1000);
  }
  get playing() { return !!this.cur; }
  position() { return this.cur ? playheadStep(this.cur.song, this.cur.start, this.ctx.currentTime) : -1; }
  private tick() {
    const c = this.cur; if (!c) return;
    const now = this.ctx.currentTime, to = now + LOOKAHEAD;
    for (const {ev, time} of eventsInWindow(c.song, c.events, c.start, c.scheduledTo, to)) playNote(this.ctx, c.gain, c.song, ev, time);
    c.scheduledTo = Math.max(c.scheduledTo, to);
    if (!c.song.loop && now >= c.start + loopSeconds(c.song)) { this.stop(0.05); c.onEnd?.(); }
  }
}

/** 1ループ分をオフラインで合成してWAVにする。 */
export async function renderSongWav(song: Song, rate = SAMPLE_RATE): Promise<ArrayBuffer> {
  const ctx = new OfflineAudioContext(1, Math.ceil((loopSeconds(song) + 0.05) * rate), rate), gain = ctx.createGain();
  gain.gain.value = song.volume; gain.connect(ctx.destination);
  for (const ev of songEvents(song)) playNote(ctx, gain, song, ev, ev.step * stepSeconds(song));
  return encodeWav((await ctx.startRendering()).getChannelData(0), rate);
}
