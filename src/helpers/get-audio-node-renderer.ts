import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { IAudioNode, IAudioNodeRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export const getAudioNodeRenderer = <T extends IMinimalOfflineAudioContext>(
    audioNode: IAudioNode<T>
): IAudioNodeRenderer<T, IAudioNode<T>> => {
    const audioNodeConnections = getAudioNodeConnections(audioNode);

    if (audioNodeConnections.renderer === null) {
        throw new Error('Missing the renderer of the given AudioNode in the audio graph.');
    }

    return audioNodeConnections.renderer;
};
