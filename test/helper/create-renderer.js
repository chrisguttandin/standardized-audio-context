import { AudioBuffer, AudioBufferSourceNode, AudioContext, ChannelMergerNode, GainNode, MinimalAudioContext } from '../../src/module';
import { createScriptProcessor } from './create-script-processor';
import { roundToSamples } from './round-to-samples';

const createBufferNode = ({ audioNodes, context }) => {
    const bufferSize = Object.values(audioNodes).reduce((accumulator, audioNode) => {
        // @todo This is using a private property.
        const bufferSizeOfAudioNode =
            audioNode._nativeAudioNode === undefined
                ? 0
                : audioNode._nativeAudioNode.bufferSize === undefined
                  ? 0
                  : audioNode._nativeAudioNode.bufferSize;

        return accumulator + bufferSizeOfAudioNode;
    }, 0);

    if (bufferSize === 0) {
        return new GainNode(context);
    }

    const scriptProcessorNode = createScriptProcessor(context, bufferSize, 1, 1);

    scriptProcessorNode.onaudioprocess = ({ inputBuffer, outputBuffer }) => {
        const input = inputBuffer.getChannelData(0);
        const output = outputBuffer.getChannelData(0);

        output.set(input);
    };

    return scriptProcessorNode;
};
const createImpulseNode = ({ context, length }) => {
    const audioBuffer = new AudioBuffer({ length, sampleRate: context.sampleRate });
    const audioBufferSourceNode = new AudioBufferSourceNode(context);

    audioBuffer.copyToChannel(new Float32Array([1]), 0);
    audioBufferSourceNode.buffer = audioBuffer;

    return audioBufferSourceNode;
};
const waitForRunningState = (audioContext) => {
    return new Promise((resolve, reject) => {
        if (audioContext.state === 'closed') {
            reject(new Error('The given AudioContext is closed.'));
        } else if (audioContext.state === 'running') {
            resolve();
        } else {
            audioContext.onstatechange = () => {
                if (audioContext.state === 'closed') {
                    audioContext.onstatechange = null;

                    reject(new Error('The given AudioContext is closed.'));
                } else if (audioContext.state === 'running') {
                    audioContext.onstatechange = null;

                    resolve();
                }
            };

            audioContext.resume().catch((err) => {
                audioContext.onstatechange = null;

                reject(err);
            });
        }
    });
};
const renderOnRealTimeContext = async ({ blockSize, context, length, prepare, prepareBeforeStart, start }) => {
    const gainNode = new GainNode(context);
    const audioNodes = await prepare(gainNode);
    const bufferNode = createBufferNode({ audioNodes, context });
    const channelMergerNode = new ChannelMergerNode(context, { numberOfInputs: 2 });
    const firstImpulseNode = createImpulseNode({ context, length });
    const newAudioNodes = typeof prepareBeforeStart !== 'function' ? undefined : prepareBeforeStart(audioNodes);
    const allAudioNodes = newAudioNodes === undefined ? audioNodes : { ...audioNodes, ...newAudioNodes };
    const recorderBufferSize = 8192;
    const recorderScriptProcessorNode = createScriptProcessor(context, recorderBufferSize, 2, 1);
    const sampleRate = context.sampleRate;
    const secondImpulseNode = createImpulseNode({ context, length });
    const thirdImpulseNode = createImpulseNode({ context, length });

    gainNode.connect(channelMergerNode, 0, 1);

    firstImpulseNode.connect(bufferNode);
    secondImpulseNode.connect(bufferNode);
    thirdImpulseNode.connect(bufferNode);

    bufferNode.connect(channelMergerNode);

    // @todo Maybe add an additional GainNode to avoid any hearable output.
    channelMergerNode.connect(recorderScriptProcessorNode).connect(context.destination);

    const disconnect = () => {
        gainNode.disconnect(channelMergerNode);
        firstImpulseNode.disconnect(bufferNode);
        secondImpulseNode.disconnect(bufferNode);
        thirdImpulseNode.disconnect(bufferNode);
        bufferNode.disconnect(channelMergerNode);
        channelMergerNode.disconnect(recorderScriptProcessorNode);
        recorderScriptProcessorNode.disconnect(context.destination);

        for (const audioNode of Object.values(allAudioNodes)) {
            audioNode.disconnect();

            if (typeof audioNode.stop === 'function') {
                audioNode.stop();
            }
        }

        bufferNode.onaudioprocess = null;
        recorderScriptProcessorNode.onaudioprocess = null;
    };

    return new Promise((resolve, reject) => {
        // Start the impulse at least in 8192 samples from now to make sure there is enough time to set everything up.
        const impulseStartSample = Math.ceil((context.currentTime * sampleRate + 8192) / blockSize) * blockSize;
        // Add an additional delay of 8192 samples to the startTime. That's especially useful for testing the MediaElementAudioSourceNode.
        const startTimeOffset = 8192;
        // This renderer is impatient. If it is not done within a reasonable time it will abort the process and try again.
        const seconds = Math.ceil(blockSize / sampleRate) + 1;
        const timeoutId = setTimeout(() => {
            disconnect();
            reject(new Error(`Recording the sample was not possible within ${seconds} second(s).`));
        }, seconds * 1000);

        let channelData = null;
        let impulseOffset = null;
        let lastPlaybackOffset = null;

        recorderScriptProcessorNode.onaudioprocess = ({ inputBuffer, playbackTime }) => {
            if (lastPlaybackOffset === null) {
                lastPlaybackOffset = Math.round(playbackTime * sampleRate);
            } else {
                lastPlaybackOffset += recorderBufferSize;
            }

            // Look for the impulse in case it was not detected yet.
            if (impulseOffset === null) {
                const impulseChannelData = inputBuffer.getChannelData(0);

                for (let i = 0; i < recorderBufferSize; i += 1) {
                    if (impulseChannelData[i] === 1) {
                        impulseOffset = lastPlaybackOffset + i;

                        break;
                    }
                }
            }

            if (impulseOffset !== null) {
                const expectedPlaybackOffset = impulseOffset + startTimeOffset;
                const expectedThirdImpulseOffset = impulseOffset + startTimeOffset * 2;

                if (
                    lastPlaybackOffset <= expectedPlaybackOffset &&
                    lastPlaybackOffset + recorderBufferSize >= expectedPlaybackOffset + length
                ) {
                    const impulseChannelData = inputBuffer.getChannelData(0);
                    const index = expectedPlaybackOffset - lastPlaybackOffset;

                    if (impulseChannelData.slice(index, index + 1)[0] === 1) {
                        const playbackChannelData = inputBuffer.getChannelData(1);

                        channelData = playbackChannelData.slice(index, index + length);
                    } else {
                        clearTimeout(timeoutId);
                        disconnect();
                        reject(new Error('Recording the second impulse was not possible.'));
                    }
                } else if (
                    lastPlaybackOffset <= expectedThirdImpulseOffset &&
                    lastPlaybackOffset + recorderBufferSize >= expectedThirdImpulseOffset + length
                ) {
                    const impulseChannelData = inputBuffer.getChannelData(0);
                    const index = expectedThirdImpulseOffset - lastPlaybackOffset;

                    clearTimeout(timeoutId);
                    disconnect();

                    if (impulseChannelData.slice(index, index + 1)[0] === 1) {
                        resolve(channelData);
                    } else {
                        reject(new Error('Recording the third impulse was not possible.'));
                    }
                } else if (lastPlaybackOffset >= expectedThirdImpulseOffset) {
                    clearTimeout(timeoutId);
                    disconnect();
                    reject(new Error('Rendering the result was not possible.'));
                }
            }
        };

        const startTime = roundToSamples(0, sampleRate, impulseStartSample + startTimeOffset);

        firstImpulseNode.start(roundToSamples(0, sampleRate, impulseStartSample));
        secondImpulseNode.start(startTime);
        thirdImpulseNode.start(roundToSamples(0, sampleRate, impulseStartSample + startTimeOffset * 2));

        if (typeof start === 'function') {
            start(startTime, allAudioNodes);
        }
    });
};

