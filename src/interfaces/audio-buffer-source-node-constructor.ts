import { TContext } from '../types';
import { IAudioBufferSourceNode } from './audio-buffer-source-node';
import { IAudioBufferSourceOptions } from './audio-buffer-source-options';

export interface IAudioBufferSourceNodeConstructor {

    new (context: TContext, options?: Partial<IAudioBufferSourceOptions>): IAudioBufferSourceNode;

}
