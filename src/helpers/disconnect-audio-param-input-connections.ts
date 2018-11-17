import { IAudioGraph, IAudioNode, IAudioParam } from '../interfaces';

export const disconnectAudioParamInputConnections = (
    audioGraph: IAudioGraph,
    audioParam: IAudioParam,
    disconnectAudioNodeInputConnections: (audioGraph: IAudioGraph, audioNode: IAudioNode) => void
) => {
    const audioParamConnections = audioGraph.params.get(audioParam);

    if (audioParamConnections !== undefined) {
        audioParamConnections
            .inputs
            .forEach(([ source, output ]) => {
                source.disconnect(audioParam, output);

                disconnectAudioNodeInputConnections(audioGraph, source);
            });
    }
};
