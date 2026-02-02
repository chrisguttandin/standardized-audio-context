import { beforeEach, describe, expect, it } from 'vitest';
import { createNativeOfflineAudioContextConstructor } from '../../../src/factories/native-offline-audio-context-constructor';

describe('createNativeOfflineAudioContextConstructor()', () => {
    let OfflineAudioContext;
    let webkitOfflineAudioContext;

    beforeEach(() => {
        OfflineAudioContext = 'a fake OfflineAudioContext';
        webkitOfflineAudioContext = 'a fake webkitOfflineAudioContext';
    });

    it('should return null if there is no OfflineAudioContext', () => {
        const fakeWindow = {};

        expect(createNativeOfflineAudioContextConstructor(fakeWindow)).to.equal(null);
    });

    it('should not return the prefixed OfflineAudioContext', () => {
        const fakeWindow = { webkitOfflineAudioContext };

        expect(createNativeOfflineAudioContextConstructor(fakeWindow)).to.equal(null);
    });

    it('should return the unprefixed OfflineAudioContext', () => {
        const fakeWindow = { OfflineAudioContext };

        expect(createNativeOfflineAudioContextConstructor(fakeWindow)).to.equal(OfflineAudioContext);
    });

    it('should return the unprefixed OfflineAudioContext even if there is a prefixed version as well', () => {
        const fakeWindow = { OfflineAudioContext, webkitOfflineAudioContext };

        expect(createNativeOfflineAudioContextConstructor(fakeWindow)).to.equal(OfflineAudioContext);
    });
});
