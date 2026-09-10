/**
 * 백엔드(Spring Boot)에서 내려온 실패 응답을 감싸는 단일 에러 타입.
 * UI 레이어는 이 타입만 보고 분기한다. (fetch/Response 를 직접 다루지 않는다)
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;

  constructor(params: { status: number; code?: string; message: string; details?: unknown }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code ?? `HTTP_${params.status}`;
    this.details = params.details;
  }

  /** 네트워크 단절 등 응답 자체를 받지 못한 경우 */
  static network(cause: unknown): ApiError {
    return new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: '서버에 연결하지 못했다. 네트워크 상태를 확인한다.',
      details: cause,
    });
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  /** 재시도해도 결과가 달라지지 않는 에러인지 */
  get isRetriable(): boolean {
    if (this.status === 0) return true;
    if (this.status === 408 || this.status === 429) return true;
    return this.isServerError;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
