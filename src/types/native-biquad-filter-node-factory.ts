import { IBiquadFilterOptions } from '../interfaces';
import { TNativeBiquadFilterNode } from './native-biquad-filter-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeBiquadFilterNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IBiquadFilterOptions>
) => TNativeBiquadFilterNode;
