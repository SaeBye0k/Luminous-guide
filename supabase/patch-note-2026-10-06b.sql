-- Run after supabase/patch-notes.sql in Supabase SQL Editor.
-- Stable ID preserves reactions and comments when re-run.
insert into public.patch_notes
  (id, title, version, published_on, summary, highlights, content, source_url)
values (
  'b6ac1006-0000-4000-8000-000000000002',
  '10.06b 패치노트',
  '10.06b',
  '2026-10-06',
  '신규 유물 모순된 토템·황금 고블린이 추가됐습니다. NPC가 거래소에 매물을 올리도록 변경하고 월드 퀘스트 NPC들의 말투 불일치를 수정했습니다.',
  array[
    '신규 유물: 모순된 토템 — 영혼의 안식처, 황금 고블린 — 언덕마을 시장',
    'NPC 거래소 매물 등록 추가 · 상품 및 가격 규칙은 비공개',
    '월드 퀘스트 NPC들의 말투 불일치 수정'
  ],
  $patch$신규 유물!
• 모순된 토템 → 영혼의 안식처
• 황금 고블린 → 언덕마을 시장

거래소
• 이제 NPC가 거래소에 매물을 올립니다!
• 올리는 상품과 가격 규칙은 시세 조작을 방지하기 위해 알리지 않겠습니다.

월드 퀘스트
• NPC들의 말투 불일치 수정$patch$,
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
