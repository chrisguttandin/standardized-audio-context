import { AudioContext, MinimalAudioContext, addAudioWorkletModule } from '../../src/module';
import { createAudioWorkletNodeAndStartFrame } from './create-audio-worklet-node-and-start-frame';

export const createRenderer = ({ context, length, setup }) => {
    const { destination, sampleRate } = context;

    if (context instanceof AudioContext || context instanceof MinimalAudioContext) {
        if (length === undefined) {
            throw new Error('The length need to be specified when using an AudioContext or MinimalAudioContext.');
        }

        if (length < 1) {
            throw new Error('The length needs to be a positive value of at least 1.');
        }

        return async ({ prepare, start }) => {
            await addAudioWorkletModule(context, 'base/test/fixtures/render-processor.js');

            while (true) {
                const audioNodes = await setup(destination);
                const { audioWorkletNode, startFrame } = await createAudioWorkletNodeAndStartFrame(
                    context,
                    destination,
                    length,
                    sampleRate
                );
                const newAudioNodes = typeof prepare !== 'function' ? undefined : prepare(audioNodes);
                const allAudioNodes = newAudioNodes === undefined ? audioNodes : { ...audioNodes, ...newAudioNodes };

                if (typeof start === 'function') {
                    start(startFrame / sampleRate, allAudioNodes);
                }

                const [channelData] = await Promise.all([
                    new Promise((resolve) => {
                        audioWorkletNode.port.onmessage = ({ data }) => {
                            audioWorkletNode.port.close();
                            destination.disconnect(audioWorkletNode);
                            resolve(data);
                        };
                    }),
                    context.resume()
                ]);

                for (const audioNode of Object.values(allAudioNodes)) {
                    audioNode.disconnect();
                }

                if (channelData instanceof Float32Array) {
                    return channelData.slice(0, length);
                }
            }
        };
    }

    if (length !== undefined) {
        throw new Error('The property length should not be set for an OfflineAudioContext.');
    }

    return async ({ prepare, start }) => {
        const audioNodes = await setup(destination);
        const newAudioNodes = typeof prepare !== 'function' ? undefined : prepare(audioNodes);

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
