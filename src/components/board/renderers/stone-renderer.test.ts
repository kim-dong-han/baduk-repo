import { describe, expect, it } from 'vitest';

import { readBoardTheme } from '../board-theme';
import { createBoardMetrics, pointToPixel } from '../coordinate-system';
import type { Stone } from '../types';

import { drawLastMove, drawMoveNumbers, drawStones } from './stone-renderer';

/**
 * jsdom 에는 Canvas 2D 구현이 없다.
 * 렌더러가 "무엇을 어디에 그리라고 했는지"를 기록해 확인한다.
 * 픽셀을 비교하는 것보다 이쪽이 깨지기 어렵고 의도도 분명하다.
 */
function createRecordingContext() {
  const arcs: { x: number; y: number; radius: number; fillStyle: unknown }[] = [];
  const texts: { text: string; x: number; y: number; fillStyle: unknown }[] = [];
  const strokes: { x: number; y: number; radius: number; strokeStyle: unknown }[] = [];

  let pending: { x: number; y: number; radius: number } | null = null;

  const ctx = {
    fillStyle: '' as unknown,
    strokeStyle: '' as unknown,
    lineWidth: 0,
    font: '',
    textAlign: '',
    textBaseline: '',
    globalAlpha: 1,
    shadowColor: '',
    shadowBlur: 0,
    shadowOffsetY: 0,
    save() {},
    restore() {},
    beginPath() {},
    arc(x: number, y: number, radius: number) {
      pending = { x, y, radius };
    },
    fill() {
      if (pending) arcs.push({ ...pending, fillStyle: ctx.fillStyle });
    },
    stroke() {
      if (pending) strokes.push({ ...pending, strokeStyle: ctx.strokeStyle });
    },
    fillText(text: string, x: number, y: number) {
      texts.push({ text, x, y, fillStyle: ctx.fillStyle });
    },
    createRadialGradient() {
      return { addColorStop() {} };
    },
  };

  return { ctx: ctx as unknown as CanvasRenderingContext2D, arcs, texts, strokes };
}

const SIZE = 19;
const metrics = createBoardMetrics(570, SIZE);
const theme = readBoardTheme();

const STONES: Stone[] = [
  { point: { x: 3, y: 3 }, color: 'B', moveNumber: 1 },
  { point: { x: 15, y: 15 }, color: 'W', moveNumber: 2 },
  { point: { x: 15, y: 3 }, color: 'B', moveNumber: 3 },
];

describe('돌 렌더링', () => {
  it('받은 돌 수만큼 그린다', () => {
    const { ctx, arcs } = createRecordingContext();
    drawStones(ctx, metrics, theme, STONES);
    expect(arcs).toHaveLength(STONES.length);
  });

  it('돌을 교차점 한가운데에 놓는다', () => {
    const { ctx, arcs } = createRecordingContext();
    drawStones(ctx, metrics, theme, [STONES[0]!]);

    const expected = pointToPixel(metrics, { x: 3, y: 3 });
    expect(arcs[0]!.x).toBeCloseTo(expected.x, 6);
    expect(arcs[0]!.y).toBeCloseTo(expected.y, 6);
    expect(arcs[0]!.radius).toBeCloseTo(metrics.stoneRadius, 6);
  });

  it('돌이 없으면 아무것도 그리지 않는다', () => {
    const { ctx, arcs } = createRecordingContext();
    drawStones(ctx, metrics, theme, []);
    expect(arcs).toHaveLength(0);
  });

  it('흑돌과 백돌의 외곽선 색이 다르다', () => {
    const { ctx, strokes } = createRecordingContext();
    drawStones(ctx, metrics, theme, [STONES[0]!, STONES[1]!]);
    expect(strokes[0]!.strokeStyle).toBe(theme.stoneBlackEdge);
    expect(strokes[1]!.strokeStyle).toBe(theme.stoneWhiteEdge);
  });
});

describe('수순 번호', () => {
  it('번호가 있는 돌에만 번호를 적는다', () => {
    const { ctx, texts } = createRecordingContext();
    drawMoveNumbers(ctx, metrics, theme, [...STONES, { point: { x: 9, y: 9 }, color: 'B' }]);

    expect(texts.map((t) => t.text)).toEqual(['1', '2', '3']);
  });

  it('번호를 돌 한가운데에 적는다', () => {
    const { ctx, texts } = createRecordingContext();
    drawMoveNumbers(ctx, metrics, theme, [STONES[0]!]);

    const expected = pointToPixel(metrics, { x: 3, y: 3 });
    expect(texts[0]!.x).toBeCloseTo(expected.x, 6);
    expect(texts[0]!.y).toBeCloseTo(expected.y, 6);
  });

  it('흑돌 위에는 밝은 글자, 백돌 위에는 어두운 글자를 쓴다', () => {
    const { ctx, texts } = createRecordingContext();
    drawMoveNumbers(ctx, metrics, theme, [STONES[0]!, STONES[1]!]);

    expect(texts[0]!.fillStyle).toBe(theme.labelOnBlack);
    expect(texts[1]!.fillStyle).toBe(theme.labelOnWhite);
  });
});

describe('마지막 수 표시', () => {
  it('그 자리에 고리를 그린다', () => {
    const { ctx, strokes } = createRecordingContext();
    drawLastMove(ctx, metrics, theme, { x: 15, y: 3 });

    const expected = pointToPixel(metrics, { x: 15, y: 3 });
    expect(strokes).toHaveLength(1);
    expect(strokes[0]!.x).toBeCloseTo(expected.x, 6);
    expect(strokes[0]!.y).toBeCloseTo(expected.y, 6);
    expect(strokes[0]!.strokeStyle).toBe(theme.lastMove);
    // 돌보다 작아야 돌 위에 얹힌 것으로 보인다
    expect(strokes[0]!.radius).toBeLessThan(metrics.stoneRadius);
  });
});
