import { IAudioContext } from './audio-context';
import { IBiquadFilterNode } from './biquad-filter-node';
import { IBiquadFilterOptions } from './biquad-filter-options';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IBiquadFilterNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IBiquadFilterOptions>
    ): IBiquadFilterNode;

}
