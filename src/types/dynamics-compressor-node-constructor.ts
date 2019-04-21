import { IDynamicsCompressorNode, IDynamicsCompressorOptions, IMinimalBaseAudioContext } from '../interfaces';

export type TDynamicsCompressorNodeConstructor = new <T extends IMinimalBaseAudioContext>(
    context: T,
    options?: Partial<IDynamicsCompressorOptions>
) => IDynamicsCompressorNode<T>;
