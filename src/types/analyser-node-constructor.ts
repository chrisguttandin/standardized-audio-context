import { IAnalyserNode, IAnalyserOptions } from '../interfaces';
import { TContext } from './context';

export type TAnalyserNodeConstructor = new (context: TContext, options?: Partial<IAnalyserOptions>) => IAnalyserNode;
