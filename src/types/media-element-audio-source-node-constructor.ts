import { IAudioContext, IMediaElementAudioSourceNode, IMediaElementAudioSourceOptions, IMinimalAudioContext } from '../interfaces';

export type TMediaElementAudioSourceNodeConstructor = new (
    context: IAudioContext | IMinimalAudioContext,
    options: IMediaElementAudioSourceOptions
) => IMediaElementAudioSourceNode;
