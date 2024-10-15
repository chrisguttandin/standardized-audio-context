import { AudioContext, AudioWorkletNode, MinimalAudioContext, addAudioWorkletModule } from '../../src/module';

export const createRenderer = ({ context, length, setup }) => {
    const { destination, sampleRate } = context;

    if (context instanceof AudioContext || context instanceof MinimalAudioContext) {
        if (length === undefined) {
            throw new Error('The length need to be specified when using an AudioContext or MinimalAudioContext.');
        }

        if (length > 128) {
            throw new Error('Running tests for longer than 128 samples is not yet possible.');
        }

        return async ({ prepare, start }) => {
            await addAudioWorkletModule(context, 'base/test/fixtures/render-processor.js');

            const audioNodes = await setup(destination);
            const newAudioNodes = typeof prepare !== 'function' ? undefined : prepare(audioNodes);
            const startFrame = Math.round(context.currentTime * sampleRate + 3840);
            const audioWorkletNode = new AudioWorkletNode(context, 'render-processor', {
                channelCount: 1,
                channelCountMode: 'explicit',
                numberOfInputs: 1,
                processorOptions: { length, startFrame }
            });

            destination.connect(audioWorkletNode);

            if (typeof start === 'function') {
                start(startFrame / sampleRate, newAudioNodes === undefined ? audioNodes : { ...audioNodes, ...newAudioNodes });
            }

            return new Promise((resolve) => {
                audioWorkletNode.port.onmessage = ({ data }) => {
                    audioWorkletNode.port.close();
                    destination.disconnect(audioWorkletNode);
                    resolve(data);
                };
            });
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
