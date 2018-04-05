import { getAudioNodeConnections } from '../helpers/get-audio-node-connections';
import { IAudioNode, IAudioNodeRenderer } from '../interfaces';
import { TNativeAudioNode } from '../types';

export const getAudioNodeRenderer = (anyAudioNode: IAudioNode | TNativeAudioNode): IAudioNodeRenderer => {
    const audioNodeConnections = getAudioNodeConnections(anyAudioNode);

    if (audioNodeConnections.renderer === null) {
        throw new Error('Missing the renderer of the given AudioNode in the audio graph.');
    }

    return audioNodeConnections.renderer;
};
