'use client';

import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import { TIERS, type Entry, type Tier } from '@/lib/game-data';

type Counts = Record<string, number[]>;
type VoteRow = { entry_id:string; tier:Tier };
type CountRow = { entry_id:string; tier:Tier; vote_count:number };

export function useCommunityVotes(entries:Entry[], version:string) {
  const [user,setUser]=useState<User|null>(null);
  const [counts,setCounts]=useState<Counts>({});
  const [myVotes,setMyVotes]=useState<Record<string,Tier>>({});
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState('');
  const [error,setError]=useState('');

  const refresh=useCallback(async(activeUser:User|null)=>{
    if(!supabase){setLoading(false);return}
    setLoading(true);setError('');

    const aggregate=await supabase.rpc('get_vote_counts',{p_version:version});
    if(aggregate.error)setError('투표 결과를 불러오지 못했습니다.');
    else {
      const next:Counts={};
      for(const entry of entries)next[entry.id]=[0,0,0,0,0];
      for(const row of (aggregate.data||[]) as CountRow[]){
        if(!next[row.entry_id])next[row.entry_id]=[0,0,0,0,0];
        const index=TIERS.indexOf(row.tier);
        if(index>=0)next[row.entry_id][index]=Number(row.vote_count);
      }
      setCounts(next);
    }

    if(activeUser){
      const own=await supabase.from('votes').select('entry_id,tier').eq('version',version).eq('user_id',activeUser.id);
      if(own.error)setError('내 투표 정보를 불러오지 못했습니다.');
      else setMyVotes(Object.fromEntries(((own.data||[]) as VoteRow[]).map(row=>[row.entry_id,row.tier])));
    }else setMyVotes({});
    setLoading(false);
  },[entries,version]);

  useEffect(()=>{
    if(!supabase){setLoading(false);return}
    let active=true;
    const timers=new Set<ReturnType<typeof setTimeout>>();
    const schedule=(nextUser:User|null)=>{
      const timer=setTimeout(()=>{
        timers.delete(timer);
        if(active)void refresh(nextUser);
      },0);
      timers.add(timer);
    };

    supabase.auth.getSession().then(({data,error:sessionError})=>{
      if(!active)return;
      if(sessionError)setError('로그인 상태를 확인하지 못했습니다.');
      const nextUser=data.session?.user||null;
      setUser(nextUser);
      schedule(nextUser);
    });

    const {data}=supabase.auth.onAuthStateChange((_event,session)=>{
      if(!active)return;
      const nextUser=session?.user||null;
      setUser(nextUser);
      schedule(nextUser);
    });

    return()=>{
      active=false;
      for(const timer of timers)clearTimeout(timer);
      data.subscription.unsubscribe();
    };
  },[refresh]);

  async function signIn(){
    if(!supabase)return;
    setError('');
    const {error:signInError}=await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{redirectTo:window.location.origin+window.location.pathname},
    });
    if(signInError)setError('Google 로그인을 시작하지 못했습니다.');
  }

  async function signOut(){
    if(!supabase)return;
    const {error:signOutError}=await supabase.auth.signOut();
    if(signOutError)setError('로그아웃하지 못했습니다.');
  }

  async function vote(entryId:string,tier:Tier){
    if(!supabase||!user)return false;
    setSaving(entryId);setError('');
    const result=await supabase.from('votes').upsert({
      user_id:user.id,entry_id:entryId,version,tier,
    },{onConflict:'user_id,entry_id,version'});
    setSaving('');
    if(result.error){setError('투표를 저장하지 못했습니다.');return false}
    setMyVotes(previous=>({...previous,[entryId]:tier}));
    await refresh(user);
    return true;
  }

  return {configured:supabaseConfigured,user,counts,myVotes,loading,saving,error,signIn,signOut,vote,refresh};
}
