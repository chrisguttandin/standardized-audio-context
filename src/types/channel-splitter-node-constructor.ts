import { IAudioNode, IChannelSplitterOptions } from '../interfaces';
import { TContext } from './context';

export type TChannelSplitterNodeConstructor = new (context: TContext, options?: Partial<IChannelSplitterOptions>) => IAudioNode;
