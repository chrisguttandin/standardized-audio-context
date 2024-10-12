import { TAddAudioWorkletModuleFunction } from './add-audio-worklet-module-function';
import { TCacheTestResultFunction } from './cache-test-result-function';
import { TContext } from './context';
import { TFetchSourceFunction } from './fetch-source-function';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TGetOrCreateBackupOfflineAudioContextFunction } from './get-or-create-backup-offline-audio-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';

export type TAddAudioWorkletModuleFactory = (
    cacheTestResult: TCacheTestResultFunction,
    fetchSource: TFetchSourceFunction,
    getNativeContext: TGetNativeContextFunction,
    getOrCreateBackupOfflineAudioContext: TGetOrCreateBackupOfflineAudioContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    ongoingRequests: WeakMap<TContext, Map<string, Promise<void>>>,
    resolvedRequests: WeakMap<TContext, Set<string>>,
    testAudioWorkletProcessorPostMessageSupport: () => Promise<boolean>
) => TAddAudioWorkletModuleFunction;
