import { IConvolverNode, IConvolverOptions } from '../interfaces';
import { TContext } from './context';

export type TConvolverNodeConstructor = new (context: TContext, options?: Partial<IConvolverOptions>) => IConvolverNode;
