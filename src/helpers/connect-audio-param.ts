import { IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';
import { getNativeAudioParam } from './get-native-audio-param';
import { renderInputsOfAudioParam } from './render-inputs-of-audio-param';

export const connectAudioParam = <T extends IMinimalOfflineAudioContext>(
    context: T,
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: undefined | TNativeAudioParam = getNativeAudioParam(audioParam)
) => {
    return renderInputsOfAudioParam(context, audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
