import { TContext } from '../types';
import { IAnalyserNode } from './analyser-node';
import { IAnalyserOptions } from './analyser-options';

export interface IAnalyserNodeConstructor {

    new (context: TContext, options?: Partial<IAnalyserOptions>): IAnalyserNode;

}
