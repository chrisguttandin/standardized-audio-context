import { IGainNode, IGainOptions } from '../interfaces';
import { TContext } from './context';

export type TGainNodeConstructor = new (context: TContext, options?: Partial<IGainOptions>) => IGainNode;
