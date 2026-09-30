-- Existing builds retain an empty trait selection.
alter table public.build_posts add column if not exists trait_ids text[] not null default '{}';
alter table public.build_posts drop constraint if exists build_posts_trait_ids_check;
alter table public.build_posts add constraint build_posts_trait_ids_check
check (cardinality(trait_ids) <= 3 and array_position(trait_ids, null) is null and array_position(trait_ids, '') is null);
-- Food slots use the slot_food marker in existing inventory_ids; no inventory schema change is needed.
