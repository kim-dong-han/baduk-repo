# 바둑 AI 기보 분석 — Frontend

기보를 올리면 KataGo 가 분석하고, 사용자는 **바둑판 위에서** 매 수의 승률·집 차이·대안수를 확인한다.

이 저장소는 **프론트엔드만** 담당한다. 분석 엔진과 도메인 로직은 별도의 Spring Boot 백엔드에 있다.

프로젝트의 방향과 원칙은 [`PROJECT.md`](PROJECT.md) 에 있다.

---

## 빠른 시작

```bash
node -v            # 20.19 이상 (권장: .nvmrc = 24)
npm install
cp .env.example .env.local   # 값 확인 후 수정
npm run dev                  # http://localhost:5173
```

백엔드가 아직 없어도 된다. `.env.local` 의 `VITE_ENABLE_API_MOCKING=true` 면 MSW 가 목 API 를 띄운다.

## 스크립트

| 명령                    | 설명                                               |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | 개발 서버 (Vite, 5173)                             |
| `npm run build`         | 타입 검사 후 프로덕션 빌드 → `dist/`               |
| `npm run preview`       | 빌드 결과를 로컬에서 확인                          |
| `npm run lint`          | ESLint (flat config, 타입 인식 규칙 포함)          |
| `npm run typecheck`     | `tsc --noEmit`                                     |
| `npm run format`        | Prettier 일괄 포맷                                 |
| `npm test`              | Vitest 단위/컴포넌트 테스트                        |
| `npm run test:coverage` | 커버리지 리포트                                    |
| `npm run test:e2e`      | Playwright E2E (최초 1회 `npx playwright install`) |
| `npm run validate`      | lint + typecheck + test (커밋 전 권장)             |

## 기술 스택

| 영역            | 선택                                       |
| --------------- | ------------------------------------------ |
| 빌드            | Vite 8                                     |
| UI              | React 19                                   |
| 라우팅          | React Router 8 (data router, SPA)          |
| 언어            | TypeScript 6 (strict)                      |
| 스타일          | Tailwind CSS 4 + CSS Variables 디자인 토큰 |
| 컴포넌트        | shadcn/ui (필요한 primitive 만 선택 사용)  |
| 서버 상태       | TanStack Query 5                           |
| 클라이언트 상태 | Zustand 5                                  |
| 검증            | Zod 4                                      |
| 폼              | React Hook Form 7 + `@hookform/resolvers`  |
| 차트            | Recharts (복잡한 것) / SVG·CSS (단순한 것) |
| 바둑판          | Canvas 2D (직접 구현)                      |
| 목 데이터       | MSW 2                                      |
| 테스트          | Vitest + Testing Library, Playwright       |

버전 선택의 근거는 [`docs/adr/`](docs/adr) 에 기록했다.

## 디렉터리

```
src/
├─ main.tsx     진입점 (목 API 기동 → 렌더)
├─ app/         앱 조립: app.tsx · providers.tsx · router.tsx
├─ routes/      라우트 컴포넌트 (화면)
├─ components/  여러 기능이 재사용하는 UI
│  ├─ ui/         기본 요소 (shadcn primitive 포함)
│  ├─ layout/     헤더 · 네비게이션 · 페이지 셸
│  ├─ board/      바둑판 (렌더링 · 좌표 · 입력)
│  └─ chart/      데이터 시각화
├─ features/    특정 기능의 UI + 로직: auth · game · analysis · gallery · notes
├─ hooks/       여러 feature 가 공유하는 훅
├─ lib/
│  ├─ api/        HTTP 클라이언트 · 에러 타입 · QueryClient
│  ├─ config/     환경변수 (Zod 검증)
│  └─ design/     JS/Canvas 에서 디자인 토큰 읽기
├─ stores/      전역 Zustand store (꼭 필요한 것만)
├─ types/       여러 곳에서 공유하는 타입
├─ mocks/       MSW 핸들러 · worker · server
└─ styles/      tokens.css · globals.css

tests/          unit/ · e2e/ · setup.ts
docs/           아키텍처 · 디자인 시스템 · ADR
public/         정적 파일 (MSW service worker 포함)
index.html      Vite 진입 HTML
```

