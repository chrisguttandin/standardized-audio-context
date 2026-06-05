import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resumeAudioContext } from '../../../helper/resume-audio-context';

describe('AudioBufferSourceNode', () => {
    let audioContext;

    afterEach(() => audioContext.close());

    beforeEach(async () => {
        audioContext = new AudioContext();

        await resumeAudioContext(audioContext);
    });

    describe('disconnect', () => {
        // bug #217

        it('should stop processing the audio when being disconnected', async () => {
            const { sampleRate } = audioContext;
            const buffer = new AudioBuffer({ length: sampleRate, sampleRate });
            const channelData = new Float32Array(sampleRate);

            for (let sampleIndex = 0; sampleIndex < sampleRate; sampleIndex += 1) {
                channelData[sampleIndex] = sampleIndex;
            }

            buffer.copyToChannel(channelData, 0);

            const audioBufferSourceNode = new AudioBufferSourceNode(audioContext, { buffer });

            await audioContext.audioWorklet.addModule('test/fixtures/discontinuity-detector-processor.js');

            const audioWorkletNode = new AudioWorkletNode(audioContext, 'discontinuity-detector-processor');

            audioBufferSourceNode.connect(audioWorkletNode);
            audioBufferSourceNode.start();

            return new Promise((resolve, reject) => {
                audioWorkletNode.port.onmessage = ({ data }) => {
                    try {
                        expect(data).to.equal('running');

                        audioBufferSourceNode.disconnect(audioWorkletNode);

                        setTimeout(() => {
                            audioBufferSourceNode.connect(audioWorkletNode);

                            audioBufferSourceNode.onended = () => {
                                audioBufferSourceNode.onended = null;
                                audioWorkletNode.port.onmessage = null;

                                audioBufferSourceNode.disconnect(audioWorkletNode);
                                audioWorkletNode.port.close();
                                resolve();
                            };
                        }, 500);
                    } catch (err) {
                        audioBufferSourceNode.onended = null;
                        audioWorkletNode.port.onmessage = null;

                        audioBufferSourceNode.disconnect(audioWorkletNode);
                        audioWorkletNode.port.close();
                        reject(err);
                    }
                };
            });
        });
    });
});
