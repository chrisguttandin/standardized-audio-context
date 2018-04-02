import { IAudioContext } from './audio-context';
import { IAudioNode } from './audio-node';
import { IChannelMergerOptions } from './channel-merger-options';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IChannelMergerNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IChannelMergerOptions>
    ): IAudioNode;

}
