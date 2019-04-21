import { IAudioGraph, IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';

export const disconnectAudioParamInputConnections = <T extends IMinimalBaseAudioContext>(
    audioGraph: IAudioGraph<T>,
    audioParam: IAudioParam,
    disconnectAudioNodeInputConnections: (audioGraph: IAudioGraph<T>, audioNode: IAudioNode<T>) => void
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
