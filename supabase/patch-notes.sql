-- Run once (or re-run safely) in Supabase SQL Editor.
begin;
create table if not exists public.patch_notes (
 id uuid primary key default gen_random_uuid(),
 title text not null check(char_length(trim(title)) between 1 and 120),
 version text not null check(char_length(trim(version)) between 1 and 40),
 published_on date not null,
 summary text not null check(char_length(trim(summary)) between 1 and 500),
 highlights text[] not null default '{}',
 content text not null default '',
 source_url text check(source_url is null or source_url ~* '^https://'),
 created_at timestamptz not null default now()
);
create index if not exists patch_notes_date_idx on public.patch_notes(published_on desc,created_at desc);
alter table public.patch_notes enable row level security;
drop policy if exists "Public patch notes" on public.patch_notes;
create policy "Public patch notes" on public.patch_notes for select to anon,authenticated using(true);
grant select on public.patch_notes to anon,authenticated;
-- Patch notes are published by the owner in SQL Editor, not by public users.
revoke insert,update,delete on public.patch_notes from anon,authenticated;

create table if not exists public.patch_reactions (
 patch_id uuid not null references public.patch_notes(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 reaction text not null check(reaction in ('like','dislike')),
 primary key(patch_id,user_id)
);
alter table public.patch_reactions enable row level security;
drop policy if exists "Read own patch reaction" on public.patch_reactions;
create policy "Read own patch reaction" on public.patch_reactions for select to authenticated using(auth.uid()=user_id);
drop policy if exists "Create own patch reaction" on public.patch_reactions;
create policy "Create own patch reaction" on public.patch_reactions for insert to authenticated with check(auth.uid()=user_id);
drop policy if exists "Update own patch reaction" on public.patch_reactions;
create policy "Update own patch reaction" on public.patch_reactions for update to authenticated using(auth.uid()=user_id) with check(auth.uid()=user_id);
grant select,insert,update on public.patch_reactions to authenticated;
revoke all on public.patch_reactions from anon;

create or replace function public.get_patch_reaction_counts()
returns table(patch_id uuid,reaction text,vote_count bigint)
language sql security definer set search_path=public as $$
 select r.patch_id,r.reaction,count(*)::bigint
 from public.patch_reactions r group by r.patch_id,r.reaction;
$$;
revoke all on function public.get_patch_reaction_counts() from public;
grant execute on function public.get_patch_reaction_counts() to anon,authenticated;
commit;
-- Comments reuse the existing public.comments table with target_key = 'patch:<uuid>'.
-- Requires the existing supabase/nickname-comments.sql setup.

-- Registration template: replace every placeholder with the real patch contents,
-- then uncomment and execute separately. Do not publish placeholder content.
-- insert into public.patch_notes
--   (title, version, published_on, summary, highlights, content, source_url)
-- values (
--   '실제 패치 제목', '실제 버전', 'YYYY-MM-DD'::date,
--   '핵심 변경을 요약한 실제 설명',
--   array['실제 변경 사항 1', '실제 변경 사항 2'],
--   '실제 패치 상세 내용', 'https://실제-공식-원문-주소'
-- );
