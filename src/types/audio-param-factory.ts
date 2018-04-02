import { IAudioParam, IMinimalBaseAudioContext } from '../interfaces';
import { TNativeAudioParam } from './native-audio-param';

export type TAudioParamFactory = (
    context: IMinimalBaseAudioContext,
    isAudioParamOfOfflineAudioContext: boolean,
    nativeAudioParam: TNativeAudioParam,
    maxValue?: null | number,
    minValue?: null | number
) => IAudioParam;
