import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TMediaElementAudioSourceNodeConstructor } from './media-element-audio-source-node-constructor';
import { TNativeMediaElementAudioSourceNodeFactory } from './native-media-element-audio-source-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TMediaElementAudioSourceNodeConstructorFactory = (
    createNativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TMediaElementAudioSourceNodeConstructor;
