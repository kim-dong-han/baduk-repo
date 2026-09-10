import type { z } from 'zod';

import { env } from '@/lib/config/env';

import { ApiError } from './api-error';

/**
 * 백엔드 API 로 나가는 유일한 출구.
 *
 * 규칙
 * - 페이지/컴포넌트는 이 파일을 직접 import 하지 않는다.
 * - `features/<feature>/api/*.ts` 가 이 클라이언트를 감싸 도메인 함수를 만들고,
 *   `features/<feature>/hooks/*.ts` 가 TanStack Query 로 그것을 소비한다.
 * - 응답은 항상 Zod 스키마로 검증해 타입을 보증한다.
 */

type RequestOptions<TSchema extends z.ZodType> = {
  /** '/api/games/123' 처럼 baseUrl 뒤에 붙는 경로 */
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** JSON 으로 직렬화되어 body 에 실린다. */
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  /** 응답 본문 검증 스키마. 204 응답이면 생략한다. */
  schema?: TSchema;
  signal?: AbortSignal;
  cache?: RequestCache;
  /** 인증이 붙으면 여기로 Authorization 헤더가 들어온다. */
  credentials?: RequestCredentials;
};

function buildUrl(path: string, searchParams?: RequestOptions<z.ZodType>['searchParams']): string {
  const url = new URL(path.startsWith('/') ? path : `/${path}`, env.VITE_API_BASE_URL);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function toApiError(response: Response): Promise<ApiError> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  const body = payload as { message?: string; code?: string; errors?: unknown } | undefined;

  return new ApiError({
    status: response.status,
    code: body?.code,
    message: body?.message ?? `요청에 실패했다. (HTTP ${response.status})`,
    details: body?.errors ?? payload,
  });
}

export async function apiRequest<TSchema extends z.ZodType>(
  options: RequestOptions<TSchema>,
): Promise<z.infer<TSchema>> {
  const {
    path,
    method = 'GET',
    body,
    searchParams,
    headers,
    schema,
    signal,
    cache,
    credentials,
  } = options;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, searchParams), {
      method,
      signal,
      cache,
      credentials,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
    throw ApiError.network(cause);
  }

  if (!response.ok) {
    throw await toApiError(response);
  }

  if (response.status === 204 || !schema) {
    return undefined as z.infer<TSchema>;
  }

  const json: unknown = await response.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    throw new ApiError({
      status: response.status,
      code: 'RESPONSE_SCHEMA_MISMATCH',
      message: '서버 응답 형식이 예상과 다르다.',
      details: parsed.error.issues,
    });
  }

  return parsed.data;
}

export const api = {
  get: <TSchema extends z.ZodType>(options: Omit<RequestOptions<TSchema>, 'method' | 'body'>) =>
    apiRequest({ ...options, method: 'GET' }),
  post: <TSchema extends z.ZodType>(options: Omit<RequestOptions<TSchema>, 'method'>) =>
    apiRequest({ ...options, method: 'POST' }),
  put: <TSchema extends z.ZodType>(options: Omit<RequestOptions<TSchema>, 'method'>) =>
    apiRequest({ ...options, method: 'PUT' }),
  patch: <TSchema extends z.ZodType>(options: Omit<RequestOptions<TSchema>, 'method'>) =>
    apiRequest({ ...options, method: 'PATCH' }),
  delete: <TSchema extends z.ZodType>(options: Omit<RequestOptions<TSchema>, 'method'>) =>
    apiRequest({ ...options, method: 'DELETE' }),
};
