# 컴포넌트 규칙

이 문서는 React 컴포넌트를 **어디에, 어떤 책임으로, 언제 나눠** 만드는지 정한다.

목표는 컴포넌트를 많이 만드는 것이 아니라 **책임이 명확한 컴포넌트**를 만드는 것이다.

- 폴더와 레이어 전체 구조: [`architecture.md`](architecture.md)
- 색·크기·간격 규칙: [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)
- API 호출 방식: [`api-integration.md`](api-integration.md)

---

## 1. 원칙

컴포넌트는 **재사용성과 의미**를 기준으로 나눈다. 파일이 길다는 이유 하나만으로 자르지 않고, 반대로 짧다는 이유로 책임이 다른 코드를 한 파일에 모으지도 않는다.

---

## 2. Component 계층

```
src/
├─ components/        여러 기능이 재사용하는 UI
│  ├─ ui/               버튼·입력·다이얼로그 같은 기본 요소 (shadcn primitive 포함)
│  ├─ layout/           헤더·네비게이션·페이지 셸
│  ├─ board/            바둑판 (렌더링·좌표·입력)
│  └─ chart/            승률 그래프 등 데이터 시각화
│
├─ features/          특정 기능에 묶인 UI + 로직
│  ├─ auth/             로그인·회원가입·세션
│  ├─ game/             기보 업로드·SGF 파싱·수순·바둑 규칙
│  ├─ analysis/         AI 분석 요청·결과·후보수
│  ├─ gallery/          기보 목록·검색
│  └─ notes/            수순 메모·학습 노트
│
└─ routes/            Page. 위 둘을 배치만 한다
```

### 어디에 둘지 고르는 기준

| 질문                                       | 예                                   | 위치               |
| ------------------------------------------ | ------------------------------------ | ------------------ |
| 특정 기능 없이도 의미가 있는가?            | 버튼, 모달 틀, 바둑판, 승률 그래프   | `components/`      |
| 특정 기능의 API·상태·흐름을 알아야 하는가? | 분석 결과 패널, 로그인 폼, 기보 목록 | `features/<기능>/` |
| URL 하나에 대응하는 화면인가?              | 분석 화면, 갤러리 화면               | `routes/`          |

바둑판(`components/board`)과 차트(`components/chart`)는 바둑 서비스의 핵심이지만 **여러 기능이 같이 쓰기 때문에** `components/` 에 둔다. 분석 화면, 기보 미리보기, 노트 화면이 모두 같은 Board 를 쓴다. 대신 이 둘은 **어떤 기능의 API 나 store 도 import 하지 않는다.** 필요한 값은 전부 props 로 받는다.

### 의존 방향

```
routes  →  features  →  components  →  lib
```

- `components/` 는 `features/` 를 import 하지 않는다.
- feature 끼리 서로의 내부 파일을 직접 import 하지 않는다. 필요하면 `features/<기능>/index.ts` 가 공개한 것만 쓴다.
- 두 feature 가 같은 것을 필요로 하게 되면 그때 `components/` · `hooks/` · `lib/` 으로 올린다. 미리 올려두지 않는다.

폴더는 기능을 만들 때 함께 만든다. 빈 폴더를 미리 깔아두지 않는다.

---

## 3. 절대 하지 말 것

**하나의 페이지에 모든 코드를 넣지 않는다.**

```
❌ src/routes/result/route.tsx
   ├─ API 호출
   ├─ 상태 관리
   ├─ Canvas 그리기
   ├─ 차트
   ├─ 모달
   ├─ 이벤트 처리
   ├─ 데이터 가공
   └─ UI
```

Page 는 **구조만** 담당한다.

```tsx
// src/routes/analysis/route.tsx
import { AnalysisHeader, AnalysisSection, BoardSection, GameSummary } from '@/features/analysis';

export function AnalysisPage() {
  return (
    <main className="container-analysis">
      <AnalysisHeader />
      <GameSummary />
      <BoardSection />
      <AnalysisSection />
    </main>
  );
}

// React Router 는 lazy 라우트에서 `Component` 를 찾는다.
export { AnalysisPage as Component };
```

