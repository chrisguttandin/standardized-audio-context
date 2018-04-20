import { TStandardizedContext } from '../types';
import { IAudioNode } from './audio-node';
import { IChannelSplitterOptions } from './channel-splitter-options';

export interface IChannelSplitterNodeConstructor {

    new (context: TStandardizedContext, options?: Partial<IChannelSplitterOptions>): IAudioNode;

}
