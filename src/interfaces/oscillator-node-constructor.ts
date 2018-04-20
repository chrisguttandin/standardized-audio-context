import { TStandardizedContext } from '../types';
import { IOscillatorNode } from './oscillator-node';
import { IOscillatorOptions } from './oscillator-options';

export interface IOscillatorNodeConstructor {

    new (context: TStandardizedContext, options?: Partial<IOscillatorOptions>): IOscillatorNode;

}
