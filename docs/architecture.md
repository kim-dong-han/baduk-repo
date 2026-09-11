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

특정 기능에 묶인 UI 와 로직을 한 폴더에 모은다.

```
features/
├─ auth/        로그인 · 회원가입 · 세션
├─ game/        기보 업로드 · SGF 파싱 · 수순 · 바둑 규칙
├─ analysis/    AI 분석 요청 · 결과 · 후보수
├─ gallery/     기보 목록 · 검색
└─ notes/       수순 메모 · 학습 노트
```

각 슬라이스 내부:

```
features/analysis/
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

여러 기능이 재사용하는 UI 를 둔다.

- `ui/` — 버튼·입력·다이얼로그 같은 기본 요소. shadcn/ui primitive 도 여기 설치하고 외형은 우리 토큰으로 교체한다.
- `layout/` — 헤더, 네비게이션, 페이지 셸.
- `board/` — 바둑판. 렌더링·좌표 변환·사용자 입력만 책임진다.
- `chart/` — 승률 그래프 등 데이터 시각화.

바둑판과 차트는 서비스의 핵심이지만 분석·갤러리·노트가 함께 쓰므로 `components/` 에 둔다. 대신 **`components/` 는 `features/` 나 store 를 import 하지 않는다.** 필요한 값은 전부 props 로 받는다.

무엇을 어디에 둘지와 Board 의 내부 구조는 [`COMPONENT_RULES.md`](COMPONENT_RULES.md) 에 있다.

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

바둑판은 `components/board/` 에 둔다. 19×19 = 361 교차점에 돌·수순·AI 후보수·영향력 오버레이가 겹친다. DOM 으로 만들면 노드가 1,000개를 넘고, 수순 이동마다 리렌더가 발생한다.

- 판/격자/좌표: 크기가 바뀔 때만 다시 그린다.
- 돌과 오버레이: 수순이 바뀔 때만 다시 그린다.
- 마우스 오버 하이라이트: 별도 레이어에 그려 나머지를 건드리지 않는다.

접근성은 Canvas 옆에 시각적으로 숨긴 텍스트(현재 수순, 좌표, 승률)를 두고 키보드 조작을 지원해 확보한다. Board 의 책임 범위와 내부 구조는 [`COMPONENT_RULES.md` 8절](COMPONENT_RULES.md#8-board-architecture) 을 따른다.
