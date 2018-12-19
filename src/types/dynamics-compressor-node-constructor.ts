import { IDynamicsCompressorNode, IDynamicsCompressorOptions } from '../interfaces';
import { TContext } from './context';

export type TDynamicsCompressorNodeConstructor = new (
    context: TContext,
    options?: Partial<IDynamicsCompressorOptions>
) => IDynamicsCompressorNode;
