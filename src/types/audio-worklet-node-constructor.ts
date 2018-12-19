import { IAudioWorkletNode, IAudioWorkletNodeOptions } from '../interfaces';
import { TContext } from './context';

export type TAudioWorkletNodeConstructor = new (
    context: TContext,
    name: string,
    options?: Partial<IAudioWorkletNodeOptions>
) => IAudioWorkletNode;
