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
