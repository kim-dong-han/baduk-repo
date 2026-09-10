import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/app';
import '@/styles/globals.css';

/**
 * 백엔드가 아직 없어도 화면 개발이 멈추지 않도록, 목 API 를 먼저 띄운다.
 * 워커가 준비되기 전에 렌더하면 첫 요청이 목을 통과하지 못한다.
 */
async function startMocking(): Promise<void> {
  // import.meta.env 를 직접 본다. Vite 가 빌드 시점에 문자열로 치환하므로
  // 플래그가 꺼진 빌드에서는 아래 dynamic import 가 통째로 사라진다.
  // (env.ts 를 거치면 Zod 를 통과하느라 번들러가 죽은 가지를 못 알아본다)
  if (import.meta.env.VITE_ENABLE_API_MOCKING !== 'true') return;

  const { startMockWorker } = await import('@/mocks/browser');
  await startMockWorker();
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('#root 를 찾지 못했다. index.html 을 확인한다.');
}

void startMocking()
  .catch((error: unknown) => {
    // 목 서버가 안 떠도 화면은 뜬다. 요청이 실패할 뿐이다.
    console.error('[msw] 목 서버를 시작하지 못했다.', error);
  })
  .finally(() => {
    createRoot(container).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  });
