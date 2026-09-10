# 아키텍처

## 왜 이 구조인가

기존 프로젝트는 하나의 거대한 JS 파일과 전역 DOM 조작에 기능이 뭉쳐 있었다. 이 저장소는 그 구조를 옮기지 않는다. 대신 **기능 단위 수직 슬라이스(feature slice)** 로 나누고, 레이어 간 의존 방향을 한쪽으로만 흐르게 고정한다.

```
app (조립: providers · router)
  ↓
routes (화면 = 라우트 컴포넌트)
  ↓
features (기능 단위: 화면 · 훅 · API · 도메인 모델)
  ↓
components / hooks / stores / types  (기능 무관 공용)
  ↓
lib (프레임워크 경계: HTTP · 환경변수 · 유틸)
```

**위에서 아래로만 import 한다.** `lib` 이 `features` 를 import 하면 잘못된 것이다.

---

## 각 디렉터리의 책임

### `src/main.tsx`

진입점. 목 API 를 먼저 띄우고 나서 렌더한다. 워커가 준비되기 전에 렌더하면 첫 요청이 목을 통과하지 못한다.

### `src/app`

앱을 조립하기만 한다. 로직을 담지 않는다.

- `app.tsx` — Provider 와 라우터를 붙인다
- `providers.tsx` — 전역 Provider 조립 (TanStack Query)
- `router.tsx` — 라우트 정의. 화면은 전부 `lazy` 로 나눠 첫 진입 번들에서 뺀다

### `src/routes`

라우트 컴포넌트. React Router 의 data router 규약을 따라 `Component` 를 named export 한다(필요해지면 `loader`, `action`, `ErrorBoundary` 도 같은 파일에서 내보낸다).

화면 파일이 30~50줄을 넘기면 대개 feature 로 내려보내야 할 로직이 올라온 것이다. 라우트 파일은 feature 컴포넌트를 배치하는 얇은 껍데기로 둔다.

### `src/features/<feature>`

하나의 기능이 필요로 하는 것을 한 폴더에 모은다. 예상되는 슬라이스:

```
features/
├─ game-upload/     SGF 업로드 · 검증 · 분석 요청
├─ game-board/      바둑판 렌더링(Canvas) · 착수 표시 · 오버레이
├─ game-review/     수순 이동 · 분석 결과 패널 · 승률 그래프
└─ game-library/    내 기보 목록 · 검색
```

각 슬라이스 내부:

```
features/game-review/
├─ api/          백엔드 호출 함수 + 응답 Zod 스키마
├─ hooks/        TanStack Query / Zustand 를 감싼 훅
├─ components/   이 기능에서만 쓰는 UI
├─ model/        도메인 계산 (승률 → 표시값 변환 등, 순수 함수)
└─ index.ts      외부에 공개할 것만 re-export
```

**규칙**

- 다른 feature 의 내부 파일을 직접 import 하지 않는다. `features/x/index.ts` 를 통한다.
- 두 feature 가 같은 것을 필요로 하면 공용(`components/`, `hooks/`, `types/`)으로 올린다. 미리 올려두지는 않는다.
- 폴더를 미리 만들어두지 않는다. 기능을 만들 때 함께 만든다.

### `src/components`

도메인을 모르는 재사용 UI만 둔다.

- `ui/` — shadcn/ui primitive 가 설치되는 위치. 설치 후 외형은 우리 토큰으로 교체한다.
- `layout/` — 헤더, 사이드바, 페이지 셸 등.

"바둑" 이라는 단어가 props 에 등장하면 그 컴포넌트는 `features` 로 가야 한다.

### `src/lib`

- `lib/api/http-client.ts` — 백엔드로 나가는 **유일한** 출구. `fetch` 는 여기에만 있다.
- `lib/api/api-error.ts` — 실패를 표현하는 단일 타입 `ApiError`.
- `lib/api/query-client.ts` — QueryClient 기본 정책. SPA 이므로 인스턴스는 하나다.
- `lib/config/env.ts` — 환경변수, Zod 검증. SPA 이므로 여기 값은 전부 공개된다.
- `lib/design/tokens.ts` — Canvas·차트가 디자인 토큰을 읽는 통로.
- `lib/utils.ts` — `cn()` 등 진짜 범용 유틸만.

### `src/stores`

Zustand store 는 **여러 화면이 공유해야 하는 클라이언트 상태**에만 만든다.

만들어도 되는 예: 리뷰 화면의 "현재 수순", "오버레이 표시 모드", "바둑판 뒤집기".
만들면 안 되는 예: 서버에서 받아온 기보/분석 결과(→ TanStack Query), 한 컴포넌트 안에서 끝나는 토글(→ `useState`).

### `src/types`

두 개 이상의 feature 가 공유하는 타입만 둔다. API 응답 타입은 Zod 스키마에서 `z.infer` 로 뽑아 쓰므로, 손으로 다시 적지 않는다.

### `src/mocks`

MSW 핸들러. 백엔드가 준비되기 전에 화면을 먼저 만들 수 있게 한다. `VITE_ENABLE_API_MOCKING=true` 일 때 브라우저에서, 테스트에서는 `tests/setup.ts` 가 항상 켠다.

---

## 데이터 흐름

```
features/*/api (Zod 스키마)  ─→  lib/api/http-client  ─→  Spring Boot
        ↑
features/*/hooks (TanStack Query)
        ↓
features/*/components  ←  stores (화면 상태)
```

- **서버 상태**(기보, 분석 결과, 목록)는 TanStack Query 가 소유한다. 이것을 Zustand 로 복사하지 않는다.
- **화면 상태**(지금 보고 있는 수, 켜둔 오버레이)는 Zustand 가 소유한다.
- 둘을 합성해야 하면 컴포넌트나 훅에서 합성한다. 새 전역 상태를 만들지 않는다.

---

## 바둑판을 Canvas 로 그리는 이유

19×19 = 361 교차점에 돌·수순·AI 후보수·영향력 오버레이가 겹친다. DOM 으로 만들면 노드가 1,000개를 넘고, 수순 이동마다 리렌더가 발생한다.

- 판/격자/좌표: 크기가 바뀔 때만 다시 그린다.
- 돌과 오버레이: 수순이 바뀔 때만 다시 그린다.
- 마우스 오버 하이라이트: 별도 레이어에 그려 나머지를 건드리지 않는다.

접근성은 Canvas 옆에 시각적으로 숨긴 텍스트(현재 수순, 좌표, 승률)를 두고 키보드 조작을 지원해 확보한다. 이 부분은 구현 시점에 별도 문서로 정리한다.
