/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    // '@/...' 별칭은 tsconfig.json 의 paths 를 그대로 쓴다. (vite 8 네이티브 지원)
    tsconfigPaths: true,
  },

  server: {
    port: 5173,
    // 백엔드가 아직 없을 때는 MSW 를 쓴다. 실제 백엔드를 붙일 때 프록시가 필요하면
    // 여기에 proxy 를 추가하는 대신 VITE_API_BASE_URL 을 바꾸는 쪽을 먼저 검토한다.
  },

  build: {
    sourcemap: true,
    // 바둑판/차트 청크가 커질 수 있다. 경고 기준을 현실적으로 둔다.
    chunkSizeWarningLimit: 700,
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**'],
    // 테스트가 .env.local 에 의존하지 않도록 여기서 고정한다.
    env: {
      VITE_API_BASE_URL: 'http://localhost:8080',
      VITE_APP_URL: 'http://localhost:5173',
      VITE_ENABLE_API_MOCKING: 'false',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.d.ts', 'src/mocks/**', 'src/main.tsx'],
    },
  },
});
