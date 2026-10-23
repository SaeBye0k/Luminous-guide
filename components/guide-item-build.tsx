'use client';

import { useState } from 'react';
import { Layers, UtensilsCrossed } from 'lucide-react';
import { entries, type Entry } from '@/lib/game-data';
import { jobTraits } from '@/lib/job-traits';
import { GUIDE_FOOD_SLOT, type GuideItemBuild as Build } from '@/lib/guide-item-build';
import { BuildEntryPicker } from '@/components/build-entry-picker';

function ItemArt({entry}:{entry:Entry|undefined}) {
  return <span className="guide-build-art" data-image={!!entry?.imageUrl}>{entry?.imageUrl&&<img src={entry.imageUrl.startsWith('/')?`${process.env.NEXT_PUBLIC_BASE_PATH||''}${entry.imageUrl}`:entry.imageUrl} alt="" onError={event=>{event.currentTarget.style.display='none';event.currentTarget.parentElement!.dataset.failed='true'}}/>}<Layers size={22} aria-hidden="true"/></span>;
}

export function GuideItemBuild({value,onChange}:{value:Build;onChange?:(build:Build)=>void}) {
  const [picking,setPicking]=useState<{kind:'job'|'armor'|'inventory';index?:number}|null>(null);
  const entry=(id:string)=>entries.find(item=>item.id===id);
  const job=entry(value.job_id);
  const traits=jobTraits[job?.name||'']?.traits||[];
  const update=(patch:Partial<Build>)=>onChange?.({...value,...patch});
  function choose(item:Entry){
    if(picking?.kind==='job')update({job_id:item.id,trait_ids:item.id===value.job_id?value.trait_ids:[]});
    else if(picking?.kind==='armor')update({armor_id:item.id});
    else if(picking?.kind==='inventory')update({inventory_ids:value.inventory_ids.map((id,i)=>i===picking.index?item.id:id),transcend_levels:value.transcend_levels.map((n,i)=>i===picking.index?0:n)});
    setPicking(null);
  }
  function setSlot(index:number,id:string){update({inventory_ids:value.inventory_ids.map((old,i)=>i===index?id:old),transcend_levels:value.transcend_levels.map((n,i)=>i===index?0:n)})}
  if(picking&&onChange)return <div className="guide-build-attachment" onKeyDown={event=>{if(event.key==='Enter'&&event.target instanceof HTMLInputElement)event.preventDefault()}}><BuildEntryPicker title={picking.kind==='job'?'직업 선택':picking.kind==='armor'?'갑옷 선택':`${picking.index!+1}번 칸 장비 선택`} items={entries.filter(item=>picking.kind==='job'?item.category==='직업':picking.kind==='armor'?item.category==='갑옷':item.category==='무기'||item.category==='유물')} onSelect={choose} onCancel={()=>setPicking(null)} renderArt={item=><ItemArt entry={item}/>}/></div>;

  return <section className="guide-build-attachment" aria-label={onChange?'첨부할 아이템 빌드':'첨부된 아이템 빌드'}>
    <div className="guide-build-heading"><h3>아이템 빌드</h3><span>{value.version}</span></div>
    <div className="guide-build-character">{([{label:'직업',kind:'job',id:value.job_id},{label:'갑옷',kind:'armor',id:value.armor_id}] as const).map(item=><div key={item.kind}><ItemArt entry={entry(item.id)}/><div><small>{item.label}{onChange&&item.kind==='armor'?' · 선택':''}</small><strong>{entry(item.id)?.name||(item.id?'등록되지 않은 항목':item.kind==='job'?'직업을 선택하세요':'미장착')}</strong>{onChange&&<div><button type="button" className="text-button" onClick={()=>setPicking({kind:item.kind})}>{item.kind==='job'?'직업 선택':'갑옷 선택'}</button>{item.kind==='armor'&&item.id&&<button type="button" className="text-button" onClick={()=>update({armor_id:''})}>해제</button>}</div>}</div></div>)}</div>
    {onChange&&job&&<fieldset className="guide-build-traits"><legend>직업 특성 · {value.trait_ids.length} / 3</legend>{traits.map((trait,index)=><button type="button" key={trait.id} aria-pressed={value.trait_ids.includes(trait.id)} className={value.trait_ids.includes(trait.id)?'active':''} disabled={!value.trait_ids.includes(trait.id)&&value.trait_ids.length>=3} onClick={()=>update({trait_ids:value.trait_ids.includes(trait.id)?value.trait_ids.filter(id=>id!==trait.id):[...value.trait_ids,trait.id]})}><span>특성 {index+1}</span>{trait.description}</button>)}</fieldset>}
    {!onChange&&!!value.trait_ids.length&&<ul className="guide-build-selected-traits">{value.trait_ids.map(id=><li key={id}>{traits.find(trait=>trait.id===id)?.description||'등록되지 않은 특성'}</li>)}</ul>}
    <div className="build-loadout guide-build-loadout">{value.inventory_ids.map((id,index)=><div className="build-slot" key={index}><span className="slot-number">{index+1}</span>{id===GUIDE_FOOD_SLOT?<UtensilsCrossed size={26} aria-hidden="true"/>:<ItemArt entry={entry(id)}/>}<strong>{id===GUIDE_FOOD_SLOT?'음식':entry(id)?.name||(id?'등록되지 않은 항목':'빈 칸')}</strong>{onChange?<><button type="button" className="secondary" aria-label={`${index+1}번 칸 무기·유물 선택`} onClick={()=>setPicking({kind:'inventory',index})}>장비 선택</button><button type="button" className="text-button" onClick={()=>setSlot(index,GUIDE_FOOD_SLOT)}>음식</button>{id&&<button type="button" className="text-button" aria-label={`${index+1}번 칸 비우기`} onClick={()=>setSlot(index,'')}>비우기</button>}{id&&id!==GUIDE_FOOD_SLOT&&<label>초월<select aria-label={`${index+1}번 칸 초월`} value={value.transcend_levels[index]} onChange={event=>update({transcend_levels:value.transcend_levels.map((n,i)=>i===index?Number(event.target.value):n)})}>{[0,1,2,3].map(n=><option key={n} value={n}>{n?`${n}초월`:'없음'}</option>)}</select></label>}</>:!!value.transcend_levels[index]&&<small>{value.transcend_levels[index]}초월</small>}</div>)}</div>
    {onChange&&<p className="tiny muted">직업과 장비를 한 칸 이상 선택하세요. 모든 칸을 채울 필요는 없어요.</p>}
  </section>;
}
