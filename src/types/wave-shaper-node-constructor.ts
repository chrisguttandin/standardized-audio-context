import { IWaveShaperNode, IWaveShaperOptions } from '../interfaces';
import { TContext } from './context';

export type TWaveShaperNodeConstructor = new (context: TContext, options?: Partial<IWaveShaperOptions>) => IWaveShaperNode;
