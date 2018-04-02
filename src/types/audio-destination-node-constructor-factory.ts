import { IAudioDestinationNodeConstructor, IAudioNodeConstructor } from '../interfaces';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TAudioDestinationNodeConstructorFactory = (
    audioNodeConstructor: IAudioNodeConstructor,
    isNativeOfflineAudioContextFunction: TIsNativeOfflineAudioContextFunction
) => IAudioDestinationNodeConstructor;
