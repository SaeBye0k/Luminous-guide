-- Permit authors to update their own builds without changing ownership.
drop policy if exists "Users update own builds" on public.build_posts;
create policy "Users update own builds" on public.build_posts
for update to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant update (title, job_id, armor_id, trait_ids, inventory_ids, tags, content, version)
on public.build_posts to authenticated;
drop policy if exists "Users delete own builds" on public.build_posts;
create policy "Users delete own builds" on public.build_posts
for delete to authenticated using (auth.uid() = user_id);
grant delete on public.build_posts to authenticated;
