import { IAudioNodeRenderer } from './audio-node-renderer';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOscillatorNode } from './oscillator-node';
import { IPeriodicWave } from './periodic-wave';

export interface IOscillatorNodeRenderer<T extends IMinimalOfflineAudioContext> extends IAudioNodeRenderer<T, IOscillatorNode<T>> {

    periodicWave: null | IPeriodicWave;

    start: number;

    stop: number;

}
