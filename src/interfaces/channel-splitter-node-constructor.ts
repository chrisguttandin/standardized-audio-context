import { TContext } from '../types';
import { IAudioNode } from './audio-node';
import { IChannelSplitterOptions } from './channel-splitter-options';

export interface IChannelSplitterNodeConstructor {

    new (context: TContext, options?: Partial<IChannelSplitterOptions>): IAudioNode;

}
