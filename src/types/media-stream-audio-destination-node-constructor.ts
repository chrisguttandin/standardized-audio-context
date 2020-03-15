import { IAudioContext, IAudioNodeOptions, IMediaStreamAudioDestinationNode, IMinimalAudioContext } from '../interfaces';

export type TMediaStreamAudioDestinationNodeConstructor = new <T extends IAudioContext | IMinimalAudioContext>(
    context: T,
    options?: IAudioNodeOptions
) => IMediaStreamAudioDestinationNode<T>;
