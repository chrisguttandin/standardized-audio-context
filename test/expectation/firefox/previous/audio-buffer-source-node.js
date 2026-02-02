import { afterEach, beforeEach, describe, expect, it } from 'vitest';

describe('AudioBufferSourceNode', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(() => (audioContext = new AudioContext()));

    describe('detune', () => {
        describe('defaultValue', () => {
            // bug #196

            it('should not reflect the initial value', () => {
                const audioBufferSourceNode = new AudioBufferSourceNode(audioContext, { detune: 3 });

                expect(audioBufferSourceNode.detune.defaultValue).to.equal(0);
            });
        });
    });
});
