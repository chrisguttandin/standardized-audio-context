import { IAudioNode, IAudioParam } from '../interfaces';
import { TContext } from '../types';
import { getAudioParamConnections } from './get-audio-param-connections';

export const disconnectAudioParamInputConnections = <T extends TContext>(
    audioParam: IAudioParam,
    disconnectAudioNodeInputConnections: (audioNode: IAudioNode<T>) => void
) => {
    const audioParamConnections = getAudioParamConnections<T>(audioParam);

    if (audioParamConnections !== undefined) {
        audioParamConnections.activeInputs.forEach(([source, output]) => {
            source.disconnect(audioParam, output);

            disconnectAudioNodeInputConnections(source);
        });
    }
};
