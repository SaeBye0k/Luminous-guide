-- Community labels come only from published guides visible to the caller.
create or replace function public.get_dungeon_guide_tag_counts()
returns table (dungeon_id text, tag text, guide_count bigint)
language sql stable security invoker
set search_path = ''
as $$
  select p.dungeon_id, t.tag, count(distinct p.id)
  from public.guide_posts p
  cross join lateral unnest(p.tags) as t(tag)
  where p.dungeon_id is not null
  group by p.dungeon_id, t.tag;
$$;

revoke all on function public.get_dungeon_guide_tag_counts() from public;
grant execute on function public.get_dungeon_guide_tag_counts() to anon, authenticated;
