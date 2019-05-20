import { IMediaStreamTrackAudioSourceNode, IMediaStreamTrackAudioSourceOptions, IMinimalAudioContext } from '../interfaces';

export type TMediaStreamTrackAudioSourceNodeConstructor = new <T extends IMinimalAudioContext>(
    context: T,
    options: IMediaStreamTrackAudioSourceOptions
) => IMediaStreamTrackAudioSourceNode<T>;
