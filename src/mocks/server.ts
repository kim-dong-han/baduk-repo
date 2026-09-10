import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/** Vitest(jsdom) 및 Node 환경에서 쓰는 목 서버. tests/setup.ts 에서 제어한다. */
export const server = setupServer(...handlers);
