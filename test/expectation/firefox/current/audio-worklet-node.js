import { beforeEach, describe, expect, it } from 'vitest';

describe('AudioWorkletNode', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256000, 44100);
    });

    // bug #179

    describe('with a processor which transfers the arguments', () => {
        let audioWorkletNode;

        beforeEach(async () => {
            await offlineAudioContext.audioWorklet.addModule('test/fixtures/transferring-processor.js');

            audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'transferring-processor');
        });

        it('should fire an processorerror event', () => {
            const { promise, resolve } = Promise.withResolvers();

            audioWorkletNode.onprocessorerror = (err) => {
                expect(err.message).to.equal('Unknown processor error');

                resolve();
            };

            offlineAudioContext.startRendering();

            return promise;
        });
    });
});
