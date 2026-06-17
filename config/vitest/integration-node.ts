import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({ test: { bail: 1, dir: 'test/integration/', include: ['**/*.js'], watch: false } });
