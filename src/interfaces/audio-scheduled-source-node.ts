import { TEndedEventHandler } from '../types';
import { IAudioNode } from './audio-node';

export interface IAudioScheduledSourceNode extends IAudioNode {

    onended: null | TEndedEventHandler<any>;

    start (when?: number): void;

    stop (when?: number): void;

}
