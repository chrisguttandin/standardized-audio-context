/* eslint-disable max-classes-per-file */
import { beforeEach, describe, expect, it } from 'vitest';
import { createIsNativeAudioParam } from '../../../src/factories/is-native-audio-param';

describe('isNativeAudioParam()', () => {
    let audioParamConstructor;
    let isNativeAudioParam;

    beforeEach(() => {
        class AudioParam {}
        const window = { AudioParam };

        audioParamConstructor = window.AudioParam;

        isNativeAudioParam = createIsNativeAudioParam(window);
    });

    describe('with a plain object', () => {
        it('should not identify a plain object', () => {
            expect(isNativeAudioParam({ a: 'fake AudioParam' })).to.be.false;
        });
    });

    describe('with a native AudioParam', () => {
        let audioParam;

        beforeEach(() => {
            audioParam = new (class extends audioParamConstructor {})();
        });

        it('should identify a native AudioParam', () => {
            expect(isNativeAudioParam(audioParam)).to.be.true;
        });
    });
});
