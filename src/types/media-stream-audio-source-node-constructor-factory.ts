import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TMediaStreamAudioSourceNodeConstructor } from './media-stream-audio-source-node-constructor';
import { TNativeMediaStreamAudioSourceNodeFactory } from './native-media-stream-audio-source-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TMediaStreamAudioSourceNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createNativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TMediaStreamAudioSourceNodeConstructor;
