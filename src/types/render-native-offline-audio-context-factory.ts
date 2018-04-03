import { TNativeGainNodeFactory } from './native-gain-node-factory';
import { TRenderNativeOfflineAudioContextFunction } from './render-native-offline-audio-context-function';

export type TRenderNativeOfflineAudioContextFactory = (
    createNativeGainNode: TNativeGainNodeFactory
) => TRenderNativeOfflineAudioContextFunction;
