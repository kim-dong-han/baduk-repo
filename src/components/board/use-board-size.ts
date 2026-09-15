import { useEffect, useState, type RefObject } from 'react';

export type BoardSize = {
  /** 판 한 변 (CSS 픽셀) */
  boardPx: number;
  /** 물리 픽셀 배율. 이 값을 곱해야 판이 선명하다. */
  dpr: number;
};

const EMPTY: BoardSize = { boardPx: 0, dpr: 1 };

/**
 * 컨테이너 폭에 맞춰 판 크기를 정한다.
 *
 * 판은 정사각형이라 폭만 재면 된다. maxPx 를 넘지 않게 자르고,
 * 화면 배율(devicePixelRatio)도 함께 돌려준다.
 */
export function useBoardSize(ref: RefObject<HTMLElement | null>, maxPx: number): BoardSize {
  const [size, setSize] = useState<BoardSize>(EMPTY);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const width = Math.floor(Math.min(element.clientWidth, maxPx));
      const dpr = typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1;
      // 같은 값이면 상태를 바꾸지 않는다. 리사이즈마다 다시 그리는 것을 막는다.
      setSize((prev) =>
        prev.boardPx === width && prev.dpr === dpr ? prev : { boardPx: width, dpr },
      );
    };

    measure();

    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(measure);
      observer.observe(element);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [ref, maxPx]);

  return size;
}
