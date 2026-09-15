import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Board } from './board';
import { createBoardMetrics, pointToPixel } from './coordinate-system';
import type { Stone } from './types';

const BOARD_PX = 570;
const SIZE = 19;

const STONES: Stone[] = [
  { point: { x: 3, y: 3 }, color: 'B', moveNumber: 1 },
  { point: { x: 15, y: 15 }, color: 'W', moveNumber: 2 },
];

/** jsdom 은 레이아웃을 계산하지 않는다. 컨테이너 폭과 캔버스 위치를 대신 정해 준다. */
let containerWidth = BOARD_PX;
let resizeCallbacks: (() => void)[] = [];

beforeEach(() => {
  containerWidth = BOARD_PX;
  resizeCallbacks = [];

  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => containerWidth);

  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resizeCallbacks.push(callback);
      }
      observe() {}
      disconnect() {}
    },
  );

  // jsdom 에는 Canvas 2D 구현이 없다. 여기서는 그리기가 아니라 크기·좌표·이벤트를 확인한다.
  // (무엇을 그리는지는 renderers/*.test.ts 가 확인한다)
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

  // 캔버스는 화면 왼쪽 위에 판 크기 그대로 놓여 있다고 본다.
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockImplementation(function (
    this: HTMLCanvasElement,
  ) {
    const size = Number.parseFloat(this.style.width) || containerWidth;
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: size,
      bottom: size,
      width: size,
      height: size,
      toJSON: () => ({}),
    };
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function clickAt(canvas: HTMLElement, point: { x: number; y: number }, boardPx = BOARD_PX) {
  const pixel = pointToPixel(createBoardMetrics(boardPx, SIZE), point);
  return userEvent.pointer({
    target: canvas,
    coords: { clientX: pixel.x, clientY: pixel.y },
    keys: '[MouseLeft]',
  });
}

describe('Board', () => {
  it('19줄 판과 돌 개수를 스크린리더에 알린다', () => {
    render(<Board stones={STONES} />);
    expect(screen.getByRole('img', { name: '19줄 바둑판. 흑 1개, 백 1개.' })).toBeInTheDocument();
  });

  it('줄 수를 바꿀 수 있다', () => {
    render(<Board size={9} stones={[]} />);
    expect(screen.getByRole('img', { name: /^9줄 바둑판/ })).toBeInTheDocument();
  });

  it('컨테이너 폭에 맞춰 판을 그린다', () => {
    const { container } = render(<Board stones={STONES} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ width: `${BOARD_PX}px`, height: `${BOARD_PX}px` });
  });

  it('창이 줄면 판도 줄어든다', () => {
    const { container } = render(<Board stones={STONES} />);

    act(() => {
      containerWidth = 320;
      resizeCallbacks.forEach((callback) => callback());
    });

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveStyle({ width: '320px', height: '320px' });
  });

  it('maxSize 보다 크게 그리지 않는다', () => {
    containerWidth = 1200;
    const { container } = render(<Board stones={STONES} maxSize={640} />);
    expect(container.querySelector('canvas')).toHaveStyle({ width: '640px' });
  });

  it('누른 자리의 교차점을 알려준다', async () => {
    const onPointClick = vi.fn();
    render(<Board stones={STONES} interactive onPointClick={onPointClick} />);

    await clickAt(screen.getByRole('img'), { x: 15, y: 3 });

    expect(onPointClick).toHaveBeenCalledWith({ x: 15, y: 3 });
  });

  it('판 바깥 여백을 누르면 알리지 않는다', async () => {
    const onPointClick = vi.fn();
    render(<Board stones={STONES} interactive onPointClick={onPointClick} />);

    await userEvent.pointer({
      target: screen.getByRole('img'),
      coords: { clientX: 0, clientY: 0 },
      keys: '[MouseLeft]',
    });

    expect(onPointClick).not.toHaveBeenCalled();
  });

  it('판이 줄어든 뒤에도 누른 자리를 맞게 계산한다', async () => {
    const onPointClick = vi.fn();
    render(<Board stones={STONES} interactive onPointClick={onPointClick} />);

    act(() => {
      containerWidth = 320;
      resizeCallbacks.forEach((callback) => callback());
    });

    await clickAt(screen.getByRole('img'), { x: 9, y: 9 }, 320);

    expect(onPointClick).toHaveBeenCalledWith({ x: 9, y: 9 });
  });

  it('읽기 전용이면 클릭에 반응하지 않는다', async () => {
    const onPointClick = vi.fn();
    render(<Board stones={STONES} onPointClick={onPointClick} />);

    await clickAt(screen.getByRole('img'), { x: 3, y: 3 });

    expect(onPointClick).not.toHaveBeenCalled();
  });

  it('hover 한 교차점을 알린다', async () => {
    const onPointHover = vi.fn();
    render(<Board stones={STONES} interactive onPointHover={onPointHover} />);

    const pixel = pointToPixel(createBoardMetrics(BOARD_PX, SIZE), { x: 4, y: 4 });
    await userEvent.pointer({
      target: screen.getByRole('img'),
      coords: { clientX: pixel.x, clientY: pixel.y },
    });

    expect(onPointHover).toHaveBeenLastCalledWith({ x: 4, y: 4 });
  });

  it('방향키로 자리를 옮기고 Enter 로 고른다', async () => {
    const onPointClick = vi.fn();
    render(<Board stones={[]} interactive lastMove={{ x: 9, y: 9 }} onPointClick={onPointClick} />);

    const board = screen.getByRole('img');
    board.focus();
    await userEvent.keyboard('{ArrowRight}{ArrowUp}{Enter}');

    expect(onPointClick).toHaveBeenCalledWith({ x: 10, y: 10 });
    // GTP 는 I 열을 건너뛰므로 x=10 은 L 이다
    expect(screen.getByRole('status')).toHaveTextContent('L11 선택 중');
  });

  it('방향키로 판 밖으로 나가지 않는다', async () => {
    const onPointClick = vi.fn();
    render(
      <Board
        size={19}
        stones={[]}
        interactive
        lastMove={{ x: 0, y: 0 }}
        onPointClick={onPointClick}
      />,
    );

    const board = screen.getByRole('img');
    board.focus();
    await userEvent.keyboard('{ArrowLeft}{ArrowDown}{Enter}');

    expect(onPointClick).toHaveBeenCalledWith({ x: 0, y: 0 });
  });
});
