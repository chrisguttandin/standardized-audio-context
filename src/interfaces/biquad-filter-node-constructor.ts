import { TContext } from '../types';
import { IBiquadFilterNode } from './biquad-filter-node';
import { IBiquadFilterOptions } from './biquad-filter-options';

export interface IBiquadFilterNodeConstructor {

    new (context: TContext, options?: Partial<IBiquadFilterOptions>): IBiquadFilterNode;

}
