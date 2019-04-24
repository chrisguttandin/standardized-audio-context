import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { IAudioParam, IAudioParamRenderer, IMinimalOfflineAudioContext } from '../interfaces';

export function getAudioParamRenderer <T extends IMinimalOfflineAudioContext> (context: T, audioParam: IAudioParam): IAudioParamRenderer {
    const audioParamConnections = getAudioParamConnections(context, audioParam);

    if (audioParamConnections.renderer === null) {
        throw new Error('Missing the renderer of the given AudioParam in the audio graph.');
    }

    return audioParamConnections.renderer;
}
