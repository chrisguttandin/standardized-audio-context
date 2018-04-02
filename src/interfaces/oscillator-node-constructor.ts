import { IAudioContext } from './audio-context';
import { IMinimalAudioContext } from './minimal-audio-context';
import { IMinimalOfflineAudioContext } from './minimal-offline-audio-context';
import { IOfflineAudioContext } from './offline-audio-context';
import { IOscillatorNode } from './oscillator-node';
import { IOscillatorOptions } from './oscillator-options';

export interface IOscillatorNodeConstructor {

    new (
        context: IAudioContext | IMinimalAudioContext | IMinimalOfflineAudioContext | IOfflineAudioContext,
        options?: Partial<IOscillatorOptions>
    ): IOscillatorNode;

}
