import { IAudioNode, IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { getAudioParamConnections } from './get-audio-param-connections';

export const disconnectAudioParamInputConnections = <T extends IMinimalBaseAudioContext>(
    audioParam: IAudioParam,
    disconnectAudioNodeInputConnections: (audioNode: IAudioNode<T>) => void
) => {
    const audioParamConnections = getAudioParamConnections<T>(audioParam);

    if (audioParamConnections !== undefined) {
        audioParamConnections
            .activeInputs
            .forEach(([ source, output ]) => {
                source.disconnect(audioParam, output);

                disconnectAudioNodeInputConnections(source);
            });
    }
};
