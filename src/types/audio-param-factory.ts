import { IAudioParam } from '../interfaces';
import { TNativeAudioParam } from './native-audio-param';
import { TStandardizedContext } from './standardized-context';

export type TAudioParamFactory = (
    context: TStandardizedContext,
    isAudioParamOfOfflineAudioContext: boolean,
    nativeAudioParam: TNativeAudioParam,
    maxValue?: null | number,
    minValue?: null | number
) => IAudioParam;
