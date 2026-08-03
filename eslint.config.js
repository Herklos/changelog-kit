import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**']
  },
  {
    files: ['examples/**/*.mjs', 'packages/**/bin/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly', fetch: 'readonly', Buffer: 'readonly', FormData: 'readonly', structuredClone: 'readonly', setTimeout: 'readonly', document: 'readonly', requestAnimationFrame: 'readonly', AbortSignal: 'readonly', URL: 'readonly' }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error'
    }
  },
  ...tseslint.config({
    files: ['packages/**/*.ts', 'examples/native/**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      globals: { console: 'readonly', process: 'readonly', fetch: 'readonly', Buffer: 'readonly', FormData: 'readonly', structuredClone: 'readonly', setTimeout: 'readonly', document: 'readonly', requestAnimationFrame: 'readonly', AbortSignal: 'readonly', URL: 'readonly' }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error'
    }
  })
];
