import { TStandardizedContext } from '../types';
import { IAudioBufferSourceNode } from './audio-buffer-source-node';
import { IAudioBufferSourceOptions } from './audio-buffer-source-options';

export interface IAudioBufferSourceNodeConstructor {

    new (context: TStandardizedContext, options?: Partial<IAudioBufferSourceOptions>): IAudioBufferSourceNode;

}
