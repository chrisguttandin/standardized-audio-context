import { IAudioBufferSourceNode, IAudioBufferSourceOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TAudioBufferSourceNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IAudioBufferSourceOptions>
) => IAudioBufferSourceNode<T>;
