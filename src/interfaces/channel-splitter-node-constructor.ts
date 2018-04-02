import { IAudioContext } from './audio-context';
import { IAudioNode } from './audio-node';
import { IChannelSplitterOptions } from './channel-splitter-options';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IChannelSplitterNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IChannelSplitterOptions>
    ): IAudioNode;

}
