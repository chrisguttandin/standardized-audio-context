import { IMediaElementAudioSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';

export type TMediaElementAudioSourceNodeConstructorFactory = (
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IMediaElementAudioSourceNodeConstructor;
