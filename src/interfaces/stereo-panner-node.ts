import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';

export interface IStereoPannerNode extends IAudioNode {

    readonly pan: IAudioParam;

}
