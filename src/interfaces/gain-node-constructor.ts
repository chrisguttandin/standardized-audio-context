import { TContext } from '../types';
import { IGainNode } from './gain-node';
import { IGainOptions } from './gain-options';

export interface IGainNodeConstructor {

    new (context: TContext, options?: Partial<IGainOptions>): IGainNode;

}
