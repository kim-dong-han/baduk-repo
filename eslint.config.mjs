import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

/**
 * Flat config.
 * 순서: next(base + core-web-vitals) -> typescript -> 프로젝트 규칙 -> prettier(포맷 규칙 off)
 */
const config = [
  {
    ignores: [
      '.next/**',
      'out/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'node_modules/**',
      'next-env.d.ts',
      'public/mockServiceWorker.js',
    ],
  },

  ...nextCoreWebVitals,
  ...nextTypeScript,

  {
    name: 'baduk/project-rules',
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
    },
  },

  {
    // API 호출은 lib/api 와 features/*/api 에서만 한다.
    // 페이지/컴포넌트에서 fetch 를 직접 부르지 못하게 막는다.
    name: 'baduk/no-direct-fetch-in-view-layer',
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'fetch 를 뷰 레이어에서 직접 호출하지 않는다. lib/api 또는 features/*/api 의 함수를 사용하고, hooks 를 통해 소비한다.',
        },
      ],
    },
  },

  {
    name: 'baduk/tests',
    files: ['tests/**/*.{ts,tsx}', 'src/**/*.test.{ts,tsx}', 'src/mocks/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },

  prettier,
];

export default config;
