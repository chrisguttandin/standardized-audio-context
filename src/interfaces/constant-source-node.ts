import { TEndedEventHandler } from '../types';
import { IAudioParam } from './audio-param';
import { IAudioScheduledSourceNode } from './audio-scheduled-source-node';

export interface IConstantSourceNode extends IAudioScheduledSourceNode {

    readonly offset: IAudioParam;

    onended: null | TEndedEventHandler<IConstantSourceNode>;

}
