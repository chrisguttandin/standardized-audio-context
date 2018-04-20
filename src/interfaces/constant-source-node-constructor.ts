import { TContext } from '../types';
import { IConstantSourceNode } from './constant-source-node';
import { IConstantSourceOptions } from './constant-source-options';

export interface IConstantSourceNodeConstructor {

    new (context: TContext, options?: Partial<IConstantSourceOptions>): IConstantSourceNode;

}
