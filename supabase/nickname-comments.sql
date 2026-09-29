create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(trim(nickname)) between 2 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_nickname_lower_idx
on public.profiles (lower(nickname));

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
on public.profiles for select
to anon, authenticated
using (true);

create policy "users create own profile"
on public.profiles for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users update own profile"
on public.profiles for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(user_id) on delete cascade,
  target_key text not null,
  content text not null check (char_length(trim(content)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists comments_target_created_idx
on public.comments (target_key, created_at);

alter table public.comments enable row level security;

create policy "comments are publicly readable"
on public.comments for select
to anon, authenticated
using (true);

create policy "users create own comments"
on public.comments for insert
to authenticated
with check (auth.uid() = user_id);

create policy "users delete own comments"
on public.comments for delete
to authenticated
using (auth.uid() = user_id);
