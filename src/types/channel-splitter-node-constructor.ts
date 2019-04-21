import { IAudioNode, IChannelSplitterOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TChannelSplitterNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IChannelSplitterOptions>
) => IAudioNode<T>;
