import { beforeEach, describe, expect, it } from 'vitest';
import { sanitizePeriodicWaveOptions } from '../../../src/helpers/sanitize-periodic-wave-options';

describe('sanitizePeriodicWaveOptions()', () => {
    describe('with a defined imag and real property', () => {
        let options;

        beforeEach(() => {
            options = { imag: [4, 5, 6], real: [2, 3, 4] };
        });

        it('should return an object with those imag and real properties', () => {
            expect(sanitizePeriodicWaveOptions(options)).to.deep.equal(options);
        });
    });

    describe('with a defined imag but without a real property', () => {
        let options;

        beforeEach(() => {
            options = { imag: [4, 5, 6] };
        });

        it('should return an object with that imag property and the default real property of the same length', () => {
            expect(sanitizePeriodicWaveOptions(options)).to.deep.equal({ ...options, real: [0, 0, 0] });
        });
    });

    describe('with a defined real but without an imag property', () => {
        let options;

        beforeEach(() => {
            options = { real: [2, 3, 4] };
        });

        it('should return an object with that real property and the default imag property of the same length', () => {
            expect(sanitizePeriodicWaveOptions(options)).to.deep.equal({ ...options, imag: [0, 0, 0] });
        });
    });

    describe('without a defined imag and real property', () => {
        let options;

        beforeEach(() => {
            options = {};
        });

        it('should return an object with the default imag and real properties', () => {
            expect(sanitizePeriodicWaveOptions(options)).to.deep.equal({ ...options, imag: [0, 0], real: [0, 0] });
        });
    });
});
