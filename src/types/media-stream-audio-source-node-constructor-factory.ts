import { IMediaStreamAudioSourceNodeConstructor, INoneAudioDestinationNodeConstructor } from '../interfaces';

export type TMediaStreamAudioSourceNodeConstructorFactory = (
    noneAudioDestinationNodeConstructor: INoneAudioDestinationNodeConstructor
) => IMediaStreamAudioSourceNodeConstructor;
