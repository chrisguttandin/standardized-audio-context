import { TAudioNodeConstructor } from './audio-node-constructor';
import { TGetNativeContextFunction } from './get-native-context-function';
import { TMediaElementAudioSourceNodeConstructor } from './media-element-audio-source-node-constructor';
import { TNativeMediaElementAudioSourceNodeFactory } from './native-media-element-audio-source-node-factory';

export type TMediaElementAudioSourceNodeConstructorFactory = (
    audioNodeConstructor: TAudioNodeConstructor,
    createNativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNodeFactory,
    getNativeContext: TGetNativeContextFunction
) => TMediaElementAudioSourceNodeConstructor;
