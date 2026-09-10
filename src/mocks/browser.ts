import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

/** 브라우저에서 목 API 를 켠다. NEXT_PUBLIC_ENABLE_API_MOCKING=true 일 때만 호출된다. */
export async function startMockWorker(): Promise<void> {
  await worker.start({
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
