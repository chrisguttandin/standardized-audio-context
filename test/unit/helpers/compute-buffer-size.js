import { computeBufferSize } from '../../../src/helpers/compute-buffer-size';

describe('computeBufferSize()', () => {

    it('should default to 512', () => {
        expect(computeBufferSize(null, 44100)).to.equal(512);
    });

    it('should be at least 512', () => {
        expect(computeBufferSize(0, 44100)).to.equal(512);
    });

    it('should be a power of 2', () => {
        const bufferSize = computeBufferSize(Math.random(), 44100);

        expect(Number.isInteger(Math.log2(bufferSize))).to.be.true;
    });

    it('should be at most 16384', () => {
        expect(computeBufferSize(1, 44100)).to.equal(16384);
    });

});
