-- Apply only after Xbox OAuth is configured and the new site is deployed.
begin;
-- Restrictive policies combine with the existing ownership policies.
-- Public reads stay public; a legacy Google session cannot bypass Xbox checks.
do $$
declare target text;
begin
 foreach target in array array['votes','profiles','comments','guide_posts','build_posts','tier_lists','patch_reactions'] loop
  if to_regclass('public.' || target) is not null then
   execute format('drop policy if exists "Xbox required to insert" on public.%I',target);
   execute format('create policy "Xbox required to insert" on public.%I as restrictive for insert to authenticated with check(public.has_verified_xbox())',target);
   execute format('drop policy if exists "Xbox required to update" on public.%I',target);
   execute format('create policy "Xbox required to update" on public.%I as restrictive for update to authenticated using(public.has_verified_xbox()) with check(public.has_verified_xbox())',target);
   execute format('drop policy if exists "Xbox required to delete" on public.%I',target);
   execute format('create policy "Xbox required to delete" on public.%I as restrictive for delete to authenticated using(public.has_verified_xbox())',target);
  end if;
 end loop;
end $$;
commit;
