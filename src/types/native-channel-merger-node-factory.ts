import { IChannelMergerOptions } from '../interfaces';
import { TNativeChannelMergerNode } from './native-channel-merger-node';
import { TNativeContext } from './native-context';

export type TNativeChannelMergerNodeFactory = (
    nativeContext: TNativeContext,
    // @todo Do only accept the full IChannelMergerOptions dictionary.
    options?: Partial<IChannelMergerOptions>
) => TNativeChannelMergerNode;
