import { IBiquadFilterNode, IBiquadFilterOptions } from '../interfaces';
import { TContext } from './context';

export type TBiquadFilterNodeConstructor = new (context: TContext, options?: Partial<IBiquadFilterOptions>) => IBiquadFilterNode;
