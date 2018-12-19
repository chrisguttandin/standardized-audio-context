import { IOscillatorNode, IOscillatorOptions } from '../interfaces';
import { TContext } from './context';

export type TOscillatorNodeConstructor = new (context: TContext, options?: Partial<IOscillatorOptions>) => IOscillatorNode;
