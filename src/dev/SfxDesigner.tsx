import {useEffect,useRef,useState} from 'react';
import {encodeWav,normalizeSfx,playSfx,renderSfx,SFX_RANGES,SFX_WAVES,type SfxParams} from '../audio/sfx';
import {sfxBank,type SfxName} from '../audio/sfxBank';
import {saveSfxOverride,clearSfxOverrides} from '../audio/sfxOverrides';
import {DesignerShell,designerBox as box,codeBox,download} from './DesignerShell';

type Key=keyof typeof SFX_RANGES;
const labels:Record<Key,string>={freq:'開始周波数 Hz',slide:'スライド oct/s',deltaSlide:'スライド加速 oct/s²',vibDepth:'ビブラート深さ',vibSpeed:'ビブラート速さ Hz',arpMul:'アルペジオ倍率',arpTime:'アルペジオ時刻 s',duty:'デューティ比',attack:'アタック s',sustain:'サステイン s',punch:'パンチ',decay:'ディケイ s',volume:'音量',lowpass:'ローパス Hz (0=なし)',highpass:'ハイパス Hz (0=なし)'};
const presets:Record<string,Partial<SfxParams>>={
  正解:sfxBank.correct,不正解:sfxBank.wrong,攻撃:sfxBank.attack,ダメージ:sfxBank.hurt,魔法:sfxBank.magic,レベルアップ:sfxBank.levelUp,決定:sfxBank.select,コイン:sfxBank.coin,
  爆発:{wave:'noise',freq:300,slide:-2,sustain:0.1,punch:0.6,decay:0.5,volume:0.5,lowpass:3000},
  ジャンプ:{wave:'square',freq:300,slide:4,duty:0.3,sustain:0.08,decay:0.12,volume:0.3},
};
const rand=(a:number,b:number)=>a+Math.random()*(b-a);
const random=():SfxParams=>normalizeSfx({wave:SFX_WAVES[Math.floor(Math.random()*SFX_WAVES.length)],freq:rand(100,1500),slide:rand(-6,6),deltaSlide:Math.random()<.3?rand(-20,20):0,vibDepth:Math.random()<.3?rand(0,.2):0,vibSpeed:rand(2,20),arpMul:Math.random()<.3?rand(.5,2):1,arpTime:rand(.02,.2),duty:rand(.1,.6),attack:Math.random()<.3?rand(0,.05):0,sustain:rand(.02,.25),punch:rand(0,.5),decay:rand(.05,.4),volume:.35});
const mutate=(p:SfxParams):SfxParams=>normalizeSfx(Object.fromEntries(Object.entries(p).map(([k,v])=>{const r=SFX_RANGES[k as Key];return [k,r&&typeof v==="number"&&v!==r[2]?v+(Math.random()-.5)*(r[1]-r[0])*.04:v];})));
const code=(name:string,p:SfxParams)=>{const d=normalizeSfx({});const diff=Object.fromEntries(Object.entries(p).filter(([k,v])=>k==='wave'||v!==d[k as keyof SfxParams]).map(([k,v])=>[k,typeof v==='number'?+v.toFixed(4):v]));return `  ${name}: ${JSON.stringify(diff).replace(/"(\w+)":/g,'$1:').replace(/,/g,', ')},`;};

