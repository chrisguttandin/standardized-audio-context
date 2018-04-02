import { IAudioContext } from './audio-context';
import { IGainNode } from './gain-node';
import { IGainOptions } from './gain-options';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IGainNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IGainOptions>
    ): IGainNode;

}
