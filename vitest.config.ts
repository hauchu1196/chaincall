// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      provider: 'v8',
      all: true,
      exclude: ['**/node_modules/**', '**/dist/**']
    }
  },
});
