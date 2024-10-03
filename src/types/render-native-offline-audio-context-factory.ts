import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeScriptProcessorNodeFactory } from './native-script-processor-node-factory';
import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';

export type TRenderNativeOfflineAudioContextFactory = (
    cacheTestResult: TCacheTestResultFunction,
    createNativeScriptProcessorNode: TNativeScriptProcessorNodeFactory,
    testOfflineAudioContextCurrentTimeSupport: () => Promise<boolean>
) => TRenderNativeOfflineAudioContextFunction;
