import { isSupported } from '../../src/module';

describe('isSupported()', () => {
    it('should resolve to true', async () => {
        expect(await isSupported()).to.be.true;
    });
});
