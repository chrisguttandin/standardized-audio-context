import { IMediaStreamAudioSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';
import { TNativeMediaStreamAudioSourceNodeFactory } from './native-media-stream-audio-source-node-factory';

export type TMediaStreamAudioSourceNodeConstructorFactory = (
    createNativeMediaStreamAudioSourceNode: TNativeMediaStreamAudioSourceNodeFactory,
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IMediaStreamAudioSourceNodeConstructor;
