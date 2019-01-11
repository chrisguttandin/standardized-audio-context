import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TMediaStreamAudioSourceNodeConstructor } from './media-stream-audio-source-node-constructor';
import { TNativeMediaStreamAudioSourceNodeFactory } from './native-media-stream-audio-source-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TMediaStreamAudioSourceNodeConstructorFactory = (
    createNativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TMediaStreamAudioSourceNodeConstructor;
