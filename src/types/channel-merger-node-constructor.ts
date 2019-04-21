import { IAudioNode, IChannelMergerOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TChannelMergerNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IChannelMergerOptions>
) => IAudioNode<T>;
