import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';

export interface IGainNode extends IAudioNode {

    readonly gain: IAudioParam;

}
