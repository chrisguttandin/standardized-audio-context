import { TIsNativeAudioParamFunction } from './is-native-audio-param-function';

export type TIsNativeAudioParamFactory = (window: null | Window) => TIsNativeAudioParamFunction;
