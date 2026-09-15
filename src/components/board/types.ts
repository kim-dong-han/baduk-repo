/**
 * 바둑판이 받는 데이터의 모양.
 *
 * Board 는 "무엇을 어디에 그릴지"만 받는다. 착수가 합법인지, 돌이 따내지는지,
 * 지금 몇 수째인지는 판단하지 않는다. 그 판단은 features/game · features/analysis 가 한다.
 */

/**
 * 교차점 좌표.
 *
 * x 는 왼쪽에서 오른쪽으로 0..size-1.
 * **y 는 아래에서 위로 0..size-1** 이다 (GTP 행 번호 − 1).
 * 화면 좌표(위가 0)와 뒤집혀 있으므로 변환은 coordinate-system 이 담당한다.
 */
export type Point = {
  x: number;
  y: number;
};

export type StoneColor = 'B' | 'W';

export type Stone = {
  point: Point;
  color: StoneColor;
  /** 수순 번호. showMoveNumbers 가 켜져 있을 때만 그린다. */
  moveNumber?: number;
};

/** 표식의 모양. 무엇을 뜻하는지는 tone 과 label 이 정한다. */
export type MarkerShape = 'circle' | 'square' | 'triangle' | 'cross' | 'dot' | 'label';

/**
 * 표식의 의미. 색은 여기서 정해지고 값은 디자인 토큰에서 온다.
 * 호출하는 쪽이 직접 색을 넘기지 않는다.
 */
export type MarkerTone = 'neutral' | 'best' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';

export type Marker = {
  point: Point;
  shape: MarkerShape;
  tone?: MarkerTone;
  /** shape 가 'label' 일 때 그릴 짧은 글자 (예: 'A', '3') */
  label?: string;
};

/** AI 후보수 하나. 순위가 낮을수록(1 이 가장 좋음) 진하게 그린다. */
export type Candidate = {
  point: Point;
  /** 1 부터 */
  rank: number;
  /** 0~1. **둘 차례 쪽 관점**이다. 화면에는 % 로 그린다. */
  winrate?: number;
  /** 이 수 이후 예상 진행. hover 했을 때 변화도로 보여줄 용도로 함께 들고 다닌다. */
  pv?: Point[];
};

/** 예상 진행(변화도). 번호가 붙은 반투명 돌로 그린다. */
export type Variation = {
  /** 첫 수를 두는 색. 이후 번갈아 놓인다. */
  startColor: StoneColor;
  moves: Point[];
};

/**
 * AI 집 예측. 길이는 size × size 이고 값은 −1..1 이다 (+흑 / −백).
 * 인덱스는 **위쪽 행부터** 채운다: (size − 1 − y) × size + x.
 * 백엔드(KataGo ownership)가 주는 순서를 그대로 쓴다.
 */
export type Territory = number[];
