-- Run after supabase/patch-notes.sql in Supabase SQL Editor.
-- Stable ID preserves reactions and comments when re-run.
insert into public.patch_notes
  (id, title, version, published_on, summary, highlights, content, source_url)
values (
  'b6ac1007-0000-4000-8000-000000000001',
  '10.07a 패치노트',
  '10.07a',
  '2026-10-07',
  '언덕마을에 이상한 모험가들이 돌아다닙니다.',
  array['언덕마을에 이상한 모험가들이 돌아다닙니다.'],
  '• 언덕마을에 이상한 모험가들이 돌아다닙니다.',
  null
)
on conflict (id) do update set
  title = excluded.title,
  version = excluded.version,
  published_on = excluded.published_on,
  summary = excluded.summary,
  highlights = excluded.highlights,
  content = excluded.content,
  source_url = excluded.source_url
returning id, title, version;
