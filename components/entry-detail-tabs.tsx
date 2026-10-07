'use client';

import { useId, useState, type ReactNode, type KeyboardEvent } from 'react';
import { ExternalLink } from 'lucide-react';
import { type Entry } from '@/lib/game-data';
import { entryDetails } from '@/lib/entry-details';
import { jobTraits } from '@/lib/job-traits';

type Tab = 'info'|'transcend'|'reviews';
export function EntryDetailTabs({entry,children}:{entry:Entry;children:ReactNode}) {
  const detail=entryDetails[entry.id];
  const traits=entry.category==='직업'?jobTraits[entry.name]:undefined;
  const effects=detail?.transcend||[];
  const tabs:{id:Tab;label:string}[]=[{id:'info',label:'능력 정보'},...(effects.length?[{id:'transcend' as const,label:'초월 효과'}]:[]),{id:'reviews',label:'평가·의견'}];
  const [tab,setTab]=useState<Tab>('info');
  const [effect,setEffect]=useState(0);
  const id=useId();
  const source=detail?.sourceUrl||traits?.sourceUrl;
  function navigate(event:KeyboardEvent<HTMLButtonElement>,index:number){
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();setTab(tabs[next].id);
    document.getElementById(`${id}-${tabs[next].id}-tab`)?.focus();
  }
  return <div className="entry-details">
    <div className="tabs entry-detail-nav" role="tablist" aria-label="항목 상세 정보">{tabs.map((t,index)=><button key={t.id} type="button" id={`${id}-${t.id}-tab`} role="tab" className={tab===t.id?'active':''} aria-selected={tab===t.id} aria-controls={`${id}-${t.id}-panel`} tabIndex={tab===t.id?0:-1} onClick={()=>setTab(t.id)} onKeyDown={event=>navigate(event,index)}>{t.label}</button>)}</div>
    <section hidden={tab!=='info'} role="tabpanel" tabIndex={0} id={`${id}-info-panel`} aria-labelledby={`${id}-info-tab`}>
      {detail&&<><section className="ability-section"><h3>{entry.category==='직업'?'직업 정보':'기본 능력치'}</h3><ul className="ability-stats">{detail.stats.map(stat=><li key={stat}>{stat}</li>)}</ul></section><section className="ability-section"><h3>{entry.category==='직업'?'고유기':'공격·스킬'}</h3>{detail.abilities.map(ability=><article className="ability-card" key={ability.name}><h4>{ability.name}</h4><p>{ability.description}</p>{ability.notes&&<ul>{ability.notes.map(note=><li key={note}>{note}</li>)}</ul>}</article>)}</section></>}
      {traits&&<section className="ability-section"><h3>직업 특성</h3><p className="ability-note">선택 가능한 특성입니다. 모든 효과가 동시에 적용되는 것은 아닙니다.</p><ul className="trait-details">{traits.traits.map(trait=><li key={trait.id}>{trait.description}</li>)}</ul></section>}
      {!detail&&<p className="ability-empty">{traits?'기본 능력치와 고유기 상세는 확인 후 추가할 예정입니다.':'이 항목의 능력치·스킬 상세는 아직 준비 중입니다. 평가·의견 탭에서 투표할 수 있어요.'}</p>}
      {detail&&!effects.length&&entry.category!=='직업'&&<p className="ability-note">확인된 초월 정보가 아직 없습니다.</p>}
    </section>
    {!!effects.length&&<section hidden={tab!=='transcend'} role="tabpanel" tabIndex={0} id={`${id}-transcend-panel`} aria-labelledby={`${id}-transcend-tab`}><label className="transcend-select">초월 효과 선택<select value={effect} onChange={event=>setEffect(Number(event.target.value))}>{effects.map((item,index)=><option key={item.name} value={index}>{item.name}</option>)}</select></label><article className="ability-card"><h3>{effects[effect].name}</h3><p>{effects[effect].description}</p></article><p className="ability-note">원문에 기재된 개별 효과입니다. 누적 효과나 적용 순서를 임의로 계산하지 않습니다.</p></section>}
    <section hidden={tab!=='reviews'} role="tabpanel" tabIndex={0} id={`${id}-reviews-panel`} aria-labelledby={`${id}-reviews-tab`}>{children}</section>
    {source&&tab!=='reviews'&&<div className="ability-source"><a href={source} target="_blank" rel="noopener noreferrer">Notion 원문 <ExternalLink size={13}/></a>{detail&&<span>확인: {detail.checkedOn}</span>}</div>}
  </div>;
}
