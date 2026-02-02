import { beforeEach, describe, expect, it } from 'vitest';
import { createIsNativeAudioContext } from '../../../src/factories/is-native-audio-context';

describe('isNativeAudioContext()', () => {
    let audioContextConstructor;
    let isNativeAudioContext;

    beforeEach(() => {
        audioContextConstructor = function AudioContext() {}; // eslint-disable-line func-name-matching

        isNativeAudioContext = createIsNativeAudioContext(audioContextConstructor);
    });

    describe('with a plain object', () => {
        it('should not identify a plain object', () => {
            expect(isNativeAudioContext({ a: 'fake AudioContext' })).to.be.false;
        });
    });

    describe('with a native AudioContext', () => {
        let audioContext;

        beforeEach(() => {
            audioContext = new audioContextConstructor(); // eslint-disable-line new-cap
        });

        it('should identify a native AudioContext', () => {
            expect(isNativeAudioContext(audioContext)).to.be.true;
        });
    });
});
