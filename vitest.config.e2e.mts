import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    exclude: ['node_modules', 'dist', '.git', '.github'],
    setupFiles: ['./test/setup-e2e.ts'],
    testTimeout: .30000,
    hookTimeout: 40000,
    sequence: {
      setupFiles: 'list',
      hooks: 'list'
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
