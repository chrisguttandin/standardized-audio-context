import { TContext } from '../types';
import { IWaveShaperNode } from './wave-shaper-node';
import { IWaveShaperOptions } from './wave-shaper-options';

export interface IWaveShaperNodeConstructor {

    new (context: TContext, options?: Partial<IWaveShaperOptions>): IWaveShaperNode;

}
