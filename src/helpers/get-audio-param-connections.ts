import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioParam, IAudioParamConnections, IMinimalBaseAudioContext } from '../interfaces';
import { TAnyContext } from '../types';

export function getAudioParamConnections <T extends IMinimalBaseAudioContext> (
    anyContext: TAnyContext,
    audioParam: IAudioParam
): IAudioParamConnections<T> {
    const audioGraph = getAudioGraph<T>(anyContext);
    const audioParamConnections = audioGraph.params.get(audioParam);

    if (audioParamConnections === undefined) {
        throw new Error('Missing the connections of the given AudioParam in the audio graph.');
    }

    return audioParamConnections;
}
