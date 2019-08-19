import { TGetAudioNodeConnectionsFunction } from '../types';
import { getAudioGraph } from './get-audio-graph';
import { getValueForKey } from './get-value-for-key';

export const getAudioNodeConnections: TGetAudioNodeConnectionsFunction = (audioNode) => {
    const audioGraph = getAudioGraph(audioNode.context);

    return getValueForKey(audioGraph.nodes, audioNode);
};
