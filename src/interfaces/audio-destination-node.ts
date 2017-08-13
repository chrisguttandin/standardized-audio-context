import { IAudioNode } from './audio-node';

export interface IAudioDestinationNode extends IAudioNode {

    readonly maxChannelCount: number;

}
