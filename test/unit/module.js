import { AudioContext, OfflineAudioContext, isSupported } from '../../src/module';

describe('module', function () {

    it('should export the AudioContext constructor', function () {
        expect(AudioContext).to.be.a('function');
    });

    it('should export the isSupported promise', function () {
        expect(isSupported).to.be.an.instanceof(Promise);
    });

    it('should export the OfflineAudioContext constructor', function () {
        expect(OfflineAudioContext).to.be.a('function');
    });

});
