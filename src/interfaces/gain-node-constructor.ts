import { TStandardizedContext } from '../types';
import { IGainNode } from './gain-node';
import { IGainOptions } from './gain-options';

export interface IGainNodeConstructor {

    new (context: TStandardizedContext, options?: Partial<IGainOptions>): IGainNode;

}
