import { IAudioBufferSourceNode } from './audio-buffer-source-node';
import { IAudioNodeRenderer } from './audio-node-renderer';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';

export interface IAudioBufferSourceNodeRenderer<T extends IMinimalOfflineAudioContext>
        extends IAudioNodeRenderer<T, IAudioBufferSourceNode<T>> {

    start: [ number, number ] | [ number, number, number ];

    stop: number;

}
