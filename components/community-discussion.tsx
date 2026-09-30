'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type CommentRow = {
  id:number;
  user_id:string;
  content:string;
  created_at:string;
  profiles:{nickname:string}|null;
};

export function CommunityDiscussion({
  targetKey,userId,nickname,onLogin,onNickname,label='모험가의 의견',
}:{
  targetKey:string;
  label?:string;
  userId?:string;
  nickname:string;
  onLogin:()=>void;
  onNickname:()=>void;
}) {
  const [comments,setComments]=useState<CommentRow[]>([]);
  const [content,setContent]=useState('');
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState('');

  const load=useCallback(async()=>{
    if(!supabase){setLoading(false);return}
    const result=await supabase
      .from('comments')
      .select('id,user_id,content,created_at,profiles!comments_user_id_fkey(nickname)')
      .eq('target_key',targetKey)
      .order('created_at',{ascending:true});
    if(result.error)setError('의견을 불러오지 못했습니다.');
    else setComments((result.data||[]) as unknown as CommentRow[]);
    setLoading(false);
  },[targetKey]);

  useEffect(()=>{void load()},[load]);

  async function submit(event:React.FormEvent){
    event.preventDefault();
    if(!supabase||!userId||!nickname||!content.trim())return;
    setSaving(true);setError('');
    const result=await supabase.from('comments').insert({
      user_id:userId,target_key:targetKey,content:content.trim(),
    });
    setSaving(false);
    if(result.error){setError('의견을 저장하지 못했습니다.');return}
    setContent('');
    await load();
  }

  async function remove(comment:CommentRow){
    if(!supabase||!userId||comment.user_id!==userId)return;
    if(!window.confirm('이 의견을 삭제할까요?'))return;
    setError('');
    const result=await supabase.from('comments').delete().eq('id',comment.id).eq('user_id',userId);
    if(result.error){setError('의견을 삭제하지 못했습니다.');return}
    setComments(previous=>previous.filter(item=>item.id!==comment.id));
  }

  return <section className="discussion">
    <div className="section-heading"><h3>{label} <span className="muted">{comments.length}</span></h3></div>
    {loading&&<p className="empty-mini">의견을 불러오는 중입니다.</p>}
    {!loading&&!comments.length&&<p className="empty-mini">첫 의견을 남겨보세요.</p>}
    {comments.map(comment=><div className="comment" key={comment.id}><span className="avatar">{comment.profiles?.nickname?.slice(0,1)||'?'}</span><div className="comment-copy"><strong>{comment.profiles?.nickname||'모험가'}</strong><p>{comment.content}</p></div>{comment.user_id===userId&&<button className="comment-delete" onClick={()=>void remove(comment)} aria-label="내 의견 삭제" title="삭제"><Trash2 size={14}/></button>}</div>)}
    {error&&<p className="editor-error" role="alert">{error}</p>}
    {!userId?<button className="secondary" onClick={onLogin}>Google 로그인 후 의견 남기기</button>
    :!nickname?<button className="secondary" onClick={onNickname}>닉네임을 설정하고 의견 남기기</button>
    :<form className="comment-form" onSubmit={submit}><input aria-label="댓글" maxLength={500} value={content} onChange={e=>setContent(e.target.value)} placeholder={`${nickname}(으)로 의견 남기기`}/><button className="primary" disabled={saving||!content.trim()}>{saving?'등록 중':'등록'}</button></form>}
  </section>;
}
