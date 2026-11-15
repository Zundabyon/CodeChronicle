import {useEffect,useMemo,useRef,useState,type MouseEvent} from 'react';
import {CHANNEL_NAMES,DUTIES,MUSIC_WAVES,MusicPlayer,formatNotes,loopSteps,midiToName,renderSongWav,songEvents,toggleNote,type Channel,type MusicWave,type Note,type Song} from '../audio/music';
import {bgmBank,type BgmName} from '../audio/bgmBank';
import {bgmSong,clearBgmOverrides,saveBgmOverride} from '../audio/bgmOverrides';
import {DesignerShell,designerBox as box,codeBox,download} from './DesignerShell';

const CELL=14,ROW=12;
const range=(lo:number,hi:number)=>Array.from({length:hi-lo+1},(_,i)=>hi-i);
const ROWS=[range(60,96),range(60,96),range(36,72),[96,92,88,84,72,60,48,40,36]];
const trim=(notes:Note[],total:number)=>{const out:Note[]=[];let at=0;for(const n of notes){if(at>=total)break;out.push({...n,len:Math.min(n.len,total-at)});at+=n.len;}return out;};
const code=(name:string,s:Song)=>{const total=loopSteps(s),ch=(c:Channel)=>`    {wave:'${c.wave}', duty:${c.duty}, volume:${+c.volume.toFixed(2)}, notes:'${formatNotes(trim(c.notes,total))}'},`;
  return `  ${name}: {bpm:${s.bpm}, beatsPerBar:${s.beatsPerBar}, bars:${s.bars}, loop:${s.loop}, volume:${+s.volume.toFixed(2)}, channels:[\n${s.channels.map(ch).join('\n')}\n  ]},`;};

