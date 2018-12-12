import { TContext } from '../types';
import { IDelayNode } from './delay-node';
import { IDelayOptions } from './delay-options';

export interface IDelayNodeConstructor {

    new (context: TContext, options?: Partial<IDelayOptions>): IDelayNode;

}
