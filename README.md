# 바둑 AI 기보 분석 — Frontend

기보를 올리면 KataGo 가 분석하고, 사용자는 **바둑판 위에서** 매 수의 승률·집 차이·대안수를 확인한다.

이 저장소는 **프론트엔드만** 담당한다. 분석 엔진과 도메인 로직은 기존 Spring Boot 백엔드에 그대로 남는다.

---

## 빠른 시작

```bash
node -v            # 20.9 이상 (권장: .nvmrc = 24)
npm install
cp .env.example .env.local   # 값 확인 후 수정
npm run dev                  # http://localhost:3000
```

## 스크립트

| 명령                    | 설명                                               |
| ----------------------- | -------------------------------------------------- |
| `npm run dev`           | 개발 서버 (Turbopack)                              |
| `npm run build`         | 프로덕션 빌드 + 타입 검사                          |
| `npm start`             | 빌드 결과 실행                                     |
| `npm run lint`          | ESLint (flat config)                               |
| `npm run typecheck`     | `tsc --noEmit`                                     |
| `npm run format`        | Prettier 일괄 포맷                                 |
| `npm test`              | Vitest 단위/컴포넌트 테스트                        |
| `npm run test:coverage` | 커버리지 리포트                                    |
| `npm run test:e2e`      | Playwright E2E (최초 1회 `npx playwright install`) |
| `npm run validate`      | lint + typecheck + test (커밋 전 권장)             |

## 기술 스택

| 영역            | 선택                                       |
| --------------- | ------------------------------------------ |
| 프레임워크      | Next.js 16 (App Router) · React 19         |
| 언어            | TypeScript 6 (strict)                      |
| 스타일          | Tailwind CSS 4 + CSS Variables 디자인 토큰 |
| UI              | shadcn/ui (필요한 primitive 만 선택 사용)  |
| 서버 상태       | TanStack Query 5                           |
| 클라이언트 상태 | Zustand 5                                  |
| 검증            | Zod 4                                      |
| 폼              | React Hook Form 7 + `@hookform/resolvers`  |
| 차트            | Recharts (복잡한 것) / SVG·CSS (단순한 것) |
| 바둑판          | Canvas 2D (직접 구현)                      |
| 테스트          | Vitest + Testing Library, Playwright       |
| 목 API          | MSW 2                                      |

버전 선택의 근거(왜 TypeScript 7 이 아니라 6 인지 등)는 [`docs/adr/0001-package-versions.md`](docs/adr/0001-package-versions.md) 에 기록했다.

## 디렉터리

```
src/
├─ app/         Next.js App Router (라우팅 · layout · page)
├─ components/  도메인에 종속되지 않는 재사용 UI
│  ├─ ui/         shadcn primitive 가 설치되는 곳
│  └─ layout/     헤더 · 셸 등 레이아웃 조각
├─ features/    기능 단위 수직 슬라이스 (api · hooks · components · model)
├─ hooks/       여러 feature 가 공유하는 훅
├─ lib/         프레임워크 경계 코드
│  ├─ api/        HTTP 클라이언트 · 에러 타입 · QueryClient
│  └─ config/     환경변수 (Zod 검증)
├─ stores/      전역 Zustand store (꼭 필요한 것만)
├─ types/       여러 곳에서 공유하는 타입
├─ mocks/       MSW 핸들러 · worker · server
└─ styles/      globals.css (디자인 토큰)

tests/          unit/ · e2e/ · setup.ts
docs/           아키텍처 · 디자인 시스템 · ADR
public/         정적 파일 (MSW service worker 포함)
```

> `app/`·`components/` 등을 `src/` 아래에 둔 것은 설정 파일이 몰려 있는 루트와 애플리케이션 코드를 분리하기 위해서다. Next.js 가 공식 지원하는 배치다.

## 지켜야 할 규칙

1. **페이지·컴포넌트에서 `fetch` 를 직접 호출하지 않는다.**
   `features/<feature>/api` → `features/<feature>/hooks` → 컴포넌트 순으로 내려온다.
   ESLint 가 `src/app`·`src/components` 에서의 직접 `fetch` 를 막는다.
2. **서버 응답은 항상 Zod 로 검증한다.** `apiRequest({ schema })` 를 통과한 값만 타입을 신뢰한다.
3. **색상 값을 컴포넌트에 하드코딩하지 않는다.** `globals.css` 의 의미 기반 토큰(`bg-board-surface`, `text-move-blunder` …)만 쓴다.
4. **전역 상태를 기본값으로 삼지 않는다.** 서버에서 온 데이터는 TanStack Query 가 갖고, Zustand 는 "지금 몇 수째를 보고 있는가" 같은 화면 상태만 갖는다.
5. **shadcn/ui 의 기본 디자인을 서비스 디자인으로 쓰지 않는다.** primitive 는 접근성·동작만 빌려오고 외형은 토큰으로 덮는다.

## 환경변수

`.env.example` 을 복사해 `.env.local` 을 만든다. 실제 Secret 값은 저장소에 커밋하지 않는다.

| 키                               | 용도                                 |
| -------------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL`       | Spring Boot 백엔드 주소              |
| `NEXT_PUBLIC_APP_URL`            | 프론트엔드 자신의 주소 (metadata·OG) |
| `NEXT_PUBLIC_ENABLE_API_MOCKING` | MSW 목 API 사용 여부                 |

서버 전용 Secret 은 `NEXT_PUBLIC_` 을 붙이지 않고 `src/lib/config/server-env.ts` 스키마에 등록한다.

## 배포

| 대상     | 위치                 |
| -------- | -------------------- |
| Frontend | Vercel               |
| Backend  | Render (Spring Boot) |
| Database | Neon PostgreSQL      |

Vercel 프로젝트에도 위 환경변수를 동일하게 등록해야 한다. `NEXT_PUBLIC_ENABLE_API_MOCKING` 은 프로덕션에서 반드시 `false` 다.

## 문서

- [`docs/architecture.md`](docs/architecture.md) — 레이어 구조와 코드 배치 규칙
- [`docs/design-system.md`](docs/design-system.md) — 디자인 토큰과 바둑판 시각 언어
- [`docs/api-integration.md`](docs/api-integration.md) — 백엔드 연동 · 에러 처리 · 목 API
- [`docs/testing.md`](docs/testing.md) — 테스트 전략
- [`docs/adr/0001-package-versions.md`](docs/adr/0001-package-versions.md) — 패키지 버전 선택 근거
