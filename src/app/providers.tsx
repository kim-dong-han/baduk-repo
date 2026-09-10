'use client';

import { useEffect, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { getQueryClient } from '@/lib/api/query-client';
import { env } from '@/lib/config/env';

/**
 * 전역 Provider 는 여기 한 곳에서만 조립한다.
 * 화면 단위 상태는 Zustand store 로, 서버 상태는 TanStack Query 로 다룬다.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [isMockingReady, setIsMockingReady] = useState(!env.NEXT_PUBLIC_ENABLE_API_MOCKING);

  useEffect(() => {
    if (!env.NEXT_PUBLIC_ENABLE_API_MOCKING) return;

    let cancelled = false;

    void import('@/mocks/browser')
      .then(({ startMockWorker }) => startMockWorker())
      .catch((error: unknown) => {
        console.error('[msw] 목 서버를 시작하지 못했다.', error);
      })
      .finally(() => {
        if (!cancelled) setIsMockingReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 목 API 를 쓰는 동안에는 워커가 준비된 뒤에 요청이 나가야 한다.
  if (!isMockingReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
