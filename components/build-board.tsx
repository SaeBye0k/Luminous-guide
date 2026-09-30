'use client';

import {useCallback,useEffect,useRef,useState,type ReactNode,type FormEvent} from 'react';
import {Plus,X,Trash2,Layers} from 'lucide-react';
import type {Entry} from '@/lib/game-data';
import {supabase} from '@/lib/supabase';
import {CommunityDiscussion} from './community-discussion';

const TAGS=['보스','던전','회랑','PVP','예능'] as const;
type BuildPost={id:number;user_id:string;title:string;job_id:string;inventory_ids:string[];tags:string[];content:string;version:string;created_at:string;profiles:{nickname:string}|null};
type Props={entries:Entry[];version:string;userId?:string;nickname:string;onLogin:()=>void;onNickname:()=>void;renderArt:(entry:Entry)=>ReactNode};
function BuildModal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;d?.showModal();return()=>d?.close()},[]);
 return <dialog ref={ref} className="modal build-modal" onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose()}}><div className="modal-header"><h2>{title}</h2><button type="button" className="icon-button" aria-label="닫기" onClick={onClose}><X/></button></div>{children}</dialog>;
}
export function BuildBoard({entries,version,userId,nickname,onLogin,onNickname,renderArt}:Props){
 const [posts,setPosts]=useState<BuildPost[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [formError,setFormError]=useState('');
 const [writing,setWriting]=useState(false);
 const [saving,setSaving]=useState(false);const submitLock=useRef(false);
 const [selected,setSelected]=useState<BuildPost|null>(null);
 const [title,setTitle]=useState('');
 const [job,setJob]=useState('');
 const [slots,setSlots]=useState<string[]>(Array(6).fill(''));
 const [tags,setTags]=useState<string[]>([]);
 const [content,setContent]=useState('');
 const [filter,setFilter]=useState('전체');
 const [search,setSearch]=useState('');
 const jobs=entries.filter(e=>e.category==='직업');
 const items=entries.filter(e=>e.category==='무기'||e.category==='유물');
 const entry=(id:string)=>entries.find(e=>e.id===id);
 const load=useCallback(async()=>{
   setLoading(true);setError('');
   if(!supabase){setError('빌드 공유 연결이 아직 설정되지 않았습니다.');setLoading(false);return}
   const r=await supabase.from('build_posts').select('id,user_id,title,job_id,inventory_ids,tags,content,version,created_at,profiles!build_posts_user_id_fkey(nickname)').order('created_at',{ascending:false}).limit(100);
   if(r.error)setError('빌드를 불러오지 못했습니다. 연결 설정을 확인한 뒤 다시 시도해주세요.');
   else setPosts((r.data||[]).map(row=>({...row,profiles:Array.isArray(row.profiles)?row.profiles[0]||null:row.profiles})) as BuildPost[]);
   setLoading(false);
 },[]);
 useEffect(()=>{void load()},[load]);
 function start(){
   // Composition is available before login; authentication is required to publish.
   setFormError('');setWriting(true);
 }
 const valid=!!title.trim()&&jobs.some(e=>e.id===job)&&slots.length===6&&slots.every(id=>items.some(e=>e.id===id))&&tags.length>0&&!!content.trim();
 async function submit(e:FormEvent){
   e.preventDefault();if(submitLock.current)return;setFormError('');
   if(!valid){setFormError('직업, 인벤토리 6칸, 제목, 목적 태그와 공략을 모두 채워주세요.');return}
   if(!userId){setFormError('게시하려면 Google 로그인이 필요합니다.');return}
   if(!nickname){setFormError('게시하려면 닉네임을 설정해주세요.');return}
   if(!supabase){setFormError('빌드 공유 연결이 아직 설정되지 않았습니다.');return}
   submitLock.current=true;setSaving(true);
   try{const r=await supabase.from('build_posts').insert({user_id:userId,title:title.trim(),job_id:job,inventory_ids:slots,tags,content:content.trim(),version});
   if(r.error){setFormError('등록하지 못했습니다. 작성 내용은 유지됩니다. 연결 설정을 확인해주세요.');return}
   setWriting(false);setTitle('');setJob('');setSlots(Array(6).fill(''));setTags([]);setContent('');await load();}catch{setFormError('등록하지 못했습니다. 작성 내용은 유지됩니다. 다시 시도해주세요.')}finally{submitLock.current=false;setSaving(false)}
 }
 async function remove(p:BuildPost){
   if(!supabase||p.user_id!==userId||!window.confirm('내 빌드를 삭제할까요?'))return;
   const r=await supabase.from('build_posts').delete().eq('id',p.id).eq('user_id',userId!);
   if(r.error){setError('빌드를 삭제하지 못했습니다.');return}
   setSelected(null);setPosts(prev=>prev.filter(b=>b.id!==p.id));
 }
 function Loadout({ids}:{ids:string[]}){
   return <div className="build-loadout">{ids.map((id,i)=>{const item=entry(id);return <div className="build-slot" key={i}><span className="slot-number">{i+1}</span>{item?renderArt(item):<Layers size={22}/>}<strong>{item?.name||'등록되지 않은 항목'}</strong><small>{item?.category||'확인 필요'}</small></div>})}</div>;
 }
 const visible=posts.filter(p=>(filter==='전체'||p.tags.includes(filter))&&[p.title,p.content,entry(p.job_id)?.name||''].some(t=>t.includes(search)));
 return <section className="build-board">
   <div className="section-heading"><h2>모험가의 빌드</h2><button className="primary" onClick={start}><Plus size={15}/> 빌드 구성하기</button></div>
   <div className="build-filters"><input aria-label="빌드 검색" placeholder="제목, 직업, 공략 검색" value={search} onChange={e=>setSearch(e.target.value)}/><div className="build-tags">{['전체',...TAGS].map(t=><button key={t} className={filter===t?'active':''} onClick={()=>setFilter(t)}>{t}</button>)}</div></div>
   {error&&<div className="editor-error" role="alert">{error} <button className="text-button" onClick={()=>void load()}>다시 불러오기</button></div>}
   {loading?<div className="empty"><p>빌드를 불러오는 중입니다.</p></div>:!visible.length?<div className="empty"><Layers/><h3>{posts.length?'조건에 맞는 빌드가 없습니다':'첫 번째 빌드를 만들어보세요'}</h3><p>직업과 6칸의 장비 구성에 나만의 운용 방법을 더해보세요.</p><button className="primary" onClick={start}>빌드 구성하기</button></div>:<div className="build-list">{visible.map(p=><button className="build-row-card" key={p.id} onClick={()=>setSelected(p)}><div className="build-row-title"><strong>{p.title}</strong><span>{p.profiles?.nickname||'모험가'} · {p.version}</span></div><div className="build-tags">{p.tags.map(t=><span key={t}>[{t}]</span>)}</div><p className="build-job-name">직업 · {entry(p.job_id)?.name||'등록되지 않은 직업'}</p><Loadout ids={p.inventory_ids}/></button>)}</div>}
   {writing&&<BuildModal title="나만의 빌드 구성" onClose={()=>{if(!saving)setWriting(false)}}><form className="guide-write-form" onSubmit={submit}>
     <p className="tiny muted">{version} · 직업 1개 + 무기·유물 인벤토리 6칸</p>
     <label>빌드 제목<input required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="이 빌드의 특징을 알려주세요"/></label>
     <label>직업<select required aria-label="빌드 직업" value={job} onChange={e=>setJob(e.target.value)}><option value="">직업 선택</option>{jobs.map(e=><option key={e.id} value={e.id}>{e.name} · {e.type}</option>)}</select></label>
     <fieldset className="build-inventory"><legend>인벤토리 · 6칸 모두 채워주세요</legend><div className="build-loadout">{slots.map((id,i)=>{const chosen=entry(id);return <label className="build-slot build-slot-editor" key={i}><span className="slot-number">{i+1}</span>{chosen?renderArt(chosen):<Layers size={28}/>}<select aria-label={`인벤토리 ${i+1}`} required value={id} onChange={e=>setSlots(prev=>prev.map((v,n)=>n===i?e.target.value:v))}><option value="">무기 / 유물 선택</option>{(['무기','유물'] as const).map(c=><optgroup label={c} key={c}>{items.filter(e=>e.category===c).map(e=><option key={e.id} value={e.id}>{e.name}</option>)}</optgroup>)}</select></label>})}</div></fieldset>
     <fieldset className="build-purpose"><legend>목적 태그 · 1개 이상 선택</legend><div className="build-tags">{TAGS.map(t=><button type="button" key={t} className={tags.includes(t)?'active':''} aria-pressed={tags.includes(t)} onClick={()=>setTags(prev=>prev.includes(t)?prev.filter(v=>v!==t):[...prev,t])}>[{t}]</button>)}</div></fieldset>
     <label>간단한 공략<textarea required rows={6} maxLength={5000} value={content} onChange={e=>setContent(e.target.value)} placeholder="조합의 핵심, 운용 순서와 주의할 점을 알려주세요."/></label>
     {formError&&<p role="alert" className="editor-error">{formError}</p>}
     <div className="editor-actions">{!userId?<button type="button" className="secondary" onClick={onLogin}>Google 로그인</button>:!nickname?<button type="button" className="secondary" onClick={()=>{setWriting(false);onNickname()}}>닉네임 설정</button>:null}<button type="button" className="secondary" disabled={saving} onClick={()=>setWriting(false)}>닫기</button><button className="primary" disabled={saving||!valid}>{saving?'게시 중':'빌드 게시'}</button></div>
   </form></BuildModal>}
   {selected&&<BuildModal title="빌드 상세" onClose={()=>setSelected(null)}><article className="community-guide"><span className="overline">ADVENTURER BUILD</span><h1>{selected.title}</h1><div className="guide-byline"><span>{selected.profiles?.nickname||'모험가'} · {selected.version}</span>{selected.user_id===userId&&<button className="text-button danger-button" onClick={()=>void remove(selected)}><Trash2 size={14}/> 내 빌드 삭제</button>}</div><div className="build-tags">{selected.tags.map(t=><span key={t}>[{t}]</span>)}</div><div className="build-job-detail">{entry(selected.job_id)&&renderArt(entry(selected.job_id)!)}<span>직업<strong>{entry(selected.job_id)?.name||'등록되지 않은 직업'}</strong></span></div><Loadout ids={selected.inventory_ids}/><div className="guide-content">{selected.content}</div></article><CommunityDiscussion targetKey={`build-post:${selected.id}`} userId={userId} nickname={nickname} onLogin={onLogin} onNickname={onNickname}/></BuildModal>}
 </section>;
}
