import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: { bail: 1, watch: false, dir: 'test/integration/', include: ['**/*.js'], setupFiles: ['config/vitest/integration-setup.ts'] }
});
