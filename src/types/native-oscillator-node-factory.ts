import { IOscillatorOptions } from '../interfaces';
import { TNativeOscillatorNode } from './native-oscillator-node';
import { TUnpatchedAudioContext } from './unpatched-audio-context';
import { TUnpatchedOfflineAudioContext } from './unpatched-offline-audio-context';

export type TNativeOscillatorNodeFactory = (
    nativeContext: TUnpatchedAudioContext | TUnpatchedOfflineAudioContext,
    options?: Partial<IOscillatorOptions>
) => TNativeOscillatorNode;