Page 파일이 50줄을 넘기기 시작하면 아래로 내려보낼 것이 올라온 것이다.

---

## 4. 책임 분리

| 책임             | 담당                  | 위치                                         |
| ---------------- | --------------------- | -------------------------------------------- |
| API 호출         | 함수                  | `lib/api` (공통) · `features/*/api` (기능별) |
| 서버 상태        | TanStack Query        | `features/*/hooks`                           |
| 복잡한 화면 상태 | Zustand               | `stores/` · `features/*/stores`              |
| 단순 UI 상태     | `useState`            | 그 컴포넌트 안                               |
| 데이터 검증      | Zod                   | `features/*/api` 의 스키마                   |
| 폼               | React Hook Form + Zod | `features/*/components`                      |
| 화면 표시        | React 컴포넌트        | `components/` · `features/*/components`      |
| 데이터 계산      | 순수 함수             | `features/*/model` · `lib/`                  |

### 상태를 어디에 둘지

1. **서버에서 온 데이터인가?** → TanStack Query. Zustand 나 `useState` 로 복사하지 않는다.
2. **여러 컴포넌트가 함께 보고 바꾸는 화면 상태인가?** (현재 수순, 켜둔 오버레이, 판 뒤집기) → Zustand
3. **한 컴포넌트 안에서 끝나는가?** (드롭다운 열림, 입력 중인 값) → `useState`

위에서부터 순서대로 묻는다. 대부분은 1번이나 3번에서 끝난다.

### 계산은 컴포넌트 밖에 둔다

승률을 표시값으로 바꾸기, 좌표를 `D4` 로 바꾸기, 수 품질 판정하기 같은 계산은 **순수 함수**로 뺀다. 컴포넌트 안에 두면 테스트하려고 렌더링부터 해야 한다.

```ts
// features/analysis/model/move-quality.ts
export function classifyMove(winrateDrop: number): MoveQuality {
  /* ... */
}
```

### 데이터는 Section 이 가져온다

Page 가 데이터를 모아 props 로 내려보내지 않는다. feature 의 Section 컴포넌트가 자기 훅을 직접 부른다.

```tsx
// features/analysis/components/game-summary.tsx
export function GameSummary() {
  const { gameId } = useParams();
  const query = useGameSummary(gameId);
  // ...
}
```

같은 데이터를 여러 Section 이 써도 TanStack Query 캐시가 공유한다. props 로 내려보낼 이유가 되지 않는다.

이렇게 해서 두 종류의 컴포넌트가 생긴다.

| 종류                           | 위치                    | 하는 일                                                 |
| ------------------------------ | ----------------------- | ------------------------------------------------------- |
| **Section** (feature 컴포넌트) | `features/*/components` | 훅을 불러 데이터를 얻고, UI 컴포넌트에 props 로 넘긴다  |
| **UI 컴포넌트**                | `components/*`          | props 만 받아 그린다. 데이터를 어디서 가져오는지 모른다 |

---

## 5. Server / Client Component

> **이 저장소에는 해당하지 않는다.** Vite + React Router SPA 라 Server Component 가 없다([ADR 0002](adr/0002-vite-spa.md)). 모든 컴포넌트가 브라우저에서 돌고, `"use client"` 지시어는 쓰지 않는다.

다만 이 규칙의 의도, 즉 **상태와 부수효과를 필요한 곳에만 둔다**는 원칙은 SPA 에서도 똑같이 지킨다.

다음을 쓰는 코드는 **가능한 한 좁은 컴포넌트나 훅 안에 가둔다.**

- `useState` · `useEffect`
- 브라우저 API (`window`, `localStorage`, `ResizeObserver` …)
- Canvas
- 사용자 입력 이벤트
- 클라이언트 상태 (Zustand)

