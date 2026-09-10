import { Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/api/query-client';

/**
 * devtools 는 개발에서만 쓴다.
 * 삼항의 조건이 빌드 시점에 false 로 치환되므로 프로덕션 번들에서는
 * import 자체가 사라진다.
 */
const Devtools = import.meta.env.DEV
  ? lazy(() =>
      import('@tanstack/react-query-devtools').then((m) => ({ default: m.ReactQueryDevtools })),
    )
  : null;

/**
 * 전역 Provider 는 여기 한 곳에서만 조립한다.
 * 서버 상태는 TanStack Query 가, 화면 상태는 Zustand 가 갖는다.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {Devtools ? (
        <Suspense fallback={null}>
          <Devtools initialIsOpen={false} />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  );
}
