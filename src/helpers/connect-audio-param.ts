import { getNativeAudioParam } from '../helpers/get-native-audio-param';
import { renderInputsOfAudioParam } from '../helpers/render-inputs-of-audio-param';
import { IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';

export const connectAudioParam = <T extends IMinimalOfflineAudioContext>(
    context: T,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: undefined | TNativeAudioParam = getNativeAudioParam(audioParam)
) => {
    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
