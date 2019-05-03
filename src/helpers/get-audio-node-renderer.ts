import { IAudioNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';
import { getAudioNodeConnections } from './get-audio-node-connections';

export const getAudioNodeRenderer = <T extends IMinimalOfflineAudioContext>(
    audioNode: IAudioNode<T>
): IAudioNodeRenderer<T, IAudioNode<T>> => {
    const audioNodeConnections = getAudioNodeConnections(audioNode);

    if (audioNodeConnections.renderer === null) {
        throw new Error('Missing the renderer of the given AudioNode in the audio graph.');
    }

    return audioNodeConnections.renderer;
};
