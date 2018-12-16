import { TContext } from '../types';
import { IConvolverNode } from './convolver-node';
import { IConvolverOptions } from './convolver-options';

export interface IConvolverNodeConstructor {

    new (context: TContext, options?: Partial<IConvolverOptions>): IConvolverNode;

}
