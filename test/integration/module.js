import { isSupported } from '../../src/module';

describe('module', () => {

    describe('isSupported', () => {

        it('should resolve to false', () => {
            return isSupported()
                .then((sSpprtd) => {
                    expect(sSpprtd).to.be.false;
                });
        });

    });

});
