import { AudioContext, OfflineAudioContext, isSupported } from '../../src/module';

describe('module', () => {

    it('should export the AudioContext constructor', () => {
        expect(AudioContext).to.be.a('function');
    });

    it('should export the isSupported promise', () => {
        expect(isSupported).to.be.an.instanceof(Promise);
    });

    it('should export the OfflineAudioContext constructor', () => {
        expect(OfflineAudioContext).to.be.a('function');
    });

});
