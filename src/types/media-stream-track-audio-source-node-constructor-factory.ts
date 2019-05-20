import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TMediaStreamTrackAudioSourceNodeConstructor } from './media-stream-track-audio-source-node-constructor';
import { TNativeMediaStreamTrackAudioSourceNodeFactory } from './native-media-stream-track-audio-source-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TMediaStreamTrackAudioSourceNodeConstructorFactory = (
    createNativeMediaStreamTrackAudioSourceNode: TNativeMediaStreamTrackAudioSourceNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TMediaStreamTrackAudioSourceNodeConstructor;
