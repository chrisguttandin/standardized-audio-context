import { TContext } from '../types';
import { IAudioWorkletNode } from './audio-worklet-node';
import { IAudioWorkletNodeOptions } from './audio-worklet-node-options';

export interface IAudioWorkletNodeConstructor {

    new (context: TContext, name: string, options?: Partial<IAudioWorkletNodeOptions>): IAudioWorkletNode;

}
