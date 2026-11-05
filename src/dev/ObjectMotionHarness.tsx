import {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ObjectMotion,ObjectMotionScene,useObjectMotionPlayback} from '../motion/ObjectMotion';
import {TitleScreen} from '../TitleScreen';
import {titleArtwork} from '../titleMotion';
import '../base.css';
import '../style.css';
import '../titleScreen.css';
import './objectMotionHarness.css';

function Harness(){
  const [mode,setMode]=useState('objects');
  const [strength,setStrength]=useState(.7),[duration,setDuration]=useState(6);
  const [point,setPoint]=useState('背景をクリックすると元画像の座標を表示します。');
  const playback=useObjectMotionPlayback();
  return <div className="motion-harness">
    <header className="motion-harness-tools"><h1>Object motion / 確認用</h1><button onClick={()=>setMode('objects')} aria-pressed={mode==='objects'}>部品を確認</button><button onClick={()=>setMode('title')} aria-pressed={mode==='title'}>タイトルを確認</button><span>dev専用・ゲームの公開物には含めません</span></header>
    {mode==='title'?<><div className="app-shell" onPointerDown={event=>{
      const layer=event.currentTarget.querySelector<SVGSVGElement>('.artwork-motion-layer'),matrix=layer?.getScreenCTM();
      if(matrix){const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());setPoint(`元画像 ${titleArtwork.width}×${titleArtwork.height}：x=${p.x.toFixed(1)}, y=${p.y.toFixed(1)}`);}
    }}><TitleScreen hasSave={false} onNew={()=>setPoint('開始操作OK（ハーネス内では冒険を変更しません）')} onResume={()=>{}} resume={null} management={<p>確認用の空ダイアログです。</p>}/></div><output className="motion-harness-coordinate">{point}</output></>:<section className="motion-harness-lab">
      <p>同じ共通部品をHTMLとSVGに適用。発光の強さ・揺れ幅・周期を比較します。</p>
      <label>強さ {strength.toFixed(2)}<input type="range" min="0" max="1" step=".05" value={strength} onChange={e=>setStrength(Number(e.target.value))}/></label>
      <label>周期 {duration}秒<input type="range" min="1" max="12" value={duration} onChange={e=>setDuration(Number(e.target.value))}/></label>
      <button disabled={playback.reduced} onClick={()=>playback.setEnabled(!playback.enabled)}>{playback.enabled?'動きを止める':'動きを再生'}</button>
      <p role="status">{playback.reduced?'端末のモーション軽減に従って静止':playback.active?'再生中':'静止中'}</p>
      <ObjectMotionScene active={playback.active} className="motion-harness-samples">
        <figure><div className="motion-harness-lamp"><span>発光する小物</span><ObjectMotion motion={{preset:'glow',duration,strength}}><i/></ObjectMotion></div><figcaption>HTML / glow（静止時は追加の光なし）</figcaption></figure>
        <figure><ObjectMotion motion={{preset:'sway',duration,strength}}><svg width="100" height="120" viewBox="0 0 100 120"><path fill="#c1a35c" d="M48 10H52V115H48Z"/><path fill="#3776a1" d="M52 14H92L83 46L92 78H52Z"/></svg></ObjectMotion><figcaption>HTML / sway（ゲーム内の移動判定とは独立）</figcaption></figure>
        <figure><svg width="120" height="120" viewBox="0 0 120 120"><path fill="none" stroke="#245269" strokeWidth="5" d="M60 15L95 60L60 105L25 60Z"/><ObjectMotion as="g" motion={{preset:'glow',duration,strength}}><path fill="#8ee8ff" fillRule="evenodd" d="M60 15L95 60L60 105L25 60Z M60 25L33 60L60 95L87 60Z"/></ObjectMotion></svg><figcaption>SVG / glow</figcaption></figure>
      </ObjectMotionScene>
      <p>動きを止めた状態と比較。端末設定の変更・別タブ移動・ウィンドウのリサイズでも確認してください。</p>
    </section>}
  </div>;
}
createRoot(document.getElementById('root')!).render(<Harness/>);
