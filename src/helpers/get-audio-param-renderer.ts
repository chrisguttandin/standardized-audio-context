import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { IAudioParam, IAudioParamRenderer } from '../interfaces';
import { TNativeContext, TStandardizedContext } from '../types';

export function getAudioParamRenderer (anyContext: TNativeContext | TStandardizedContext, audioParam: IAudioParam): IAudioParamRenderer {
    const audioParamConnections = getAudioParamConnections(anyContext, audioParam);

    if (audioParamConnections.renderer === null) {
        throw new Error('Missing the renderer of the given AudioParam in the audio graph.');
    }

    return audioParamConnections.renderer;
}
