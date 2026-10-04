-- Run after supabase/patch-notes.sql in Supabase SQL Editor.
-- Stable ID preserves this patch's reactions/comments when re-run.
insert into public.patch_notes
  (id, title, version, published_on, summary, highlights, content, source_url)
values (
  'b6ac1003-0000-4000-8000-000000000001',
  '10.03 패치노트',
  '10.03',
  '2026-10-03',
  '풍압술사의 자멸 피해 기준과 번개가 잠든 검의 특수 공격·장비 스킬을 변경했습니다. 전격의 외침·타이어 효과를 상향하고 잠의 수련소 훈련장을 확장했습니다.',
  array[
    '풍압술사 자멸 피해 기준 변경 및 번개가 잠든 검 특수 공격·장비 스킬 조정',
    '전격의 외침 피해 계수 100% → 140%, 타이어 회복량 50% → 150%',
    '잠의 수련소 훈련장 확장'
  ],
  $patch$풍압술사
• 자멸 피해가 보조속성이 아닌 주속성 기반으로 들어가도록 변경

번개가 잠든 검
• 특수 공격의 피해가 지연되어서 들어가던 효과 삭제
• 특수 공격의 방향이 정면으로 고정되지 않음. 적이 공중 혹은 더 낮은 위치에 있을 경우에도 추격
• 장비 스킬: 소모한 공명 1pt당 소모 에너지 10pt → 5pt
• 장비 스킬 일부 효과 변경

[이전]
64pt를 초과하는 획득량 1pt당 8%씩 5s 동안 번개 속성 피해가 증가합니다.

[변경]
소모한 에너지가 300pt를 초과한다면 초과량 1pt당 1%씩 6s 동안 번개 속성 피해가 증가하며 5s 동안 에너지 회복 효율이 400% 증가합니다.

전격의 외침
• 방출로 가하는 스킬 피해 계수 100% → 140%

타이어
• 입은 자멸 피해의 50% 만큼 회복 → 150% 만큼 회복

잠의 수련소
• 훈련장 확장$patch$,
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
