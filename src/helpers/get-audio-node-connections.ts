import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioNode, IAudioNodeConnections, IMinimalBaseAudioContext } from '../interfaces';
import { TAnyContext, TNativeAudioNode } from '../types';

export const getAudioNodeConnections = <T extends IMinimalBaseAudioContext>(
    anyAudioNode: IAudioNode<T> | TNativeAudioNode
): IAudioNodeConnections<T> => {
    // The builtin types define the context property as BaseAudioContext which is why it needs to be casted here.
    const audioGraph = getAudioGraph<T>(<TAnyContext> anyAudioNode.context);
    const audioNodeConnections = audioGraph.nodes.get(anyAudioNode);

    if (audioNodeConnections === undefined) {
        throw new Error('Missing the connections of the given AudioNode in the audio graph.');
    }

    return audioNodeConnections;
};
