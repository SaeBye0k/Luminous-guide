-- Store a build with the guide so the attachment remains independent of build posts.
alter table public.guide_posts add column if not exists build_snapshot jsonb;
alter table public.guide_posts add constraint guide_posts_build_snapshot_valid
  check (build_snapshot is null or
    (jsonb_typeof(build_snapshot) = 'object' and octet_length(build_snapshot::text) <= 16000));
