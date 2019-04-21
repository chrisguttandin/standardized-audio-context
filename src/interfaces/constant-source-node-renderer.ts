import { IAudioNodeRenderer } from './audio-node-renderer';
import { IConstantSourceNode } from './constant-source-node';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';

export interface IConstantSourceNodeRenderer<T extends IMinimalOfflineAudioContext> extends IAudioNodeRenderer<T, IConstantSourceNode<T>> {

    start: number;

    stop: number;

}