나머지는 props 만 받아 그리는 **순수 컴포넌트**로 둔다. 페이지 전체를 상태 덩어리로 만들지 않는다.

```tsx
// ❌ 페이지 전체가 hover 상태를 들고 있다 → 마우스가 움직일 때마다 전부 다시 그린다
function AnalysisPage() {
  const [hover, setHover] = useState<Point | null>(null);
  // ...
}

// ✅ hover 는 그것이 필요한 Board 안에서 끝난다
function BoardInteraction() {
  const [hover, setHover] = useState<Point | null>(null);
  // ...
}
```

---

## 6. Props

- **타입을 명확하게 쓴다.** `any` 는 쓰지 않는다. ESLint(`@typescript-eslint/no-explicit-any`)가 에러로 막는다. 타입을 모르면 `unknown` 을 쓰고 좁힌다.
- **거대한 props 객체를 만들지 않는다.** 컴포넌트가 실제로 쓰는 값만 받는다.

```tsx
// ❌ 전체 분석 결과를 통째로 받아 그중 두 개만 쓴다
<WinrateBadge analysis={analysis} />

// ✅ 필요한 값만 받는다
<WinrateBadge winrate={move.winrate} player={move.player} />
```

- props 가 8~10개를 넘기 시작하면 컴포넌트가 너무 많은 일을 하고 있다는 신호다. 나눌 수 있는지 먼저 본다.
- boolean props 를 여러 개 조합해 모양을 바꾸지 않는다(`isLarge isPrimary isOutline`). variant 하나로 표현한다 (`cva`).
- 이벤트 props 는 `on` 으로 시작하고 무슨 일이 일어났는지로 이름 짓는다. `onMoveSelect(point)` 처럼.

---

## 7. UI 컴포넌트

**UI 컴포넌트는 비즈니스 로직을 직접 포함하지 않는다.**

- API 를 호출하지 않는다.
- store 를 import 하지 않는다.
- 라우터를 알 필요가 없으면 알지 않는다.

외부와의 연결은 전부 props 와 이벤트 콜백으로 한다. 그래야 분석 화면에서 쓰던 컴포넌트를 갤러리 미리보기에서도 그대로 쓸 수 있다.

---

## 8. Board Architecture

Board 는 프로젝트의 핵심 컴포넌트이므로 **독립적으로** 설계한다. 어떤 feature 에도 기대지 않고, 바둑판 자체의 책임만 진다.

### Board 가 하는 일

- 바둑판 렌더링 (판, 격자, 화점)
- 돌 렌더링
- 좌표 변환 (화면 픽셀 ↔ 교차점 ↔ `D4` 표기)
- 사용자 입력 (클릭, hover, 터치, 키보드)

### Board 가 하지 않는 일

- AI 분석 API 호출 → `features/analysis`
- 착수가 합법인지 판정, 따냄, 패 → `features/game/model`
- 현재 수순 저장 → feature 의 store

Board 는 "어디에 무엇을 그려라"를 받고, "여기가 눌렸다"를 알린다. 그 사이의 판단은 하지 않는다.

```tsx
<Board
  size={19}
  stones={stones} // 무엇을 그릴지
  markers={markers} // 마지막 수, 후보수 표시
  onIntersectionClick={handle} // 무엇이 눌렸는지
/>
```

### 예상 구조

```
components/board/
├─ board.tsx                외부에 공개하는 조립 컴포넌트
├─ board-canvas.tsx         Canvas 요소 · 크기 · devicePixelRatio · 레이어
├─ board-interaction.tsx    포인터·터치·키보드 입력 → 교차점 이벤트
├─ board-controls.tsx       확대/뒤집기 같은 판 자체의 조작
├─ renderers/
│  ├─ grid-renderer.ts      판 · 격자 · 화점 · 좌표 그리기
│  └─ stone-renderer.ts     돌 · 마커 그리기
├─ coordinate-system.ts     픽셀 ↔ 교차점 ↔ 표기 변환 (순수 함수)
└─ index.ts
```

