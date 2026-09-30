create or replace function public.touch_vote_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists votes_touch_updated_at on public.votes;
create trigger votes_touch_updated_at
before update on public.votes
for each row execute function public.touch_vote_updated_at();

create or replace function public.get_recent_voted_entries(
  p_version text,
  p_limit integer default 100
)
returns table(entry_id text, last_voted_at timestamptz)
language sql
security definer
set search_path = public
as $$
  select votes.entry_id, max(votes.updated_at) as last_voted_at
  from public.votes
  where votes.version = p_version
  group by votes.entry_id
  order by last_voted_at desc
  limit greatest(1, least(p_limit, 100));
$$;

revoke all on function public.get_recent_voted_entries(text, integer) from public;
grant execute on function public.get_recent_voted_entries(text, integer) to anon, authenticated;
