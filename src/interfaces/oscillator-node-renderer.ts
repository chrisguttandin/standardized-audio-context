import { IAudioNodeRenderer } from './audio-node-renderer';

export interface IOscillatorNodeRenderer extends IAudioNodeRenderer {

    start: number;

    stop: number;

}
