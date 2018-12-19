import { IDelayNode, IDelayOptions } from '../interfaces';
import { TContext } from './context';

export type TDelayNodeConstructor = new (context: TContext, options?: Partial<IDelayOptions>) => IDelayNode;
