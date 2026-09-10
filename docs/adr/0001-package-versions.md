# ADR 0001 — 패키지 버전 선택

- 상태: 일부 대체됨 ([ADR 0002](0002-vite-spa.md))
- 날짜: 2026-09-10

> **갱신:** `next` 와 `eslint` 항목은 ADR 0002 로 대체되었다. Next.js 는 Vite 로,
> ESLint 는 9 에서 10 으로 바뀌었다. TypeScript 6 선택의 근거는 그대로 유효하다.

## 배경

"최신"이 항상 "안정"은 아니다. 초기화 시점에 레지스트리의 `latest` 를 그대로 쓰면 툴체인이 서로 맞지 않는 경우가 있어, 주요 패키지는 근거를 남기고 고른다. 버전은 `^` 없이 정확히 고정한다(재현 가능한 설치).

## 결정

| 패키지      | 레지스트리 `latest` | 선택       | 근거                                                                                    |
| ----------- | ------------------- | ---------- | --------------------------------------------------------------------------------------- |
| next        | 16.3.4              | **16.3.4** | App Router 안정판. React 19 정식 지원.                                                  |
| react       | 19.3.0              | **19.3.0** | Next 16 의 peer 범위와 일치.                                                            |
| typescript  | 7.0.2               | **6.0.3**  | ↓ 아래 설명                                                                             |
| eslint      | 10.10.0             | **9.39.5** | ↓ 아래 설명                                                                             |
| vitest      | 5.0.0               | **4.1.11** | ↓ 아래 설명                                                                             |
| tailwindcss | 4.3.3               | **4.3.3**  | v4 CSS-first 설정. `@theme inline` 으로 디자인 토큰을 그대로 유틸리티에 노출할 수 있다. |
| zod         | 4.6.1               | **4.6.1**  | 최상위 `z.url()` 등 v4 API 사용.                                                        |

### TypeScript 7 이 아니라 6 인 이유

`typescript-eslint@8.70.0`(현재 유일한 안정 라인)의 peer 범위가 `typescript >=4.8.4 <6.1.0` 이다. TypeScript 7(네이티브 포트)을 쓰면 타입 인식 린트 규칙이 동작하지 않는다. 린트를 포기하는 것보다 컴파일러 버전을 한 단계 낮추는 쪽이 낫다.

**해제 조건:** `typescript-eslint` 가 TypeScript 7 을 peer 로 지원하는 안정 버전을 내면 올린다.

### ESLint 10 이 아니라 9 인 이유

처음에 10.10.0 으로 설치했더니 린트가 아예 실행되지 않았다.

```
TypeError: Error while loading rule 'react/display-name':
contextOrFilename.getFilename is not a function
```

`eslint-config-next@16.3.4` → `eslint-plugin-react@7.37.5` 가 ESLint 10 에서 제거된 `context.getFilename()` 을 쓴다. 해당 플러그인의 안정 버전은 peer 가 `^9.7` 까지다(ESLint 10 지원은 `7.8.0-rc.0` 에만 있다).

선택지는 셋이었다.

1. RC 플러그인을 override → 불안정 버전 도입. 기각.
2. `react/*` 규칙 전체 off → 린트 품질 손실. 기각.
3. **ESLint 9.39.5(9.x 마지막 버전)로 고정** → 채택.

`npm install` 시 "no longer supported" deprecation 경고가 뜬다. 알고 있는 트레이드오프다. 지금은 린트가 실제로 도는 쪽이 중요하다.

**해제 조건:** `eslint-plugin-react` 7.8 정식 릴리스, 또는 `eslint-config-next` 가 해당 의존성을 걷어내면 ESLint 10 으로 올린다.

### Vitest 5 가 아니라 4 인 이유

5.0.0 은 릴리스 7일차(2026-09-03)다. 프로젝트 초기 세팅에서 방금 나온 메이저의 회귀를 밟을 이유가 없다. 4.1.11 은 성숙했고 Vite 8 을 지원한다.

**해제 조건:** 5.x 가 몇 번의 패치를 거친 뒤 올린다. 마이그레이션 비용은 낮다.

## 추가로 넣은 패키지와 이유

| 패키지                           | 이유                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------- |
| `server-only`                    | 서버 전용 Secret 파일이 클라이언트 번들에 딸려 들어가면 빌드가 실패하도록 강제           |
| `msw`                            | 백엔드보다 화면을 먼저 개발하기 위한 목 API. 테스트에서도 같은 핸들러를 재사용           |
| `@tanstack/react-query-devtools` | 캐시 상태를 눈으로 확인. 프로덕션 빌드에서는 no-op                                       |
| `clsx` + `tailwind-merge`        | `cn()` 유틸. shadcn/ui 가 전제하는 조합                                                  |
| `class-variance-authority`       | 컴포넌트 variant 정의. shadcn/ui 가 전제                                                 |
| `lucide-react`                   | 아이콘. shadcn/ui 기본 아이콘 세트                                                       |
| `tw-animate-css`                 | Tailwind v4 용 애니메이션 유틸 (구 `tailwindcss-animate` 대체)                           |
| `recharts`                       | 승률 그래프 등 축·툴팁·반응형이 필요한 차트. 단순한 막대/게이지는 SVG·CSS 로 직접 만든다 |
| `@hookform/resolvers`            | React Hook Form 과 Zod 연결                                                              |

## 넣지 않은 것

- **상태관리 추가 라이브러리** — TanStack Query + Zustand 로 충분하다.
- **컴포넌트 라이브러리 전체 설치** — shadcn primitive 는 필요할 때 하나씩 추가한다.
- **`vite-tsconfig-paths`** — 처음엔 넣었으나 Vite 8 이 `resolve.tsconfigPaths` 로 네이티브 지원해 제거했다.
- **아이콘/폰트 웹 요청** — 빌드 타임 네트워크 의존을 만들지 않는다. 폰트는 시스템 스택으로 시작한다.

## 되돌아볼 시점

분기마다 또는 Next 메이저 업그레이드 시점에 이 표를 다시 본다. 해제 조건이 충족된 항목부터 올린다.
