# 디자인 시스템

## 원칙

1. **바둑판이 화면의 중심이다.** 나머지 UI는 판을 읽는 것을 돕는 보조 장치다. 대시보드형 카드 나열을 기본 레이아웃으로 삼지 않는다.
2. **색은 의미를 갖는다.** 장식으로 색을 쓰지 않는다. 분석 결과(좋은 수 / 실수 / 대악수)와 승률만이 강한 색을 가진다.
3. **shadcn/ui 의 기본 외형을 쓰지 않는다.** primitive 에서 접근성과 동작만 가져오고 색·간격·타이포는 우리 토큰으로 덮는다.
4. **숫자는 흔들리지 않는다.** 승률·집 차이·수순은 `tabular` 클래스로 고정폭 숫자를 쓴다. 수를 넘길 때 숫자가 좌우로 떨리면 안 된다.

---

## 토큰 계층

`src/styles/globals.css` 한 파일이 전부다. 세 층으로 나뉜다.

```
1. 원시 토큰      --ink-900, --kaya-500, --signal-red …
        ↓
2. 의미 토큰      --background, --board-surface, --move-blunder …
        ↓
3. Tailwind 매핑  @theme inline → bg-board-surface, text-move-blunder …
```

**컴포넌트는 3층(유틸리티 클래스)만 쓴다.** 1층 원시 토큰을 직접 참조하지 않는다. 서비스 톤을 바꾸고 싶으면 1층 값만 고치면 된다.

색 공간은 `oklch` 를 쓴다. 명도(L)를 일정하게 유지한 채 색상만 바꿀 수 있어서, 분석 신호색끼리 대비를 맞추기 쉽다.

## 의미 토큰

### 표면 / 텍스트

| 토큰                                 | 용도                           |
| ------------------------------------ | ------------------------------ |
| `background` / `foreground`          | 페이지 바탕과 본문             |
| `surface` / `surface-muted`          | 패널·카드 표면                 |
| `muted-foreground`                   | 보조 설명, 메타 정보           |
| `border` / `input` / `ring`          | 경계선, 입력 테두리, 포커스 링 |
| `primary` / `accent` / `destructive` | 주요 동작 / 강조 / 파괴적 동작 |

### 바둑판

| 토큰                          | 용도                                  |
| ----------------------------- | ------------------------------------- |
| `board-surface`               | 판 바탕 (비자나무 톤)                 |
| `board-surface-edge`          | 판 테두리·두께 표현                   |
| `board-grid`                  | 격자선                                |
| `board-star`                  | 화점                                  |
| `board-coord`                 | 좌표 문자 (A-T, 1-19)                 |
| `stone-black` / `stone-white` | 돌 본체                               |
| `stone-*-edge`                | 돌 외곽선 (흑돌이 배경에 묻히지 않게) |
| `stone-marker-on-*`           | 돌 위에 얹는 수순 숫자 색             |
| `board-shadow`                | 돌 그림자                             |

Canvas 에서는 `getComputedStyle(document.documentElement).getPropertyValue('--board-surface')` 로 토큰 값을 읽어 쓴다. 색을 코드에 적지 않는다. 다크 모드 전환 시 다시 읽어 재렌더한다.

### 분석 신호

| 토큰                              | 의미                         |
| --------------------------------- | ---------------------------- |
| `move-brilliant`                  | AI 최선 이상의 좋은 수       |
| `move-good`                       | 무난한 수                    |
| `move-inaccuracy`                 | 부정확                       |
| `move-mistake`                    | 실수                         |
| `move-blunder`                    | 대악수                       |
| `winrate-black` / `winrate-white` | 승률 그래프 흑/백 영역       |
| `score-lead`                      | 집 차이 표시                 |
| `candidate-top/mid/low`           | AI 후보수 오버레이 (승률 순) |

색만으로 구분하지 않는다. 아이콘·수치·텍스트 라벨을 함께 둔다(색각 이상 대응).

### 차트

`chart-1` ~ `chart-5`. Recharts 든 직접 만든 SVG 든 이 토큰만 쓴다.

---

## 다크 모드

`html.dark` 클래스 기반이다 (`@custom-variant dark`). 다크에서 바둑판은 **검게 만들지 않는다.** 나무 톤의 명도만 낮춘다. 판이 어두워지면 흑돌이 사라진다.

## 타이포그래피

- 본문: `--font-sans` (Pretendard → 시스템 한글 폰트 폴백)
- 숫자·좌표·SGF: `--font-mono`

웹폰트를 빌드 타임에 받아오지 않는다. 폰트 로딩 때문에 첫 화면의 바둑판이 밀리는 것을 피한다. 웹폰트가 필요해지면 `next/font/local` 로 자체 호스팅하고 `font-display: swap` 을 적용한다.

## 모션

`prefers-reduced-motion` 을 존중한다 (`globals.css` 에 이미 반영). 수순 이동 애니메이션은 100ms 를 넘기지 않는다. 기보를 빠르게 넘겨볼 때 애니메이션이 밀리면 안 된다.

## shadcn/ui 사용 방침

```bash
npx shadcn@latest add button dialog
```

`components.json` 이 설정되어 있어 `src/components/ui/` 에 설치되고 `@/lib/utils` 의 `cn` 을 쓴다.

- 필요한 primitive 만 하나씩 추가한다. 전체를 미리 설치하지 않는다.
- 설치 직후 기본 색상 클래스를 우리 의미 토큰으로 교체한다.
- 바둑판, 승률 그래프, 수순 목록처럼 서비스 고유 UI 는 shadcn 으로 만들지 않는다. 직접 만든다.
