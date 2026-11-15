import {normalizeSfx, type SfxParams} from './sfx';
// 作成ツール（npm run dev:sfx）の「TSコードをコピー」の結果をここへ貼る。省略した項目は既定値になる。
const bank = {
  select:    {wave:'square', freq:660, arpMul:1.5, arpTime:0.04, duty:0.25, sustain:0.05, decay:0.06, volume:0.3},
  cursor:    {wave:'square', freq:880, duty:0.125, sustain:0.015, decay:0.03, volume:0.2},
  blocked:   {wave:'triangle', freq:330, slide:-4, sustain:0.04, decay:0.08, volume:0.4},
  bump:      {wave:'triangle', freq:140, slide:-3, sustain:0.02, decay:0.04, volume:0.4},
  step:      {wave:'noise', freq:900, sustain:0.01, decay:0.025, volume:0.18, lowpass:1800},
  correct:   {wave:'square', freq:784, arpMul:1.5, arpTime:0.07, duty:0.25, sustain:0.1, punch:0.3, decay:0.12, volume:0.3},
  wrong:     {wave:'triangle', freq:392, slide:-1.5, vibDepth:0.03, vibSpeed:8, sustain:0.12, decay:0.16, volume:0.4},
  attack:    {wave:'noise', freq:1400, slide:-6, sustain:0.03, punch:0.5, decay:0.12, volume:0.35, lowpass:5000},
  hurt:      {wave:'square', freq:300, slide:-5, duty:0.4, sustain:0.04, punch:0.4, decay:0.12, volume:0.3, lowpass:3000},
  magic:     {wave:'sine', freq:880, slide:2, vibDepth:0.06, vibSpeed:14, attack:0.02, sustain:0.2, decay:0.2, volume:0.45},
  levelUp:   {wave:'square', freq:523, slide:1.2, arpMul:2, arpTime:0.18, duty:0.25, sustain:0.3, punch:0.2, decay:0.25, volume:0.3},
  heal:      {wave:'sine', freq:660, slide:1.5, vibDepth:0.04, vibSpeed:10, attack:0.03, sustain:0.2, decay:0.25, volume:0.45},
  coin:      {wave:'square', freq:988, arpMul:1.335, arpTime:0.05, duty:0.5, sustain:0.06, punch:0.3, decay:0.12, volume:0.25},
  chest:     {wave:'square', freq:523, slide:2.5, duty:0.25, sustain:0.12, punch:0.2, decay:0.15, volume:0.3},
  door:      {wave:'noise', freq:220, slide:-1, attack:0.01, sustain:0.06, decay:0.12, volume:0.3, lowpass:900},
  warp:      {wave:'sine', freq:300, slide:5, vibDepth:0.15, vibSpeed:18, sustain:0.2, decay:0.15, volume:0.4},
  encounter: {wave:'sawtooth', freq:180, slide:3, vibDepth:0.1, vibSpeed:20, sustain:0.2, decay:0.15, volume:0.25, lowpass:2500},
  victory:   {wave:'square', freq:659, arpMul:1.5, arpTime:0.12, duty:0.25, sustain:0.3, punch:0.3, decay:0.3, volume:0.3},
  defeat:    {wave:'triangle', freq:330, slide:-1, vibDepth:0.03, vibSpeed:5, sustain:0.3, decay:0.4, volume:0.4},
} satisfies Record<string, Partial<SfxParams>>;
export type SfxName = keyof typeof bank;
export const sfxBank = Object.fromEntries(Object.entries(bank).map(([k,v]) => [k, normalizeSfx(v)])) as Record<SfxName, SfxParams>;
