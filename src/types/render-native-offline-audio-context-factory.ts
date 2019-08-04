import { TCacheTestResultFunction } from './cache-test-result-function';
import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';

export type TRenderNativeOfflineAudioContextFactory = (
    cacheTestResult: TCacheTestResultFunction,
    createNativeGainNode: TNativeGainNodeFactory
) => TRenderNativeOfflineAudioContextFunction;
