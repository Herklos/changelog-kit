export default [
  {
    files: ['packages/**/*.js', 'examples/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { console: 'readonly', process: 'readonly', fetch: 'readonly', Buffer: 'readonly', FormData: 'readonly', structuredClone: 'readonly', setTimeout: 'readonly', document: 'readonly', requestAnimationFrame: 'readonly', AbortSignal: 'readonly' }
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-undef': 'error',
      eqeqeq: ['error', 'smart'],
      'prefer-const': 'error'
    }
  }
];
