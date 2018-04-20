import { TContext } from '../types';
import { IAudioNode } from './audio-node';
import { IChannelMergerOptions } from './channel-merger-options';

export interface IChannelMergerNodeConstructor {

    new (context: TContext, options?: Partial<IChannelMergerOptions>): IAudioNode;

}
