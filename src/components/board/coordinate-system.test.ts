import { describe, expect, it } from 'vitest';

import {
  DEFAULT_BOARD_RATIOS,
  createBoardMetrics,
  gtpToPoint,
  isOnBoard,
  pixelToPoint,
  pointToGtp,
  pointToPixel,
  starPoints,
  territoryAt,
} from './coordinate-system';

const SIZE = 19;
const BOARD_PX = 570;

describe('좌표 변환', () => {
  it('GTP 는 I 열을 건너뛴다', () => {
    expect(pointToGtp({ x: 0, y: 0 })).toBe('A1');
    expect(pointToGtp({ x: 7, y: 3 })).toBe('H4');
    expect(pointToGtp({ x: 8, y: 3 })).toBe('J4'); // I 없음
    expect(pointToGtp({ x: 18, y: 18 })).toBe('T19');
  });

  it('GTP 문자열을 교차점으로 되돌린다', () => {
    expect(gtpToPoint('D4')).toEqual({ x: 3, y: 3 });
    expect(gtpToPoint('J4')).toEqual({ x: 8, y: 3 });
    expect(gtpToPoint('Q16')).toEqual({ x: 15, y: 15 });
  });

  it('왕복해도 같은 값이다', () => {
    for (const gtp of ['A1', 'D4', 'J10', 'T19']) {
      const point = gtpToPoint(gtp);
      expect(point).not.toBeNull();
      expect(pointToGtp(point!)).toBe(gtp);
    }
  });

  it('패스와 잘못된 좌표는 null 이다', () => {
    expect(gtpToPoint('pass')).toBeNull();
    expect(gtpToPoint('I5')).toBeNull(); // 존재하지 않는 열
    expect(gtpToPoint('T20')).toBeNull(); // 판 밖
    expect(gtpToPoint('')).toBeNull();
  });

  it('판 안인지 판단한다', () => {
    expect(isOnBoard({ x: 0, y: 0 }, SIZE)).toBe(true);
    expect(isOnBoard({ x: 18, y: 18 }, SIZE)).toBe(true);
    expect(isOnBoard({ x: 19, y: 0 }, SIZE)).toBe(false);
    expect(isOnBoard({ x: -1, y: 0 }, SIZE)).toBe(false);
    expect(isOnBoard({ x: 1.5, y: 0 }, SIZE)).toBe(false);
  });
});

describe('19줄 판 치수', () => {
  const metrics = createBoardMetrics(BOARD_PX, SIZE);

  it('여백과 격자를 합치면 판 폭이 된다', () => {
    const span = metrics.padding * 2 + metrics.gap * (SIZE - 1);
    expect(span).toBeCloseTo(BOARD_PX, 6);
  });

  it('비율 토큰으로 돌·화점 크기를 정한다', () => {
    expect(metrics.stoneRadius).toBeCloseTo((metrics.gap * DEFAULT_BOARD_RATIOS.stoneSize) / 2, 6);
    expect(metrics.starRadius).toBeCloseTo((metrics.gap * DEFAULT_BOARD_RATIOS.starSize) / 2, 6);
  });

  it('y 는 아래에서 위로 센다 (화면 좌표와 뒤집힌다)', () => {
    const bottomLeft = pointToPixel(metrics, { x: 0, y: 0 });
    const topLeft = pointToPixel(metrics, { x: 0, y: SIZE - 1 });

    expect(bottomLeft.x).toBeCloseTo(metrics.padding, 6);
    expect(topLeft.y).toBeCloseTo(metrics.padding, 6);
    expect(bottomLeft.y).toBeGreaterThan(topLeft.y);
  });

  it('19줄 화점은 9개다', () => {
    const stars = starPoints(19);
    expect(stars).toHaveLength(9);
    expect(stars).toContainEqual({ x: 3, y: 3 });
    expect(stars).toContainEqual({ x: 9, y: 9 });
    expect(stars).toContainEqual({ x: 15, y: 15 });
  });

  it('9줄·13줄 판은 귀 4개와 천원으로 5개다', () => {
    expect(starPoints(9)).toHaveLength(5);
    expect(starPoints(9)).toContainEqual({ x: 4, y: 4 });
    expect(starPoints(13)).toHaveLength(5);
    expect(starPoints(13)).toContainEqual({ x: 6, y: 6 });
  });
});

describe('클릭 위치 계산', () => {
  const metrics = createBoardMetrics(BOARD_PX, SIZE);

  it('교차점 한가운데를 누르면 그 자리가 나온다', () => {
    for (const point of [
      { x: 0, y: 0 },
      { x: 3, y: 15 },
      { x: 18, y: 18 },
    ]) {
      const pixel = pointToPixel(metrics, point);
      expect(pixelToPoint(metrics, pixel.x, pixel.y)).toEqual(point);
    }
  });

  it('조금 빗나가도 가장 가까운 교차점으로 붙는다', () => {
    const pixel = pointToPixel(metrics, { x: 4, y: 4 });
    const nudge = metrics.gap * 0.3;
    expect(pixelToPoint(metrics, pixel.x + nudge, pixel.y - nudge)).toEqual({ x: 4, y: 4 });
  });

  it('반 칸보다 멀면 착점으로 보지 않는다', () => {
    const pixel = pointToPixel(metrics, { x: 4, y: 4 });
    const far = metrics.gap * 0.45;
    expect(pixelToPoint(metrics, pixel.x + far, pixel.y + far)).toBeNull();
  });

  it('판 바깥 여백은 null 이다', () => {
    expect(pixelToPoint(metrics, 0, 0)).toBeNull();
    expect(pixelToPoint(metrics, BOARD_PX, BOARD_PX)).toBeNull();
  });

  it('판 크기가 0 이면 null 이다 (첫 렌더)', () => {
    expect(pixelToPoint(createBoardMetrics(0, SIZE), 10, 10)).toBeNull();
  });
});

describe('집 예측 인덱스', () => {
  it('배열은 위쪽 행부터 채워진다 (KataGo ownership 순서)', () => {
    const size = 19;
    const territory = Array.from({ length: size * size }, (_, index) => index);

    // 맨 윗줄 왼쪽 끝 = 인덱스 0
    expect(territoryAt(territory, { x: 0, y: size - 1 }, size)).toBe(0);
    // 맨 아랫줄 오른쪽 끝 = 마지막 인덱스
    expect(territoryAt(territory, { x: size - 1, y: 0 }, size)).toBe(size * size - 1);
  });
});
