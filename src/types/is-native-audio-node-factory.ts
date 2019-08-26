import { TIsNativeAudioNodeFunction } from './is-native-audio-node-function';

export type TIsNativeAudioNodeFactory = (window: null | Window) => TIsNativeAudioNodeFunction;
