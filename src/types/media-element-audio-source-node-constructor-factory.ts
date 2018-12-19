import { TMediaElementAudioSourceNodeConstructor } from './media-element-audio-source-node-constructor';
import { TNativeMediaElementAudioSourceNodeFactory } from './native-media-element-audio-source-node-factory';
import { TNoneAudioDestinationNodeConstructor } from './none-audio-destination-node-constructor';

export type TMediaElementAudioSourceNodeConstructorFactory = (
    createNativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNodeFactory,
    noneAudioDestinationNodeConstructor: TNoneAudioDestinationNodeConstructor
) => TMediaElementAudioSourceNodeConstructor;
