import { describe, expect, it } from 'vitest';
import { isSupported } from '../../src/module';

describe('isSupported', () => {
    it(`should resolve to ${typeof window !== 'undefined'}`, async () => {
        expect(await isSupported()).to.equal(typeof window !== 'undefined');
    });
});
