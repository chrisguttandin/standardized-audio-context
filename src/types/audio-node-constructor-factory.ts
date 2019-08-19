import { TAudioNodeConstructor } from './audio-node-constructor';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TDetectCyclesFunction } from './detect-cycles-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAudioNodeConstructorFactory = (
    cacheTestResult: TCacheTestResultFunction,
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    detectCycles: TDetectCyclesFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TAudioNodeConstructor;
