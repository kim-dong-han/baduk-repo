import { QueryClient } from '@tanstack/react-query';

import { isApiError } from './api-error';

/**
 * 기보와 분석 결과는 한 번 만들어지면 거의 변하지 않는다.
 * 그래서 staleTime 을 넉넉히 두고, 다시 시도해서 결과가 달라질 수 있는
 * 실패만 골라서 재시도한다.
 *
 * SPA 이므로 인스턴스는 하나면 된다.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (isApiError(error) && !error.isRetriable) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
