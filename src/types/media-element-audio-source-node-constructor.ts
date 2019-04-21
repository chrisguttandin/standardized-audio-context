import { IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';

export type TMediaElementAudioSourceNodeConstructor = new <T extends IMinimalAudioContext>(
    context: T,
    options: IMediaElementAudioSourceOptions
) => IMediaElementAudioSourceNode<T>;
