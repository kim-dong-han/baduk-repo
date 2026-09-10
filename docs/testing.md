# 테스트 전략

## 나누는 기준

| 층       | 도구                           | 대상                                               |
| -------- | ------------------------------ | -------------------------------------------------- |
| 단위     | Vitest                         | 도메인 계산 (`features/*/model`), 유틸, Zod 스키마 |
| 컴포넌트 | Vitest + Testing Library + MSW | 훅과 UI 의 상호작용, 로딩·에러·빈 상태             |
| E2E      | Playwright                     | 업로드 → 분석 → 리뷰로 이어지는 사용자 흐름        |

**바둑 규칙 계산(활로, 따냄, 패, 좌표 변환)과 SGF 파싱은 단위 테스트를 반드시 쓴다.** 여기가 틀리면 화면 전체가 조용히 틀린다.

## 실행

```bash
npm test              # 단위 + 컴포넌트
npm run test:watch
npm run test:coverage
npm run test:e2e      # 최초 1회: npx playwright install
```

Playwright 는 브라우저 바이너리를 따로 받아야 한다. CI 에서는 `npx playwright install --with-deps chromium` 을 먼저 실행한다.

## 설정

- `vite.config.ts` 의 `test` 키 — jsdom 환경, `tests/setup.ts` 자동 로드, `@/` alias 는 tsconfig paths 를 그대로 쓴다. 테스트용 `VITE_*` 값이 여기에 주입되어 있으므로 테스트가 `.env.local` 에 의존하지 않는다. 앱 설정과 테스트 설정을 한 파일에 두어 별칭·플러그인이 어긋나지 않게 한다.
- `tests/setup.ts` — jest-dom matcher, Testing Library 자동 cleanup, MSW 서버 기동. **핸들러가 없는 요청은 실패한다**(`onUnhandledRequest: 'error'`). 실수로 실제 백엔드를 때리는 테스트를 막기 위해서다.
- `playwright.config.ts` — `npm run dev`(5173)를 자동 기동하고, Desktop Chrome 과 Pixel 7(터치) 두 프로젝트로 돈다. 바둑판은 터치 환경에서도 동작해야 한다.

SPA 이므로 **딥링크 새로고침**을 반드시 E2E 로 지킨다. `vercel.json` 의 fallback 이 깨지면 `/design-system` 같은 주소가 프로덕션에서만 404 가 나고 로컬에서는 멀쩡하다.

## 테스트 파일 위치

- 도메인 로직 옆에 두는 것을 기본으로 한다: `features/game-board/model/liberties.test.ts`
- 접근성은 lint 로 잡지 않는다(`eslint-plugin-jsx-a11y` 가 ESLint 10 을 지원하지 않는다). 대신 화면이 생기면 `@axe-core/playwright` 를 E2E 에 붙인다.
- 여러 모듈에 걸치는 것은 `tests/unit/` 에 둔다.
- E2E 는 `tests/e2e/*.spec.ts`.

## 무엇을 테스트하지 않는가

- shadcn/ui primitive 자체의 동작
- Canvas 픽셀 결과. 대신 **그리기 직전의 계산 결과**(어느 좌표에 무엇을 어떤 색으로 그릴지)를 순수 함수로 분리해 그것을 테스트한다.
- 스타일 값. 디자인 토큰이 적용됐는지는 사람이 본다.

## 테스트에서 서버 상태 다루기

컴포넌트 테스트에서 QueryClient 는 매 테스트마다 새로 만들고 `retry: false` 로 둔다. 재시도가 켜져 있으면 에러 상태 테스트가 느려지고 불안정해진다. 공용 렌더 헬퍼가 필요해지면 `tests/utils/` 에 만든다.
