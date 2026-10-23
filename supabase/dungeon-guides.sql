-- Adds dungeon grouping and purpose tags to the existing public guide board.
-- Existing Xbox verification and author ownership policies remain in effect.
alter table public.guide_posts
  add column if not exists dungeon_id text,
  add column if not exists tags text[] not null default '{}';

alter table public.guide_posts
  add constraint guide_posts_tags_allowed
  check (tags <@ array['렙업용', '무기파밍', '유물파밍', '봉우리 파밍']::text[]
    and cardinality(tags) <= 4 and array_position(tags, null) is null);

create index if not exists guide_posts_dungeon_created_at_idx
  on public.guide_posts (dungeon_id, created_at desc)
  where dungeon_id is not null;

create index if not exists guide_posts_tags_idx
  on public.guide_posts using gin (tags);
