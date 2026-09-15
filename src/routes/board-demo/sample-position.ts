import {
  gtpToPoint,
  type Candidate,
  type Marker,
  type Stone,
  type Variation,
} from '@/components/board';

/**
 * 데모용 가짜 국면. 백엔드가 붙기 전까지 판을 눈으로 확인하는 데만 쓴다.
 * 실제 기보가 아니라 화면 확인을 위해 손으로 찍은 수순이다.
 */
const MOVES = [
  'Q16',
  'D4',
  'Q4',
  'D16',
  'C6',
  'F3',
  'R6',
  'O17',
  'C14',
  'F17',
  'Q10',
  'C9',
  'E2',
  'R14',
  'O3',
  'D18',
  'K3',
  'H17',
];

function toPoint(gtp: string) {
  const point = gtpToPoint(gtp);
  if (!point) throw new Error(`좌표를 읽지 못했습니다: ${gtp}`);
  return point;
}

export const SAMPLE_STONES: Stone[] = MOVES.map((gtp, index) => ({
  point: toPoint(gtp),
  color: index % 2 === 0 ? 'B' : 'W',
  moveNumber: index + 1,
}));

export const SAMPLE_LAST_MOVE = toPoint(MOVES[MOVES.length - 1]!);

export const SAMPLE_CANDIDATES: Candidate[] = [
  { point: toPoint('R9'), rank: 1, winrate: 0.58, pv: ['R9', 'Q9', 'R10'].map(toPoint) },
  { point: toPoint('C11'), rank: 2, winrate: 0.54 },
  { point: toPoint('M17'), rank: 3, winrate: 0.51 },
  { point: toPoint('G15'), rank: 4, winrate: 0.47 },
];

export const SAMPLE_VARIATION: Variation = {
  startColor: 'B',
  moves: ['R9', 'Q9', 'R10', 'Q10', 'R11'].map(toPoint),
};

export const SAMPLE_MARKERS: Marker[] = [
  { point: toPoint('C9'), shape: 'triangle', tone: 'mistake' },
  { point: toPoint('F17'), shape: 'square', tone: 'good' },
  { point: toPoint('K3'), shape: 'label', label: 'A', tone: 'best' },
];

/**
 * 가짜 집 예측. 아래쪽·오른쪽은 흑, 위쪽·왼쪽은 백으로 기울게 만든다.
 * 인덱스는 위쪽 행부터다(KataGo ownership 과 같은 순서).
 */
export function createSampleTerritory(size = 19): number[] {
  const territory: number[] = [];
  for (let row = 0; row < size; row += 1) {
    for (let x = 0; x < size; x += 1) {
      const y = size - 1 - row;
      const lean = (y - (size - 1) / 2) / size + (x - (size - 1) / 2) / size;
      territory.push(Math.max(-1, Math.min(1, -lean * 1.1)));
    }
  }
  return territory;
}
