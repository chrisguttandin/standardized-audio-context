import { IAudioBufferSourceNode, IAudioBufferSourceOptions } from '../interfaces';
import { TContext } from './context';

export type TAudioBufferSourceNodeConstructor = new (
    context: TContext,
    options?: Partial<IAudioBufferSourceOptions>
) => IAudioBufferSourceNode;
