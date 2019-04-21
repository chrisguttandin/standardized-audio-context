import { IAudioWorkletNode, IAudioWorkletNodeOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TAudioWorkletNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    name: string,
    options?: Partial<IAudioWorkletNodeOptions>
) => IAudioWorkletNode<T>;
