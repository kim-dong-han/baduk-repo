# ADR 0002 — Next.js 에서 Vite SPA 로

- 상태: 채택
- 날짜: 2026-09-10
- 대체: [ADR 0001](0001-package-versions.md) 의 `next` 항목

## 배경

초기 세팅은 Next.js 16 App Router 로 했다. 이후 `PROJECT.md` 가 프로젝트 헌장으로 정리되면서 Frontend Stack 이 **React 19 + TypeScript + Vite + React Router + CSS** 로 명시되었다. 두 가지가 충돌해 결정이 필요했다.

## 결정

`PROJECT.md` 를 따라 **Vite + React Router SPA** 로 옮긴다. 스타일은 Tailwind CSS 4 를 유지한다.

### Vite 를 고른 이유

이 프로젝트의 구조에서 Next.js 가 주는 것이 적다.

- 백엔드가 별도 Spring Boot 이고 인증이 **JWT** 다. Next 서버 컴포넌트에서 데이터를 가져오려면 토큰을 쿠키에 심고 서버 fetch 로 넘기는 층이 하나 더 필요하다. 그렇게 하지 않으면 결국 클라이언트에서 부르게 되는데, 그러면 Next 를 쓸 이유가 사라진다.
- 핵심 화면(바둑판, 수순 이동, 분석 오버레이)이 전부 클라이언트 상호작용이다. 서버 렌더링해서 얻을 것이 거의 없다.
- 데이터 소유권이 한 곳(TanStack Query)으로 정리된다. 서버/클라이언트 두 벌의 데이터 경로가 생기지 않는다.

**포기하는 것:** 공개 기보 페이지의 SSR/SEO. 지금은 로그인 뒤에서 쓰는 화면이 대부분이라 문제되지 않는다. 나중에 공개 기보 공유가 중요해지면 그때 다시 판단한다.

### 지금 옮긴 이유

소스가 18개뿐이고 화면 구현 전이다. 가장 공들인 `tokens.css`(디자인 토큰)는 순수 CSS 변수라 그대로 넘어왔다. 나중에 옮기면 화면 수만큼 비용이 붙는다.

### Tailwind 를 유지한 이유

`PROJECT.md` 의 "CSS" 는 CSS-in-JS 를 쓰지 않는다는 뜻으로 읽었고, 사용자가 유지를 택했다. Tailwind 도 결국 CSS 이며, 이미 디자인 토큰이 `@theme` 로 유틸리티에 연결되어 있다. 기본 팔레트를 지워 둔 가드(`--color-*: initial`)도 함께 유지된다.

## 바뀐 것

|             | 전                              | 후                                                 |
| ----------- | ------------------------------- | -------------------------------------------------- |
| 빌드        | Next 16 (Turbopack)             | Vite 8                                             |
| 라우팅      | App Router (파일 기반)          | React Router 8 data router                         |
| 진입        | `src/app/layout.tsx`            | `index.html` + `src/main.tsx`                      |
| 화면        | `src/app/**/page.tsx`           | `src/routes/**` (`Component` named export)         |
| 환경변수    | `NEXT_PUBLIC_*`                 | `VITE_*`                                           |
| 서버 Secret | `server-env.ts` + `server-only` | **없음.** SPA 라 가질 수 없다. 백엔드가 갖는다     |
| 배포        | Vercel (Next 런타임)            | Vercel (정적 `dist/` + `vercel.json` SPA fallback) |
| 테스트 설정 | `vitest.config.ts`              | `vite.config.ts` 의 `test` 키                      |

## 딸려온 결정

### ESLint 9 → 10

ADR 0001 에서 ESLint 9 에 묶였던 이유는 `eslint-config-next` 가 끌고 오는 `eslint-plugin-react`(ESLint 10 미지원) 때문이었다. Next 를 걷어내면서 그 제약이 사라져 **ESLint 10.10.0** 으로 올렸다. "no longer supported" deprecation 경고도 함께 사라졌다.

대신 `typescript-eslint` 의 `recommendedTypeChecked` 를 켰다. 옮기자마자 실제 문제 3건을 잡았다(불필요한 타입 단언, 상수 조건식, 프로젝트 밖 파일).

### `eslint-plugin-jsx-a11y` 제외

이 플러그인은 2024년 10월 이후 릴리스가 없고 ESLint 10 을 지원하지 않는다. npm 이 peer 충돌로 설치를 거부한다.

미유지보수 플러그인 하나 때문에 툴체인 전체를 EOL 버전에 묶는 것은 손해라고 판단해 제외했다. 접근성은 두 가지로 대신한다.

- `docs/DESIGN_SYSTEM.md` 의 리뷰 체크리스트
- 화면이 생기면 `@axe-core/playwright` 를 E2E 에 붙인다 (lint 보다 실제 렌더 결과를 검사하므로 더 정확하다)

플러그인이 ESLint 10 을 지원하면 다시 넣는다.

### TypeScript 는 6 유지

`typescript-eslint@8.70.0` 의 peer 가 여전히 `<6.1.0` 이다. ADR 0001 의 판단이 그대로 유효하다.

## 번들에서 빼둔 것

`import.meta.env` 값은 빌드 시점에 문자열로 치환된다. 이 성질을 이용해 두 가지를 프로덕션 번들에서 통째로 뺐다.

- **MSW(약 400 kB)** — `main.tsx` 가 `import.meta.env.VITE_ENABLE_API_MOCKING !== 'true'` 로 먼저 끊는다. `env.ts` 의 Zod 를 거치면 번들러가 죽은 가지를 알아보지 못하므로 여기서만 원시 값을 직접 본다. 플래그를 켜고 빌드하면 목 데이터로 도는 프리뷰 배포를 만들 수 있다.
- **React Query devtools(약 68 kB)** — `import.meta.env.DEV` 삼항으로 감쌌다.

플래그를 끈 프로덕션 빌드 기준 첫 진입 번들은 340 kB (gzip 107 kB) 다.

## 되돌아볼 시점

- 공개 기보 페이지의 SEO 가 실제로 필요해질 때 → SSR 재검토
- `eslint-plugin-jsx-a11y` 가 ESLint 10 을 지원할 때 → 재도입
- `typescript-eslint` 가 TypeScript 7 을 지원할 때 → TS 7
