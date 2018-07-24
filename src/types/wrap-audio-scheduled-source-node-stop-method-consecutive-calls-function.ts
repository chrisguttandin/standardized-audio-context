import { INativeConstantSourceNode } from '../interfaces';
import { TNativeAudioBufferSourceNode } from './native-audio-buffer-source-node';
import { TNativeContext } from './native-context';
import { TNativeOscillatorNode } from './native-oscillator-node';

export type TWrapAudioScheduledSourceNodeStopMethodConsecutiveCallsFunction = (
    nativeAudioScheduledSourceNode: TNativeAudioBufferSourceNode | INativeConstantSourceNode | TNativeOscillatorNode,
    nativeContext: TNativeContext
) => void;
