import { TOscillatorType } from '../types';
import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IOscillatorNode<T extends IMinimalBaseAudioContext> extends IAudioScheduledSourceNode<T> {

    readonly detune: IAudioParam;

    readonly frequency: IAudioParam;

    type: TOscillatorType;

    setPeriodicWave (periodicWave: PeriodicWave): void;

}
