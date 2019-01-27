import { TEndedEventHandler, TOscillatorType } from '../types';
import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IOscillatorNode extends IAudioScheduledSourceNode {

    readonly detune: IAudioParam;

    readonly frequency: IAudioParam;

    onended: null | TEndedEventHandler<IOscillatorNode>;

    type: TOscillatorType;

    setPeriodicWave (periodicWave: PeriodicWave): void;

}
