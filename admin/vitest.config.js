// Vitest config for Cloudflare Workers
// v1.0.0 - 2026-01-13

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.js'],
  },
});
