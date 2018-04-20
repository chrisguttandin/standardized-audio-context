import { TContext } from '../types';
import { IOscillatorNode } from './oscillator-node';
import { IOscillatorOptions } from './oscillator-options';

export interface IOscillatorNodeConstructor {

    new (context: TContext, options?: Partial<IOscillatorOptions>): IOscillatorNode;

}
