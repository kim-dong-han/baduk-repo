import type { BoardTheme } from '../board-theme';
import { pointToPixel, territoryAt, type BoardMetrics } from '../coordinate-system';
import type { Candidate, Marker, Point, StoneColor, Territory, Variation } from '../types';

import { drawStone } from './stone-renderer';

/**
 * AI 집 예측.
 *
 * 확신이 클수록 큰 사각형으로 그린다. 확신이 약한 곳(0.15 미만)은 그리지 않는다.
 * 전부 칠하면 판이 지저분해져 정작 중요한 경계가 안 보인다.
 */
export function drawTerritory(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  territory: Territory,
): void {
  const threshold = 0.15;

  ctx.save();
  for (let gx = 0; gx < metrics.size; gx += 1) {
    for (let gy = 0; gy < metrics.size; gy += 1) {
      const point = { x: gx, y: gy };
      const value = territoryAt(territory, point, metrics.size);
      if (value === null) continue;

      const strength = Math.abs(value);
      if (strength < threshold) continue;

      const { x, y } = pointToPixel(metrics, point);
      const side = metrics.gap * 0.82 * strength;

      ctx.globalAlpha = 0.55 * strength;
      ctx.fillStyle = value > 0 ? theme.stoneBlack : theme.stoneWhite;
      ctx.fillRect(x - side / 2, y - side / 2, side, side);
    }
  }
  ctx.restore();
}

/**
 * AI 후보수. 순위가 좋을수록 진한 색이다.
 * 승률을 함께 받으면 원 안에 % 로 적는다 — 색만으로 좋고 나쁨을 알리지 않기 위해서다.
 */
export function drawCandidates(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  candidates: Candidate[],
): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (const candidate of candidates) {
    const { x, y } = pointToPixel(metrics, candidate.point);
    const color = theme.candidates[Math.min(candidate.rank, 4) - 1] ?? theme.candidates[3];

    ctx.beginPath();
    ctx.arc(x, y, metrics.stoneRadius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = metrics.lineWidth;
    ctx.strokeStyle = theme.stoneWhiteSheen;
    ctx.stroke();

    if (candidate.winrate === undefined) continue;

    const percent = Math.min(99.9, Math.max(0.1, candidate.winrate * 100));
    ctx.font = `600 ${(metrics.labelFontPx * 0.72).toFixed(1)}px system-ui, sans-serif`;
    ctx.fillStyle = theme.labelOnBlack;
    ctx.fillText(`${percent.toFixed(0)}%`, x, y);
  }

  ctx.restore();
}

/**
 * 예상 진행(변화도). 번호가 붙은 반투명 돌로 그린다.
 *
 * 돌을 따내는 계산은 하지 않는다. 받은 순서대로 놓기만 한다.
 * 따냄까지 반영한 수순이 필요하면 features/game 이 미리 계산해 넘긴다.
 */
export function drawVariation(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  variation: Variation,
): void {
  let color: StoneColor = variation.startColor;

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  variation.moves.forEach((point, index) => {
    drawStone(ctx, metrics, theme, point, color, { alpha: 0.72, shadow: false });

    const { x, y } = pointToPixel(metrics, point);

    // 첫 수는 어디서 갈라지는지 알아야 하므로 고리를 두른다.
    if (index === 0) {
      ctx.beginPath();
      ctx.arc(x, y, metrics.stoneRadius, 0, Math.PI * 2);
      ctx.strokeStyle = theme.accent;
      ctx.lineWidth = Math.max(1, metrics.stoneRadius * 0.16);
      ctx.stroke();
    }

    const text = String(index + 1);
    const scale = text.length >= 3 ? 0.78 : 1;
    ctx.font = `600 ${(metrics.labelFontPx * scale).toFixed(1)}px system-ui, sans-serif`;
    ctx.fillStyle = color === 'B' ? theme.labelOnBlack : theme.labelOnWhite;
    ctx.fillText(text, x, y);

    color = color === 'B' ? 'W' : 'B';
  });

  ctx.restore();
}

/** 표식(동그라미·세모·네모·가위표·점·글자). 색은 tone 이 정한다. */
export function drawMarkers(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  markers: Marker[],
): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = Math.max(1, metrics.markerRadius * 0.28);

  for (const marker of markers) {
    const { x, y } = pointToPixel(metrics, marker.point);
    const color = theme.tones[marker.tone ?? 'neutral'];
    const r = metrics.markerRadius;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    switch (marker.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'dot':
        ctx.beginPath();
        ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.strokeRect(x - r, y - r, r * 2, r * 2);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(x, y - r);
        ctx.lineTo(x + r, y + r * 0.8);
        ctx.lineTo(x - r, y + r * 0.8);
        ctx.closePath();
        ctx.stroke();
        break;
      case 'cross':
        ctx.beginPath();
        ctx.moveTo(x - r, y - r);
        ctx.lineTo(x + r, y + r);
        ctx.moveTo(x + r, y - r);
        ctx.lineTo(x - r, y + r);
        ctx.stroke();
        break;
      case 'label':
        if (!marker.label) break;
        ctx.font = `600 ${metrics.labelFontPx.toFixed(1)}px system-ui, sans-serif`;
        ctx.fillText(marker.label, x, y);
        break;
    }
  }

  ctx.restore();
}

/**
 * 마우스가 올라간 자리.
 * 놓을 색을 알면 그 색 돌을 흐리게 미리 보여주고, 모르면 옅은 표시만 남긴다.
 */
export function drawHover(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  point: Point,
  color: StoneColor | null,
): void {
  if (color) {
    drawStone(ctx, metrics, theme, point, color, { alpha: 0.45, shadow: false });
    return;
  }

  const { x, y } = pointToPixel(metrics, point);
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, metrics.stoneRadius, 0, Math.PI * 2);
  ctx.fillStyle = theme.hover;
  ctx.fill();
  ctx.restore();
}

/** 키보드로 고른 자리. 마우스 hover 와 구분되게 테두리만 그린다. */
export function drawCursor(
  ctx: CanvasRenderingContext2D,
  metrics: BoardMetrics,
  theme: BoardTheme,
  point: Point,
): void {
  const { x, y } = pointToPixel(metrics, point);
  const r = metrics.stoneRadius * 1.05;

  ctx.save();
  ctx.strokeStyle = theme.accent;
  ctx.lineWidth = Math.max(2, metrics.stoneRadius * 0.18);
  ctx.strokeRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}
