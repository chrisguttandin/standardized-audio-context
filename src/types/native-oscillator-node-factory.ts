import { IOscillatorOptions } from '../interfaces';
import { TNativeAudioContext } from './native-audio-context';
import { TNativeOfflineAudioContext } from './native-offline-audio-context';
import { TNativeOscillatorNode } from './native-oscillator-node';

export type TNativeOscillatorNodeFactory = (
    nativeContext: TNativeAudioContext | TNativeOfflineAudioContext,
    options?: Partial<IOscillatorOptions>
) => TNativeOscillatorNode;
