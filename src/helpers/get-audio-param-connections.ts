import { IAudioParam, IAudioParamConnections, IMinimalBaseAudioContext } from '../interfaces';
import { getAudioGraph } from './get-audio-graph';
import { getValueForKey } from './get-value-for-key';

export function getAudioParamConnections <T extends IMinimalBaseAudioContext> (
    context: T,
    audioParam: IAudioParam
): IAudioParamConnections<T> {
    const audioGraph = getAudioGraph(context);

    return getValueForKey(audioGraph.params, audioParam);
}
