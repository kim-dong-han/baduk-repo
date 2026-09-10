# 백엔드 연동

백엔드는 기존 Spring Boot 서비스를 그대로 쓴다. 이 저장소에 백엔드 로직을 다시 구현하지 않는다. Next.js Route Handler 도 원칙적으로 만들지 않는다 — 만들어야 한다면 그 이유(서버 전용 Secret 이 필요한 프록시 등)를 PR 에 적는다.

## 레이어

```
컴포넌트
   ↓ (훅만 호출)
features/<feature>/hooks     TanStack Query / Mutation
   ↓
features/<feature>/api       도메인 함수 + Zod 응답 스키마
   ↓
lib/api/http-client          fetch · URL 조립 · 에러 변환 · 스키마 검증
   ↓
Spring Boot
```

`fetch` 는 `lib/api/http-client.ts` 에만 존재한다. ESLint 가 `src/app`, `src/components` 에서의 직접 호출을 막는다.

## 작성 예 (실제 스키마가 정해지면 이 형태로)

```ts
// features/game-review/api/get-analysis.ts
import { z } from 'zod';
import { api } from '@/lib/api';

const moveAnalysisSchema = z.object({
  moveNumber: z.number().int().nonnegative(),
  winrate: z.number().min(0).max(1),
  scoreLead: z.number(),
  bestMove: z.string().nullable(),
});

export const gameAnalysisSchema = z.object({
  gameId: z.string(),
  moves: z.array(moveAnalysisSchema),
});

export type GameAnalysis = z.infer<typeof gameAnalysisSchema>;

export function getGameAnalysis(gameId: string, signal?: AbortSignal) {
  return api.get({
    path: `/api/games/${gameId}/analysis`,
    schema: gameAnalysisSchema,
    signal,
  });
}
```

```ts
// features/game-review/hooks/use-game-analysis.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { getGameAnalysis } from '../api/get-analysis';

export const gameReviewKeys = {
  all: ['game-review'] as const,
  analysis: (gameId: string) => [...gameReviewKeys.all, 'analysis', gameId] as const,
};

export function useGameAnalysis(gameId: string) {
  return useQuery({
    queryKey: gameReviewKeys.analysis(gameId),
    queryFn: ({ signal }) => getGameAnalysis(gameId, signal),
  });
}
```

**쿼리 키는 feature 안에서 팩토리로 관리한다.** 문자열을 여기저기 흩어놓지 않는다.

## 응답 검증

`apiRequest({ schema })` 를 통과하지 못한 응답은 `ApiError('RESPONSE_SCHEMA_MISMATCH')` 가 된다. 백엔드 변경을 화면이 조용히 삼키지 않고 즉시 드러내기 위해서다. 스키마 없이 호출하는 것은 204 응답처럼 본문이 없을 때만 허용한다.

## 에러 처리

모든 실패는 `ApiError` 로 통일된다.

| 상황             | `status` | `code`                        |
| ---------------- | -------- | ----------------------------- |
| 네트워크 실패    | `0`      | `NETWORK_ERROR`               |
| 백엔드 4xx/5xx   | 그대로   | 백엔드 `code` 또는 `HTTP_<n>` |
| 응답 형식 불일치 | 그대로   | `RESPONSE_SCHEMA_MISMATCH`    |

재시도 정책은 `ApiError.isRetriable` 이 결정한다(네트워크·408·429·5xx만 재시도). QueryClient 기본값에 이미 연결되어 있으므로 훅마다 `retry` 를 다시 적지 않는다.

UI 에서는 `isApiError(error)` 로 좁혀서 메시지를 고른다. `error.message` 를 그대로 노출해도 되도록, 사용자에게 보여줄 수 있는 문구를 백엔드와 맞춘다.

## 긴 분석 작업

KataGo 분석은 즉시 끝나지 않는다. 백엔드가 어떤 방식을 제공하는지에 따라 아래 중 하나를 고른다. 결정되면 이 문서에 확정해 적는다.

- **폴링** — `useQuery` + `refetchInterval` (분석 상태가 `DONE` 이 되면 중단). 가장 단순하고, 현재 스택으로 추가 의존성 없이 가능하다.
- **SSE** — 진행률을 실시간으로 보여줄 때. `EventSource` 구독을 훅으로 감싸고 결과를 `queryClient.setQueryData` 로 캐시에 밀어 넣는다.

어느 쪽이든 **컴포넌트가 직접 구독하지 않는다.** feature 훅 안에 가둔다.

## 목 API (MSW)

백엔드보다 화면을 먼저 만들 때 쓴다.

```bash
# .env.local
NEXT_PUBLIC_ENABLE_API_MOCKING=true
```

- 핸들러: `src/mocks/handlers/` (도메인별 파일로 나누고 `index.ts` 에서 합친다)
- 브라우저: `src/mocks/browser.ts` — `providers.tsx` 가 워커 준비 후 렌더한다
- 테스트: `src/mocks/server.ts` — `tests/setup.ts` 가 항상 켜고, 등록되지 않은 요청은 실패시킨다
- `public/mockServiceWorker.js` 는 `npx msw init public --save` 로 생성된 파일이다. 직접 수정하지 않는다. MSW 를 올리면 다시 실행한다.

프로덕션에서는 반드시 `false` 다.

## CORS

브라우저가 Render 의 백엔드를 직접 호출하므로 백엔드 쪽에 Vercel 도메인(프리뷰 도메인 포함)이 허용되어 있어야 한다. 프리뷰 배포는 매번 도메인이 바뀌므로 패턴 허용이 필요하다.
