import { beforeEach, describe, expect, it } from 'vitest';
import { spy } from 'sinon';

describe('AudioWorklet', () => {
    let offlineAudioContext;

    beforeEach(() => {
        offlineAudioContext = new OfflineAudioContext(1, 256, 44100);
    });

    describe('with processorOptions with an unclonable value', () => {
        // bug #191

        it('should not throw an error', async () => {
            await offlineAudioContext.audioWorklet.addModule('test/fixtures/gain-processor.js');

            new AudioWorkletNode(offlineAudioContext, 'gain-processor', { processorOptions: { fn: () => {} } });
        });
    });

    describe('with a processor which transfers the arguments', () => {
        let audioWorkletNode;

        beforeEach(async () => {
            await offlineAudioContext.audioWorklet.addModule('test/fixtures/transferring-processor.js');

            audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'transferring-processor');
        });

        // bug #197

        it('should not deliver the messages before the promise returned by startRendering() resolves', () => {
            const { promise, resolve } = Promise.withResolvers();
            const onmessage = spy();

            audioWorkletNode.port.onmessage = onmessage;

            offlineAudioContext.startRendering().then(() => {
                expect(onmessage).to.have.not.been.called;

                setTimeout(() => {
                    expect(onmessage).to.have.been.calledTwice;

                    resolve();
                });
            });

            return promise;
        });
    });
});
