import { IWorkletOptions } from './worklet-options';

export interface IAudioWorklet {

    addModule (moduleURL: string, options?: IWorkletOptions): Promise<void>; // tslint:disable-line:invalid-void

}