## 지켜야 할 규칙

1. **화면에서 `fetch` 를 직접 호출하지 않는다.**
   `features/<feature>/api` → `features/<feature>/hooks` → 컴포넌트 순으로 내려온다.
   ESLint 가 `src/routes`·`src/components` 에서의 직접 `fetch` 를 막는다.
2. **서버 응답은 항상 Zod 로 검증한다.** `apiRequest({ schema })` 를 통과한 값만 타입을 신뢰한다.
3. **색·크기·간격을 컴포넌트에 하드코딩하지 않는다.** 디자인 토큰만 쓴다. Tailwind 기본 색 팔레트는 지워 두었다.
4. **전역 상태를 기본값으로 삼지 않는다.** 서버에서 온 데이터는 TanStack Query 가 갖고, Zustand 는 "지금 몇 수째를 보고 있는가" 같은 화면 상태만 갖는다.
5. **API 가 없다고 UI 를 멈추지 않는다.** MSW 핸들러를 먼저 쓴다.
6. **shadcn/ui 의 기본 디자인을 서비스 디자인으로 쓰지 않는다.** primitive 는 접근성·동작만 빌려오고 외형은 토큰으로 덮는다.

## 환경변수

`.env.example` 을 복사해 `.env.local` 을 만든다.

| 키                        | 용도                    |
| ------------------------- | ----------------------- |
| `VITE_API_BASE_URL`       | Spring Boot 백엔드 주소 |
| `VITE_APP_URL`            | 프론트엔드 자신의 주소  |
| `VITE_ENABLE_API_MOCKING` | MSW 목 API 사용 여부    |

> **이 프로젝트는 브라우저에서만 도는 SPA 다.** `VITE_` 로 시작하는 값은 전부 번들에 들어가 사용자에게 노출된다. **Secret 을 넣지 않는다.** 서버 전용 Secret 은 Spring Boot 백엔드가 갖는다.

## 배포

| 대상     | 위치                         |
| -------- | ---------------------------- |
| Frontend | Vercel (`dist/` 정적 호스팅) |
| Backend  | Render (Spring Boot)         |
| Database | Neon PostgreSQL              |

`vercel.json` 이 SPA fallback(모든 경로 → `index.html`)과 정적 자산 캐시 헤더를 설정한다. 이게 없으면 `/design-system` 같은 주소를 새로고침했을 때 404 가 난다.

Vercel 프로젝트에도 위 환경변수를 등록해야 한다. `VITE_ENABLE_API_MOCKING` 은 프로덕션에서 반드시 `false` 다. 값이 `true` 가 아니면 MSW 는 번들에서 통째로 빠진다(약 400 kB).

브라우저가 Render 의 백엔드를 직접 호출하므로 백엔드 쪽 CORS 에 Vercel 도메인(프리뷰 포함)이 허용되어 있어야 한다.

## 문서

- [`PROJECT.md`](PROJECT.md) — 프로젝트 원칙과 개발 순서
- [`docs/architecture.md`](docs/architecture.md) — 레이어 구조와 코드 배치 규칙
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — 디자인 토큰과 바둑판 시각 언어
- [`docs/COMPONENT_RULES.md`](docs/COMPONENT_RULES.md) — 컴포넌트 분리 기준과 Page 구조
- [`docs/api-integration.md`](docs/api-integration.md) — 백엔드 연동 · 에러 처리 · 목 API
- [`docs/testing.md`](docs/testing.md) — 테스트 전략
- [`docs/LEGACY_FEATURES.md`](docs/LEGACY_FEATURES.md) — 기존 서비스 기능 분석 (이관 명세)
- [`docs/adr/`](docs/adr) — 기술 선택 기록
