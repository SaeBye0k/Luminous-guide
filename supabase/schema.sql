create table if not exists public.votes (
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_id text not null,
  version text not null,
  tier text not null check (tier in ('S','A','B+','B','C','D','F')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, entry_id, version)
);

alter table public.votes enable row level security;

create policy "read own vote"
on public.votes for select
to authenticated
using (auth.uid() = user_id);

create policy "insert own vote"
on public.votes for insert
to authenticated
with check (auth.uid() = user_id);

create policy "update own vote"
on public.votes for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.get_vote_counts(p_version text)
returns table(entry_id text, tier text, vote_count bigint)
language sql
security definer
set search_path = public
as $$
  select votes.entry_id, votes.tier, count(*)::bigint
  from public.votes
  where votes.version = p_version
  group by votes.entry_id, votes.tier;
$$;

revoke all on function public.get_vote_counts(text) from public;
grant execute on function public.get_vote_counts(text) to anon, authenticated;
