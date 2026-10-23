import type { DungeonTagCount } from '@/lib/dungeon-guides';

export function DungeonTagBadges({tags=[]}:{tags?:DungeonTagCount[]}) {
  if(!tags.length)return null;
  return <span className="dungeon-community-tags" aria-label="공략에서 모인 태그">{tags.map(({tag,count})=><span className="dungeon-community-tag" key={tag} title={`${count}개의 공략에 붙은 태그`}>[{tag}]</span>)}</span>;
}