실제 구조는 구현하면서 합리적으로 조정한다. 몇 가지는 미리 정해 둔다.

- **`StoneRenderer` 와 `CoordinateSystem` 은 React 컴포넌트가 아니라 순수 모듈이다.** Canvas 에 돌 361개를 React 컴포넌트로 그리면 수순을 넘길 때마다 재조정(reconciliation)이 일어난다. 렌더러는 `ctx` 와 데이터를 받아 그리는 함수로 둔다.
- 순수 모듈로 두면 **그리기 직전의 계산**을 렌더링 없이 테스트할 수 있다. 좌표 변환은 반드시 단위 테스트를 쓴다.
- 색과 비율은 코드에 적지 않고 디자인 토큰에서 읽는다(`src/lib/design/tokens.ts` 의 `BOARD_COLOR_TOKENS`, `BOARD_RATIO_TOKENS`). 테마가 바뀌면 `onThemeChange()` 로 다시 그린다.
- 판(격자)과 돌·오버레이와 hover 는 **레이어를 나눈다.** 마우스가 움직일 때 격자까지 다시 그리지 않는다.
- 수순 이동·AI 후보수 표시 같은 **분석 전용 조작은 `BoardControls` 가 아니라 `features/analysis`** 에 둔다. `BoardControls` 는 어느 화면에서 써도 의미가 있는 조작만 갖는다.

### Board 의 접근성

Canvas 는 스크린리더가 읽지 못한다. Board 는 다음을 함께 갖는다.

- 현재 판 상태를 설명하는 시각적으로 숨긴 텍스트 (마지막 수, 좌표)
- 방향키로 교차점을 이동하고 Enter 로 선택하는 키보드 조작
- 포커스된 교차점의 시각적 표시

---

## 9. Chart

`components/chart/` 도 Board 와 같은 규칙을 따른다. 데이터를 props 로 받아 그리기만 한다.

- 차트 색은 `SERIES_TOKENS` · `SEQUENTIAL_TOKENS` · `DIVERGING_TOKENS` 에서 읽는다.
- 승률 그래프에서 수를 클릭하면 `onMoveSelect(moveNumber)` 를 알릴 뿐, 수순을 직접 바꾸지 않는다.
- 차트마다 같은 데이터를 표로도 볼 수 있게 한다.

---

## 10. Modal

**모달 안에 모든 로직을 넣지 않는다.**

| 모달이 담당                | 상위 feature / hook 이 담당  |
| -------------------------- | ---------------------------- |
| 열기·닫기 표시             | 언제 여는지 결정             |
| 포커스 가두기, Esc 로 닫기 | 확인을 눌렀을 때 무엇을 할지 |
| 입력 받기, 버튼 표시       | API 호출, 캐시 갱신          |
| 진행 중·에러 **표시**      | 진행 중·에러 **상태**        |

```tsx
// features/game/components/delete-game-dialog.tsx
export function DeleteGameDialog({ gameId, open, onOpenChange }: Props) {
  const deleteGame = useDeleteGame(); // 데이터 처리는 훅이 한다

  return (
    <ConfirmDialog // 표시와 상호작용은 모달이 한다
      open={open}
      onOpenChange={onOpenChange}
      title="이 기보를 삭제할까요?"
      confirmLabel="삭제"
      pending={deleteGame.isPending}
      onConfirm={() => deleteGame.mutate(gameId, { onSuccess: () => onOpenChange(false) })}
    />
  );
}
```

`ConfirmDialog` 는 `components/ui/` 에 두고 무엇을 삭제하는지 모른다.

---

## 11. Loading / Success / Empty / Error

주요 데이터 화면은 **네 가지 상태를 모두** 그린다. 성공 화면만 만들고 나머지를 비워두지 않는다.

