import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier/flat';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'node_modules/**',
      'public/mockServiceWorker.js',
    ],
  },

  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.flat['recommended-latest'],

  {
    name: 'baduk/base',
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
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
    // 화면 코드는 컴포넌트만 내보내야 HMR 이 상태를 유지한 채 갱신된다.
    name: 'baduk/react-refresh',
    files: ['src/**/*.tsx'],
    ...reactRefresh.configs.vite,
  },

  {
    // API 호출은 lib/api 와 features/*/api 에서만 한다.
    // 화면에서 fetch 를 직접 부르지 못하게 막는다.
    name: 'baduk/no-direct-fetch-in-view-layer',
    files: ['src/routes/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message:
            'fetch 를 화면에서 직접 호출하지 않는다. lib/api 또는 features/*/api 의 함수를 hooks 로 감싸 쓴다.',
        },
      ],
    },
  },

  {
    // 이 파일은 allowJs:false 라 타입 프로젝트에 들어가지 않는다.
    // 타입 정보가 필요한 규칙을 끈다.
    name: 'baduk/eslint-config-self',
    files: ['eslint.config.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: { globals: globals.node },
  },

  {
    name: 'baduk/config-files',
    files: ['*.config.{ts,mjs}', 'vite.config.ts', 'playwright.config.ts'],
    languageOptions: { globals: globals.node },
    rules: { 'no-console': 'off' },
  },

  {
    name: 'baduk/tests',
    files: ['tests/**/*.{ts,tsx}', 'src/**/*.test.{ts,tsx}', 'src/mocks/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  prettier,
);
