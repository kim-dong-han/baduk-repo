import {
  BOARD_COLOR_TOKENS,
  BOARD_RATIO_TOKENS,
  MOVE_QUALITY_TOKENS,
  onThemeChange,
  readRatio,
  readToken,
} from '@/lib/design/tokens';

import { DEFAULT_BOARD_RATIOS, type BoardRatios } from './coordinate-system';
import type { MarkerTone } from './types';

/**
 * Canvas 가 쓸 색과 비율을 디자인 토큰에서 읽어 온 값.
 * 렌더러는 이 객체만 보고 그린다. 색을 코드에 적지 않는다.
 */
export type BoardTheme = {
  surface: string;
  surfaceLight: string;
  edge: string;
  frame: string;
  line: string;
  lineEdge: string;
  star: string;
  coord: string;
  hover: string;
  lastMove: string;
  stoneBlack: string;
  stoneBlackEdge: string;
  stoneBlackSheen: string;
  stoneWhite: string;
  stoneWhiteEdge: string;
  stoneWhiteSheen: string;
  stoneShadow: string;
  labelOnBlack: string;
  labelOnWhite: string;
  /** 후보수 1·2·3위와 그 밖 */
  candidates: [string, string, string, string];
  /** 표식의 의미별 색 */
  tones: Record<MarkerTone, string>;
  accent: string;
  ratios: BoardRatios;
};

/**
 * 토큰을 읽지 못하는 환경(테스트 등)에서 쓰는 값.
 * tokens.css 의 라이트 모드 값과 같게 유지한다.
 */
const FALLBACK: BoardTheme = {
  surface: 'oklch(0.82 0.07 74)',
  surfaceLight: 'oklch(0.845 0.064 75)',
  edge: 'oklch(0.66 0.068 70)',
  frame: 'oklch(0.55 0.06 68)',
  line: 'oklch(0.32 0.028 62 / 0.82)',
  lineEdge: 'oklch(0.3 0.028 62 / 0.95)',
  star: 'oklch(0.28 0.028 62 / 0.92)',
  coord: 'oklch(0.4 0.026 62 / 0.9)',
  hover: 'oklch(0.32 0.028 62 / 0.14)',
  lastMove: 'oklch(0.55 0.165 28)',
  stoneBlack: 'oklch(0.19 0.008 265)',
  stoneBlackEdge: 'oklch(0.34 0.012 265)',
  stoneBlackSheen: 'oklch(0.46 0.012 265 / 0.55)',
  stoneWhite: 'oklch(0.975 0.004 90)',
  stoneWhiteEdge: 'oklch(0.79 0.008 85)',
  stoneWhiteSheen: 'oklch(1 0 0 / 0.9)',
  stoneShadow: 'oklch(0.24 0.02 62 / 0.28)',
  labelOnBlack: 'oklch(0.98 0 0)',
  labelOnWhite: 'oklch(0.2 0.008 265)',
  candidates: [
    'oklch(0.55 0.115 152 / 0.9)',
    'oklch(0.62 0.09 152 / 0.75)',
    'oklch(0.7 0.06 152 / 0.6)',
    'oklch(0.75 0.03 152 / 0.45)',
  ],
  tones: {
    neutral: 'oklch(0.32 0.028 62 / 0.82)',
    best: 'oklch(0.47 0.115 248)',
    good: 'oklch(0.47 0.105 152)',
    inaccuracy: 'oklch(0.54 0.1 79)',
    mistake: 'oklch(0.52 0.125 48)',
    blunder: 'oklch(0.47 0.15 28)',
  },
  accent: 'oklch(0.47 0.115 248)',
  ratios: DEFAULT_BOARD_RATIOS,
};

function color(name: string, fallback: string): string {
  return readToken(name) || fallback;
}

