# [루미너스:윈더러스트] 적용

운영 투표 초기화는 아래 SQL로 별도 적용합니다.
이번 변경은 저장소 코드와 아래 운영 마이그레이션을 함께 적용해야 합니다.

## 데이터

기준: https://app.notion.com/p/luminous-rpg/RPG-04815989269e46d6b1a8ab186328ebdd

`python scripts/sync-notion.py --cache /tmp/luminous-source-YYYY-MM-DD`로 공개 데이터와
고유기·특성·초월 설명을 갱신합니다. 날짜별 새 캐시를 사용하면 원본을 다시 조회합니다.
이름에 `미완` 또는 `추가 전`이 있는 항목을 제외하고, 결과와 제외 목록을
`lib/notion-sync-report.json`에 기록합니다. 공개 데이터 읽기만 수행하며 Notion은 수정하지 않습니다.
기존 무기·유물 ID와 기존 직업 ID, 설명이 동일한 특성 ID는 보존합니다.
운영자가 별도로 제공한 구리 갑옷은 `catalog-supplements.ts`에서 유지합니다. 새 직업은 원본 페이지 ID를 사용합니다.
기존 로컬 이미지가 있는 항목은 이미지를 유지하고, 신규 항목은 분류 아이콘을 사용합니다.

## Xbox 로그인

사이트는 Xbox 로그인만 제공합니다. Microsoft 개인 계정 인증 후 별도의
Xbox OAuth 동의와 User Token → XSTS 교환으로 XUID를 확인합니다.
Google 로그인 버튼 및 수동 Google 계정 연결 흐름은 제공하지 않습니다.
Supabase Google 공급자는 대시보드에서 비활성화합니다.
기존 게시글·댓글은 삭제하지 않습니다. 동일 이메일의 공급자 자동 연결 여부는
Supabase Auth 정책에 따르며, 별도의 수동 병합은 수행하지 않습니다.

- Microsoft 앱 Client ID: `3e0076e5-bf57-4ba2-9377-c9f87b63c796`
- Azure Tenant URL: `https://login.microsoftonline.com/common` (Supabase 기본 발급자 검증 경로). 앱의 지원 계정 유형은 모든 Entra 테넌트 + 개인 Microsoft 계정으로 설정하며, 별도 Xbox OAuth는 consumers 엔드포인트를 사용합니다.
- Web redirect URI: `https://ymmwzujuhwvmadynkerc.supabase.co/auth/v1/callback`
- Web redirect URI: `https://ymmwzujuhwvmadynkerc.supabase.co/functions/v1/verify-xbox`
- Edge Secrets: `XBOX_CLIENT_ID`, `XBOX_CLIENT_SECRET`, `XBOX_SITE_URL`
- `XBOX_SITE_URL`: `https://saebye0k.github.io/Luminous-guide/`
- Azure 토큰 구성에 email optional claim을 추가합니다.
- Xbox 계정 검증 전에는 사이트에서 로그인 완료로 취급하지 않습니다.
- `supabase/xbox-enforce.sql`은 검증된 Xbox 계정에만 insert/update/delete를 허용합니다.
- 비밀 값은 저장소·문서에 기록하지 않습니다.

## 투표 초기화와 버전

기존 스키마 및 `armor-and-modes.sql`, `patch-notes.sql` 설정이 적용된 운영 DB에서
`supabase/wanderlust-reset.sql`을 실행합니다.

- 과거 모든 버전의 PVE/PVP 티어 투표와 패치 좋아요/아쉬워요를 초기화합니다.
- 기존 기록은 API에 노출되지 않는 `release_archive` 스키마에 한 번만 백업합니다.
- 댓글·닉네임·공략·빌드·개인 티어표는 삭제하지 않습니다.
- 빌드·공유 티어표·패치의 버전 속성을 `[루미너스:윈더러스트]`로 통일합니다.
- 재실행해도 새로 들어온 투표를 지우지 않습니다.
- 구버전 클라이언트가 이전 버전 키로 투표를 다시 쌓는 것을 DB 제약으로 막습니다.

SQL 마지막 검증 결과가 초기 실행 직후 두 항목 모두 0인지 확인합니다.
새 사이트를 배포하고 투표·분포·최근 커뮤니티 픽이 비어 있는지 확인한 뒤 새 표를 테스트합니다.
개인 브라우저의 기존 평가/좋아요 캐시도 새 사이트를 열 때 비웁니다.

## 운영 적용 기록

- 2026-10-23: 기존 티어 투표 376건과 패치 평가 1건을 비공개 백업 후 초기화했습니다.
- 초기화 직후 투표 0건, 패치 평가 0건을 확인했습니다.
- 댓글 42개, 프로필 8개, 공략 1개, 빌드 4개, 공유 티어표 3개를 보존했습니다.
- 빌드·공유 티어표·패치노트의 버전을 통일했습니다.
- 첫 데이터 배포는 Google 로그인을 유지했으며, 후속 인증 배포는 Xbox 전용으로 전환합니다.
- 공개 집계 백업: `docs/backups/vote-counts-before-wanderlust-2026-10-23.txt`.
  이 파일은 계정과 개별 투표 시각을 포함하지 않으며, 원본 백업은 비공개 DB에 보관합니다.

## Xbox 닉네임 자동 동기화

`supabase/xbox-gamertag.sql`을 기본 Xbox 스키마 이후 적용합니다.
서버가 Xbox 토큰의 게이머태그 또는 공식 Xbox 프로필의 Gamertag를 확인하여
계정 연결과 프로필 닉네임 저장을 하나의 트랜잭션에서 처리합니다.
새 Microsoft 로그인마다 Xbox 확인을 다시 수행하여 이름을 갱신합니다.
기존 연결은 닉네임 동기화 배포 이후 첫 접속에서 Xbox 확인을 다시 진행합니다.
사이트에서 닉네임 수동 변경을 제공하지 않으며 XUID가 계정의 고유 식별자입니다.
기존 닉네임 중복·길이 제약은 유지합니다. 충돌 시 저장을 거절하며 기존 기록을 덮어쓰지 않습니다.
베드락 Xbox 게이머태그 기준이며 Java 에디션 프로필명은 별도입니다.
