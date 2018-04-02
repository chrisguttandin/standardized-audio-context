import { IAudioBufferSourceNode } from './audio-buffer-source-node';
import { IAudioBufferSourceOptions } from './audio-buffer-source-options';
import { IAudioContext } from './audio-context';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IAudioBufferSourceNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IAudioBufferSourceOptions>
    ): IAudioBufferSourceNode;

}
