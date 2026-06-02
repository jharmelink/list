import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@src': resolve(__dirname, 'src/index.ts'),
    },
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      thresholds: {
        functions: 80,
        branches: 80,
        statements: 80,
        lines: 90,
      },
      include: ['src/**/*.ts'],
    },
  },
});
