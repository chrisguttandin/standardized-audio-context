import { AudioBuffer } from '../../src/audio-buffer';
import { AudioBufferSourceNode } from '../../src/audio-nodes/audio-buffer-source-node';
import { AudioContext } from '../../src/audio-contexts/audio-context';
import { MinimalAudioContext } from '../../src/audio-contexts/minimal-audio-context';
import { createScriptProcessor } from './create-script-processor';

export const createRenderer = ({ bufferSize = 0, context, length, connect }) => {
    if (context instanceof AudioContext || context instanceof MinimalAudioContext) {
        if (length === undefined) {
            throw new Error('The length need to be specified when using an AudioContext or MinimalAudioContext.');
        }

        if (length > 128) {
            throw new Error('Running tests for longer than 128 samples is not yet possible.');
        }

        const sampleRate = context.sampleRate;
        const audioBuffer = new AudioBuffer({ length, sampleRate });
        const audioBufferSourceNode = new AudioBufferSourceNode(context);
        const bufferScriptProcessorNode = (bufferSize === 0) ? null : createScriptProcessor(context, bufferSize, 1, 1);
        const recorderBufferSize = 8192;
        const recorderScriptProcessorNode = createScriptProcessor(context, recorderBufferSize, 1, 1);

        audioBuffer.copyToChannel(new Float32Array([ 1 ]), 0);

        audioBufferSourceNode.buffer = audioBuffer;

        if (bufferScriptProcessorNode !== null) {
            bufferScriptProcessorNode.onaudioprocess = ({ inputBuffer, outputBuffer }) => {
                const input = inputBuffer.getChannelData(0);
                const output = outputBuffer.getChannelData(0);

                output.set(input);
            };
        }

        connect(recorderScriptProcessorNode);

        if (bufferScriptProcessorNode === null) {
            audioBufferSourceNode.connect(recorderScriptProcessorNode);
        } else {
            audioBufferSourceNode
                .connect(bufferScriptProcessorNode)
                .connect(recorderScriptProcessorNode);
        }
        // @todo Maybe add an additional GainNode to avoid any hearable output.
        recorderScriptProcessorNode.connect(context.destination);

        return (start) => {
            const renderQuantum = 128 / sampleRate;
            // Start the impulse in 8192 samples from now to make sure there is enough time to set everything up.
            const impulseStartTime = (Math.round(context.currentTime / renderQuantum) * renderQuantum) + (8192 / sampleRate);
            // Add an additional delay of 512 samples to the startTime.
            const startTimeOffset = 512;
            const startTime = impulseStartTime + (startTimeOffset / sampleRate);
            const promise = new Promise((resolve, reject) => {
                const stop = () => {
                    recorderScriptProcessorNode.onaudioprocess = null;
                    recorderScriptProcessorNode.disconnect(context.destination);
                };

                let impulseOffset = null;
                let lastPlaybackOffset = null;

                recorderScriptProcessorNode.onaudioprocess = ({ inputBuffer, playbackTime }) => {
                    /*
                     * @todo Add an expectation test to prove the following assumption.
                     * Keeping track of the playbackOffset is necessary because Edge doesn't always report the correct playbackTime.
                     */
                    if (lastPlaybackOffset === null) {
                        lastPlaybackOffset = Math.round(playbackTime * sampleRate);
                    } else {
                        lastPlaybackOffset += recorderBufferSize;
                    }

                    const channelData = inputBuffer.getChannelData(0);

                    // Look for the impulse in case it was not detected yet.
                    if (impulseOffset === null) {
                        // The impulse will be at the first sample of a render quantum.
                        for (let i = 0; i < recorderBufferSize; i += 1) {
                            if (channelData[i] === 1) {
                                impulseOffset = lastPlaybackOffset + i;

                                break;
                            }
                        }
                    }

                    if (impulseOffset !== null) {
                        const expectedPlaybackOffset = impulseOffset + startTimeOffset;

                        if (lastPlaybackOffset <= expectedPlaybackOffset &&
                                lastPlaybackOffset + recorderBufferSize >= expectedPlaybackOffset + length) {
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
