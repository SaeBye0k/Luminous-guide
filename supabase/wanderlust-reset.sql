-- Owner-only release migration. Run once in Supabase SQL Editor after xbox-auth.sql.
-- Clears all historical tier votes (PVE/PVP) and patch like/dislike votes.
-- Posts, comments, profiles and personal tier lists are preserved.
begin;
create schema if not exists release_archive;
revoke all on schema release_archive from public, anon, authenticated;
create table if not exists release_archive.migrations (
 id text primary key, applied_at timestamptz not null default now()
);
-- Private rollback snapshots are never exposed through the public API.
create table if not exists release_archive.wanderlust_votes as select * from public.votes with no data;
create table if not exists release_archive.wanderlust_patch_reactions as select * from public.patch_reactions with no data;
revoke all on all tables in schema release_archive from public, anon, authenticated;

do $$
begin
 perform pg_advisory_xact_lock(hashtext('wanderlust-reset-v1'));
 if not exists(select 1 from release_archive.migrations where id='wanderlust-reset-v1') then
  lock table public.votes, public.patch_reactions in access exclusive mode;
  insert into release_archive.wanderlust_votes select * from public.votes;
  insert into release_archive.wanderlust_patch_reactions select * from public.patch_reactions;
  delete from public.votes;
  delete from public.patch_reactions;
  update public.tier_lists set version='[루미너스:윈더러스트]';
  update public.build_posts set version='[루미너스:윈더러스트]';
  update public.patch_notes set version='[루미너스:윈더러스트]';
  insert into release_archive.migrations(id) values('wanderlust-reset-v1');
 end if;
end $$;
-- Old deployed clients must not recreate votes in the old version namespace.
alter table public.votes drop constraint if exists votes_wanderlust_version;
alter table public.votes add constraint votes_wanderlust_version check(version='[루미너스:윈더러스트]');
commit;

-- Verification: immediately after the first execution both counts must be 0.
select 'tier_votes' as collection, count(*) as remaining from public.votes
union all select 'patch_reactions', count(*) from public.patch_reactions;
