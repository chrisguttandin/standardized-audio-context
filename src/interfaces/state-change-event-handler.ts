import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IStateChangeEventHandler<T extends IMinimalBaseAudioContext> extends ThisType<T> {

    (event: Event): any;

}
