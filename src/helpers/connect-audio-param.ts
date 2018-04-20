import { getNativeAudioParam } from '../helpers/get-native-audio-param';
import { renderInputsOfAudioParam } from '../helpers/render-inputs-of-audio-param';
import { IAudioParam } from '../interfaces';
import { TContext, TNativeAudioParam, TNativeOfflineAudioContext } from '../types';

export const connectAudioParam = (
    context: TContext,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: undefined | TNativeAudioParam = getNativeAudioParam(audioParam)
) => {
    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
