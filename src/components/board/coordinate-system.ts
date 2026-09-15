import type { Point } from './types';

/**
 * 좌표와 크기 계산. 순수 함수만 둔다.
 *
 * Canvas 를 몰라야 테스트할 수 있다. 렌더러는 여기서 나온 숫자만 받아 그린다.
 */

export const DEFAULT_BOARD_SIZE = 19;

/** GTP 열 이름. I 를 건너뛴다. */
const GTP_COLUMNS = 'ABCDEFGHJKLMNOPQRST';

export function isOnBoard(point: Point, size: number): boolean {
  return (
    Number.isInteger(point.x) &&
    Number.isInteger(point.y) &&
    point.x >= 0 &&
    point.y >= 0 &&
    point.x < size &&
    point.y < size
  );
}

export function samePoint(a: Point | null, b: Point | null): boolean {
  if (!a || !b) return a === b;
  return a.x === b.x && a.y === b.y;
}

/** Map · Set 의 키로 쓰는 문자열. */
export function pointKey(point: Point): string {
  return `${point.x},${point.y}`;
}

/** {x:3, y:3} → "D4" */
export function pointToGtp(point: Point, size = DEFAULT_BOARD_SIZE): string | null {
  if (!isOnBoard(point, size) || size > GTP_COLUMNS.length) return null;
  return `${GTP_COLUMNS[point.x]}${point.y + 1}`;
}

/** "D4" → {x:3, y:3}. 패스나 잘못된 좌표는 null. */
export function gtpToPoint(gtp: string, size = DEFAULT_BOARD_SIZE): Point | null {
  if (!gtp || gtp.toLowerCase() === 'pass') return null;

  const column = gtp.charAt(0).toUpperCase();
  const x = GTP_COLUMNS.indexOf(column);
  const y = Number.parseInt(gtp.slice(1), 10) - 1;

  if (x < 0 || !Number.isFinite(y)) return null;
  const point = { x, y };
  return isOnBoard(point, size) ? point : null;
}

/**
 * 화점 위치. 판 크기에 따라 다르다.
 *
 * 19줄만 변의 가운데까지 포함해 9개이고, 13줄·9줄은 귀 4개와 천원 5개다.
 */
export function starPoints(size: number): Point[] {
  if (size < 7) return [];

  const edge = size >= 13 ? 3 : 2;
  const far = size - 1 - edge;
  const center = (size - 1) / 2;
  const hasCenter = Number.isInteger(center);

  if (size >= 17 && hasCenter) {
    const lines = [edge, center, far];
    return lines.flatMap((x) => lines.map((y) => ({ x, y })));
  }

  const corners: Point[] = [
    { x: edge, y: edge },
    { x: edge, y: far },
    { x: far, y: edge },
    { x: far, y: far },
  ];
  return hasCenter ? [...corners, { x: center, y: center }] : corners;
}

/** 격자 간격에 곱해서 쓰는 비율. 값은 디자인 토큰에서 온다. */
export type BoardRatios = {
  stoneSize: number;
  starSize: number;
  lineWidth: number;
  edgeWidth: number;
  padding: number;
  labelSize: number;
  coordSize: number;
  markerSize: number;
};

export const DEFAULT_BOARD_RATIOS: BoardRatios = {
  stoneSize: 0.94,
  starSize: 0.11,
  lineWidth: 0.035,
  edgeWidth: 0.06,
  padding: 0.85,
  labelSize: 0.5,
  coordSize: 0.42,
  markerSize: 0.42,
};

/** 한 번 계산해 두고 렌더러가 공유하는 픽셀 치수. 전부 CSS 픽셀이다. */
export type BoardMetrics = {
  size: number;
  /** 판 한 변의 길이 */
  boardPx: number;
  /** 교차점 사이 간격 */
  gap: number;
  /** 판 가장자리에서 첫 줄까지 */
  padding: number;
  stoneRadius: number;
  starRadius: number;
  lineWidth: number;
  edgeWidth: number;
  labelFontPx: number;
  coordFontPx: number;
  markerRadius: number;
};

export function createBoardMetrics(
  boardPx: number,
  size = DEFAULT_BOARD_SIZE,
  ratios: BoardRatios = DEFAULT_BOARD_RATIOS,
): BoardMetrics {
  // 판 폭 = 여백 2칸 + 격자 (size - 1) 칸
  const gap = boardPx / (size - 1 + ratios.padding * 2);

  return {
    size,
    boardPx,
    gap,
    padding: gap * ratios.padding,
    stoneRadius: (gap * ratios.stoneSize) / 2,
    starRadius: (gap * ratios.starSize) / 2,
    lineWidth: gap * ratios.lineWidth,
    edgeWidth: gap * ratios.edgeWidth,
    labelFontPx: gap * ratios.labelSize,
    coordFontPx: gap * ratios.coordSize,
    markerRadius: (gap * ratios.markerSize) / 2,
  };
}

/** 교차점 → 캔버스 좌표. y 는 아래에서 위로 세므로 여기서 뒤집는다. */
export function pointToPixel(metrics: BoardMetrics, point: Point): { x: number; y: number } {
  return {
    x: metrics.padding + point.x * metrics.gap,
    y: metrics.padding + (metrics.size - 1 - point.y) * metrics.gap,
  };
}

/**
 * 캔버스 좌표 → 가장 가까운 교차점.
 * 교차점에서 반 칸보다 멀면 null 이다(판 바깥 여백을 눌렀을 때).
 */
export function pixelToPoint(metrics: BoardMetrics, pixelX: number, pixelY: number): Point | null {
  if (metrics.gap <= 0) return null;

  const x = Math.round((pixelX - metrics.padding) / metrics.gap);
  const row = Math.round((pixelY - metrics.padding) / metrics.gap);
  const y = metrics.size - 1 - row;
  const point = { x, y };

  if (!isOnBoard(point, metrics.size)) return null;

  const center = pointToPixel(metrics, point);
  const distance = Math.hypot(pixelX - center.x, pixelY - center.y);
  return distance <= metrics.gap / 2 ? point : null;
}

/** 집 예측 배열에서 한 점의 값을 읽는다. (인덱스는 위쪽 행부터) */
export function territoryAt(territory: number[], point: Point, size: number): number | null {
  const index = (size - 1 - point.y) * size + point.x;
  return territory[index] ?? null;
}
