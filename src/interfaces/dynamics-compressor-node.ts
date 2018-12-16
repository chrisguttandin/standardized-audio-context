import { IAudioNode } from './audio-node';
import { IAudioParam } from './audio-param';

export interface IDynamicsCompressorNode extends IAudioNode {

    readonly attack: IAudioParam;

    readonly knee: IAudioParam;

    readonly ratio: IAudioParam;

    readonly reduction: number;

    readonly release: IAudioParam;

    readonly threshold: IAudioParam;

}
