import '../helper/play-silence';
import { AudioContext, OfflineAudioContext, addAudioWorkletModule, decodeAudioData, isSupported } from '../../src/module';

describe('module', () => {

    it('should export the AudioContext constructor', () => {
        expect(AudioContext).to.be.a('function');
    });

    it('should export the OfflineAudioContext constructor', () => {
        expect(OfflineAudioContext).to.be.a('function');
    });

    it('should export the addAudioWorkletModule function', () => {
        expect(addAudioWorkletModule).to.be.a('function');
    });

    it('should export the decodeAudioData function', () => {
        expect(decodeAudioData).to.be.a('function');
    });

    it('should export the isSupported function', () => {
        expect(isSupported).to.be.a('function');
    });

});
