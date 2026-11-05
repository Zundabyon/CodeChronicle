import {useRef,useState,type ReactNode} from 'react';
import {ObjectMotion,ObjectMotionScene,useObjectMotionPlayback} from './motion/ObjectMotion';
import {ArtworkMotionLayer} from './motion/ArtworkMotionLayer';
import {titleArtwork,titleLights} from './titleMotion';

type Props={hasSave:boolean;onNew:()=>void;onResume:()=>void;resume:ReactNode;management:ReactNode};

export function TitleScreen({hasSave,onNew,onResume,resume,management}:Props){
  const dialog=useRef<HTMLDialogElement>(null);
  const artwork=useRef<HTMLDivElement>(null);
  const playback=useObjectMotionPlayback();
  const [artworkReady,setArtworkReady]=useState(false);
  return <main className="title-screen title-journey">
    <div ref={artwork} className="title-artwork" aria-hidden="true">
      <img className="title-background" src={`${import.meta.env.BASE_URL}title/knowledge-journey-v1.png`} alt="" fetchPriority="high" onLoad={event=>setArtworkReady(event.currentTarget.naturalWidth===titleArtwork.width&&event.currentTarget.naturalHeight===titleArtwork.height)} onError={()=>setArtworkReady(false)}/>
      <ObjectMotionScene active={playback.active&&artworkReady}>
        <ArtworkMotionLayer frame={artwork} source={titleArtwork}>
          {titleLights.map(light=><ObjectMotion key={light.id} as="g" motion={light.motion} className={`title-light title-light-${light.id}`}><path d={light.path} fill={light.color} fillRule="evenodd"/></ObjectMotion>)}
        </ArtworkMotionLayer>
      </ObjectMotionScene>
    </div>
    <div className="title-shade" aria-hidden="true"/>
    <div className="title-content">
      <header className="title-heading">
        <p className="eyebrow">THE LOST ART OF CODING</p>
        <h1>コードクロニクル</h1>
        <h2>コードの扉を開く者達</h2>
        <p className="title-copy">知識が失われた世界で、<br/>もう一度、魔法を取り戻す。</p>
      </header>
      <section className="title-adventure" aria-label="冒険を始める">
        {hasSave&&resume}
        <div className="title-menu">
          {hasSave&&<button className="primary" onClick={onResume}>続きから始める <span aria-hidden="true">▶</span></button>}
          <button className={hasSave?'title-new':'primary'} onClick={onNew}>新しい冒険を始める <span aria-hidden="true">▶</span></button>
        </div>
        <button className="title-manage" onClick={()=>dialog.current?.showModal()}>冒険の管理 <span aria-hidden="true">＋</span></button>
      </section>
      <div className="title-footer"><p className="title-note">学びが、世界を動かす。</p>
      <button type="button" className="title-motion-toggle" aria-pressed={playback.enabled&&!playback.reduced} disabled={playback.reduced} onClick={()=>playback.setEnabled(!playback.enabled)}>{playback.reduced?'背景の動き：端末設定で停止':`背景の動き：${playback.enabled?'入':'切'}`}</button></div>
    </div>
    <dialog ref={dialog} className="title-management" aria-labelledby="title-management-heading" onClick={event=>{if(event.target===event.currentTarget)dialog.current?.close();}}>
      <div className="title-management-heading"><h2 id="title-management-heading">冒険の管理</h2><form method="dialog"><button aria-label="冒険の管理を閉じる">閉じる ×</button></form></div>
      <p>セーブの持ち運びや、前の冒険の復元ができます。</p>
      {management}
    </dialog>
  </main>;
}
