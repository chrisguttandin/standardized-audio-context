import { IAudioNode } from './audio-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IAudioDestinationNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    readonly maxChannelCount: number;

}
