import { IAudioParam, IMinimalOfflineAudioContext } from '../interfaces';
import { TNativeAudioParam, TNativeOfflineAudioContext } from '../types';
import { getNativeAudioParam } from './get-native-audio-param';
import { renderInputsOfAudioParam } from './render-inputs-of-audio-param';

export const connectAudioParam = <T extends IMinimalOfflineAudioContext>(
    nativeOfflineAudioContext: TNativeOfflineAudioContext,
    audioParam: IAudioParam,
    nativeAudioParam: undefined | TNativeAudioParam = getNativeAudioParam(audioParam)
) => {
    return renderInputsOfAudioParam<T>(audioParam, nativeOfflineAudioContext, nativeAudioParam);
};
