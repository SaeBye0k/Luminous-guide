# LUMINOUS · 커뮤니티 공략 아카이브

Next.js App Router 기반의 정적 사이트입니다. GitHub Pages에 배포할 수 있으며 홈, 게임 데이터베이스, 버전별 티어, 개인 티어표 제작, 공략 화면을 포함합니다.

## 로컬 실행

Node.js 22 이상이 필요합니다.

```sh
npm ci
npm run dev
```

정적 배포 결과 확인:

```sh
npm run build
npm start
```

빌드 결과는 `out/`에 생성됩니다.

## GitHub Pages 배포

1. 이 폴더의 내용을 GitHub 저장소 `main` 브랜치에 올립니다.
2. 저장소 **Settings → Pages → Build and deployment**에서 Source를 **GitHub Actions**로 선택합니다.
3. `main`에 push하면 `.github/workflows/deploy-pages.yml`이 자동으로 빌드하고 배포합니다.

워크플로는 사용자/조직 사이트(`계정.github.io`)와 프로젝트 사이트(`계정.github.io/저장소명`)의 경로를 자동으로 구분합니다.

## 관리자 콘텐츠 수정

GitHub Pages는 서버나 비공개 관리자 세션을 제공하지 않습니다. 사이트 안에서 직접 저장하는 관리자 편집 기능은 배포판에서 제거했습니다. 실제 수정 권한은 GitHub 저장소 쓰기 권한으로 제한됩니다.

- 무기 이름, 설명, 등급, 집계 데이터: `lib/game-data.ts`
- 무기 이미지: `public/`에 파일을 추가한 뒤 해당 항목의 `imageUrl`을 설정
- 사이트 문구와 화면: `components/guide-app.tsx`

저장소 관리자만 변경을 `main`에 반영할 수 있으므로 일반 방문자는 무기 정보나 이미지를 바꿀 수 없습니다. 변경 후 push하면 Pages가 자동 갱신됩니다.

## 배포판 동작

- 커뮤니티 픽은 등록된 무기를 5초마다 순환합니다.
- 이전/다음, 일시정지, 항목 선택을 지원합니다.
- 마우스를 올리거나 키보드 포커스가 있으면 자동 순환이 잠시 멈춥니다.
- 동작 줄이기 설정을 사용하는 기기에서는 자동 순환을 끕니다.
- 개인 티어표 초안과 저장본은 방문자의 브라우저에만 저장됩니다.

GitHub Pages만으로는 여러 사용자가 공유하는 투표·댓글·좋아요를 안전하게 저장할 수 없습니다. 해당 기능을 실제로 운영하려면 별도의 인증·데이터베이스 API가 필요합니다.

## Google 로그인과 투표 설정

이 프로젝트는 Supabase Google 로그인과 계정당 한 표 투표 구조를 포함합니다.

1. Supabase에서 프로젝트를 생성합니다.
2. Supabase **SQL Editor**에서 `supabase/schema.sql`과 `supabase/nickname-comments.sql`을 차례로 실행합니다.
3. **Authentication → Providers → Google**에서 Google 로그인을 활성화합니다.
4. **Authentication → URL Configuration**의 Site URL을
   `https://saebye0k.github.io/Luminous-guide/`로 설정하고 같은 주소를 Redirect URLs에도 추가합니다.
5. GitHub 저장소 **Settings → Secrets and variables → Actions**에 다음 Repository secret을 추가합니다.
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. 새 커밋을 Push하거나 Actions에서 배포 작업을 다시 실행합니다.

공개용 anon 키는 브라우저에 포함되는 값입니다. `service_role` 키는 절대 GitHub나 프론트엔드에 넣지 마세요. 중복 투표는 데이터베이스 기본 키 `(user_id, entry_id, version)`로 차단하며, 다시 투표하면 기존 행을 갱신합니다.

## 닉네임과 댓글

- 로그인한 사용자는 상단의 **닉네임 설정**에서 2~20자의 고유 닉네임을 등록할 수 있습니다.
- 무기·직업·유물·던전 상세 화면과 공략, 저장한 티어표의 **모험가의 의견**에 댓글을 남길 수 있습니다.
- 댓글에는 이메일 대신 설정한 닉네임이 표시됩니다.
- 닉네임과 댓글은 Supabase에 저장되며, Row Level Security로 본인의 닉네임과 댓글만 작성·수정할 수 있습니다.
