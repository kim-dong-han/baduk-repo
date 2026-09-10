/// <reference types="vite/client" />

/**
 * import.meta.env 의 타입.
 * 값 검증은 src/lib/config/env.ts 가 Zod 로 한 번 더 한다.
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_URL: string;
  readonly VITE_ENABLE_API_MOCKING?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
