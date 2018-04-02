import { createUnpatchedOfflineAudioContextConstructor } from '../../../src/factories/unpatched-offline-audio-context-constructor';

describe('createUnpatchedOfflineAudioContextConstructor()', () => {

    let OfflineAudioContext;
    let webkitOfflineAudioContext;

    beforeEach(() => {
        OfflineAudioContext = 'a fake OfflineAudioContext';
        webkitOfflineAudioContext = 'a fake webkitOfflineAudioContext';
    });

    it('should return null if there is no OfflineAudioContext', () => {
        const fakeWindow = { };

        expect(createUnpatchedOfflineAudioContextConstructor(fakeWindow)).to.equal(null);
    });

    it('should return the prefixed OfflineAudioContext', () => {
        const fakeWindow = { webkitOfflineAudioContext };

        expect(createUnpatchedOfflineAudioContextConstructor(fakeWindow)).to.equal(webkitOfflineAudioContext);
    });

    it('should return the unprefixed OfflineAudioContext', () => {
        const fakeWindow = { OfflineAudioContext };

        expect(createUnpatchedOfflineAudioContextConstructor(fakeWindow)).to.equal(OfflineAudioContext);
    });

    it('should return the unprefixed OfflineAudioContext even if there is a prefixed version as well', () => {
        const fakeWindow = { OfflineAudioContext, webkitOfflineAudioContext };

        expect(createUnpatchedOfflineAudioContextConstructor(fakeWindow)).to.equal(OfflineAudioContext);
    });

});
