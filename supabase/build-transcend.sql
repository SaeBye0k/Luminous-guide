alter table public.build_posts add column if not exists transcend_levels integer[] not null default array[0,0,0,0,0,0];
alter table public.build_posts drop constraint if exists build_posts_transcend_levels_check;
alter table public.build_posts add constraint build_posts_transcend_levels_check
check (cardinality(transcend_levels) = 6 and array_ndims(transcend_levels) = 1 and array_position(transcend_levels,null) is null and transcend_levels <@ array[0,1,2,3]);
grant update (transcend_levels) on public.build_posts to authenticated;
