import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioNode, IAudioNodeConnections } from '../interfaces';
import { TNativeAudioNode } from '../types';

export const getAudioNodeConnections = (anyAudioNode: IAudioNode | TNativeAudioNode): IAudioNodeConnections => {
    const audioGraph = getAudioGraph(anyAudioNode.context);
    const audioNodeConnections = audioGraph.nodes.get(anyAudioNode);

    if (audioNodeConnections === undefined) {
        throw new Error('Missing the connections of the given AudioNode in the audio graph.');
    }

    return audioNodeConnections;
};
