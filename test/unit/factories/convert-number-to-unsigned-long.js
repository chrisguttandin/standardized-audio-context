import { createConvertNumberToUnsignedLong } from '../../../src/factories/convert-number-to-unsigned-long';

describe('convertNumberToUnsignedLong()', () => {

    let convertNumberToUnsignedLong;

    beforeEach(() => {
        convertNumberToUnsignedLong = createConvertNumberToUnsignedLong(new Uint32Array(1));
    });

    describe('with a value within the range of valid values', () => {

        let value;

        beforeEach(() => {
            value = Math.floor(Math.random() * (2 ** 32));
        });

        it('should return the value', () => {
            expect(convertNumberToUnsignedLong(value)).to.equal(value);
        });

    });

    describe('with a value above the range of valid values', () => {

        let value;

        beforeEach(() => {
            value = Math.floor(Math.random() * (2 ** 32)) + (2 ** 32);
        });

        it('should return a value mapped into the range of valid values', () => {
            expect(convertNumberToUnsignedLong(value)).to.equal(value - (2 ** 32));
        });

    });

    describe('with a value below the range of valid values', () => {

        let value;

        beforeEach(() => {
            value = Math.floor(Math.random() * (2 ** 32)) - (2 ** 32);
        });

        it('should return a value mapped into the range of valid values', () => {
            expect(convertNumberToUnsignedLong(value)).to.equal(value + (2 ** 32));
        });

    });

    describe('with a floating point value', () => {

        let value;

        beforeEach(() => {
            value = Math.random() * (2 ** 32);
        });

        it('should return the floored value', () => {
            expect(convertNumberToUnsignedLong(value)).to.equal(Math.floor(value));
        });

    });

    describe('with NaN as value', () => {

        let value;

        beforeEach(() => {
            value = NaN;
        });

        it('should return zero', () => {
            expect(convertNumberToUnsignedLong(value)).to.equal(0);
        });

    });

    describe('with positive infinity as value', () => {

        let value;

        beforeEach(() => {
            value = Number.POSITIVE_INFINITY;
        });

        it('should return zero', () => {
            expect(convertNumberToUnsignedLong(value)).to.equal(0);
        });

    });

    describe('with negative infinity as value', () => {

        let value;

        beforeEach(() => {
            value = Number.NEGATIVE_INFINITY;
        });

        it('should return zero', () => {
            expect(convertNumberToUnsignedLong(value)).to.equal(0);
        });

    });

});
