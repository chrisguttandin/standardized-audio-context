import { IConvolverNode, IConvolverOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TConvolverNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IConvolverOptions>
) => IConvolverNode<T>;
