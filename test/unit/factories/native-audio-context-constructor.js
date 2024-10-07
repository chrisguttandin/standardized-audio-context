import { createNativeAudioContextConstructor } from '../../../src/factories/native-audio-context-constructor';

describe('createNativeAudioContextConstructor()', () => {
    let AudioContext;
    let webkitAudioContext;

    beforeEach(() => {
        AudioContext = 'a fake AudioContext';
        webkitAudioContext = 'a fake webkitAudioContext';
    });

    it('should return null if there is no AudioContext', () => {
        const fakeWindow = {};

        expect(createNativeAudioContextConstructor(fakeWindow)).to.equal(null);
    });

    it('should not return the prefixed AudioContext', () => {
        const fakeWindow = { webkitAudioContext };

        expect(createNativeAudioContextConstructor(fakeWindow)).to.equal(null);
    });

    it('should return the unprefixed AudioContext', () => {
        const fakeWindow = { AudioContext };

        expect(createNativeAudioContextConstructor(fakeWindow)).to.equal(AudioContext);
    });

    it('should return the unprefixed AudioContext even if there is a prefixed version as well', () => {
        const fakeWindow = { AudioContext, webkitAudioContext };

        expect(createNativeAudioContextConstructor(fakeWindow)).to.equal(AudioContext);
    });
});
