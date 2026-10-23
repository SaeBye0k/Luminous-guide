'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import { TIERS, emptyCounts, type Entry, type Tier, type GameMode } from '@/lib/game-data';

type Counts = Record<string, number[]>;
type VoteRow = { entry_id:string; tier:Tier };
type CountRow = { entry_id:string; tier:Tier; vote_count:number };
type RecentRow = { entry_id:string; last_voted_at:string };

export function useCommunityVotes(entries:Entry[], version:string, mode:GameMode='PVE') {
  const [user,setUser]=useState<User|null>(null);
  const [xboxVerified,setXboxVerified]=useState(false);
  const [counts,setCounts]=useState<Counts>({});
  const [myVotes,setMyVotes]=useState<Record<string,Tier>>({});
  const [loading,setLoading]=useState(supabaseConfigured);
  const [saving,setSaving]=useState('');
  const [error,setError]=useState('');
  const [nickname,setNickname]=useState('');
  const [recentEntryIds,setRecentEntryIds]=useState<string[]>([]);

  const request=useRef(0);
  const refresh=useCallback(async(activeUser:User|null)=>{
    if(!supabase){setLoading(false);return}
    const ticket=++request.current;setLoading(true);setError('');

    const aggregate=await supabase.rpc('get_vote_counts_by_mode',{p_version:version,p_mode:mode});
    if(ticket!==request.current)return;
    if(aggregate.error)setError('투표 결과를 불러오지 못했습니다.');
    else {
      const next:Counts={};
      for(const entry of entries)next[entry.id]=emptyCounts();
      for(const row of (aggregate.data||[]) as CountRow[]){
        if(!next[row.entry_id])next[row.entry_id]=emptyCounts();
        const index=TIERS.indexOf(row.tier);
        if(index>=0)next[row.entry_id][index]=Number(row.vote_count);
      }
      setCounts(next);
    }

    const recent=await supabase.rpc('get_recent_voted_entries_by_mode',{p_version:version,p_mode:mode,p_limit:100});
    if(ticket!==request.current)return;
    if(recent.error)setRecentEntryIds([]);
    else setRecentEntryIds(((recent.data||[]) as RecentRow[]).map(row=>row.entry_id));

    if(activeUser){
      const profile=await supabase.from('profiles').select('nickname').eq('user_id',activeUser.id).maybeSingle();
      if(!profile.error)setNickname(profile.data?.nickname||'');
      const own=await supabase.from('votes').select('entry_id,tier').eq('version',version).eq('mode',mode).eq('user_id',activeUser.id);
      if(ticket!==request.current)return;
      if(own.error)setError('내 투표 정보를 불러오지 못했습니다.');
      else setMyVotes(Object.fromEntries(((own.data||[]) as VoteRow[]).map(row=>[row.entry_id,row.tier])));
    }else {setMyVotes({});setNickname('')}
    setLoading(false);
  },[entries,version,mode]);

  const xboxCallback=useRef<URLSearchParams|null>(null);
  const invalidateRequest=useCallback(()=>{request.current++},[]);
  useEffect(()=>{
    if(!supabase)return;
    let active=true;
    const timers=new Set<ReturnType<typeof setTimeout>>();
    if(!xboxCallback.current){
      const params=new URLSearchParams(window.location.search);
      const hash=new URLSearchParams(window.location.hash.slice(1));
      for(const key of ['error','error_code','error_description']){
        if(hash.has(key))params.set(key,hash.get(key)!);
      }
      xboxCallback.current=params;
    }
    const callback=xboxCallback.current;
    const authError=callback.has('error')||callback.has('error_code')
      ?(callback.get('error_description')?.includes('issuer')
        ?'Microsoft 인증 설정이 일치하지 않아 로그인하지 못했습니다. 운영자에게 문의해주세요.'
        :'Microsoft 로그인을 완료하지 못했습니다. 다시 시도해주세요.')
      :'';
    const clean=new URL(window.location.href);
    if(new URLSearchParams(clean.hash.slice(1)).has('error'))clean.hash='';
    for(const key of ['error','error_code','error_description'])clean.searchParams.delete(key);
    clean.searchParams.delete('xbox_code');clean.searchParams.delete('xbox_state');
    window.history.replaceState(null,'',clean.toString());
    let lastToken:string|null|undefined;
    let authTicket=0;
    let callbackUsed=false;
    const schedule=(session:Session|null)=>{
      const token=session?.access_token||null;
      if(token===lastToken)return;
      lastToken=token;
      const ticket=++authTicket;
      setXboxVerified(false);
      const timer=setTimeout(async()=>{
        timers.delete(timer);
        if(!active)return;
        const nextUser=session?.user||null;
        setUser(nextUser);
        if(!nextUser){
          await refresh(null);
          if(active&&ticket===authTicket&&authError)setError(authError);
          return;
        }
        try{
          const linked=await supabase!.from('xbox_accounts').select('user_id,verified_at').eq('user_id',nextUser.id).maybeSingle();
          if(!active||ticket!==authTicket)return;
          if(linked.error)throw new Error('Xbox 계정 연동 정보를 불러오지 못했습니다.');
          if(!linked.data||Date.parse(linked.data.verified_at)<Math.max(Date.parse(nextUser.last_sign_in_at||'9999-01-01'),Date.parse('2026-10-23T08:12:15Z'))){
            if(callback.has('xbox_error'))throw new Error('Xbox 인증을 완료하지 못했습니다. 다시 로그인해주세요.');
            if(!nextUser.identities?.some(i=>i.provider==='azure'))throw new Error('Xbox 계정으로 다시 로그인해주세요.');
            const code=callback.get('xbox_code'),state=callback.get('xbox_state');
            if(code&&state&&!callbackUsed){
              callbackUsed=true;
              const completed=await supabase!.functions.invoke('verify-xbox',{body:{action:'complete',code,state}});
              if(!active||ticket!==authTicket)return;
              if(completed.error||!completed.data?.ok)throw new Error('Xbox 인증에 실패했습니다. 다시 로그인해주세요.');
            }else{
              const started=await supabase!.functions.invoke('verify-xbox',{body:{action:'start'}});
              if(!active||ticket!==authTicket)return;
              if(started.error||!started.data?.url)throw new Error('Xbox 인증을 시작하지 못했습니다. 다시 로그인해주세요.');
              window.location.assign(started.data.url);return;
            }
          }
          setXboxVerified(true);void refresh(nextUser);
        }catch(cause){
          if(!active||ticket!==authTicket)return;
          await refresh(null);
          if(active&&ticket===authTicket)setError(cause instanceof Error?cause.message:'Xbox 인증에 실패했습니다.');
        }
      },0);
      timers.add(timer);
    };
    supabase.auth.getSession().then(({data,error:sessionError})=>{
      if(!active)return;
      if(sessionError)setError('로그인 상태를 확인하지 못했습니다.');
      schedule(data.session);
    });
    const {data}=supabase.auth.onAuthStateChange((_event,session)=>{if(active)schedule(session)});
    return()=>{active=false;invalidateRequest();for(const timer of timers)clearTimeout(timer);data.subscription.unsubscribe()};
  },[refresh,invalidateRequest]);

  async function signIn(){
    if(!supabase)return;
    setError('');
    const clean=new URL(window.location.href);
    // OAuth fragments can contain large access/provider tokens. Never put those
    // fragments or prior query parameters into the next authorization request.
    const options={redirectTo:clean.origin+clean.pathname,scopes:'email'};
    // Discard a legacy provider session; no manual Google identity linking.
    if(user&&!user.identities?.some(i=>i.provider==='azure')){
      const signedOut=await supabase.auth.signOut({scope:'local'});
      if(signedOut.error){setError('기존 로그인 세션을 종료하지 못했습니다.');return}
    }
    const result=await supabase.auth.signInWithOAuth({provider:'azure',options});
    if(result.error)setError('Xbox 로그인을 시작하지 못했습니다. 잠시 후 다시 시도해주세요.');
  }

  async function signOut(){
    if(!supabase)return;
    const {error:signOutError}=await supabase.auth.signOut();
    if(signOutError)setError('로그아웃하지 못했습니다.');
  }

  async function vote(entryId:string,tier:Tier){
    if(!supabase||!user||!xboxVerified)return false;
    setSaving(entryId);setError('');
    const result=await supabase.from('votes').upsert({
      user_id:user.id,entry_id:entryId,version,mode,tier,updated_at:new Date().toISOString(),
    },{onConflict:'user_id,entry_id,version,mode'});
    setSaving('');
    if(result.error){setError('투표를 저장하지 못했습니다.');return false}
    setMyVotes(previous=>({...previous,[entryId]:tier}));
    await refresh(user);
    return true;
  }

  async function saveNickname(value:string){
    void value;
    return {ok:false,message:'닉네임은 Xbox 게이머태그와 자동 동기화됩니다.'};
  }

  return {configured:supabaseConfigured,hasSession:Boolean(user),user:xboxVerified?user:null,nickname,counts,myVotes,recentEntryIds,loading,saving,error,signIn,signOut,vote,saveNickname,refresh};
}
