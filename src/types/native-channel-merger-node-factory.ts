import { IChannelMergerOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeChannelMergerNode } from './native-channel-merger-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeChannelMergerNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    // @todo Do only accept the full IChannelMergerOptions dictionary.
    options?: Partial<IChannelMergerOptions>
) => TNativeChannelMergerNode;
