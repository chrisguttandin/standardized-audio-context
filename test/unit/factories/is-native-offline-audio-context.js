import { beforeEach, describe, expect, it } from 'vitest';
import { createIsNativeOfflineAudioContext } from '../../../src/factories/is-native-offline-audio-context';

describe('isNativeOfflineAudioContext()', () => {
    let isNativeOfflineAudioContext;
    let offlineAudioContextConstructor;

    beforeEach(() => {
        offlineAudioContextConstructor = function OfflineAudioContext() {}; // eslint-disable-line func-name-matching

        isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(offlineAudioContextConstructor);
    });

    describe('with a plain object', () => {
        it('should not identify a plain object', () => {
            expect(isNativeOfflineAudioContext({ a: 'fake OfflineAudioContext' })).to.be.false;
        });
    });

    describe('with a native OfflineAudioContext', () => {
        let audioContext;

        beforeEach(() => {
            audioContext = new offlineAudioContextConstructor(); // eslint-disable-line new-cap
        });

        it('should identify a native OfflineAudioContext', () => {
            expect(isNativeOfflineAudioContext(audioContext)).to.be.true;
        });
    });
});
