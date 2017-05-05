import { IAudioNode } from './audio-node';

export interface IGainNode extends IAudioNode {

    readonly gain: AudioParam;

}
