import { IChannelMergerOptions } from '../interfaces';
import { TNativeChannelMergerNode } from './native-channel-merger-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeChannelMergerNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IChannelMergerOptions>
) => TNativeChannelMergerNode;
