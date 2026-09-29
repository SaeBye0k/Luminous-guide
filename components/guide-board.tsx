'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, PenLine, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CommunityDiscussion } from '@/components/community-discussion';

type GuidePost = {
  id:number;
  user_id:string;
  title:string;
  content:string;
  created_at:string;
  profiles:{nickname:string}|null;
};

type Props = {
  userId?:string;
  nickname:string;
  onLogin:()=>void;
  onNickname:()=>void;
  preview?:boolean;
};

function BoardModal({title,onClose,children}:{title:string;onClose:()=>void;children:ReactNode}){
  const ref=useRef<HTMLDialogElement>(null);
  useEffect(()=>{const dialog=ref.current;dialog?.showModal();return()=>dialog?.close()},[]);
  return <dialog ref={ref} className="modal guide-post-modal" onCancel={onClose} onClick={event=>{if(event.target===event.currentTarget)onClose()}}><div className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="닫기"><X/></button></div>{children}</dialog>;
}

export function GuideBoard({userId,nickname,onLogin,onNickname,preview=false}:Props){
  const [posts,setPosts]=useState<GuidePost[]>([]);
  const [selected,setSelected]=useState<GuidePost|null>(null);
  const [writing,setWriting]=useState(false);
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');

  const load=useCallback(async()=>{
    if(!supabase){setError('게시판 연결 설정이 필요합니다.');setLoading(false);return}
    const result=await supabase.from('guide_posts')
      .select('id,user_id,title,content,created_at,profiles!guide_posts_user_id_fkey(nickname)')
      .order('created_at',{ascending:false})
      .limit(preview?3:100);
    if(result.error)setError('공략을 불러오지 못했습니다. Supabase 게시판 설정을 확인해주세요.');
    else setPosts((result.data||[]) as unknown as GuidePost[]);
    setLoading(false);
  },[preview]);

  useEffect(()=>{void load()},[load]);

  function startWriting(){
    if(!userId){onLogin();return}
    if(!nickname){onNickname();return}
    setWriting(true);
  }

  async function submit(event:React.FormEvent){
    event.preventDefault();
    if(!supabase||!userId||!nickname||!title.trim()||!content.trim())return;
    setSaving(true);setError('');
    const result=await supabase.from('guide_posts').insert({
      user_id:userId,title:title.trim(),content:content.trim(),
    });
    setSaving(false);
    if(result.error){setError('공략을 등록하지 못했습니다.');return}
    setTitle('');setContent('');setWriting(false);await load();
  }

  return <section className={preview?'section guide-board':'guide-board'}>
    <div className="section-heading"><div>{preview&&<span className="overline">ADVENTURER GUIDES</span>}<h2>{preview?'새로 올라온 모험가 공략':'공략 게시판'}</h2></div>{preview?<Link href="/guides/" className="text-button">모든 공략 <ChevronRight size={16}/></Link>:<button className="primary" onClick={startWriting}><PenLine size={16}/> 공략 작성</button>}</div>
    {error&&<p className="editor-error" role="alert">{error}</p>}
    {loading&&<div className="empty"><BookOpen/><h3>공략을 불러오는 중입니다</h3></div>}
    {!loading&&!posts.length&&<div className="empty"><BookOpen/><h3>아직 등록된 공략이 없습니다</h3><p>첫 번째 공략을 작성해 모험가들과 경험을 나눠보세요.</p>{!preview&&<button className="primary" onClick={startWriting}>첫 공략 작성하기</button>}</div>}
    {!!posts.length&&<div className="board-list">{posts.map(post=><button className="board-row" key={post.id} onClick={()=>setSelected(post)}><span className="board-icon"><BookOpen size={19}/></span><span className="board-copy"><strong>{post.title}</strong><small>{post.content}</small></span><span className="board-meta"><b>{post.profiles?.nickname||'모험가'}</b><time>{new Date(post.created_at).toLocaleDateString('ko-KR')}</time></span><ChevronRight size={17}/></button>)}</div>}
    {writing&&<BoardModal title="새 공략 작성" onClose={()=>setWriting(false)}><form className="guide-write-form" onSubmit={submit}><label>제목<input autoFocus required maxLength={100} value={title} onChange={e=>setTitle(e.target.value)} placeholder="공략 제목을 입력하세요"/></label><label>공략 내용<textarea required maxLength={10000} rows={14} value={content} onChange={e=>setContent(e.target.value)} placeholder="장비 구성, 운영 방법, 주의할 점 등을 자유롭게 작성하세요."/></label><div className="editor-actions"><button type="button" className="secondary" onClick={()=>setWriting(false)}>취소</button><button className="primary" disabled={saving||!title.trim()||!content.trim()}>{saving?'등록 중':'공략 등록'}</button></div></form></BoardModal>}
    {selected&&<BoardModal title="모험가 공략" onClose={()=>setSelected(null)}><article className="community-guide"><span className="overline">ADVENTURER FIELD NOTE</span><h1>{selected.title}</h1><p className="guide-byline">{selected.profiles?.nickname||'모험가'} · {new Date(selected.created_at).toLocaleDateString('ko-KR')}</p><div className="guide-content">{selected.content}</div></article><CommunityDiscussion targetKey={`guide-post:${selected.id}`} userId={userId} nickname={nickname} onLogin={onLogin} onNickname={onNickname}/></BoardModal>}
  </section>;
}
