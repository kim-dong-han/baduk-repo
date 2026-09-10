# 컴포넌트 규칙

## Component Principle

컴포넌트는 재사용성과 의미를 기준으로 분리한다.

파일이 길어졌다는 이유만으로 자르지 않는다. 자를 이유는 둘 중 하나여야 한다.

- **재사용성** — 두 곳 이상에서 쓴다
- **의미** — 이름을 붙일 수 있는 독립된 정보 단위나 동작이다

## Do Not

하나의 Page 컴포넌트에 모든 UI와 로직을 작성하지 않는다.

## Page

Page는 페이지의 구조를 담당한다.

```tsx
<AnalysisPage>
  <AnalysisHeader />
  <GameSummary />
  <BoardSection />
  <AnalysisSection />
</AnalysisPage>
```

---

## 이 저장소에서의 적용

위 규칙을 지금 구조에 옮기면 다음과 같다.

### Page 는 `src/routes` 에 둔다

Page 컴포넌트는 **배치만** 한다. 데이터를 가져오거나 계산하지 않는다.

```tsx
// src/routes/analysis/route.tsx
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
// 이름은 위 규칙대로 두고 별칭으로 라우터 규약을 맞춘다.
export { AnalysisPage as Component };
```

Page 파일이 50줄을 넘기면 대개 아래로 내려보내야 할 것이 올라온 것이다.

### Section 은 feature 가 갖는다

`AnalysisHeader`, `GameSummary`, `BoardSection`, `AnalysisSection` 같은 조각은 Page 옆이 아니라 해당 feature 안에 산다.

```
src/features/game-review/
├─ api/          백엔드 호출 + Zod 스키마
├─ hooks/        TanStack Query / Zustand 를 감싼 훅
├─ components/   AnalysisHeader · GameSummary · BoardSection · AnalysisSection
├─ model/        순수 계산 (승률 → 표시값 등)
└─ index.ts      Page 가 쓸 것만 re-export
```

Page 는 `features/game-review` 의 `index.ts` 만 import 한다. 내부 파일을 직접 꺼내 쓰지 않는다.

### 데이터는 Section 이 직접 가져온다

Page 가 데이터를 모아 props 로 뿌리지 않는다. 각 Section 이 자기 훅을 부른다.

```tsx
function GameSummary() {
  const { data, isPending } = useGameSummary(gameId);
  // ...
}
```

Page 가 모든 데이터를 들고 있으면 한 곳이 바뀔 때 페이지 전체가 다시 그려지고, Page 가 다시 "모든 로직을 가진 컴포넌트"가 된다. 로딩·에러 상태도 각 Section 이 자기 몫만 책임진다.

같은 데이터를 여러 Section 이 쓰면 TanStack Query 캐시가 알아서 공유한다. props 로 내려보낼 이유가 되지 않는다.

### 어디에 두는지 정하는 순서

1. 이 기능에서만 쓰는가 → `features/<feature>/components/`
2. 도메인을 모르는 재사용 UI 인가 → `src/components/`
3. shadcn primitive 인가 → `src/components/ui/`
4. 헤더·페이지 셸 같은 레이아웃 조각인가 → `src/components/layout/`

props 이름에 "바둑", "기보", "승률" 이 등장하면 그 컴포넌트는 `src/components/` 가 아니라 `features/` 로 가야 한다.

### 폴더를 미리 만들지 않는다

기능을 만들 때 함께 만든다. 두 feature 가 같은 것을 필요로 하게 되면 그때 공용으로 올린다.

---

## Card

모든 정보를 카드에 넣지 않는다. Card 는 **독립적인 정보 단위**일 때만 쓴다.

- 목록의 한 항목처럼 그 자체로 떼어낼 수 있는가 → Card
- 페이지 흐름의 한 문단인가 → Card 아님. 배경 위에 그냥 둔다

영역을 나눌 때는 카드보다 여백을 먼저 쓰고, 그다음 경계선을 쓴다.