| 상태    | 판단                     | 보여줄 것                                                              |
| ------- | ------------------------ | ---------------------------------------------------------------------- |
| Loading | `query.isPending`        | 실제 레이아웃 모양의 자리표시자. 화면 전체 스피너 하나로 때우지 않는다 |
| Error   | `query.isError`          | 무엇이 실패했는지 + 다시 시도 버튼                                     |
| Empty   | 성공했지만 데이터가 없음 | 왜 비었는지 + 다음 행동 (예: "기보 올리기")                            |
| Success | 그 외                    | 실제 내용                                                              |

```tsx
export function GameList() {
  const query = useGames();

  if (query.isPending) return <GameListSkeleton />;
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />;
  if (query.data.length === 0) return <EmptyState action={<UploadGameButton />} />;

  return <GameListView games={query.data} />;
}
```

- 상태 판단은 Section 에서 하고, 각 상태의 **모양**은 별도 컴포넌트로 둔다.
- 에러 문구는 `isApiError(error)` 로 좁혀서 고른다.
- 자리표시자는 실제 콘텐츠와 크기가 같아야 한다. 로드가 끝날 때 화면이 튀지 않게 한다.
- Section 마다 자기 상태를 따로 가진다. 분석 결과가 늦게 와도 기보 요약은 먼저 보인다.

---

## 12. Accessibility

| 규칙                                | 이유                                                            |
| ----------------------------------- | --------------------------------------------------------------- |
| 동작은 `<button>`                   | `div onClick` 은 키보드로 누를 수 없다                          |
| 이동은 `<a>` · `<Link>`             | 새 탭 열기, 주소 복사가 된다                                    |
| 폼 요소에는 `<label>`               | placeholder 는 label 이 아니다. 입력하면 사라진다               |
| 키보드로 모든 조작이 가능하다       | Tab 순서가 읽는 순서와 같다                                     |
| 아이콘만 있는 버튼에는 `aria-label` | 스크린리더가 "버튼"이라고만 읽는다                              |
| 색만으로 상태를 표현하지 않는다     | 수 품질은 색 + 이름 + 수치                                      |
| 포커스를 숨기지 않는다              | `outline: none` 을 쓰지 않는다. 토큰의 `:focus-visible` 을 쓴다 |

```tsx
// ❌
<div onClick={next}><ChevronRight /></div>

// ✅
<button type="button" onClick={next} aria-label="다음 수">
  <ChevronRight aria-hidden />
</button>
```

> 접근성은 lint 로 잡지 않는다. `eslint-plugin-jsx-a11y` 가 ESLint 10 을 지원하지 않기 때문이다([ADR 0002](adr/0002-vite-spa.md)). 대신 리뷰 체크리스트로 확인하고, 화면이 생기면 `@axe-core/playwright` 로 실제 렌더 결과를 검사한다.

---

## 13. Styling

Tailwind CSS 를 쓴다. 값은 디자인 토큰에서만 온다.

### 추상화 기준

**긴 className 을 무조건 컴포넌트로 빼지 않는다.** 한 번만 쓰는 긴 className 은 그 자리에 두는 편이 읽기 쉽다.

**같은 스타일이 여러 곳에서 반복되면** 추상화한다. 무엇이 반복되느냐에 따라 방법이 다르다.

| 반복되는 것               | 방법          | 예                                        |
| ------------------------- | ------------- | ----------------------------------------- |
| 값 하나 (색, 크기)        | 디자인 토큰   | `--board-surface` → `bg-board`            |
| 구조 없는 스타일 묶음     | `@utility`    | `container-page`, `label-text`, `tabular` |
| 구조 + 스타일 + 동작      | 컴포넌트      | `Button`, `ConfirmDialog`                 |
| 같은 컴포넌트의 모양 변형 | `cva` variant | `<Button variant="ghost" size="sm">`      |

### 규칙

