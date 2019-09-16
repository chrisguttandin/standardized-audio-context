import { TGetAudioNodeRendererFactory } from '../types';

export const createGetAudioNodeRenderer: TGetAudioNodeRendererFactory = (getAudioNodeConnections) => {
    return (audioNode) => {
        const audioNodeConnections = getAudioNodeConnections(audioNode);

        if (audioNodeConnections.renderer === null) {
            throw new Error('Missing the renderer of the given AudioNode in the audio graph.');
        }

        return audioNodeConnections.renderer;
    };
};
