import { IConstantSourceNode, IConstantSourceOptions } from '../interfaces';
import { TContext } from './context';

export type TConstantSourceNodeConstructor = new (context: TContext, options?: Partial<IConstantSourceOptions>) => IConstantSourceNode;
