import { IAudioNodeRenderer } from './audio-node-renderer';

export interface IConstantSourceNodeRenderer extends IAudioNodeRenderer {

    start: number;

    stop: number;

}