export function SfxDesigner({onClose}:{onClose?:()=>void}){
  const [p,setP]=useState<SfxParams>(sfxBank.select),[name,setName]=useState('select'),[auto,setAuto]=useState(true),[msg,setMsg]=useState('');
  const ctx=useRef<AudioContext|null>(null);
  const play=(q=p)=>{ctx.current??=new AudioContext();void ctx.current.resume();playSfx(ctx.current,q);(window as {sfxPlayed?:number}).sfxPlayed=((window as {sfxPlayed?:number}).sfxPlayed??0)+1;};
  const set=(q:SfxParams)=>{setP(q);if(auto)play(q);};
  useEffect(()=>{const on=(e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement&&e.target.type!=='range'||e.target instanceof HTMLSelectElement)return;
    if(e.key===' '){e.preventDefault();play();}else if(e.key==='r')set(random());else if(e.key==='m')set(mutate(p));};
    addEventListener('keydown',on);return()=>removeEventListener('keydown',on);});
  const copy=()=>{const text=code(name||'custom',p);void navigator.clipboard?.writeText(text).then(()=>setMsg('コピーしました。sfxBank.ts の bank に貼ってください。'),()=>setMsg('コピーできませんでした。下の欄から選択してください。'));};
  const apply=()=>{if(!(name in sfxBank)){setMsg('対応表の名前を選んでから反映してください。');return;}saveSfxOverride(name as SfxName,p);setMsg(`ゲームの「${name}」をこの音に変えました（このブラウザに保存）。`);};
  const reset=()=>{clearSfxOverrides();setMsg('ゲームの効果音を初期の音に戻しました。');};
  const wav=()=>download(encodeWav(renderSfx(p)),`${name||'sfx'}.wav`);
  return <DesignerShell title="効果音さくせい / SFX designer" help="Space=試聴 R=ランダム M=揺らぎ。Tabで移動し、矢印キーでスライダーを調整。" onClose={onClose}>
    <section style={box} aria-label="読み込み">
      <label>対応表 <select value={name in sfxBank?name:''} onChange={e=>{const n=e.target.value as SfxName;setName(n);set(sfxBank[n]);}}><option value="">（新規）</option>{Object.keys(sfxBank).map(n=><option key={n}>{n}</option>)}</select></label>{' '}
      <label>名前 <input value={name} onChange={e=>setName(e.target.value)} size={12}/></label>
      <div style={{display:'flex',flexWrap:'wrap',gap:6,marginTop:10}}>{Object.entries(presets).map(([k,v])=><button key={k} className="secondary" onClick={()=>set(normalizeSfx(v))}>{k}</button>)}
        <button className="secondary" onClick={()=>set(random())}>ランダム</button><button className="secondary" onClick={()=>set(mutate(p))}>揺らぎ</button></div>
    </section>
    <section style={{...box,display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:'6px 20px'}} aria-label="パラメータ">
      <label>波形 <select value={p.wave} onChange={e=>set({...p,wave:e.target.value as SfxParams['wave']})}>{SFX_WAVES.map(w=><option key={w}>{w}</option>)}</select></label>
      {(Object.keys(SFX_RANGES) as Key[]).map(k=>{const [min,max]=SFX_RANGES[k];return <label key={k} style={{display:'grid',gridTemplateColumns:'150px 1fr 60px',alignItems:'center',gap:8,fontSize:12}}>{labels[k]}
        <input type="range" min={min} max={max} step={(max-min)/1000} value={p[k]} onChange={e=>setP({...p,[k]:+e.target.value})} onPointerUp={()=>auto&&play()} onKeyUp={e=>auto&&e.key.startsWith('Arrow')&&play()}/><span>{+p[k].toFixed(3)}</span></label>;})}
    </section>
    <section style={box} aria-label="操作">
      <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}}><button className="primary" onClick={()=>play()}>▶ 試聴</button>
        <label><input type="checkbox" checked={auto} onChange={e=>setAuto(e.target.checked)}/> 変更時に鳴らす</label>
        <button className="primary" onClick={apply}>ゲームに反映</button><button className="secondary" onClick={reset}>反映を全部もとに戻す</button><button className="secondary" onClick={copy}>TSコードをコピー</button><button className="secondary" onClick={wav}>WAV書き出し</button><span role="status">{msg}</span></div>
      <textarea readOnly value={code(name||'custom',p)} style={codeBox} rows={3} aria-label="sfxBank.ts に貼るコード"/>
    </section>
  </DesignerShell>;
}
