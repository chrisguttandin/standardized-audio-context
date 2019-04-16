import { TAudioNodeConstructor } from './audio-node-constructor';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAudioNodeConstructorFactory = (
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TAudioNodeConstructor;
