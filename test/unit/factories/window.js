import { describe, expect, it } from 'vitest';
import { createWindow } from '../../../src/factories/window';

describe('createWindow()', () => {
    it('should return the global window', () => {
        expect(createWindow()).to.equal(window);
    });
});
