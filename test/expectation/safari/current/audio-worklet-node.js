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
        // bug #197

        it('should not deliver the messages before the promise returned by startRendering() resolves', async () => {
            while (true) {
                await offlineAudioContext.audioWorklet.addModule('test/fixtures/transferring-processor.js');

                const audioWorkletNode = new AudioWorkletNode(offlineAudioContext, 'transferring-processor');
                const onmessage = spy();

                audioWorkletNode.port.onmessage = onmessage;

                try {
                    await offlineAudioContext.startRendering().then(() => {
                        expect(onmessage).to.have.not.been.called;

                        return new Promise((resolve, reject) => {
                            setTimeout(() => {
                                try {
                                    expect(onmessage).to.have.been.calledTwice;

                                    resolve();
                                } catch (err) {
                                    reject(err);
                                }
                            });
                        });
                    });
                } catch (err) {
                    offlineAudioContext = new OfflineAudioContext(1, offlineAudioContext.length, offlineAudioContext.sampleRate);

                    continue;
                }

                break;
            }
        });
    });
});
