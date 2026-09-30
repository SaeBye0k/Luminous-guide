create table if not exists public.tier_lists (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references public.profiles(user_id) on delete cascade,
 title text not null check(char_length(title) between 1 and 80),
 description text not null default '' check(char_length(description)<=180),
 slots jsonb not null check(jsonb_typeof(slots)='object' and slots <> '{}'::jsonb),
 version text not null,
 content_key text not null,
 created_at timestamptz not null default now(),
 unique(user_id,content_key)
);
alter table public.tier_lists enable row level security;
drop policy if exists "Public tier lists" on public.tier_lists;
create policy "Public tier lists" on public.tier_lists for select using(true);
drop policy if exists "Create own tier lists" on public.tier_lists;
create policy "Create own tier lists" on public.tier_lists for insert to authenticated with check(auth.uid()=user_id);
drop policy if exists "Delete own tier lists" on public.tier_lists;
create policy "Delete own tier lists" on public.tier_lists for delete to authenticated using(auth.uid()=user_id);
grant select on public.tier_lists to anon,authenticated;
grant insert,delete on public.tier_lists to authenticated;
create index if not exists tier_lists_version_created_idx on public.tier_lists(version,created_at desc);

-- Preserve card order without changing existing tier assignments.
alter table public.tier_lists add column if not exists item_order text[] not null default '{}';
