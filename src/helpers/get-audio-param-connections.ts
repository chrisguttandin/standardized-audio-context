import { getAudioGraph } from '../helpers/get-audio-graph';
import { IAudioParam, IAudioParamConnections } from '../interfaces';
import { TAnyContext } from '../types';

export function getAudioParamConnections (anyContext: TAnyContext, audioParam: IAudioParam): IAudioParamConnections {
    const audioGraph = getAudioGraph(anyContext);
    const audioParamConnections = audioGraph.params.get(audioParam);

    if (audioParamConnections === undefined) {
        throw new Error('Missing the connections of the given AudioParam in the audio graph.');
    }

    return audioParamConnections;
}
