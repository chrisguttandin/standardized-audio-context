import { IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';

export type TMediaStreamAudioSourceNodeConstructor = new <T extends IMinimalAudioContext>(
    context: T,
    options: IMediaStreamAudioSourceOptions
) => IMediaStreamAudioSourceNode<T>;
