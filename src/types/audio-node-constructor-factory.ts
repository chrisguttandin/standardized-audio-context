import { TAddAudioNodeConnectionsFunction } from './add-audio-node-connections-function';
import { TAudioNodeConstructor } from './audio-node-constructor';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TDetectCyclesFunction } from './detect-cycles-function';
import { TIndexSizeErrorFactory } from './index-size-error-factory';
import { TInvalidAccessErrorFactory } from './invalid-access-error-factory';
import { TIsNativeAudioNodeFunction } from './is-native-audio-node-function';
import { TIsNativeAudioParamFunction } from './is-native-audio-param-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TAudioNodeConstructorFactory = (
    addAudioNodeConnections: TAddAudioNodeConnectionsFunction,
    cacheTestResult: TCacheTestResultFunction,
    createIndexSizeError: TIndexSizeErrorFactory,
    createInvalidAccessError: TInvalidAccessErrorFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    detectCycles: TDetectCyclesFunction,
    isNativeAudioNode: TIsNativeAudioNodeFunction,
    isNativeAudioParam: TIsNativeAudioParamFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TAudioNodeConstructor;
