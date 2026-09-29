'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Sparkles, Pause, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Entry, type Tier } from '@/lib/game-data';

type Props = {
  weapons: Entry[];
  version: string;
  blocked: boolean;
  isAdmin?: boolean;
  onSaved?: (entry: Entry) => void;
  result: (entry: Entry) => {average:number;total:number;agreement:number;tier:Tier};
  renderArt: (entry: Entry) => ReactNode;
  onOpen: (entry: Entry) => void;
};

export function CommunityPick({weapons,version,blocked,result,renderArt,onOpen}:Props) {
  const [index,setIndex]=useState(0);
  const [paused,setPaused]=useState(false);
  const [hovered,setHovered]=useState(false);
  const [focused,setFocused]=useState(false);
  const [hidden,setHidden]=useState(false);
  const [reduced,setReduced]=useState(false);
  const current=weapons[index%weapons.length];
  const active=!paused&&!hovered&&!focused&&!hidden&&!blocked&&!reduced;

  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: reduce)');
    const update=()=>setReduced(media.matches); update(); media.addEventListener('change',update);
    const visibility=()=>setHidden(document.hidden); document.addEventListener('visibilitychange',visibility);
    return()=>{media.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility)};
  },[]);
  useEffect(()=>{if(!active||weapons.length<2)return;const timer=setTimeout(()=>setIndex(i=>(i+1)%weapons.length),5000);return()=>clearTimeout(timer)},[active,index,weapons.length]);
  if(!current)return <section className="spotlight community-carousel empty-pick" aria-label="커뮤니티 픽">
    <div className="spotlight-top"><span><Sparkles size={14}/> COMMUNITY PICK</span></div>
    <div className="empty"><h3>등록된 항목이 없습니다</h3><p>무기·직업·유물을 등록하면 이곳에서 순환해 보여줍니다.</p></div>
  </section>;
  const score=result(current);

  return <section className="spotlight community-carousel" aria-label="커뮤니티 픽" aria-roledescription="캐러셀" onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setFocused(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setFocused(false)}}>
    <div className="spotlight-top"><span><Sparkles size={14}/> COMMUNITY PICK</span><div className="spotlight-tools"><span>v{version}</span></div></div>
    <div key={current.id} className="pick-slide" aria-live={active?'off':'polite'}>
      <div className="spotlight-main"><div className="pick-art">{renderArt(current)}</div><div className="pick-copy"><span className="eyebrow">{current.category}{current.category==='무기'?` · ${current.rarity}`:''} · {current.element} · {current.type}</span><h2>{current.name}</h2><p>{current.tagline||current.description}</p><button className="text-button" onClick={()=>onOpen(current)}>상세 정보 <ChevronRight size={15}/></button></div><span className="giant-tier" aria-label={`${score.tier} 티어`}>{score.tier}</span></div>
      <div className="spotlight-stats"><span>커뮤니티 점수 <b>{score.average.toFixed(2)}<small> / 5</small></b></span><span>평가 참여 <b>{score.total}<small>명</small></b></span><span>의견 일치도 <b>{score.agreement}<small>%</small></b></span></div>
    </div>
    <div className="pick-controls"><div className="pick-dots" aria-label="항목 선택">{weapons.map((w,i)=><button key={w.id} aria-label={`${w.name} 보기`} aria-pressed={index===i} onClick={()=>setIndex(i)} className={index===i?'active':''}/>)}</div><span className="pick-count">{String(index+1).padStart(2,'0')} / {String(weapons.length).padStart(2,'0')}</span><div className="pick-navigation"><button aria-label="이전 항목" onClick={()=>setIndex(i=>(i-1+weapons.length)%weapons.length)}><ChevronLeft size={16}/></button><button aria-label={paused||reduced?'자동 순환 재생':'자동 순환 일시정지'} disabled={reduced} title={reduced?'기기의 동작 줄이기 설정으로 자동 순환이 꺼져 있습니다.':undefined} onClick={()=>setPaused(!paused)}>{paused||reduced?<Play size={14}/>:<Pause size={14}/>}</button><button aria-label="다음 항목" onClick={()=>setIndex(i=>(i+1)%weapons.length)}><ChevronRight size={16}/></button></div></div>
  </section>;
}
