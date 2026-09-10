import { z } from 'zod';

/**
 * 클라이언트에서도 읽히는 공개 환경변수.
 *
 * Next.js 는 `process.env.NEXT_PUBLIC_*` 를 빌드 시점에 문자열로 치환한다.
 * 따라서 반드시 아래처럼 "정적으로" 참조해야 한다. (동적 키 접근 금지)
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.url({ message: 'NEXT_PUBLIC_API_BASE_URL 은 URL 이어야 한다.' }),
  NEXT_PUBLIC_APP_URL: z.url({ message: 'NEXT_PUBLIC_APP_URL 은 URL 이어야 한다.' }),
  /** MSW 목 API 사용 여부. 로컬 개발/테스트에서만 켠다. */
  NEXT_PUBLIC_ENABLE_API_MOCKING: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function readPublicEnv(): PublicEnv {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ENABLE_API_MOCKING: process.env.NEXT_PUBLIC_ENABLE_API_MOCKING,
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

export const env = readPublicEnv();
