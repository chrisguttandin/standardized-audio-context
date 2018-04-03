import { IAudioNodeRenderer } from './audio-node-renderer';

export interface IAudioBufferSourceNodeRenderer extends IAudioNodeRenderer {

    start: [ number, number ] | [ number, number, number ];

    stop: number;

}
