import { IAnalyserNode, IAnalyserOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TAnalyserNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IAnalyserOptions>
) => IAnalyserNode<T>;
