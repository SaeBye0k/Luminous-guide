export const DUNGEON_GUIDE_TAGS = ['렙업용', '무기파밍', '유물파밍', '봉우리 파밍'] as const;
export type DungeonGuideTag = typeof DUNGEON_GUIDE_TAGS[number];

export type DungeonTagCount = { tag: DungeonGuideTag; count: number };
export type DungeonTagCounts = Record<string, DungeonTagCount[]>;
export type DungeonTagRow = { dungeon_id: string; tag: string; guide_count: number|string };

export function collectDungeonTags(rows: DungeonTagRow[]): DungeonTagCounts {
  const counts: DungeonTagCounts = {};
  for(const row of rows){
    if(!DUNGEON_GUIDE_TAGS.includes(row.tag as DungeonGuideTag)||Number(row.guide_count)<=0)continue;
    (counts[row.dungeon_id]??=[]).push({tag:row.tag as DungeonGuideTag,count:Number(row.guide_count)});
  }
  for(const tags of Object.values(counts))tags.sort((a,b)=>b.count-a.count||DUNGEON_GUIDE_TAGS.indexOf(a.tag)-DUNGEON_GUIDE_TAGS.indexOf(b.tag));
  return counts;
}
