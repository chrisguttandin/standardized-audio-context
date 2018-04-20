import { IAudioParam } from '../interfaces';
import { TContext } from './context';
import { TNativeAudioParam } from './native-audio-param';

export type TAudioParamFactory = (
    context: TContext,
    isAudioParamOfOfflineAudioContext: boolean,
    nativeAudioParam: TNativeAudioParam,
    maxValue?: null | number,
    minValue?: null | number
) => IAudioParam;
