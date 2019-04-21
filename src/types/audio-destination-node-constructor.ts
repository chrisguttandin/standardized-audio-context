import { IAudioDestinationNode, IMinimalBaseAudioContext } from '../interfaces';

export type TAudioDestinationNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    channelCount: number
) => IAudioDestinationNode<T>;