export const createRenderer = ({ context, create, length, prepare }) => {
    if (context instanceof AudioContext || context instanceof MinimalAudioContext) {
        if (length === undefined) {
            throw new Error('The length need to be specified when using an AudioContext or MinimalAudioContext.');
        }

        if (length > 128) {
            throw new Error('Running tests for longer than 128 samples is not yet possible.');
        }

        return async ({ blockSize = 128, prepare: prepareBeforeStart, start, verifyChannelData = true }) => {
            const MAX_RETRIES = 9;

            let channelData = null;
            let indexOfCurrentTry = 0;

            while (indexOfCurrentTry < MAX_RETRIES) {
                await waitForRunningState(context);

                try {
                    const newChannelData = await renderOnRealTimeContext({
                        blockSize,
                        context,
                        create,
                        length,
                        prepare,
                        prepareBeforeStart,
                        start
                    });

                    if (channelData === null) {
                        channelData = newChannelData;

                        if (!verifyChannelData) {
                            break;
                        }
                    } else {
                        for (let i = 0; i < length; i += 1) {
                            if (channelData[i] !== newChannelData[i]) {
                                channelData = null;
                                // @todo Limit the number of retries in case of different results.
                                indexOfCurrentTry = 0;

                                throw new Error('Two consecutive recordings had a different result.');
                            }
                        }

                        break;
                    }
                } catch (err) {
                    indexOfCurrentTry += 1;

                    const currentTry =
                        indexOfCurrentTry === 1
                            ? '1st'
                            : indexOfCurrentTry === 2
                              ? '2nd'
                              : indexOfCurrentTry === 3
                                ? '3rd'
                                : `${indexOfCurrentTry}th`;
                    const message = `${err.message.slice(0, -1)} when tried for the ${currentTry} time.`;

                    if (indexOfCurrentTry < MAX_RETRIES) {
                        console.warn(message); // eslint-disable-line no-console
                    } else {
                        throw new Error(message);
                    }
                }
            }

            return channelData;
        };
    }

    if (length !== undefined) {
        throw new Error('The property length should not be set for an OfflineAudioContext.');
    }

    return async ({ prepare: prepareBeforeStart, start }) => {
        const audioNodes = await prepare(context.destination);
        const newAudioNodes = typeof prepareBeforeStart !== 'function' ? undefined : prepareBeforeStart(audioNodes);

        if (typeof start === 'function') {
            start(context.currentTime, newAudioNodes === undefined ? audioNodes : { ...audioNodes, ...newAudioNodes });
        }

        const channelData = new Float32Array(context.length);
        const renderedBuffer = await context.startRendering();

        renderedBuffer.copyFromChannel(channelData, 0, 0);

        // @todo Chrome sometimes produces samples with a value of a negative zero.
        for (let i = 0; i < channelData.length; i += 1) {
            if (channelData[i] === 0) {
                channelData[i] = 0;
            }
        }

        return channelData;
    };
};
