import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioParam, IAudioParamConnections, IMinimalBaseAudioContext } from '../interfaces';

export function getAudioParamConnections <T extends IMinimalBaseAudioContext> (
    context: T,
    audioParam: IAudioParam
): IAudioParamConnections<T> {
    const audioGraph = getAudioGraph<T>(context);
    const audioParamConnections = audioGraph.params.get(audioParam);

    if (audioParamConnections === undefined) {
        throw new Error('Missing the connections of the given AudioParam in the audio graph.');
    }

    return audioParamConnections;
}