export function BgmDesigner({onClose}:{onClose?:()=>void}){
  const [name,setName]=useState<string>('town'),[song,setSong]=useState<Song>(()=>bgmSong('town')),[ch,setCh]=useState(0),[len,setLen]=useState(2);
  const [mute,setMute]=useState([false,false,false,false]),[solo,setSolo]=useState<number|null>(null),[pos,setPos]=useState(-1),[playing,setPlaying]=useState(false),[msg,setMsg]=useState('');
  const audio=useRef<{ctx:AudioContext;player:MusicPlayer}|null>(null);
  const heard=useMemo(()=>({...song,channels:song.channels.map((c,i)=>mute[i]||(solo!==null&&solo!==i)?{...c,volume:0}:c)}),[song,mute,solo]);
  const total=loopSteps(song),bar=song.beatsPerBar*4,channel=song.channels[ch];
  const events=useMemo(()=>songEvents(song).filter(e=>e.ch===ch),[song,ch]);
  useEffect(()=>{audio.current?.player.update(heard);},[heard]);
  useEffect(()=>{if(!playing)return;let id=0;const loop=()=>{const p=audio.current?.player;setPos(p?.position()??-1);if(p&&!p.playing)setPlaying(false);else id=requestAnimationFrame(loop);};id=requestAnimationFrame(loop);return()=>cancelAnimationFrame(id);},[playing]);
  useEffect(()=>()=>{audio.current?.player.stop(0.05);void audio.current?.ctx.close().catch(()=>{});},[]);
  const play=()=>{if(!audio.current){const ctx=new AudioContext();audio.current={ctx,player:new MusicPlayer(ctx,ctx.destination)};}void audio.current.ctx.resume();audio.current.player.play(heard,{fade:0.02});setPlaying(true);};
  const stop=()=>{audio.current?.player.stop(0.05);setPlaying(false);setPos(-1);};
  useEffect(()=>{const on=(e:KeyboardEvent)=>{if(e.target instanceof HTMLInputElement&&e.target.type!=='range'||e.target instanceof HTMLSelectElement||e.target instanceof HTMLButtonElement)return;
    if(e.key===' '){e.preventDefault();if(playing)stop();else play();}};addEventListener('keydown',on);return()=>removeEventListener('keydown',on);});
  const setChannel=(patch:Partial<Channel>)=>setSong(s=>({...s,channels:s.channels.map((c,i)=>i===ch?{...c,...patch}:c)}));
  const click=(pitch:number)=>(e:MouseEvent<HTMLDivElement>)=>{const step=Math.floor((e.clientX-e.currentTarget.getBoundingClientRect().left)/CELL);if(step>=0&&step<total)setChannel({notes:toggleNote(channel.notes,step,pitch,len,total)});};
  const load=(n:string)=>{setName(n);if(n in bgmBank)setSong(bgmSong(n as BgmName));};
  const apply=()=>{if(!(name in bgmBank)){setMsg('対応表の曲名を選んでから反映してください。');return;}saveBgmOverride(name as BgmName,song);setMsg(`ゲームの「${name}」をこの曲に変えました（このブラウザに保存）。`);};
  const reset=()=>{clearBgmOverrides();setMsg('ゲームのBGMを初期の曲に戻しました。');};
  const copy=()=>{void navigator.clipboard?.writeText(code(name||'custom',song)).then(()=>setMsg('コピーしました。bgmBank.ts の bank に貼ってください。'),()=>setMsg('コピーできませんでした。下の欄から選択してください。'));};
  const wav=()=>{void renderSongWav(heard).then(data=>download(data,`${name||'bgm'}.wav`),()=>setMsg('WAVを書き出せませんでした。'));};
  const num=(label:string,value:number,min:number,max:number,step:number,onChange:(v:number)=>void)=><label>{label} <input type="number" min={min} max={max} step={step} value={value} onChange={e=>{const v=+e.target.value;if(Number.isFinite(v))onChange(Math.min(max,Math.max(min,v)));}} style={{width:64}}/></label>;
  const rows=ROWS[ch];
  return <DesignerShell title="BGMさくせい / BGM designer" help="Space=再生/停止。マスをクリックで音符を置く／消す（長さは「置く長さ」）。1マス=16分音符、太線=小節。" onClose={onClose}>
    <section style={box} aria-label="読み込み">
      <div style={{display:'flex',flexWrap:'wrap',gap:12,alignItems:'center'}}>
        <label>対応表 <select value={name in bgmBank?name:''} onChange={e=>load(e.target.value)}><option value="">（新規）</option>{Object.keys(bgmBank).map(n=><option key={n}>{n}</option>)}</select></label>
        <label>名前 <input value={name} onChange={e=>setName(e.target.value)} size={12}/></label>
        {num('テンポ BPM',song.bpm,40,240,1,bpm=>setSong(s=>({...s,bpm})))}
        {num('拍/小節',song.beatsPerBar,2,7,1,beatsPerBar=>setSong(s=>({...s,beatsPerBar})))}
        {num('小節数',song.bars,1,32,1,bars=>setSong(s=>({...s,bars})))}
        {num('曲の音量',song.volume,0,1,.05,volume=>setSong(s=>({...s,volume})))}
        <label><input type="checkbox" checked={song.loop} onChange={e=>setSong(s=>({...s,loop:e.target.checked}))}/> ループ</label>
      </div>
    </section>
    <section style={box} aria-label="チャンネル">
      <div style={{display:'grid',gap:6}}>{song.channels.map((c,i)=><div key={i} style={{display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',fontSize:13}}>
        <label><input type="radio" name="bgm-channel" checked={ch===i} onChange={()=>setCh(i)}/> <b style={{color:ch===i?'#f4e4bd':undefined}}>{CHANNEL_NAMES[i]}</b></label>
        <label>波形 <select value={c.wave} onChange={e=>{setCh(i);setSong(s=>({...s,channels:s.channels.map((x,j)=>j===i?{...x,wave:e.target.value as MusicWave}:x)}));}}>{MUSIC_WAVES.map(w=><option key={w}>{w}</option>)}</select></label>
        {c.wave==='square'&&<label>デューティ <select value={c.duty} onChange={e=>setSong(s=>({...s,channels:s.channels.map((x,j)=>j===i?{...x,duty:+e.target.value}:x)}))}>{[...new Set([...DUTIES,c.duty])].map(d=><option key={d} value={d}>{d}</option>)}</select></label>}
        <label>音量 <input type="range" min={0} max={1} step={.05} value={c.volume} onChange={e=>setSong(s=>({...s,channels:s.channels.map((x,j)=>j===i?{...x,volume:+e.target.value}:x)}))}/></label>
        <label><input type="checkbox" checked={mute[i]} onChange={e=>setMute(m=>m.map((v,j)=>j===i?e.target.checked:v))}/> ミュート</label>
        <label><input type="checkbox" checked={solo===i} onChange={e=>setSolo(e.target.checked?i:null)}/> ソロ</label>
      </div>)}</div>
    </section>
    <section style={box} aria-label="ピアノロール">
      <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8,fontSize:13}}><span>{CHANNEL_NAMES[ch]}を編集中</span>
        <label>置く長さ <select value={len} onChange={e=>setLen(+e.target.value)}>{[1,2,3,4,6,8,12,16].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
        <span>再生位置 {pos<0?'—':`${Math.floor(pos/bar)+1}小節 ${Math.floor(pos%bar/4)+1}拍`}</span></div>
      <div style={{overflow:'auto',maxHeight:380,border:'1px solid #548475',background:'#0d1320'}}>
        <div style={{position:'relative',width:total*CELL+48}}>
          {rows.map(pitch=><div key={pitch} style={{display:'flex',height:ROW}}>
            <span style={{width:48,flex:'none',fontSize:9,lineHeight:`${ROW}px`,color:pitch%12===0?'#f4e4bd':'#7f8aa0',position:'sticky',left:0,background:'#0d1320',zIndex:1}}>{midiToName(pitch)}</span>
            <div data-pitch={pitch} onClick={click(pitch)} style={{position:'relative',flex:'none',width:total*CELL,cursor:'pointer',borderBottom:'1px solid #1a2333',
              background:`repeating-linear-gradient(90deg,#3a4660 0 2px,transparent 2px ${bar*CELL}px),repeating-linear-gradient(90deg,#1f2a3d 0 1px,transparent 1px ${CELL}px)${[1,3,6,8,10].includes(pitch%12)?',#111a2a':''}`}}>
              {events.filter(e=>e.pitch===pitch).map(e=><span key={e.step} style={{position:'absolute',left:e.step*CELL+1,width:e.len*CELL-2,top:1,bottom:1,background:'#d9a441',opacity:.4+.6*e.vol,borderRadius:2,pointerEvents:'none'}}/>)}
            </div></div>)}
          {pos>=0&&<div aria-hidden="true" style={{position:'absolute',top:0,bottom:0,left:48+pos*CELL,width:CELL,background:'rgba(125,211,252,.25)',pointerEvents:'none'}}/>}
        </div>
      </div>
    </section>
    <section style={box} aria-label="操作">
      <div style={{display:'flex',flexWrap:'wrap',gap:8,alignItems:'center'}}>
        {playing?<button className="primary" onClick={stop}>■ 停止</button>:<button className="primary" onClick={play}>▶ 再生</button>}
        <button className="primary" onClick={apply}>ゲームに反映</button><button className="secondary" onClick={reset}>反映を全部もとに戻す</button><button className="secondary" onClick={copy}>TSコードをコピー</button><button className="secondary" onClick={wav}>WAV書き出し</button><span role="status">{msg}</span></div>
      <textarea readOnly value={code(name||'custom',song)} style={codeBox} rows={7} aria-label="bgmBank.ts に貼るコード"/>
    </section>
  </DesignerShell>;
}
