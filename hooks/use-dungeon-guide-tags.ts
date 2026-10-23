'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { collectDungeonTags, type DungeonTagCounts, type DungeonTagRow } from '@/lib/dungeon-guides';

export function useDungeonGuideTags(enabled:boolean) {
  const [counts,setCounts]=useState<DungeonTagCounts>({});
  const [error,setError]=useState('');
  const request=useRef(0);
  const refresh=useCallback(async()=>{
    if(!supabase||!enabled)return;
    const ticket=++request.current;
    const result=await supabase.rpc('get_dungeon_guide_tag_counts');
    if(ticket!==request.current)return;
    if(result.error){setError('공략 태그를 불러오지 못했습니다.');return}
    setError('');setCounts(collectDungeonTags((result.data||[]) as DungeonTagRow[]));
  },[enabled]);
  useEffect(()=>{
    if(!enabled)return;
    void refresh();
    const onFocus=()=>{void refresh()};
    window.addEventListener('focus',onFocus);
    return()=>{request.current++;window.removeEventListener('focus',onFocus)};
  },[enabled,refresh]);
  return {counts,error,refresh};
}