export function readBoardTheme(): BoardTheme {
  return {
    surface: color(BOARD_COLOR_TOKENS.surface, FALLBACK.surface),
    surfaceLight: color(BOARD_COLOR_TOKENS.surfaceLight, FALLBACK.surfaceLight),
    edge: color(BOARD_COLOR_TOKENS.edge, FALLBACK.edge),
    frame: color(BOARD_COLOR_TOKENS.frame, FALLBACK.frame),
    line: color(BOARD_COLOR_TOKENS.line, FALLBACK.line),
    lineEdge: color(BOARD_COLOR_TOKENS.lineEdge, FALLBACK.lineEdge),
    star: color(BOARD_COLOR_TOKENS.star, FALLBACK.star),
    coord: color(BOARD_COLOR_TOKENS.coord, FALLBACK.coord),
    hover: color(BOARD_COLOR_TOKENS.hover, FALLBACK.hover),
    lastMove: color(BOARD_COLOR_TOKENS.lastMove, FALLBACK.lastMove),
    stoneBlack: color(BOARD_COLOR_TOKENS.stoneBlack, FALLBACK.stoneBlack),
    stoneBlackEdge: color(BOARD_COLOR_TOKENS.stoneBlackEdge, FALLBACK.stoneBlackEdge),
    stoneBlackSheen: color(BOARD_COLOR_TOKENS.stoneBlackSheen, FALLBACK.stoneBlackSheen),
    stoneWhite: color(BOARD_COLOR_TOKENS.stoneWhite, FALLBACK.stoneWhite),
    stoneWhiteEdge: color(BOARD_COLOR_TOKENS.stoneWhiteEdge, FALLBACK.stoneWhiteEdge),
    stoneWhiteSheen: color(BOARD_COLOR_TOKENS.stoneWhiteSheen, FALLBACK.stoneWhiteSheen),
    stoneShadow: color(BOARD_COLOR_TOKENS.stoneShadow, FALLBACK.stoneShadow),
    labelOnBlack: color(BOARD_COLOR_TOKENS.labelOnBlack, FALLBACK.labelOnBlack),
    labelOnWhite: color(BOARD_COLOR_TOKENS.labelOnWhite, FALLBACK.labelOnWhite),
    candidates: [
      color('--candidate-1', FALLBACK.candidates[0]),
      color('--candidate-2', FALLBACK.candidates[1]),
      color('--candidate-3', FALLBACK.candidates[2]),
      color('--candidate-rest', FALLBACK.candidates[3]),
    ],
    tones: {
      neutral: color(BOARD_COLOR_TOKENS.line, FALLBACK.tones.neutral),
      best: color(MOVE_QUALITY_TOKENS.best, FALLBACK.tones.best),
      good: color(MOVE_QUALITY_TOKENS.good, FALLBACK.tones.good),
      inaccuracy: color(MOVE_QUALITY_TOKENS.inaccuracy, FALLBACK.tones.inaccuracy),
      mistake: color(MOVE_QUALITY_TOKENS.mistake, FALLBACK.tones.mistake),
      blunder: color(MOVE_QUALITY_TOKENS.blunder, FALLBACK.tones.blunder),
    },
    accent: color('--accent', FALLBACK.accent),
    ratios: {
      stoneSize: readRatio(BOARD_RATIO_TOKENS.stoneSize, DEFAULT_BOARD_RATIOS.stoneSize),
      starSize: readRatio(BOARD_RATIO_TOKENS.starSize, DEFAULT_BOARD_RATIOS.starSize),
      lineWidth: readRatio(BOARD_RATIO_TOKENS.lineWidth, DEFAULT_BOARD_RATIOS.lineWidth),
      edgeWidth: readRatio(BOARD_RATIO_TOKENS.edgeWidth, DEFAULT_BOARD_RATIOS.edgeWidth),
      padding: readRatio(BOARD_RATIO_TOKENS.padding, DEFAULT_BOARD_RATIOS.padding),
      labelSize: readRatio(BOARD_RATIO_TOKENS.labelSize, DEFAULT_BOARD_RATIOS.labelSize),
      coordSize: readRatio(BOARD_RATIO_TOKENS.coordSize, DEFAULT_BOARD_RATIOS.coordSize),
      markerSize: readRatio(BOARD_RATIO_TOKENS.markerSize, DEFAULT_BOARD_RATIOS.markerSize),
    },
  };
}

/*
 * 테마는 문서 전체에 하나뿐이라 모듈 수준에 담아 두고 구독한다.
 * useSyncExternalStore 로 읽으면 effect 안에서 setState 하지 않아도 되고,
 * 여러 판이 떠 있어도 같은 객체를 공유한다.
 */
let cached: BoardTheme | null = null;

export function getBoardThemeSnapshot(): BoardTheme {
  cached ??= readBoardTheme();
  return cached;
}

export function subscribeBoardTheme(onChange: () => void): () => void {
  return onThemeChange(() => {
    cached = null;
    onChange();
  });
}
