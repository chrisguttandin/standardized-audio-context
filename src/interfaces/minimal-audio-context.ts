import { IMinimalBaseAudioContext } from './minimal-base-audio-context';

export interface IMinimalAudioContext extends IMinimalBaseAudioContext {

    readonly baseLatency: number;

    close (): Promise<void>; // tslint:disable-line:invalid-void

    // @todo This should be part of the IMinimalBaseAudioContext.
    resume (): Promise<void>; // tslint:disable-line:invalid-void

    suspend (): Promise<void>; // tslint:disable-line:invalid-void

}
