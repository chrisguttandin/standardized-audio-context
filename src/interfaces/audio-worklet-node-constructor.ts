import { IAudioContext } from './audio-context';
import { IAudioWorkletNode } from './audio-worklet-node';
import { IAudioWorkletNodeOptions } from './audio-worklet-node-options';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';

export interface IAudioWorkletNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        name: string,
        options?: IAudioWorkletNodeOptions
    ): IAudioWorkletNode;

}
