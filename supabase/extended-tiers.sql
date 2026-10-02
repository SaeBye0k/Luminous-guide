-- Run in the Supabase SQL Editor before deploying the extended-tier client.
-- Existing votes, user tier lists, RLS policies and RPCs are preserved.
-- Re-runnable: replace the constraint created by supabase/schema.sql.
begin;
alter table public.votes drop constraint if exists votes_tier_check;
alter table public.votes add constraint votes_tier_check
  check (tier in ('S', 'A', 'B+', 'B', 'C', 'D', 'F'));
commit;
-- No seed rows are needed: tier_lists.slots already stores tier names as JSON.
