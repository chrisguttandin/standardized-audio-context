/* eslint-disable max-classes-per-file */
import { beforeEach, describe, expect, it } from 'vitest';
import { createIsNativeAudioNode } from '../../../src/factories/is-native-audio-node';

describe('isNativeAudioNode()', () => {
    let audioNodeConstructor;
    let isNativeAudioNode;

    beforeEach(() => {
        class AudioNode {}
        const window = { AudioNode };

        audioNodeConstructor = window.AudioNode;

        isNativeAudioNode = createIsNativeAudioNode(window);
    });

    describe('with a plain object', () => {
        it('should not identify a plain object', () => {
            expect(isNativeAudioNode({ a: 'fake AudioNode' })).to.be.false;
        });
    });

    describe('with a native AudioNode', () => {
        let audioNode;

        beforeEach(() => {
            audioNode = new (class extends audioNodeConstructor {})();
        });

        it('should identify a native AudioNode', () => {
            expect(isNativeAudioNode(audioNode)).to.be.true;
        });
    });
});
