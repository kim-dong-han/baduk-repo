import { memo, useCallback, useLayoutEffect, useMemo, useRef, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

import { getBoardThemeSnapshot, subscribeBoardTheme } from './board-theme';
import {
  DEFAULT_BOARD_SIZE,
  createBoardMetrics,
  isOnBoard,
  pixelToPoint,
  pointToGtp,
  samePoint,
  type BoardMetrics,
} from './coordinate-system';
import { drawBoardBase } from './renderers/grid-renderer';
import {
  drawCandidates,
  drawCursor,
  drawHover,
  drawMarkers,
  drawTerritory,
  drawVariation,
} from './renderers/overlay-renderer';
import { drawLastMove, drawMoveNumbers, drawStones } from './renderers/stone-renderer';
import type { Candidate, Marker, Point, Stone, StoneColor, Territory, Variation } from './types';
import { useBoardSize } from './use-board-size';

export type BoardProps = {
  /** 줄 수. 기본 19 */
  size?: number;
  stones: Stone[];
  markers?: Marker[];
  candidates?: Candidate[];
  variation?: Variation | null;
  territory?: Territory | null;
  /** 마지막 수. 돌 위에 고리를 두른다. */
  lastMove?: Point | null;
  showMoveNumbers?: boolean;
  showCoordinates?: boolean;
  /** 판 한 변의 최대 길이. 컨테이너가 더 좁으면 컨테이너에 맞춘다. */
  maxSize?: number;
  /** 마우스·키보드로 착점을 고를 수 있는지 */
  interactive?: boolean;
  /** hover 할 때 미리 보여줄 돌 색. 없으면 옅은 표시만 남는다. */
  hoverColor?: StoneColor | null;
  onPointClick?: (point: Point) => void;
  onPointHover?: (point: Point | null) => void;
  /** 스크린리더가 읽을 판 설명. 없으면 줄 수와 돌 개수로 만든다. */
  ariaLabel?: string;
  className?: string;
};

const EMPTY_STONES: Stone[] = [];

/**
 * 바둑판.
 *
 * 받은 데이터를 그리고 "여기가 눌렸다"를 알린다. 그 사이의 판단은 하지 않는다.
 * 착수가 합법인지, 돌이 따내지는지는 features/game 이, 분석 결과는 features/analysis 가 맡는다.
 *
 * 성능을 위해 캔버스를 세 층으로 나눈다.
 *   1. 판·격자·좌표  — 크기나 테마가 바뀔 때만
 *   2. 돌·표식·후보수 — 데이터가 바뀔 때만
 *   3. hover·커서     — 마우스가 움직일 때만 (React 상태를 건드리지 않는다)
 */
export const Board = memo(function Board({
  size = DEFAULT_BOARD_SIZE,
  stones = EMPTY_STONES,
  markers,
  candidates,
  variation,
  territory,
  lastMove,
  showMoveNumbers = false,
  showCoordinates = true,
  maxSize = 720,
  interactive = false,
  hoverColor = null,
  onPointClick,
  onPointHover,
  ariaLabel,
  className,
}: BoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);

  /** 마우스 위치와 키보드 커서. 여기서 바뀌어도 React 는 다시 렌더하지 않는다. */
  const hoverRef = useRef<Point | null>(null);
  const cursorRef = useRef<Point | null>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  const theme = useSyncExternalStore(subscribeBoardTheme, getBoardThemeSnapshot);
  const { boardPx, dpr } = useBoardSize(containerRef, maxSize);

  const metrics = useMemo(
    () => createBoardMetrics(boardPx, size, theme.ratios),
    [boardPx, size, theme.ratios],
  );

  const paintOverlay = useCallback(() => {
    const ctx = prepareLayer(overlayRef.current, metrics, dpr);
    if (!ctx) return;

    if (cursorRef.current) drawCursor(ctx, metrics, theme, cursorRef.current);
    if (hoverRef.current) drawHover(ctx, metrics, theme, hoverRef.current, hoverColor);
  }, [metrics, theme, dpr, hoverColor]);

  // 1층 — 판
  useLayoutEffect(() => {
    const ctx = prepareLayer(baseRef.current, metrics, dpr);
    if (!ctx) return;
    drawBoardBase(ctx, metrics, theme, { showCoordinates });
  }, [metrics, theme, dpr, showCoordinates]);

  // 2층 — 돌과 분석 표시
  useLayoutEffect(() => {
    const ctx = prepareLayer(mainRef.current, metrics, dpr);
    if (!ctx) return;

    if (territory) drawTerritory(ctx, metrics, theme, territory);
    drawStones(ctx, metrics, theme, stones);
    if (lastMove) drawLastMove(ctx, metrics, theme, lastMove, { outline: showMoveNumbers });
    if (showMoveNumbers) drawMoveNumbers(ctx, metrics, theme, stones);
    if (candidates?.length) drawCandidates(ctx, metrics, theme, candidates);
    // 변화도는 후보수보다 구체적이므로 같은 자리면 변화도가 보여야 한다.
    if (variation) drawVariation(ctx, metrics, theme, variation);
    if (markers?.length) drawMarkers(ctx, metrics, theme, markers);
  }, [
    metrics,
    theme,
    dpr,
    stones,
    markers,
    candidates,
    variation,
    territory,
    lastMove,
    showMoveNumbers,
  ]);

  // 3층 — 판 크기나 테마가 바뀌면 hover·커서도 다시 그린다
  useLayoutEffect(() => {
    paintOverlay();
  }, [paintOverlay]);

  const setHover = useCallback(
    (point: Point | null) => {
      if (samePoint(hoverRef.current, point)) return;
      hoverRef.current = point;
      paintOverlay();
      onPointHover?.(point);
    },
    [paintOverlay, onPointHover],
  );

  const moveCursor = useCallback(
    (point: Point) => {
      if (!isOnBoard(point, size)) return;
      cursorRef.current = point;
      paintOverlay();
      if (statusRef.current) {
        statusRef.current.textContent = `${pointToGtp(point, size) ?? ''} 선택 중`;
      }
    },
    [paintOverlay, size],
  );

  const pointFromEvent = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = overlayRef.current;
      if (!canvas || metrics.gap <= 0) return null;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0) return null;
      // 캔버스가 CSS 로 늘어나 있을 수 있으므로 배율을 보정한다.
      const scale = metrics.boardPx / rect.width;
      return pixelToPoint(
        metrics,
        (event.clientX - rect.left) * scale,
        (event.clientY - rect.top) * scale,
      );
    },
    [metrics],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLCanvasElement>) => {
      const step: Record<string, Point> = {
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        ArrowUp: { x: 0, y: 1 },
        ArrowDown: { x: 0, y: -1 },
      };

      const delta = step[event.key];
      if (delta) {
        event.preventDefault();
        const from = cursorRef.current ?? lastMove ?? centerPoint(size);
        moveCursor({ x: from.x + delta.x, y: from.y + delta.y });
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const point = cursorRef.current ?? lastMove ?? centerPoint(size);
        moveCursor(point);
        onPointClick?.(point);
      }
    },
    [lastMove, moveCursor, onPointClick, size],
  );

  const label =
    ariaLabel ??
    `${size}줄 바둑판. 흑 ${countStones(stones, 'B')}개, 백 ${countStones(stones, 'W')}개.`;

  return (
    <div ref={containerRef} className={cn('w-full', className)}>
      <div
        className="relative mx-auto"
        style={{ width: boardPx || undefined, height: boardPx || undefined }}
      >
        <canvas ref={baseRef} aria-hidden="true" className="absolute inset-0 rounded-md" />
        <canvas ref={mainRef} aria-hidden="true" className="absolute inset-0" />
        <canvas
          ref={overlayRef}
          role="img"
          aria-label={label}
          tabIndex={interactive ? 0 : -1}
          className={cn('absolute inset-0 rounded-md', interactive && 'cursor-pointer')}
          onPointerMove={interactive ? (event) => setHover(pointFromEvent(event)) : undefined}
          onPointerLeave={interactive ? () => setHover(null) : undefined}
          onClick={
            interactive
              ? (event) => {
                  const point = pointFromEvent(event);
                  if (point) onPointClick?.(point);
                }
              : undefined
          }
          onKeyDown={interactive ? handleKeyDown : undefined}
        />
      </div>
      {/* 키보드로 고른 자리를 스크린리더에 알린다. Canvas 는 스스로 읽히지 않는다. */}
      <p ref={statusRef} role="status" aria-live="polite" className="sr-only" />
    </div>
  );
});

function centerPoint(size: number): Point {
  const mid = Math.floor(size / 2);
  return { x: mid, y: mid };
}

function countStones(stones: Stone[], color: StoneColor): number {
  return stones.reduce((total, stone) => (stone.color === color ? total + 1 : total), 0);
}

/**
 * 캔버스 크기를 맞추고 그릴 준비를 한다.
 * 물리 픽셀로 키운 뒤 CSS 픽셀 기준으로 그리도록 배율을 건다.
 */
function prepareLayer(
  canvas: HTMLCanvasElement | null,
  metrics: BoardMetrics,
  dpr: number,
): CanvasRenderingContext2D | null {
  if (!canvas || metrics.boardPx <= 0) return null;

  const pixelSize = Math.round(metrics.boardPx * dpr);
  if (canvas.width !== pixelSize || canvas.height !== pixelSize) {
    canvas.width = pixelSize;
    canvas.height = pixelSize;
  }
  canvas.style.width = `${metrics.boardPx}px`;
  canvas.style.height = `${metrics.boardPx}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, metrics.boardPx, metrics.boardPx);
  return ctx;
}
