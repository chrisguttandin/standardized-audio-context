import { AudioContext } from '../../src/audio-contexts/audio-context';
import { createScriptProcessor } from './create-script-processor';

export const createRenderer = ({ context, length, connect }) => {
    if (context instanceof AudioContext) {
        if (length > 128) {
            throw new Error('Running tests for longer than 128 samples is not yet possible.');
        }

        const sampleRate = context.sampleRate;
        const audioBuffer = context.createBuffer(1, length, sampleRate);
        const audioBufferSourceNode = context.createBufferSource();
        const bufferSize = 512;
        const scriptProcessorNode = createScriptProcessor(context, bufferSize, 1, 1);

        audioBuffer.copyToChannel(new Float32Array([ 1 ]), 0);

        audioBufferSourceNode.buffer = audioBuffer;

        connect(scriptProcessorNode);

        audioBufferSourceNode.connect(scriptProcessorNode);
        // @todo Maybe add an additional GainNode to avoid any hearable output.
        scriptProcessorNode.connect(context.destination);

        return (start) => {
            // Start the impulse in 4096 samples from now to make sure there is enough time to set everything up.
            const impulseStartTime = context.currentTime + (4096 / sampleRate);
            // Add an additional delay of 512 samples to the startTime.
            const startTime = impulseStartTime + (512 / sampleRate);
            const promise = new Promise((resolve, reject) => {
                const stop = () => {
                    scriptProcessorNode.onaudioprocess = null;
                    scriptProcessorNode.disconnect(context.destination);
                };

                let impulseOffset = null;
                let lastPlaybackOffset = null;

                scriptProcessorNode.onaudioprocess = ({ inputBuffer, playbackTime }) => {
                    /*
                     * @todo Add an expectation test to prove the following assumption.
                     * Keeping track of the playbackOffset is necessary because Edge doesn't always report the correct playbackTime.
                     */
                    if (lastPlaybackOffset === null) {
                        lastPlaybackOffset = Math.round(playbackTime * sampleRate);
                    } else {
                        lastPlaybackOffset += bufferSize;
                    }

                    const channelData = inputBuffer.getChannelData(0);

                    // Look for the impulse in case it was not detected yet.
                    if (impulseOffset === null) {
                        // The impulse will be at the first sample of a render quantum.
                        for (let i = 0; i < bufferSize; i += 128) {
                            if (channelData[i] === 1) {
                                impulseOffset = lastPlaybackOffset - Math.round(impulseStartTime * sampleRate) + i;

                                break;
                            }
                        }
                    }

                    if (impulseOffset !== null) {
                        const expectedPlaybackOffset = Math.round(startTime * sampleRate) + impulseOffset;

                        if (lastPlaybackOffset <= expectedPlaybackOffset &&
                                lastPlaybackOffset + bufferSize >= expectedPlaybackOffset + length) {
                            stop();

                            const index = expectedPlaybackOffset - lastPlaybackOffset;

                            resolve(channelData.slice(index, index + length));
                        } else if (lastPlaybackOffset >= expectedPlaybackOffset) {
                            stop();

                            reject(new Error('Rendering the result was not possible.'));
                        }
                    }
                };
            });

            start(startTime);

            audioBufferSourceNode.start(impulseStartTime);

            return promise;
        };
    }

    if (length !== undefined) {
        throw new Error('The property length should not be set for an OfflineAudioContext.');
    }

    connect(context.destination);

    return async (start) => {
        start(context.currentTime);

        const renderedBuffer = await context.startRendering();
        const channelData = new Float32Array(context.length);

        renderedBuffer.copyFromChannel(channelData, 0, 0);

        return channelData;
    };
};
