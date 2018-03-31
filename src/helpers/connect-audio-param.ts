import { AUDIO_PARAM_RENDERER_STORE, AUDIO_PARAM_STORE } from '../globals';
import { IAudioParam } from '../interfaces';
import { TNativeAudioParam, TUnpatchedOfflineAudioContext } from '../types';

export const connectAudioParam = (
    nativeOfflineAudioContext: TUnpatchedOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: undefined | TNativeAudioParam = AUDIO_PARAM_STORE.get(audioParam)
) => {
    const audioParamRenderer = AUDIO_PARAM_RENDERER_STORE.get(audioParam);

    if (audioParamRenderer === undefined) {
        throw new Error('The associated renderer is missing.');
    }

    if (nativeAudioParam === undefined) {
        throw new Error('The associated native AudioParam is missing.');
    }

    return audioParamRenderer.connect(nativeOfflineAudioContext, nativeAudioParam);
};
