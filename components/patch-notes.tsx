'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThumbsUp, ThumbsDown, ArrowRight, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CommunityDiscussion } from '@/components/community-discussion';

type Patch = { id:string; title:string; version:string; published_on:string; summary:string; highlights:string[]; content:string; source_url:string|null };
type Reaction = 'like'|'dislike';
type Count = { patch_id:string; reaction:Reaction; vote_count:number };
type Props = { compact?:boolean; userId?:string; nickname:string; onLogin:()=>void; onNickname:()=>void };

export function PatchNotes({compact=false,userId,nickname,onLogin,onNickname}:Props) {
  const [patches,setPatches]=useState<Patch[]>([]);
  const [selected,setSelected]=useState('');
  const [counts,setCounts]=useState<Count[]>([]);
  const [mine,setMine]=useState<Record<string,Reaction>>({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');
  const request=useRef(0);
  const refresh=useCallback(async()=>{
    if(!supabase){setLoading(false);return}
    const ticket=++request.current;
    setLoading(true);setError('');
    const [notes,totals,own]=await Promise.all([
      supabase.from('patch_notes').select('id,title,version,published_on,summary,highlights,content,source_url').order('published_on',{ascending:false}).order('created_at',{ascending:false}),
      supabase.rpc('get_patch_reaction_counts'),
      userId?supabase.from('patch_reactions').select('patch_id,reaction').eq('user_id',userId):Promise.resolve({data:[],error:null}),
    ]);
    if(ticket!==request.current)return;
    if(notes.error||totals.error||own.error){setError('패치노트와 평가를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');setLoading(false);return}
    setPatches(notes.data||[]);setCounts(totals.data||[]);
    setMine(Object.fromEntries((own.data||[]).map(row=>[row.patch_id,row.reaction])));
    setLoading(false);
  },[userId]);
  useEffect(()=>{
    const pending=request;
    const timer=setTimeout(()=>void refresh(),0);
    return()=>{clearTimeout(timer);pending.current++};
  },[refresh]);
  const patch=compact?patches[0]:patches.find(p=>p.id===selected)||patches[0];
  const count=(reaction:Reaction)=>Number(counts.find(row=>row.patch_id===patch?.id&&row.reaction===reaction)?.vote_count||0);
  async function vote(reaction:Reaction){
    if(!supabase||!patch||saving)return;
    if(!userId){onLogin();return}
    setSaving(true);setError('');
    const ticket=request.current;
    const result=await supabase.from('patch_reactions').upsert({patch_id:patch.id,user_id:userId,reaction},{onConflict:'patch_id,user_id'});
    if(ticket!==request.current){setSaving(false);return}
    if(result.error)setError('평가를 저장하지 못했습니다. 다시 시도해주세요.');
    else await refresh();
    setSaving(false);
  }
  const rating=patch&&<div className="patch-rating"><p>이번 패치, 어떻게 느끼셨나요?</p><div className="patch-reactions">{(['like','dislike'] as Reaction[]).map(reaction=><button key={reaction} type="button" className={`secondary ${mine[patch.id]===reaction?'chosen':''}`} disabled={!supabase||loading||saving} aria-pressed={!!userId&&mine[patch.id]===reaction} onClick={()=>void vote(reaction)}>{reaction==='like'?<ThumbsUp size={15}/>:<ThumbsDown size={15}/>}<span>{reaction==='like'?'좋아요':'아쉬워요'}</span><b>{count(reaction).toLocaleString()}</b></button>)}</div><small>{saving?'평가 저장 중…':userId?'계정당 한 표 · 다시 선택해 변경할 수 있어요.':'로그인 후 평가에 참여할 수 있어요.'}</small></div>;
  return <section className={compact?'patch-feature':'patch-page'} aria-label={compact?'최신 패치노트':'패치노트 목록'}>
    {!compact&&<div className="page-title"><span className="overline">PATCH NOTES</span><h1>패치노트</h1><p>무엇이 달라졌는지 읽고, 이번 패치에 대한 의견을 나눠보세요.</p></div>}
    {loading&&!patch&&<p className="empty-mini">패치노트를 불러오는 중입니다.</p>}
    {!loading&&!error&&!patch&&<div className="patch-empty"><span className="overline">PATCH NOTES</span><h2>새로운 변화, 함께 살펴봐요.</h2><p>아직 등록된 패치노트가 없습니다. 등록되면 핵심 변경과 모험가의 평가를 여기에서 확인할 수 있어요.</p></div>}
    {error&&<p className="editor-error" role="alert">{error}<button type="button" className="text-button" disabled={loading||saving} onClick={()=>void refresh()}>다시 시도</button></p>}
    {patch&&<>
      {!compact&&patches.length>1&&<label className="patch-select">패치 선택<select value={patch.id} onChange={event=>setSelected(event.target.value)}>{patches.map(p=><option key={p.id} value={p.id}>{p.published_on} · {p.title}</option>)}</select></label>}
      <article className="patch-article"><div className="patch-meta"><span className="small-tag">{compact?'최신 패치':patch.version}</span><time dateTime={patch.published_on}>{patch.published_on}</time></div><h2>{patch.title}</h2><p className="patch-summary">{patch.summary}</p>{!!patch.highlights.length&&<ul className="patch-highlights">{(compact?patch.highlights.slice(0,3):patch.highlights).map((highlight,index)=><li key={index}>{highlight}</li>)}</ul>}
      {!compact&&<><div className="patch-content">{patch.content}</div>{patch.source_url&&/^https:\/\//i.test(patch.source_url)&&<a className="text-button patch-source" href={patch.source_url} target="_blank" rel="noopener noreferrer">공식 원문 보기 <ExternalLink size={14}/></a>}</>}
      </article>{rating}
      {!compact&&<CommunityDiscussion key={patch.id} targetKey={`patch:${patch.id}`} label="이번 패치에 대한 의견" userId={userId} nickname={nickname} onLogin={onLogin} onNickname={onNickname}/>}
    </>}
    {compact&&<Link className="text-button patch-more" href="/patch-notes/">패치노트 전체 보기 · 의견 남기기 <ArrowRight size={15}/></Link>}
  </section>;
}
