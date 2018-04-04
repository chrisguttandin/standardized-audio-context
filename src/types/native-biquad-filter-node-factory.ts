import { IBiquadFilterOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeBiquadFilterNode } from './native-biquad-filter-node';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';

export type TNativeBiquadFilterNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options?: Partial<IBiquadFilterOptions>
) => TNativeBiquadFilterNode;
