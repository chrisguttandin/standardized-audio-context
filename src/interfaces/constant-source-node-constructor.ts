import { IAudioContext } from './audio-context';
import { IConstantSourceNode } from './constant-source-node';
import { IConstantSourceOptions } from './constant-source-options';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IConstantSourceNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IConstantSourceOptions>
    ): IConstantSourceNode;

}
