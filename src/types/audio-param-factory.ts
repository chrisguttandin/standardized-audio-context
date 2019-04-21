import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioParam } from './native-audio-param';

export type TAudioParamFactory = <T extends IMinimalBaseAudioContext>(
    context: T,
    isAudioParamOfOfflineAudioContext: boolean,
    nativeAudioParam: TNativeAudioParam,
    maxValue?: null | number,
    minValue?: null | number
) => IAudioParam;
