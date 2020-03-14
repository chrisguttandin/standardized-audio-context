import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TNativeAudioNodeFactory } from './native-audio-node-factory';
import { TNativeMediaStreamTrackAudioSourceNodeFactory } from './native-media-stream-track-audio-source-node-factory';

export type TNativeMediaStreamTrackAudioSourceNodeFactoryFactory = (
    createInvalidStateError: TInvalidStateErrorFactory,
    createNativeAudioNode: TNativeAudioNodeFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TNativeMediaStreamTrackAudioSourceNodeFactory;
