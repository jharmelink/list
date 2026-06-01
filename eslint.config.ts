import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig({ ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.js', '*.cjs'] }, tseslint.configs.recommended, {
  files: ['src/**/*.ts'],
  languageOptions: {
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
  },
  rules: {
    '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    // Prettier owns code width (printWidth 120) but does not reflow comment prose, so this guards the comment ceiling
    // only — code length is left to Prettier. See the comment-width rule in .claude/code-style.md.
    'max-len': [
      'error',
      {
        code: Number.MAX_SAFE_INTEGER,
        comments: 120,
        ignoreUrls: true,
        ignorePattern: 'eslint-disable',
      },
    ],
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
  },
}, {
  // Tests intentionally cast to `any` to exercise runtime guards against invalid types.
  files: ['test/**/*.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
});
