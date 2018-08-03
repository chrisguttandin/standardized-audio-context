import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioNode, IAudioNodeConnections } from '../interfaces';
import { TContext, TNativeAudioContext, TNativeAudioNode } from '../types';

export const getAudioNodeConnections = (anyAudioNode: IAudioNode | TNativeAudioNode): IAudioNodeConnections => {
    // The builtin types define the context property as BaseAudioContext which is why it needs to be casted here.
    const audioGraph = getAudioGraph(<TContext | TNativeAudioContext> anyAudioNode.context);
    const audioNodeConnections = audioGraph.nodes.get(anyAudioNode);

    if (audioNodeConnections === undefined) {
        throw new Error('Missing the connections of the given AudioNode in the audio graph.');
    }

    return audioNodeConnections;
};
