import type { BoardTheme } from '../board-theme';
import { pointToPixel, starPoints, type BoardMetrics } from '../coordinate-system';

/** GTP 열 이름. I 를 건너뛴다. */
const COLUMN_LABELS = 'ABCDEFGHJKLMNOPQRST';

/**
 * 판·격자·화점·좌표를 그린다.
 *
 * 이 층은 판 크기나 테마가 바뀔 때만 다시 그린다. 돌을 놓거나 마우스를 움직일 때는
 * 건드리지 않는다.
 */
export function drawBoardBase(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  options: { showCoordinates?: boolean } = {},
): void {
  const { boardPx, size, padding, gap } = metrics;

  ctx.clearRect(0, 0, boardPx, boardPx);

  // 나무 바탕. 위쪽을 살짝 밝게 해 판에 두께가 있어 보이게 한다.
  const background = ctx.createLinearGradient(0, 0, boardPx, boardPx);
  background.addColorStop(0, theme.surfaceLight);
  background.addColorStop(1, theme.surface);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, boardPx, boardPx);

  const first = pointToPixel(metrics, { x: 0, y: size - 1 });
  const last = pointToPixel(metrics, { x: size - 1, y: 0 });

  ctx.strokeStyle = theme.line;
  ctx.lineWidth = metrics.lineWidth;
  for (let i = 0; i < size; i += 1) {
    const offset = padding + i * gap;
    ctx.beginPath();
    ctx.moveTo(offset, first.y);
    ctx.lineTo(offset, last.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(first.x, offset);
    ctx.lineTo(last.x, offset);
    ctx.stroke();
  }

  // 바깥 테두리는 조금 두껍게 — 판의 끝이 어디인지 보이게 한다.
  ctx.strokeStyle = theme.lineEdge;
  ctx.lineWidth = metrics.edgeWidth;
  ctx.strokeRect(first.x, first.y, last.x - first.x, last.y - first.y);

  ctx.fillStyle = theme.star;
  for (const star of starPoints(size)) {
    const { x, y } = pointToPixel(metrics, star);
    ctx.beginPath();
    ctx.arc(x, y, metrics.starRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  if (options.showCoordinates) drawCoordinates(ctx, metrics, theme);
}

function drawCoordinates(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
): void {
  const { size, boardPx, padding } = metrics;
  if (size > COLUMN_LABELS.length) return;

  // 좌표는 판 여백 한가운데에 놓는다.
  const inset = padding / 2;

  ctx.fillStyle = theme.coord;
  ctx.font = `${metrics.coordFontPx.toFixed(1)}px system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < size; i += 1) {
    const { x } = pointToPixel(metrics, { x: i, y: 0 });
    ctx.fillText(COLUMN_LABELS[i] ?? '', x, inset);
    ctx.fillText(COLUMN_LABELS[i] ?? '', x, boardPx - inset);

    const { y } = pointToPixel(metrics, { x: 0, y: i });
    ctx.fillText(String(i + 1), inset, y);
    ctx.fillText(String(i + 1), boardPx - inset, y);
  }
}
