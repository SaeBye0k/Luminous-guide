-- Run after supabase/patch-notes.sql in Supabase SQL Editor.
-- Stable ID: re-running updates this note without losing reactions or comments.
insert into public.patch_notes
  (id, title, version, published_on, summary, highlights, content, source_url)
values (
  'b6ac1001-0470-4000-8000-000000000001',
  '10.01b 패치노트',
  '10.01b',
  '2026-10-01',
  '루미너스 런처 0.4.7 업데이트. 블럭·주민 의상 렌더링 오류와 이동 시 버벅임을 수정하고, 데미지 텍스트 연출을 개선했습니다.',
  array[
    '문·유리·개구리 전등 등 블럭과 주민 의상 렌더링 오류 수정',
    '이동 시 위치 보간 오차 및 버벅임 수정',
    '데미지 텍스트가 더 화려하게 변경'
  ],
  $patch$루미너스 런처 0.4.7 업데이트!

• 문, 유리, 개구리 전등 등의 다양한 블럭 렌더링 오류 수정
• 주민의 옷이 렌더링 되지 않아서 옷을 입고 있지 않던 오류 수정
• 이동 시 위치 보간 오차 및 버벅임 수정
• 데미지 텍스트가 더 화려하게 변경됨$patch$,
  null
)
on conflict (id) do update set
  title = excluded.title,
  version = excluded.version,
  published_on = excluded.published_on,
  summary = excluded.summary,
  highlights = excluded.highlights,
  content = excluded.content,
  source_url = excluded.source_url;
