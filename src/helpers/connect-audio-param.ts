import { AUDIO_PARAM_STORE } from '../globals';
import { renderInputsOfAudioParam } from '../helpers/render-inputs-of-audio-param';
import { IAudioParam } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext, TStandardizedContext } from '../types';

export const connectAudioParam = (
    context: TStandardizedContext,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: undefined | TNativeAudioParam = AUDIO_PARAM_STORE.get(audioParam)
) => {
    if (nativeAudioParam === undefined) {
        throw new Error('The associated native AudioParam is missing.');
    }

    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
