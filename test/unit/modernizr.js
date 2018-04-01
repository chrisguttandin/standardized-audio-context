import browsernizr from '../../src/browsernizr';

describe('browsernizr', () => {

    it('should contain the result of the promises test', () => {
        expect(browsernizr.promises).to.be.a('boolean');
    });

    it('should contain the result of the typedarrays test', () => {
        expect(browsernizr.typedarrays).to.be.a('boolean');
    });

    it('should contain the result of the webaudio test', () => {
        expect(browsernizr.webaudio).to.be.a('boolean');
    });

});
