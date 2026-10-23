'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Castle, ChevronRight, MessageSquare } from 'lucide-react';
import type { Entry } from '@/lib/game-data';
import { dungeonDetails } from '@/lib/dungeons';
import { DungeonTagBadges } from '@/components/dungeon-tag-badges';
import type { DungeonTagCounts } from '@/lib/dungeon-guides';
import { GuideBoard } from '@/components/guide-board';
import { CommunityDiscussion } from '@/components/community-discussion';

type Props = {
  dungeons: Entry[];
  tagCounts?:DungeonTagCounts;
  onPostsChanged?:()=>void;
  dungeonId: string|null;
  onSelect: (id:string)=>void;
  userId?: string;
  nickname: string;
  onLogin: ()=>void;
  onNickname: ()=>void;
};

export function DungeonGuideHub({dungeons,dungeonId,onSelect,tagCounts={},onPostsChanged,...auth}:Props) {
  const selected=dungeons.find(dungeon=>dungeon.id===dungeonId)||dungeons[0];
  const [tab,setTab]=useState<'guides'|'comments'>('guides');
  if(!selected)return <div className="empty"><Castle/><h2>등록된 던전이 없습니다</h2></div>;
  const detail=dungeonDetails[selected.id];

  return <>
    <div className="page-title"><span className="overline">DUNGEON FIELD NOTES</span><h1>던전 공략</h1><p>도전할 던전을 고르고, 공략과 짧은 경험을 나눠보세요. 던전의 태그는 모험가들이 작성한 공략에서 모입니다.</p></div>
    <div className="dungeon-world-heading"><span className="dungeon-world-label">월드 1</span></div>
    <div className="dungeon-guide-selector" role="group" aria-label="공략을 볼 던전 선택">
      {dungeons.map(dungeon=><button type="button" key={dungeon.id} aria-pressed={selected.id===dungeon.id} className={selected.id===dungeon.id?'active':''} onClick={()=>onSelect(dungeon.id)}><Castle size={19} aria-hidden="true"/><span><strong>{dungeon.name}</strong><small>{dungeonDetails[dungeon.id]?.stats[0]}</small><DungeonTagBadges tags={tagCounts[dungeon.id]}/></span><ChevronRight size={16} aria-hidden="true"/></button>)}
    </div>
    <section className="dungeon-guide-overview" aria-label={`${selected.name} 요약`}>
      <div><span className="overline">SELECTED DUNGEON</span><h2>{selected.name}</h2><p>{selected.tagline}</p><DungeonTagBadges tags={tagCounts[selected.id]}/></div>
      <div className="dungeon-guide-facts">{detail?.stats.slice(1).map(stat=><span key={stat}>{stat}</span>)}<Link className="text-button" href={`/database/?${new URLSearchParams({category:'던전',item:selected.id})}`}>던전 정보·드랍테이블 <ChevronRight size={14}/></Link></div>
    </section>
    <div className="tabs dungeon-guide-tabs" role="group" aria-label="공략과 한줄평 보기">
      <button type="button" className={tab==='guides'?'active':''} aria-pressed={tab==='guides'} onClick={()=>setTab('guides')}><BookOpen size={16} aria-hidden="true"/>공략글</button>
      <button type="button" className={tab==='comments'?'active':''} aria-pressed={tab==='comments'} onClick={()=>setTab('comments')}><MessageSquare size={16} aria-hidden="true"/>한줄평</button>
    </div>
    {tab==='guides'?<GuideBoard key={selected.id} dungeonId={selected.id} dungeonName={selected.name} onPostsChanged={onPostsChanged} {...auth}/>:<CommunityDiscussion key={selected.id} targetKey={`dungeon:${selected.id}`} label={`${selected.name} 한줄평`} {...auth}/>}
  </>;
}
