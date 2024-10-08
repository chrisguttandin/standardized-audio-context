import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TMediaStreamAudioSourceNodeConstructor } from './media-stream-audio-source-node-constructor';
import { TNativeMediaStreamAudioSourceNodeFactory } from './native-media-stream-audio-source-node-factory';

export type TMediaStreamAudioSourceNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createNativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNodeFactory,
    getNativeContext: TGetNativeContextFunction
) => TMediaStreamAudioSourceNodeConstructor;
