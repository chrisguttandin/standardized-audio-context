import { IAudioNodeConstructor } from '../interfaces';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TAudioNodeConstructorFactory = (
    createInvalidAccessError: TInvalidAccessErrorFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => IAudioNodeConstructor;
