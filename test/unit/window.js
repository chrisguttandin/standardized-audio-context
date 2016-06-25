import { window as wndw } from '../../src/window';

describe('window', function () {

    it('should return the global window', function () {
        expect(wndw).to.equal(window);
    });

});
