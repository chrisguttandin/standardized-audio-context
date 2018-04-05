import { getAudioParamConnections } from '../helpers/get-audio-param-connections';
import { IAudioParam, IAudioParamRenderer, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioContext, TNativeOfflineAudioContext } from '../types';

export const getAudioParamRenderer = (
    anyContext: IMinimalBaseAudioContext | TNativeAudioContext | TNativeOfflineAudioContext,
    audioParam: IAudioParam
): IAudioParamRenderer => {
    const audioParamConnections = getAudioParamConnections(anyContext, audioParam);

    if (audioParamConnections.renderer === null) {
        throw new Error('Missing the renderer of the given AudioParam in the audio graph.');
    }

    return audioParamConnections.renderer;
};
