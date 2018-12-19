import { IAudioNode, IChannelMergerOptions } from '../interfaces';
import { TContext } from './context';

export type TChannelMergerNodeConstructor = new (context: TContext, options?: Partial<IChannelMergerOptions>) => IAudioNode;
