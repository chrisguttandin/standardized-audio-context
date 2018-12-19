import { IAudioContext, IMediaStreamAudioSourceNode, IMediaStreamAudioSourceOptions, IMinimalAudioContext } from '../interfaces';

export type TMediaStreamAudioSourceNodeConstructor = new (
    context: IAudioContext | IMinimalAudioContext,
    options: IMediaStreamAudioSourceOptions
) => IMediaStreamAudioSourceNode;
