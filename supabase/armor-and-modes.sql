begin;
-- Existing votes and tier lists are preserved as PVE.
alter table public.votes add column if not exists mode text not null default 'PVE' check(mode in ('PVE','PVP'));
alter table public.votes drop constraint if exists votes_pkey;
alter table public.votes add primary key(user_id,entry_id,version,mode);
alter table public.tier_lists add column if not exists mode text not null default 'PVE' check(mode in ('PVE','PVP'));
create index if not exists tier_lists_mode_version_idx on public.tier_lists(mode,version,created_at desc);
alter table public.build_posts add column if not exists armor_id text not null default '';

create or replace function public.get_vote_counts_by_mode(p_version text,p_mode text)
returns table(entry_id text,tier text,vote_count bigint)
language sql security definer set search_path=public as $$
 select v.entry_id,v.tier,count(*)::bigint from public.votes v
 where v.version=p_version and v.mode=p_mode group by v.entry_id,v.tier;
$$;
revoke all on function public.get_vote_counts_by_mode(text,text) from public;
grant execute on function public.get_vote_counts_by_mode(text,text) to anon,authenticated;
create or replace function public.get_recent_voted_entries_by_mode(p_version text,p_mode text,p_limit integer default 100)
returns table(entry_id text,last_voted_at timestamptz)
language sql security definer set search_path=public as $$
 select v.entry_id,max(v.updated_at) as last_voted_at from public.votes v
 where v.version=p_version and v.mode=p_mode group by v.entry_id
 order by last_voted_at desc limit greatest(1,least(p_limit,100));
$$;
revoke all on function public.get_recent_voted_entries_by_mode(text,text,integer) from public;
grant execute on function public.get_recent_voted_entries_by_mode(text,text,integer) to anon,authenticated;
-- Keep older public clients scoped to the existing PVE results.
create or replace function public.get_vote_counts(p_version text)
returns table(entry_id text,tier text,vote_count bigint)
language sql security definer set search_path=public as $$
 select * from public.get_vote_counts_by_mode(p_version,'PVE');
$$;
create or replace function public.get_recent_voted_entries(p_version text,p_limit integer default 100)
returns table(entry_id text,last_voted_at timestamptz)
language sql security definer set search_path=public as $$
 select * from public.get_recent_voted_entries_by_mode(p_version,'PVE',p_limit);
$$;

commit;
