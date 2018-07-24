import { IMediaElementAudioSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TNativeMediaElementAudioSourceNodeFactory } from './native-media-element-audio-source-node-factory';

export type TMediaElementAudioSourceNodeConstructorFactory = (
    createNativeMediaElementAudioSourceNode: TNativeMediaElementAudioSourceNodeFactory,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IMediaElementAudioSourceNodeConstructor;
