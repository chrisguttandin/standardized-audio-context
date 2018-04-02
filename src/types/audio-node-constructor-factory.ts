import { IAudioNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TAudioNodeConstructorFactory = (
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction
) => IAudioNodeConstructor;
