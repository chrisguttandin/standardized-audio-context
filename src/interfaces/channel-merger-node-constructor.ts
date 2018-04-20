import { TStandardizedContext } from '../types';
import { IAudioNode } from './audio-node';
import { IChannelMergerOptions } from './channel-merger-options';

export interface IChannelMergerNodeConstructor {

    new (context: TStandardizedContext, options?: Partial<IChannelMergerOptions>): IAudioNode;

}
