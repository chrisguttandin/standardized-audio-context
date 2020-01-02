import { isSupported } from '../../src/module';

describe('module', () => {

    describe('isSupported', () => {

        it('should resolve to false', async () => {
            expect(await isSupported()).to.be.false;
        });

    });

});
