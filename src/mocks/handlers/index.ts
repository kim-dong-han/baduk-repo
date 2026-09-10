import type { RequestHandler } from 'msw';

/**
 * MSW 핸들러 모음.
 *
 * 기능이 늘어나면 `handlers/games.ts`, `handlers/analysis.ts` 처럼
 * 도메인별 파일로 나누고 여기서 합친다.
 */
export const handlers: RequestHandler[] = [];
