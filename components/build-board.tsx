'use client';

import {useCallback,useEffect,useRef,useState,type ReactNode,type FormEvent} from 'react';
import {Plus,X,Trash2,Pencil,Layers,UtensilsCrossed} from 'lucide-react';
import type {Entry} from '@/lib/game-data';
import {supabase} from '@/lib/supabase';
import {BuildEntryPicker} from './build-entry-picker';
import {jobTraits} from '@/lib/job-traits';
import {CommunityDiscussion} from './community-discussion';

const FOOD_SLOT='slot_food';
const TAGS=['보스','던전','회랑','PVP','예능'] as const;
type BuildPost={id:number;user_id:string;title:string;job_id:string;armor_id:string;trait_ids:string[];inventory_ids:string[];tags:string[];content:string;version:string;created_at:string;profiles:{nickname:string}|null};
type Props={entries:Entry[];version:string;userId?:string;nickname:string;onLogin:()=>void;onNickname:()=>void;renderArt:(entry:Entry)=>ReactNode};
function BuildModal({title,onClose,children,className=''}:{title:string;onClose:()=>void;children:ReactNode;className?:string}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;d?.showModal();return()=>d?.close()},[]);
 return <dialog ref={ref} className={`modal build-modal ${className}`} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal-header"><h2>{title}</h2><button type="button" className="icon-button" aria-label="닫기" onClick={onClose}><X/></button></div>{children}</dialog>;
}
export function BuildBoard({entries,version,userId,nickname,onLogin,onNickname,renderArt}:Props){
 const [posts,setPosts]=useState<BuildPost[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [formError,setFormError]=useState('');
 const [writing,setWriting]=useState(false);
 const [editing,setEditing]=useState<BuildPost|null>(null);
 const [deleting,setDeleting]=useState(false);const deleteLock=useRef(false);
 const [saving,setSaving]=useState(false);const submitLock=useRef(false);
 const [selected,setSelected]=useState<BuildPost|null>(null);
 const [title,setTitle]=useState('');
 const [traitIds,setTraitIds]=useState<string[]>([]);const [picking,setPicking]=useState<{kind:'job'|'armor'|'inventory';index?:number}|null>(null);
 const [job,setJob]=useState('');const [armor,setArmor]=useState('');
 const armors=entries.filter(e=>e.category==='갑옷');
 const [slots,setSlots]=useState<string[]>(Array(6).fill(''));
 const [tags,setTags]=useState<string[]>([]);
 const [content,setContent]=useState('');
 const [filter,setFilter]=useState('전체');
 const [search,setSearch]=useState('');
 const jobs=entries.filter(e=>e.category==='직업');
 const items=entries.filter(e=>e.category==='무기'||e.category==='유물');
 const entry=(id:string)=>entries.find(e=>e.id===id);
 const availableTraits=jobTraits[entry(job)?.name||'']?.traits||[];
 function choose(e:Entry){if(picking?.kind==='job'){if(e.id!==job)setTraitIds([]);setJob(e.id)}else if(picking?.kind==='armor')setArmor(e.id);else if(picking?.kind==='inventory')setSlots(prev=>prev.map((v,i)=>i===picking.index?e.id:v));setPicking(null)}
 const load=useCallback(async()=>{
   setLoading(true);setError('');
   if(!supabase){setError('빌드 공유 연결이 아직 설정되지 않았습니다.');setLoading(false);return}
   const r=await supabase.from('build_posts').select('id,user_id,title,job_id,armor_id,trait_ids,inventory_ids,tags,content,version,created_at,profiles!build_posts_user_id_fkey(nickname)').order('created_at',{ascending:false}).limit(100);
   if(r.error)setError('빌드를 불러오지 못했습니다. 연결 설정을 확인한 뒤 다시 시도해주세요.');
   else setPosts((r.data||[]).map(row=>({...row,profiles:Array.isArray(row.profiles)?row.profiles[0]||null:row.profiles})) as BuildPost[]);
   setLoading(false);
 },[]);
 useEffect(()=>{void load()},[load]);
 function start(){
   // Composition is available before login; authentication is required to publish.
   if(editing){setTitle('');setJob('');setArmor('');setTraitIds([]);setSlots(Array(6).fill(''));setTags([]);setContent('')}
   setEditing(null);setFormError('');setPicking(null);setWriting(true);
 }
 function edit(p:BuildPost){if(p.user_id!==userId)return;setEditing(p);setTitle(p.title);setJob(p.job_id);setArmor(p.armor_id||'');setTraitIds([...(p.trait_ids||[])]);setSlots([...p.inventory_ids]);setTags([...p.tags]);setContent(p.content);setFormError('');setPicking(null);setSelected(null);setWriting(true)}
 const valid=!!title.trim()&&jobs.some(e=>e.id===job)&&(armor===''||armors.some(e=>e.id===armor))&&slots.length===6&&slots.every(id=>id===''||id===FOOD_SLOT||items.some(e=>e.id===id))&&traitIds.length<=3&&new Set(traitIds).size===traitIds.length&&traitIds.every(id=>availableTraits.some(t=>t.id===id))&&tags.length>0&&!!content.trim();
 async function submit(e:FormEvent){
   e.preventDefault();if(submitLock.current)return;setFormError('');
   if(!valid){setFormError('직업, 제목, 목적 태그와 공략을 채워주세요.');return}
   if(!userId){setFormError('게시하려면 Google 로그인이 필요합니다.');return}
   if(!nickname){setFormError('게시하려면 닉네임을 설정해주세요.');return}
   if(!supabase){setFormError('빌드 공유 연결이 아직 설정되지 않았습니다.');return}
   submitLock.current=true;setSaving(true);
   try{if(editing&&editing.user_id!==userId){setFormError('본인이 작성한 빌드만 수정할 수 있습니다.');return}
   const values={title:title.trim(),job_id:job,armor_id:armor,trait_ids:traitIds,inventory_ids:slots,tags,content:content.trim(),version:editing?.version||version};
   const r=editing?await supabase.from('build_posts').update(values).eq('id',editing.id).eq('user_id',userId).select('id').single():await supabase.from('build_posts').insert({...values,user_id:userId}).select('id').single();
   if(r.error){setFormError('등록하지 못했습니다. 작성 내용은 유지됩니다. 연결 설정을 확인해주세요.');return}
   setWriting(false);setEditing(null);setTitle('');setJob('');setArmor('');setTraitIds([]);setPicking(null);setSlots(Array(6).fill(''));setTags([]);setContent('');await load();}catch{setFormError('등록하지 못했습니다. 작성 내용은 유지됩니다. 다시 시도해주세요.')}finally{submitLock.current=false;setSaving(false)}
 }
 async function remove(p:BuildPost){
   if(!supabase||p.user_id!==userId||deleteLock.current||!window.confirm('내 빌드를 삭제할까요? 삭제한 빌드는 복구할 수 없습니다.'))return;
   deleteLock.current=true;setDeleting(true);setError('');
   try{const r=await supabase.from('build_posts').delete().eq('id',p.id).eq('user_id',userId!).select('id').single();
   if(r.error){setError('빌드를 삭제하지 못했습니다. 다시 시도해주세요.');return}
   setSelected(null);setPosts(prev=>prev.filter(b=>b.id!==p.id));
   }catch{setError('빌드를 삭제하지 못했습니다. 다시 시도해주세요.')}finally{deleteLock.current=false;setDeleting(false)}
 }
 function Loadout({ids}:{ids:string[]}){
   return <div className="build-loadout">{ids.map((id,i)=>{const item=entry(id);return <div className={`build-slot ${!id?'is-empty':''}`} key={i}><span className="slot-number">{i+1}</span>{id===FOOD_SLOT?<UtensilsCrossed size={28}/>:item?renderArt(item):<Layers size={22}/>}<strong>{id===FOOD_SLOT?'음식':item?.name||(id?'등록되지 않은 항목':'빈 칸')}</strong><small>{id===FOOD_SLOT?'음식 칸':item?.category||(id?'확인 필요':'미장착')}</small></div>})}</div>;
 }
 const visible=posts.filter(p=>(filter==='전체'||p.tags.includes(filter))&&[p.title,p.content,entry(p.job_id)?.name||''].some(t=>t.includes(search)));
 return <section className="build-board">
   <div className="section-heading"><h2>모험가의 빌드</h2><button className="primary" onClick={start}><Plus size={15}/> 빌드 구성하기</button></div>
   <div className="build-filters"><input aria-label="빌드 검색" placeholder="제목, 직업, 공략 검색" value={search} onChange={e=>setSearch(e.target.value)}/><div className="build-tags">{['전체',...TAGS].map(t=><button key={t} className={filter===t?'active':''} onClick={()=>setFilter(t)}>{t}</button>)}</div></div>
   {error&&<div className="editor-error" role="alert">{error} <button className="text-button" onClick={()=>void load()}>다시 불러오기</button></div>}
   {loading?<div className="empty"><p>빌드를 불러오는 중입니다.</p></div>:!visible.length?<div className="empty"><Layers/><h3>{posts.length?'조건에 맞는 빌드가 없습니다':'첫 번째 빌드를 만들어보세요'}</h3><p>직업과 6칸의 장비 구성에 나만의 운용 방법을 더해보세요.</p><button className="primary" onClick={start}>빌드 구성하기</button></div>:<div className="build-list">{visible.map(p=><button className="build-row-card" key={p.id} onClick={()=>setSelected(p)}><div className="build-row-title"><strong>{p.title}</strong><span>{p.profiles?.nickname||'모험가'} · {p.version}</span></div><div className="build-tags">{p.tags.map(t=><span key={t}>[{t}]</span>)}</div><p className="build-job-name">직업 · {entry(p.job_id)?.name||'등록되지 않은 직업'} · 갑옷 {entry(p.armor_id)?.name||'미장착'}</p><Loadout ids={p.inventory_ids}/></button>)}</div>}
   {writing&&<BuildModal title={editing?'내 빌드 수정':'나만의 빌드 구성'} onClose={()=>{if(!saving)setWriting(false)}}>{picking?<BuildEntryPicker title={picking.kind==='job'?'직업 검색':picking.kind==='armor'?'갑옷 검색':`인벤토리 ${picking.index!+1} 검색`} items={picking.kind==='job'?jobs:picking.kind==='armor'?armors:items} renderArt={renderArt} onSelect={choose} onCancel={()=>setPicking(null)}/>:<form className="guide-write-form build-compose-form" onSubmit={submit}>
     <p className="tiny muted">{editing?.version||version} · 직업 1개 · 특성 최대 3개 · 무기·유물·음식 인벤토리 6칸</p>
     <label>빌드 제목<input required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="이 빌드의 특징을 알려주세요"/></label>
     <div className="build-selection-field"><span>직업</span><button type="button" className="secondary" onClick={()=>setPicking({kind:'job'})}>{entry(job)?.name||'직업 검색해서 선택'}</button></div>
     {job&&<fieldset className="build-traits"><legend>직업 특성 · {traitIds.length} / 3 선택</legend><p className="tiny muted">최대 3개까지 선택할 수 있습니다.</p><div className="build-trait-options">{availableTraits.map((t,i)=><button type="button" key={t.id} className={traitIds.includes(t.id)?'active':''} aria-pressed={traitIds.includes(t.id)} disabled={!traitIds.includes(t.id)&&traitIds.length>=3} onClick={()=>setTraitIds(prev=>prev.includes(t.id)?prev.filter(id=>id!==t.id):[...prev,t.id])}><span>특성 {i+1}</span>{t.description}</button>)}</div>{!availableTraits.length&&<p className="empty-mini">이 직업의 특성 정보가 아직 없습니다.</p>}</fieldset>}
     <div className="build-selection-field"><span>갑옷 (선택)</span><button type="button" className="secondary" onClick={()=>setPicking({kind:'armor'})}>{entry(armor)?.name||'갑옷 검색해서 선택'}</button>{armor&&<button type="button" className="text-button" onClick={()=>setArmor('')}>해제</button>}</div>{entry(armor)&&<div className="build-job-detail">{renderArt(entry(armor)!)}<p>{entry(armor)!.description}</p></div>}
     <fieldset className="build-inventory"><legend>인벤토리 <span className="muted">{slots.filter(Boolean).length} / 6칸 사용</span></legend><p className="tiny muted">무기·유물을 검색하거나 음식 칸으로 지정하세요. 빈 칸이 있어도 게시할 수 있습니다.</p><div className="build-loadout">{slots.map((id,i)=>{const chosen=entry(id);return <div className="build-slot build-slot-editor" key={i}><span className="slot-number">{i+1}</span>{id===FOOD_SLOT?<UtensilsCrossed size={28}/>:chosen?renderArt(chosen):<Layers size={28}/>}<strong>{id===FOOD_SLOT?'음식':chosen?.name||'빈 칸'}</strong><button type="button" className="secondary" aria-label={`인벤토리 ${i+1} 검색`} onClick={()=>setPicking({kind:'inventory',index:i})}>무기·유물 검색</button><button type="button" className="text-button" aria-pressed={id===FOOD_SLOT} onClick={()=>setSlots(prev=>prev.map((v,n)=>n===i?FOOD_SLOT:v))}>음식 칸 지정</button>{id&&<button type="button" className="text-button" aria-label={`인벤토리 ${i+1} 비우기`} onClick={()=>setSlots(prev=>prev.map((v,n)=>n===i?'':v))}>비우기</button>}</div>})}</div></fieldset>
     <fieldset className="build-purpose"><legend>목적 태그 · 1개 이상 선택</legend><div className="build-tags">{TAGS.map(t=><button type="button" key={t} className={tags.includes(t)?'active':''} aria-pressed={tags.includes(t)} onClick={()=>setTags(prev=>prev.includes(t)?prev.filter(v=>v!==t):[...prev,t])}>[{t}]</button>)}</div></fieldset>
     <label>간단한 공략<textarea required rows={6} maxLength={5000} value={content} onChange={e=>setContent(e.target.value)} placeholder="조합의 핵심, 운용 순서와 주의할 점을 알려주세요."/></label>
     {formError&&<p role="alert" className="editor-error">{formError}</p>}
     <div className="editor-actions">{!userId?<button type="button" className="secondary" onClick={onLogin}>Google 로그인</button>:!nickname?<button type="button" className="secondary" onClick={()=>{setWriting(false);onNickname()}}>닉네임 설정</button>:null}<button type="button" className="secondary" disabled={saving} onClick={()=>setWriting(false)}>닫기</button><button className="primary" disabled={saving||!valid}>{saving?'저장 중':editing?'수정 저장':'빌드 게시'}</button></div>
   </form>}</BuildModal>}
   {selected&&<BuildModal title="빌드 상세" className="build-detail-modal" onClose={()=>setSelected(null)}>{error&&<p role="alert" className="editor-error">{error}</p>}
     <article className="build-detail">
       <header className="build-detail-heading"><div><h1>{selected.title}</h1><p className="build-detail-meta">{selected.profiles?.nickname||'모험가'} <span>· {selected.version}</span></p></div>{selected.user_id===userId&&<div className="build-owner-actions"><button className="secondary" disabled={deleting} onClick={()=>edit(selected)}><Pencil size={14}/> 수정</button><button className="secondary danger-button" disabled={deleting} onClick={()=>void remove(selected)}><Trash2 size={14}/> {deleting?'삭제 중':'삭제'}</button></div>}</header>
       <div className="build-tags">{selected.tags.map(t=><span key={t}>{t}</span>)}</div>
       <div className="build-overview"><section className="build-character-summary" aria-label="직업과 갑옷">{[{label:'직업',id:selected.job_id},{label:'갑옷',id:selected.armor_id}].map(({label,id})=><div className="build-summary-entry" key={label}>{entry(id)?renderArt(entry(id)!):<Layers size={24}/>}<div><span>{label}</span><strong>{entry(id)?.name||(id?'등록되지 않은 항목':'미장착')}</strong>{label==='갑옷'&&entry(id)&&<p>{entry(id)!.description}</p>}</div></div>)}</section><section className="build-trait-summary"><h2>직업 특성 <span>{selected.trait_ids?.length||0} / 3</span></h2>{selected.trait_ids?.length?<ul>{selected.trait_ids.map(id=><li key={id}>{jobTraits[entry(selected.job_id)?.name||'']?.traits.find(t=>t.id===id)?.description||'등록되지 않은 특성'}</li>)}</ul>:<p className="muted">선택한 특성이 없습니다.</p>}</section></div>
       <section className="build-detail-inventory"><h2>인벤토리 <span>{selected.inventory_ids.filter(Boolean).length} / 6칸</span></h2><Loadout ids={selected.inventory_ids}/></section>
       <section className="build-detail-guide"><h2>운용 공략</h2><div className="guide-content">{selected.content}</div></section>
     </article><CommunityDiscussion targetKey={`build-post:${selected.id}`} userId={userId} nickname={nickname} onLogin={onLogin} onNickname={onNickname}/></BuildModal>}
 </section>;
}

