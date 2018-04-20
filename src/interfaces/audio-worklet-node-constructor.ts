import { TStandardizedContext } from '../types';
import { IAudioWorkletNode } from './audio-worklet-node';
import { IAudioWorkletNodeOptions } from './audio-worklet-node-options';

export interface IAudioWorkletNodeConstructor {

    new (context: TStandardizedContext, name: string, options?: Partial<IAudioWorkletNodeOptions>): IAudioWorkletNode;

}
