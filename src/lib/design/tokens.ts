/**
 * CSS 디자인 토큰을 JS 에서 읽기 위한 다리.
 *
 * Canvas(바둑판)와 차트 라이브러리는 CSS 클래스를 쓸 수 없으므로
 * 색을 직접 받아야 한다. 그때도 값을 코드에 적지 않고 여기를 통한다.
 * 토큰 이름이 바뀌면 여기서만 고치면 된다.
 */

/** 차트 시리즈 슬롯. 순서가 고정이며 순환시키지 않는다. */
export const SERIES_TOKENS = [
  '--series-1',
  '--series-2',
  '--series-3',
  '--series-4',
  '--series-5',
  '--series-6',
  '--series-7',
  '--series-8',
] as const;

/**
 * 산점도·버블·지도·small multiples 처럼 아무 두 계열이나 나란히 놓일 수 있는
 * 차트에서 안전하게 쓸 수 있는 슬롯. 이 셋을 넘기면 계열을 합치거나 화면을 나눈다.
 */
export const SERIES_TOKENS_ANY_PAIR = ['--series-1', '--series-4', '--series-5'] as const;

/** 크기(magnitude) 표현용 단일 색조 램프. 낮음 → 높음 */
export const SEQUENTIAL_TOKENS = [
  '--seq-1',
  '--seq-2',
  '--seq-3',
  '--seq-4',
  '--seq-5',
  '--seq-6',
] as const;

/** 0 을 기준으로 갈리는 값(집 차이 등). 백 우세 ← 중립 → 흑 우세 */
export const DIVERGING_TOKENS = [
  '--div-neg-3',
  '--div-neg-2',
  '--div-neg-1',
  '--div-mid',
  '--div-pos-1',
  '--div-pos-2',
  '--div-pos-3',
] as const;

/** 수 품질. 예약된 상태 색이며 차트 시리즈로 재사용하지 않는다. */
export const MOVE_QUALITY_TOKENS = {
  best: '--move-best',
  good: '--move-good',
  inaccuracy: '--move-inaccuracy',
  mistake: '--move-mistake',
  blunder: '--move-blunder',
} as const;

/** 바둑판 색. Canvas 렌더러가 그대로 쓴다. */
export const BOARD_COLOR_TOKENS = {
  surface: '--board-surface',
  surfaceLight: '--board-surface-light',
  edge: '--board-surface-edge',
  frame: '--board-frame',
  line: '--board-line',
  lineEdge: '--board-line-edge',
  star: '--board-star',
  coord: '--board-coord',
  hover: '--board-hover',
  lastMove: '--board-last-move',
  stoneBlack: '--stone-black',
  stoneBlackEdge: '--stone-black-edge',
  stoneBlackSheen: '--stone-black-sheen',
  stoneWhite: '--stone-white',
  stoneWhiteEdge: '--stone-white-edge',
  stoneWhiteSheen: '--stone-white-sheen',
  stoneShadow: '--stone-shadow',
  labelOnBlack: '--stone-label-on-black',
  labelOnWhite: '--stone-label-on-white',
} as const;

/**
 * 바둑판 기하 비율. 모두 "격자 간격(gap)에 곱하는 값"이다.
 * 픽셀 상수를 렌더러 안에 흩어놓지 않기 위해 토큰으로 둔다.
 */
export const BOARD_RATIO_TOKENS = {
  stoneSize: '--board-stone-size',
  starSize: '--board-star-size',
  lineWidth: '--board-line-width',
  edgeWidth: '--board-edge-width',
  padding: '--board-padding',
  labelSize: '--board-label-size',
  coordSize: '--board-coord-size',
  markerSize: '--board-marker-size',
} as const;

export type BoardColorKey = keyof typeof BOARD_COLOR_TOKENS;
export type BoardRatioKey = keyof typeof BOARD_RATIO_TOKENS;
export type MoveQuality = keyof typeof MOVE_QUALITY_TOKENS;

/**
 * :root 에 걸린 CSS 변수의 계산된 값을 읽는다.
 * 서버에서는 읽을 수 없으므로 빈 문자열을 돌려준다. 호출부가 이를 처리한다.
 */
export function readToken(name: string, element?: Element): string {
  if (typeof window === 'undefined') return '';
  const target = element ?? document.documentElement;
  return getComputedStyle(target).getPropertyValue(name).trim();
}

export function readTokens<K extends string>(map: Record<K, string>, element?: Element) {
  const out = {} as Record<K, string>;
  for (const key of Object.keys(map) as K[]) {
    out[key] = readToken(map[key], element);
  }
  return out;
}

/** 비율 토큰은 숫자로 쓰인다. 값이 없으면 fallback 을 쓴다. */
export function readRatio(name: string, fallback: number, element?: Element): number {
  const raw = readToken(name, element);
  const value = Number.parseFloat(raw);
  return Number.isFinite(value) ? value : fallback;
}

/**
 * 테마(라이트/다크)가 바뀌면 토큰 값이 달라진다.
 * Canvas 는 자동으로 다시 그려지지 않으므로 변화를 구독해 재렌더해야 한다.
 * 반환값은 구독 해제 함수다.
 */
export function onThemeChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // jsdom 처럼 matchMedia · MutationObserver 가 없는 환경에서도 동작해야 한다.
  const media =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-color-scheme: dark)')
      : null;
  media?.addEventListener('change', callback);

  const observer = typeof MutationObserver === 'function' ? new MutationObserver(callback) : null;
  observer?.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  return () => {
    media?.removeEventListener('change', callback);
    observer?.disconnect();
  };
}
