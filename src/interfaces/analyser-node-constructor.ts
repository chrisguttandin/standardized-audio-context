import { TStandardizedContext } from '../types';
import { IAnalyserNode } from './analyser-node';
import { IAnalyserOptions } from './analyser-options';

export interface IAnalyserNodeConstructor {

    new (context: TStandardizedContext, options?: Partial<IAnalyserOptions>): IAnalyserNode;

}
