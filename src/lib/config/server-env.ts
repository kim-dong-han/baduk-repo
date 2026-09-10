import 'server-only';

import { z } from 'zod';

/**
 * 서버에서만 읽히는 환경변수.
 *
 * - `NEXT_PUBLIC_` 접두사를 절대 붙이지 않는다. (붙이면 클라이언트 번들에 들어간다)
 * - `import 'server-only'` 덕분에 클라이언트 컴포넌트에서 import 하면 빌드가 실패한다.
 * - 값 자체는 Vercel 환경변수로 주입한다. 레포에는 실제 값을 커밋하지 않는다.
 *
 * 아직 서버 전용 Secret 이 필요한 기능이 없으므로 스키마는 비어 있다.
 * 추가될 때 아래 스키마에만 필드를 넣으면 된다.
 * (예: INTERNAL_API_TOKEN, KATAGO_WEBHOOK_SECRET, SENTRY_AUTH_TOKEN)
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    throw new Error(`서버 환경변수 설정이 올바르지 않다.\n${detail}`);
  }

  cached = parsed.data;
  return cached;
}
