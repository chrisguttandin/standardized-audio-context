import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TIsNativeOfflineAudioContextFunction } from './is-native-offline-audio-context-function';
import { TMediaStreamTrackAudioSourceNodeConstructor } from './media-stream-track-audio-source-node-constructor';
import { TNativeMediaStreamTrackAudioSourceNodeFactory } from './native-media-stream-track-audio-source-node-factory';
import { TNotSupportedErrorFactory } from './not-supported-error-factory';

export type TMediaStreamTrackAudioSourceNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createNativeMediaStreamTrackAudioSourceNode: TNativeMediaStreamTrackAudioSourceNodeFactory,
    createNotSupportedError: TNotSupportedErrorFactory,
    getNativeContext: TGetNativeContextFunction,
    isNativeOfflineAudioContext: TIsNativeOfflineAudioContextFunction
) => TMediaStreamTrackAudioSourceNodeConstructor;
