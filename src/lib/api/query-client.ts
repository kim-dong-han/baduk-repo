import { QueryClient, isServer } from '@tanstack/react-query';

import { isApiError } from './api-error';

/**
 * 기보/분석 데이터는 한 번 만들어지면 거의 변하지 않는다.
 * 따라서 staleTime 을 넉넉히 두고, 실패한 요청만 선별적으로 재시도한다.
 */
function createQueryClient(): QueryClient {
  return new QueryClient({
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
}

let browserQueryClient: QueryClient | undefined;

/**
 * 서버에서는 요청마다 새 QueryClient 를 만들고(요청 간 캐시 공유 금지),
 * 브라우저에서는 하나를 재사용한다.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return createQueryClient();

  browserQueryClient ??= createQueryClient();
  return browserQueryClient;
}
