import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';

export interface IDelayNode extends IAudioNode {

    readonly delayTime: IAudioParam;

}
