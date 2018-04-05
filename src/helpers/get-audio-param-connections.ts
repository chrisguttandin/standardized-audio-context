import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioParam, IAudioParamConnections, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const getAudioParamConnections = (
    anyContext: IMinimalBaseAudioContext | TNativeAudioContext | TNativeOfflineAudioContext,
    audioParam: IAudioParam
): IAudioParamConnections => {
    const audioGraph = getAudioGraph(anyContext);
    const audioParamConnections = audioGraph.params.get(audioParam);

    if (audioParamConnections === undefined) {
        throw new Error('Missing the connections of the given AudioParam in the audio graph.');
    }

    return audioParamConnections;
};
