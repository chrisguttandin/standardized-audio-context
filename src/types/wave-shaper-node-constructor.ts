import { IMinimalBaseAudioContext, IWaveShaperNode, IWaveShaperOptions } from '../interfaces';

export type TWaveShaperNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IWaveShaperOptions>
) => IWaveShaperNode<T>;
