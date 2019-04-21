import { TAudioParamMap } from '../types';
import { IAudioNode } from './audio-node';
import { IMinimalBaseAudioContext } from './minimal-base-audio-context';
import { IProcessorErrorEventHandler } from './processor-error-event-handler';

export interface IAudioWorkletNode<T extends IMinimalBaseAudioContext> extends IAudioNode<T> {

    onprocessorerror: null | IProcessorErrorEventHandler<T, this>;

    readonly parameters: TAudioParamMap;

    readonly port: MessagePort;

}
