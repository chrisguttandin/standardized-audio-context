import { IConstantSourceNode, IConstantSourceOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TConstantSourceNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IConstantSourceOptions>
) => IConstantSourceNode<T>;
