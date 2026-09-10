import { z } from 'zod';

/**
 * 환경변수.
 *
 * Vite 는 `import.meta.env.VITE_*` 를 빌드 시점에 문자열로 치환한다.
 * 반드시 아래처럼 정적으로 참조해야 한다. (동적 키 접근 금지)
 *
 * 이 프로젝트는 브라우저에서만 도는 SPA 다. 여기 들어온 값은 전부
 * 번들에 포함되어 사용자에게 노출된다. **Secret 을 넣지 않는다.**
 * 서버 전용 Secret 은 Spring Boot 백엔드가 갖는다.
 */
const envSchema = z.object({
  VITE_API_BASE_URL: z.url({ message: 'VITE_API_BASE_URL 은 URL 이어야 한다.' }),
  VITE_APP_URL: z.url({ message: 'VITE_APP_URL 은 URL 이어야 한다.' }),
  /** MSW 목 API 사용 여부. 백엔드 없이 화면을 개발할 때만 켠다. */
  VITE_ENABLE_API_MOCKING: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export type Env = z.infer<typeof envSchema>;

function readEnv(): Env {
  const parsed = envSchema.safeParse({
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_APP_URL: import.meta.env.VITE_APP_URL,
    VITE_ENABLE_API_MOCKING: import.meta.env.VITE_ENABLE_API_MOCKING,
  });

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(
      `환경변수 설정이 올바르지 않다. .env.local 을 확인한다.\n${detail}\n(.env.example 참고)`,
    );
  }

  return parsed.data;
}

export const env = readEnv();
