import { TAudioNodeConstructor } from './audio-node-constructor';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAudioNodeConstructorFactory = (
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TAudioNodeConstructor;