- 조건부 className 은 `cn()` 으로 합친다. 문자열을 `+` 로 이어 붙이지 않는다.
- 임의 값(`w-[347px]`, `text-[15px]`)을 쓰지 않는다. 필요하면 토큰을 먼저 만든다.
- `style={{ }}` 는 런타임에 계산되는 값(차트 막대 폭, Canvas 크기)에만 쓴다.
- 컴포넌트 바깥 여백(`margin`)은 컴포넌트가 아니라 **쓰는 쪽**이 정한다. 재사용 컴포넌트가 자기 바깥 여백을 갖고 있으면 다른 곳에서 쓸 수 없다.

---

## 14. 컴포넌트를 나누는 기준

다음 중 하나에 해당할 때 분리를 고려한다.

1. **여러 곳에서 재사용된다.**
2. **하나의 명확한 책임이 있다.** 이름을 붙였을 때 그 이름이 하는 일을 설명한다.
3. **파일이 지나치게 커진다.** 한 화면에 다 보이지 않을 정도라면 신호다.
4. **상태나 이벤트가 복잡해진다.** 상태가 다른 부분의 리렌더를 끌고 다닌다.
5. **독립적으로 테스트할 필요가 있다.**

### 나누지 않는 경우

**단순한 div 하나를 무조건 컴포넌트로 만들지 않는다.**

```tsx
// ❌ 이름만 있고 책임이 없다
function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-4">{children}</div>;
}
```

- 한 번만 쓰이고, 책임이 없고, 테스트할 필요도 없는 조각은 그 자리에 둔다.
- "나중에 재사용할 것 같아서" 미리 나누지 않는다. 두 번째로 필요해질 때 나눈다.
- 나눴더니 props 로 대부분의 값을 그대로 넘기기만 한다면 나눈 것이 잘못이다.

---

## 15. 이름과 파일

| 대상          | 규칙          | 예                                                |
| ------------- | ------------- | ------------------------------------------------- |
| 파일          | kebab-case    | `game-summary.tsx`, `use-game-summary.ts`         |
| 컴포넌트      | PascalCase    | `GameSummary`                                     |
| 훅            | `use` 로 시작 | `useGameSummary`                                  |
| Page          | `…Page`       | `AnalysisPage` (라우터용 `Component` 별칭과 함께) |
| 이벤트 props  | `on…`         | `onMoveSelect`                                    |
| 이벤트 핸들러 | `handle…`     | `handleMoveSelect`                                |

- 한 파일에는 공개 컴포넌트 하나를 둔다. 그 컴포넌트만 쓰는 작은 조각은 같은 파일에 둬도 된다.
- `export default` 대신 named export 를 쓴다. 이름이 import 하는 쪽마다 달라지지 않는다.
- feature 의 `index.ts` 는 Page 가 쓰는 것만 다시 내보낸다. 내부 조각까지 전부 내보내지 않는다.

---

## 16. 리뷰 체크리스트

- [ ] Page 가 구조만 담당한다. API·계산·Canvas·모달 로직이 Page 에 없다.
- [ ] `components/` 가 `features/` 나 store 를 import 하지 않는다.
- [ ] 서버 데이터를 Zustand 나 `useState` 로 복사하지 않았다.
- [ ] 데이터 계산이 컴포넌트 밖의 순수 함수에 있다.
- [ ] `any` 가 없다. props 가 실제로 쓰는 값만 받는다.
- [ ] 상태·effect·브라우저 API 가 필요한 컴포넌트 안에만 있다.
- [ ] Board 와 Chart 가 API 를 호출하지 않는다.
- [ ] 모달이 데이터 처리를 직접 하지 않는다.
- [ ] Loading · Empty · Error · Success 네 상태를 모두 그린다.
- [ ] 동작은 `button`, 이동은 `Link`, 입력에는 `label` 이 있다.
- [ ] 아이콘만 있는 버튼에 `aria-label` 이 있다.
- [ ] 색만으로 상태를 알리지 않는다.
- [ ] 키보드만으로 조작할 수 있다.
- [ ] 임의 값(`[347px]`)을 쓰지 않았다.
- [ ] 단순한 div 를 이유 없이 컴포넌트로 만들지 않았다.
