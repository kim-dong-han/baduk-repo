import type { BoardTheme } from '../board-theme';
import { pointToPixel, type BoardMetrics } from '../coordinate-system';
import type { Point, Stone, StoneColor } from '../types';

/** 돌 하나. 위치는 이미 정해져 있고 규칙 판단은 하지 않는다. */
export function drawStone(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  point: Point,
  color: StoneColor,
  options: { alpha?: number; shadow?: boolean } = {},
): void {
  const { x, y } = pointToPixel(metrics, point);
  const radius = metrics.stoneRadius;
  const isBlack = color === 'B';

  ctx.save();
  if (options.alpha !== undefined) ctx.globalAlpha = options.alpha;

  if (options.shadow !== false) {
    ctx.shadowColor = theme.stoneShadow;
    ctx.shadowBlur = radius * 0.35;
    ctx.shadowOffsetY = radius * 0.12;
  }

  // 왼쪽 위에서 빛이 들어오는 것처럼 보이게 한다.
  const sheen = ctx.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.35,
    radius * 0.1,
    x,
    y,
    radius,
  );
  sheen.addColorStop(0, isBlack ? theme.stoneBlackSheen : theme.stoneWhiteSheen);
  sheen.addColorStop(1, isBlack ? theme.stoneBlack : theme.stoneWhite);

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = sheen;
  ctx.fill();

  // 외곽선이 없으면 흰 돌이 밝은 판에, 검은 돌이 어두운 판에 묻힌다.
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.lineWidth = metrics.lineWidth;
  ctx.strokeStyle = isBlack ? theme.stoneBlackEdge : theme.stoneWhiteEdge;
  ctx.stroke();

  ctx.restore();
}

export function drawStones(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  stones: Stone[],
): void {
  for (const stone of stones) {
    drawStone(ctx, metrics, theme, stone.point, stone.color);
  }
}

/** 돌 위의 수순 번호. 번호가 있는 돌만 그린다. */
export function drawMoveNumbers(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  stones: Stone[],
): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const stone of stones) {
    if (stone.moveNumber === undefined) continue;

    const { x, y } = pointToPixel(metrics, stone.point);
    const text = String(stone.moveNumber);
    // 세 자리가 넘으면 돌 밖으로 나가므로 글자를 줄인다.
    const scale = text.length >= 3 ? 0.78 : 1;

    ctx.font = `600 ${(metrics.labelFontPx * scale).toFixed(1)}px system-ui, sans-serif`;
    ctx.fillStyle = stone.color === 'B' ? theme.labelOnBlack : theme.labelOnWhite;
    ctx.fillText(text, x, y);
  }

  ctx.restore();
}

/**
 * 마지막 수 표시.
 *
 * 기본은 돌 가운데의 작은 고리다. 수순 번호가 켜져 있으면 숫자를 가리므로
 * 돌 가장자리를 두르는 링으로 바꾼다.
 */
export function drawLastMove(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  point: Point,
  options: { outline?: boolean } = {},
): void {
  const { x, y } = pointToPixel(metrics, point);
  const radius = options.outline ? metrics.stoneRadius * 0.92 : metrics.stoneRadius * 0.42;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = theme.lastMove;
  ctx.lineWidth = Math.max(1, metrics.stoneRadius * 0.16);
  ctx.stroke();
  ctx.restore();
}
