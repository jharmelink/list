import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
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
