import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  // vite 8 부터 tsconfig 의 paths 를 네이티브로 해석한다. ('@/...' alias)
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    // E2E 는 Playwright 가 담당한다.
    exclude: ['node_modules/**', '.next/**', 'tests/e2e/**'],
    env: {
      NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NEXT_PUBLIC_ENABLE_API_MOCKING: 'false',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/mocks/**', 'src/app/**/layout.tsx'],
    },
  },
});
