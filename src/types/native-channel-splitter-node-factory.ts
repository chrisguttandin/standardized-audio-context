import { IChannelSplitterOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeChannelSplitterNode } from './native-channel-splitter-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeChannelSplitterNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options?: Partial<IChannelSplitterOptions>
) => TNativeChannelSplitterNode;
