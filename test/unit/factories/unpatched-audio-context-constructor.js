import { createUnpatchedAudioContextConstructor } from '../../../src/factories/unpatched-audio-context-constructor';

describe('createUnpatchedAudioContextConstructor()', () => {

    let AudioContext;
    let webkitAudioContext;

    beforeEach(() => {
        AudioContext = 'a fake AudioContext';
        webkitAudioContext = 'a fake webkitAudioContext';
    });

    it('should return null if there is no AudioContext', () => {
        const fakeWindow = { };

        expect(createUnpatchedAudioContextConstructor(fakeWindow)).to.equal(null);
    });

    it('should return the prefixed AudioContext', () => {
        const fakeWindow = { webkitAudioContext };

        expect(createUnpatchedAudioContextConstructor(fakeWindow)).to.equal(webkitAudioContext);
    });

    it('should return the unprefixed AudioContext', () => {
        const fakeWindow = { AudioContext };

        expect(createUnpatchedAudioContextConstructor(fakeWindow)).to.equal(AudioContext);
    });

    it('should return the unprefixed AudioContext even if there is a prefixed version as well', () => {
        const fakeWindow = { AudioContext, webkitAudioContext };

        expect(createUnpatchedAudioContextConstructor(fakeWindow)).to.equal(AudioContext);
    });

});
