import { IAudioNode, IAudioNodeConnections, IMinimalBaseAudioContext } from '../interfaces';
import { getAudioGraph } from './get-audio-graph';
import { getValueForKey } from './get-value-for-key';

export const getAudioNodeConnections = <T extends IMinimalBaseAudioContext>(audioNode: IAudioNode<T>): IAudioNodeConnections<T> => {
    const audioGraph = getAudioGraph(audioNode.context);

    return getValueForKey(audioGraph.nodes, audioNode);
};
