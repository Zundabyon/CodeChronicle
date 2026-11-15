// sfxr風の効果音合成。サンプルを直接計算してAudioBufferにするので、試聴とWAV書き出しが同じ音になる。
export type SfxWave = 'square' | 'triangle' | 'sawtooth' | 'sine' | 'noise';
export type SfxParams = {
  wave: SfxWave;
  freq: number;       // 開始周波数 Hz
  slide: number;      // 周波数スライド（オクターブ/秒）
  deltaSlide: number; // スライドの加速度（オクターブ/秒²）
  vibDepth: number;   // ビブラート深さ（周波数比 0〜0.5）
  vibSpeed: number;   // ビブラート速さ Hz
  arpMul: number;     // アルペジオ倍率（1で無効）
  arpTime: number;    // アルペジオ切替時刻 秒
  duty: number;       // 矩形波デューティ比 0.05〜0.95
  attack: number; sustain: number; punch: number; decay: number; // 秒（punchは0〜1の持ち上げ）
  volume: number;     // 0〜1
  lowpass: number;    // Hz、0で無効
  highpass: number;   // Hz、0で無効
};
export const SFX_WAVES: SfxWave[] = ['square','triangle','sawtooth','sine','noise'];
export const SFX_RANGES: Record<Exclude<keyof SfxParams,'wave'>,[number,number,number]> = {
  freq:[20,4000,440], slide:[-24,24,0], deltaSlide:[-100,100,0], vibDepth:[0,0.5,0], vibSpeed:[0,40,0],
  arpMul:[0.25,4,1], arpTime:[0,2,0], duty:[0.05,0.95,0.5], attack:[0,2,0], sustain:[0,2,0.05], punch:[0,1,0], decay:[0,2,0.1],
  volume:[0,1,0.5], lowpass:[0,20000,0], highpass:[0,20000,0],
};
export const SAMPLE_RATE = 44100;

export function normalizeSfx(raw: Partial<SfxParams> | null | undefined): SfxParams {
  const p = {wave: SFX_WAVES.includes(raw?.wave as SfxWave) ? raw!.wave! : 'square'} as SfxParams;
  for (const [key,[min,max,def]] of Object.entries(SFX_RANGES) as [Exclude<keyof SfxParams,'wave'>,[number,number,number]][]) {
    const v = Number(raw?.[key]);
    p[key] = Number.isFinite(v) ? Math.min(max,Math.max(min,v)) : def;
  }
  return p;
}

export function renderSfx(input: Partial<SfxParams>, rate = SAMPLE_RATE): Float32Array {
  const p = normalizeSfx(input), total = p.attack + p.sustain + p.decay;
  const out = new Float32Array(Math.max(1, Math.ceil(total * rate)));
  let phase = 0, noise = 0, lp = 0, hpPrev = 0, hp = 0;
  const lpA = p.lowpass ? 1 - Math.exp(-2 * Math.PI * p.lowpass / rate) : 1;
  const hpA = p.highpass ? Math.exp(-2 * Math.PI * p.highpass / rate) : 0;
  for (let i = 0; i < out.length; i++) {
    const t = i / rate;
    let f = p.freq * 2 ** (p.slide * t + 0.5 * p.deltaSlide * t * t) * (p.arpMul !== 1 && p.arpTime > 0 && t >= p.arpTime ? p.arpMul : 1);
    f *= 1 + p.vibDepth * Math.sin(2 * Math.PI * p.vibSpeed * t);
    f = Math.min(20000, Math.max(20, f));
    const prev = phase; phase = (phase + f / rate) % 1;
    if (phase < prev) noise = Math.random() * 2 - 1;
    let s = p.wave === 'square' ? (phase < p.duty ? 0.5 : -0.5)
      : p.wave === 'triangle' ? 1 - 4 * Math.abs(phase - 0.5)
      : p.wave === 'sawtooth' ? 2 * phase - 1
      : p.wave === 'sine' ? Math.sin(2 * Math.PI * phase) : noise;
    const env = t < p.attack ? t / p.attack
      : t < p.attack + p.sustain ? 1 + p.punch * (1 - (t - p.attack) / p.sustain)
      : p.decay ? Math.max(0, 1 - (t - p.attack - p.sustain) / p.decay) : 0;
    lp += lpA * (s - lp); s = lp;
    if (p.highpass) { hp = hpA * (hp + s - hpPrev); hpPrev = s; s = hp; }
    out[i] = Math.max(-1, Math.min(1, s * env * p.volume));
  }
  return out;
}

const cache = new WeakMap<object, AudioBuffer>();
/** 同時再生可。paramsオブジェクトごとにバッファを使い回す。 */
export function playSfx(ctx: BaseAudioContext, params: Partial<SfxParams>, volume = 1): AudioBufferSourceNode {
  let buffer = cache.get(params);
  if (!buffer || buffer.sampleRate !== ctx.sampleRate) {
    const data = renderSfx(params, ctx.sampleRate);
    buffer = ctx.createBuffer(1, data.length, ctx.sampleRate); buffer.copyToChannel(data, 0);
    cache.set(params, buffer);
  }
  const src = ctx.createBufferSource(), gain = ctx.createGain();
  src.buffer = buffer; gain.gain.value = volume;
  src.connect(gain).connect(ctx.destination); src.start();
  return src;
}

/** 16bit モノラルWAV。 */
export function encodeWav(samples: Float32Array, rate = SAMPLE_RATE): ArrayBuffer {
  const view = new DataView(new ArrayBuffer(44 + samples.length * 2));
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  str(0,'RIFF'); view.setUint32(4, 36 + samples.length * 2, true); str(8,'WAVE'); str(12,'fmt ');
  view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(24,rate,true);
  view.setUint32(28,rate*2,true); view.setUint16(32,2,true); view.setUint16(34,16,true); str(36,'data'); view.setUint32(40,samples.length*2,true);
  samples.forEach((s,i) => view.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, s)) * 32767), true));
  return view.buffer;
}
