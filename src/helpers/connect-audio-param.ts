import { AUDIO_PARAM_RENDERER_STORE } from '../globals';
import { IAudioParam } from '../interfaces';
import { TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';

export const connectAudioParam = (
    nativeOfflineAudioContext: TUnpatchedOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: TNativeAudioParam
) => {
    const audioParamRenderer = AUDIO_PARAM_RENDERER_STORE.get(audioParam);

    if (audioParamRenderer === undefined) {
        throw new Error('The associated renderer is missing.');
    }

    return audioParamRenderer.connect(nativeOfflineAudioContext, nativeAudioParam);
};
