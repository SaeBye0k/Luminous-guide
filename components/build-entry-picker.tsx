'use client';
import {useState,type ReactNode} from 'react';
import {Search,ArrowLeft} from 'lucide-react';
import type {Entry} from '@/lib/game-data';
export function BuildEntryPicker({title,items,onSelect,onCancel,renderArt}:{title:string;items:Entry[];onSelect:(entry:Entry)=>void;onCancel:()=>void;renderArt:(entry:Entry)=>ReactNode}){
 const [query,setQuery]=useState('');const [category,setCategory]=useState('전체');
 const categories=[...new Set(items.map(e=>e.category))];
 const normalize=(value:string)=>value.toLocaleLowerCase().replace(/\s/g,'');
 const visible=items.filter(e=>(category==='전체'||e.category===category)&&normalize(`${e.name} ${e.type}`).includes(normalize(query)));
 return <section className="build-picker"><div className="build-picker-heading"><h3>{title}</h3><button type="button" className="text-button" onClick={onCancel}><ArrowLeft size={15}/> 구성으로 돌아가기</button></div><label className="build-picker-search"><Search size={16}/><input autoFocus aria-label="추가할 항목 검색" placeholder="이름으로 검색" value={query} onChange={e=>setQuery(e.target.value)}/></label>{categories.length>1&&<div className="segmented"><button type="button" className={category==='전체'?'active':''} onClick={()=>setCategory('전체')}>전체</button>{categories.map(c=><button type="button" key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div>}<p className="tiny muted">검색 결과 {visible.length}개</p><div className="build-picker-results">{visible.map(e=><button type="button" key={e.id} className="build-picker-result" onClick={()=>onSelect(e)}>{renderArt(e)}<span><strong>{e.name}</strong><small>{e.category} · {e.category==='무기'?e.rarity:e.type}</small></span></button>)}</div>{!visible.length&&<p className="empty-mini">검색 결과가 없습니다.</p>}</section>;
}

