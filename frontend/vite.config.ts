
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'html', 'json-summary'], 
      exclude: ['**/node_modules/**', '**/test/**'],
    },
    setupFiles:['./src/setup.ts',]
  },
});
