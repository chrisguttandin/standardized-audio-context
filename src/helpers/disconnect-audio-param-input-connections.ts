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
            .forEach(([ source ]) => {
                /*
                 * @todo Disconnect the AudioParam.
                 * source.disconnect(audioParam);
                 */

                disconnectAudioNodeInputConnections(audioGraph, source);
            });
    }
};
