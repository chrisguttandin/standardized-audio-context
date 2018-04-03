import { IChannelSplitterOptions } from '../interfaces';
import { TNativeChannelSplitterNode } from './native-channel-splitter-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeChannelSplitterNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IChannelSplitterOptions>
) => TNativeChannelSplitterNode;
