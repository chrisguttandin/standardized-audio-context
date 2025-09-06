import { AudioWorkletNode } from '../../src/module';

export const createAudioWorkletNodeAndStartFrame = async (context, destination, length, sampleRate) => {
    while (true) {
        await context.suspend();

        const audioWorkletNode = new AudioWorkletNode(context, 'render-processor', {
            channelCount: 1,
            channelCountMode: 'explicit',
            numberOfInputs: 1,
            processorOptions: {
                /*
                 * Bug #204: Chrome sometimes forgets to advance currentFrame. It can only be detected when recording at least two render
                 * quantums.
                 */
                length: Math.max(length, 256)
            }
        });

        destination.connect(audioWorkletNode);

        const startFrame = await new Promise((resolve) => {
            audioWorkletNode.port.onmessage = ({ data }) => resolve(data);
        });

        // Bug #204: Chrome sometimes forgets to advance currentFrame.
        if (!/Chrome/.test(navigator.userAgent) || startFrame >= Math.round(context.currentTime * sampleRate)) {
            return { audioWorkletNode, startFrame };
        }

        audioWorkletNode.port.close();
        destination.disconnect(audioWorkletNode);

        await context.resume();
    }
};
